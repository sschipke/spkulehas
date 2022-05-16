import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addReservation, toggleEditReservationPicker, setCurrentReservation, showToast, toggleNewReservationPicker, updateViewDate, setSurroundingReservations, showLoginPrompt, showViewReservationModal, showIsLoading } from "../actions";
import { isInReservation, findNearestReservations } from "../utils/helpers";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { loadReservations } from "../thunks/thunks";
import CalendarNavBar from "../components/CalendarNavBar/CalendarNavBar";

import "react-big-calendar/lib/css/react-big-calendar.css";
moment.updateLocale('en-US', {
    week: {
        dow: 1,
        doy: 1,
    },
});

const localizer = momentLocalizer(moment);

const App = ({ reservations, areReservationsLoaded, toggleEditReservationPicker, toggleNewReservationPicker, setCurrentReservation, showToast, viewDate, updateViewDate, setSurroundingReservations, showLoginPrompt, user, showViewReservationModal }) => {

  const handleEventSelect = (selection) => {
    setCurrentReservation(selection);
    showViewReservationModal();
  }
  let dispatch = useDispatch();

  const handleDrillDown = (date) => {
    if (!user) {
      return showLoginPrompt()
    }
    const closestReservations = findNearestReservations(date, reservations);
    if (isInReservation(moment(date), moment(closestReservations[0].start), moment(closestReservations[0].end))) {
      showToast("You cannot reserve this date.", "error")
    } else  {
      updateViewDate(date);
      setSurroundingReservations(closestReservations);
      toggleNewReservationPicker();
    }
  }
  
  useEffect(() => {
    if (!areReservationsLoaded) {
      showIsLoading();
      dispatch(loadReservations());
    }
  }, [areReservationsLoaded,reservations])
  

    return (
      <div className="App">
        <div className="calendar-container">
          <CalendarNavBar />
          <Calendar
            localizer={localizer}
            date={viewDate}
            views={["month"]}
            events={reservations}
            style={{ height: "85vh", width: '100vw' }}
            eventPropGetter={(event, start, end, isSelected) => ({
          event,
          start,
          end,
          isSelected,
          style: { backgroundColor: "#880e4f" }
        })}
            onSelectEvent={handleEventSelect}
            onDrillDown={(date) => {
            handleDrillDown(date)
            }}
            onNavigate={function(){}}
            min={moment('2022-01-01').toDate()}
            max={moment('2022-06-01').toDate()}
            toolbar={false}
          />
        </div>
      </div>
    );
}

export const mapStateToProps = (state) => ({
  reservations: state.data.reservations,
  areReservationsLoaded: state.data.are_reservations_loaded,
  user: state.data.user,
  viewDate: state.screen.view_date
})

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ addReservation, toggleEditReservationPicker, toggleNewReservationPicker, setCurrentReservation, showToast, updateViewDate, setSurroundingReservations, showLoginPrompt, showViewReservationModal, showIsLoading }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);