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
  showLoadingModal,
} from "../actions";
import { isInReservation, findNearestReservations } from "../utils/helpers";
import { momentLocalizer } from "react-big-calendar";
const Calendar = dynamic(() =>
  import("react-big-calendar").then((mod) => mod.Calendar)
);

import moment from "moment";
import { loadReservations } from "../thunks/thunks";
const CalendarNavBar = dynamic(() =>
  import("../components/CalendarNavBar/CalendarNavBar")
);

import "react-big-calendar/lib/css/react-big-calendar.css";
moment.updateLocale("en-US", {
  week: {
    dow: 1,
    doy: 1,
  },
});

const localizer = momentLocalizer(moment);

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
  showUdpateCredentialsModal,
  updateToken,
}) => {
  const router = useRouter();

  const { reset, date } = router.query;
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
      )
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
    if (!user && reset) {
      updateToken(reset);
      showUdpateCredentialsModal("RESET_PASSWORD");
      router.replace("/", null, { shallow: true });
    }
    if (date) {
      updateViewDate(date);
      router.replace("/", null, { shallow: true });
    }
  }, [areReservationsLoaded, reservations, user, reset, date]); // eslint-disable-line

  return (
    <div className="App">
      <div className="calendar-container">
        <CalendarNavBar />
        <Calendar
          localizer={localizer}
          date={viewDate}
          views={["month"]}
          events={reservations}
          style={{ height: "85vh", width: "100vw" }}
          eventPropGetter={(event, start, end, title, isSelected) => ({
            event,
            start,
            end,
            title,
            isSelected,
            style: { backgroundColor: event.color ? event.color : "#006064" },
          })}
          onSelectEvent={handleEventSelect}
          onDrillDown={(date) => {
            handleDrillDown(date);
          }}
          onNavigate={function () {}}
          min={moment("2022-01-01").toDate()}
          max={moment("2022-06-01").toDate()}
          toolbar={false}
        />
      </div>
    </div>
  );
};

export const mapStateToProps = (state) => ({
  reservations: state.data.reservations,
  areReservationsLoaded: state.data.are_reservations_loaded,
  user: state.data.user,
  viewDate: state.screen.view_date,
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
      updateToken,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);
