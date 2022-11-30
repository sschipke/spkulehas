import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import dynamic from "next/dynamic";
import {
  TextField,
  Modal,
  Backdrop,
  Box,
  Stack,
  Button,
  Typography
} from "@mui/material";
import { DateRangePicker } from "@mui/lab";
import {
  addReservation,
  toggleNewReservationPicker,
  showToast
} from "../../actions";
import {
  determineMinDateForNewReservation,
  determineMaxDate,
  formatReservation,
  determineIfAdmin,
  canSubmitReservation
} from "../../utils/helpers";
import { postReservation } from "../../utils/apiCalls";
const UserSelect = dynamic(() => import("../Utilities/UserSelect"));
const ReservationTitle = dynamic(() => import("../Utilities/ReservationTitle"));
export const NewReservationPicker = ({
  isOpen,
  user,
  selectedUser,
  surroundingReservations,
  toggleNewReservationPicker,
  showToast,
  viewDate,
  addReservation,
  token,
  reservationTitle
}) => {
  const [dates, setDates] = useState([new Date(viewDate), null]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  useEffect(() => {
    setDates([new Date(viewDate), null]);
    return () => {
      setDates([null, null]);
      setError(null);
      setNotes("");
    };
  }, [viewDate]);

  if (!user) {
    return null;
  }

  const [checkinDate, checkoutDate] = dates;

  const canSubmit = canSubmitReservation(
    user,
    selectedUser,
    checkinDate,
    checkoutDate
  );

  const handleSubmit = async () => {
    const { name, id } = user;
    let reservation = {
      user_id: user.isAdmin ? selectedUser.id : id,
      title: user.isAdmin ? selectedUser.name : name,
      notes: notes.trim()
    };
    if (reservationTitle) {
      reservation.title = reservationTitle.trim();
    }
    reservation = formatReservation(reservation, checkinDate, checkoutDate);
    try {
      const newReservation = await postReservation(reservation, token);
      addReservation(newReservation.reservation);
      toggleNewReservationPicker();
    } catch (err) {
      console.error("Error creating reservation. ", err);
      const { error } = err;
      showToast("Unable to add reservation. " + error, "error");
    }
  };

  const [previousReservation, nextReservation] = surroundingReservations;

  const minDate = determineMinDateForNewReservation(previousReservation);
  const maxDate = determineMaxDate(
    checkinDate,
    nextReservation,
    determineIfAdmin(user)
  );

  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      className="modal-background"
      onClose={() => toggleNewReservationPicker()}
    >
      <Box className="modal-large date-picker">
        <Typography
          component="h2"
          variant="h2"
          sx={{ fontSize: "2rem", marginBottom: "30px", fontWeight: 400 }}
        >
          Create New Reservation
        </Typography>
        <DateRangePicker
          views={["year", "month", "day"]}
          startText="Check-in"
          endText="Check-out"
          label="Reservation Dates"
          value={dates}
          onChange={(newValue) => {
            setDates(newValue);
          }}
          minDate={minDate}
          maxDate={maxDate}
          sx={{ display: "flex", margin: "auto", flexDirection: "column" }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} />
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
        <TextField
          id="notes"
          label="Notes"
          placeholder="Checkin time, checkout, etc."
          multiline
          rows={1}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          inputProps={{
            maxLength: 60
          }}
          sx={{ mt: "15px" }}
        />
        <ReservationTitle />
        <UserSelect />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          className="reservation-buttons"
          sx={{ mt: 5 }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => toggleNewReservationPicker()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            disabled={!canSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export const mapStateToProps = (state) => ({
  isOpen: state.screen.new_reservation_picker_open,
  currentReservation: state.data.current_reservation,
  reservations: state.data.reservations,
  surroundingReservations: state.data.surrounding_reservations,
  viewDate: state.screen.view_date,
  user: state.data.user,
  selectedUser: state.data.selected_user,
  reservationTitle: state.data.reservation_title,
  token: state.data.token
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { toggleNewReservationPicker, addReservation, showToast },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewReservationPicker);
