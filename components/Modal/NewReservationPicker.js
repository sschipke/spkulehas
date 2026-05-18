import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import dynamic from "next/dynamic";
import moment from "moment";
import {
  Modal,
  Backdrop,
  Box,
  Stack,
  Button,
  TextField,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  addReservation,
  toggleNewReservationPicker,
  showToast
} from "../../actions";
import { handleEtagMismatch } from "../../thunks/thunks";
import {
  determineMinDateForNewReservation,
  determineMaxDate,
  formatReservation,
  determineIfAdmin,
  canSubmitReservation
} from "../../utils/helpers";
import { postReservation } from "../../utils/apiCalls";
import {
  cacheReservationsEtag,
  getCachedReservationsEtag
} from "../../utils/localStorage";
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
  const thunkDispatch = useDispatch();
  const [dates, setDates] = useState([moment(viewDate), null]);
  const [notes, setNotes] = useState("");
  useEffect(() => {
    setDates([moment(viewDate), null]);
    return () => {
      setDates([null, null]);
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
      const cachedReservationsEtag = getCachedReservationsEtag();
      const newReservationResponse = await postReservation(
        reservation,
        token,
        cachedReservationsEtag
      );
      const { reservationsEtag } = newReservationResponse;
      cacheReservationsEtag(reservationsEtag);
      addReservation(newReservationResponse.reservation);
      toggleNewReservationPicker();
    } catch (err) {
      console.warn("Error adding reservation: ", err);
      if (err.status && err.status === 412) {
        return thunkDispatch(handleEtagMismatch(toggleNewReservationPicker));
      }
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
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <DatePicker
            label="Check-in"
            value={checkinDate}
            onChange={(newValue) => setDates([newValue, checkoutDate])}
            minDate={minDate}
            maxDate={checkoutDate || maxDate}
          />
          <DatePicker
            label="Check-out"
            value={checkoutDate}
            onChange={(newValue) => setDates([checkinDate, newValue])}
            minDate={checkinDate || minDate}
            maxDate={maxDate}
          />
        </Stack>
        <TextField
          className="notes-title-and-member-select"
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
        />
        <ReservationTitle />
        <UserSelect />
        <Stack
          direction="row"
          className="reservation-buttons"
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-end",
            mt: 5
          }}>
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
