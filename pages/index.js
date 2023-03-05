import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { useRouter } from "next/router";
import {
  addReservation,
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
  loadReservations,
  processValidateToken,
  handleReservationIdFromUrl
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

import dayjs from "dayjs";

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
  const minDate = dayjs(process.env.NEXT_PUBLIC_MIN_DATE);
  const maxDate = dayjs(process.env.NEXT_PUBLIC_MAX_DATE);
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
        dayjs(date),
        dayjs(closestReservations[0].start),
        dayjs(closestReservations[0].end)
      ) ||
      dayjs(date).isBefore(minDate) ||
      dayjs(date).isAfter(maxDate)
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
      dispatch(loadReservations());
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
      addReservation,
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
