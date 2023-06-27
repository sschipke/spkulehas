import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { useRouter } from "next/router";
import {
  toggleEditReservationPicker,
  setCurrentReservation,
  showToast,
  toggleNewReservationPicker,
  updateViewDate,
  setSurroundingReservations,
  showUdpateCredentialsModal,
  updateToken,
  showLoginPrompt,
  showViewReservationModal,
  showLoadingModal
} from "../actions";
import {
  processValidateToken,
  handleReservationIdFromUrl,
  handleReservationLoading
} from "../thunks/thunks";
import { isInReservation, findNearestReservations } from "../utils/helpers";

const CalendarNavBar = dynamic(() =>
  import("../components/CalendarNavBar/CalendarNavBar")
);

const BigCalendar = dynamic(() =>
  import("../components/BigCalendar/BigCalendar")
);

const LoadingDataMessage = dynamic(() =>
  import("../components/Utilities/LoadingDataMessage")
);

import moment from "moment";

const App = ({
  reservations,
  areReservationsLoaded,
  toggleNewReservationPicker,
  setCurrentReservation,
  showToast,
  viewDate,
  updateViewDate,
  setSurroundingReservations,
  showLoginPrompt,
  user,
  showViewReservationModal,
  updateToken,
  token
}) => {
  const minDate = moment(process.env.NEXT_PUBLIC_MIN_DATE);
  const maxDate = moment(process.env.NEXT_PUBLIC_MAX_DATE);
  const router = useRouter();

  const { reset, date, reservationId } = router.query;

  const handleEventSelect = (selection) => {
    setCurrentReservation(selection);
    showViewReservationModal();
  };
  let dispatch = useDispatch();

  const handleDrillDown = (date) => {
    if (!user) {
      return showLoginPrompt();
    }
    const closestReservations = findNearestReservations(date, reservations);
    if (
      isInReservation(
        moment(date),
        moment(closestReservations[0].start),
        moment(closestReservations[0].end)
      ) ||
      moment(date).isBefore(minDate) ||
      moment(date).isAfter(maxDate)
    ) {
      showToast("You cannot reserve this date.", "error");
    } else {
      updateViewDate(date);
      setSurroundingReservations(closestReservations);
      toggleNewReservationPicker();
    }
  };

  useEffect(() => {
    if (!areReservationsLoaded) {
      showLoadingModal();
      dispatch(handleReservationLoading());
    }
    if (!user && reset && !token) {
      updateToken(reset);
      dispatch(processValidateToken(reset));
    }
    if (reset && user) {
      router.replace("/", null, { shallow: true });
    }
    if (date) {
      updateViewDate(date);
    }
    if (areReservationsLoaded && reservationId) {
      dispatch(handleReservationIdFromUrl(reservationId, reservations));
      router.replace("/", null, { shallow: true });
    }
  }, [areReservationsLoaded, reservations, user, reset, date, token, reservationId]); // eslint-disable-line

  return (
    <div className="App">
      <div className="calendar-container">
        <CalendarNavBar />
        {areReservationsLoaded && (
          <BigCalendar
            viewDate={viewDate}
            reservations={reservations}
            handleEventSelect={handleEventSelect}
            handleDrillDown={handleDrillDown}
          />
        )}
        {!areReservationsLoaded && (
          <LoadingDataMessage message={"Reservations"} />
        )}
      </div>
    </div>
  );
};

export const mapStateToProps = (state) => ({
  reservations: state.data.reservations,
  areReservationsLoaded: state.data.are_reservations_loaded,
  user: state.data.user,
  token: state.data.token,
  viewDate: state.screen.view_date
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleEditReservationPicker,
      toggleNewReservationPicker,
      setCurrentReservation,
      showToast,
      updateViewDate,
      setSurroundingReservations,
      showLoginPrompt,
      showViewReservationModal,
      showLoadingModal,
      showUdpateCredentialsModal,
      updateToken
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);
