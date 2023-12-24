import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import {
  TextField,
  Modal,
  Backdrop,
  Box,
  Button,
  Stack,
  Typography
} from "@mui/material";
import { DateRangePicker } from "@mui/lab";
import {
  toggleEditReservationPicker,
  updateReservation,
  closeViewReservationModal,
  showToast
} from "../../actions";
import {
  determineMinDate,
  determineMaxDate,
  canEdit,
  formatReservation,
  determineIfAdmin,
  canSubmitReservation
} from "../../utils/helpers";
import { putReservation } from "../../utils/apiCalls";
import { handleEtagMismatch } from "../../thunks/thunks";
import {
  cacheReservationsEtag,
  getCachedReservationsEtag
} from "../../utils/localStorage";
const UserSelect = dynamic(() => import("../Utilities/UserSelect"));
const ReservationTitle = dynamic(() => import("../Utilities/ReservationTitle"));

export const EditReservationPicker = ({
  isOpen,
  surroundingReservations,
  currentReservation,
  toggleEditReservationPicker,
  showToast,
  updateReservation,
  reservations,
  closeViewReservationModal,
  user,
  selectedUser,
  reservationTitle,
  token
}) => {
  const initialValue = () => {
    if (!currentReservation) {
      return [moment().startOf("isoWeek"), moment().endOf("isoWeek")];
    } else return [currentReservation.start, currentReservation.end];
  };
  const thunkDispatch = useDispatch();
  const [dates, setDates] = useState(initialValue());
  const initialNotes = currentReservation ? currentReservation.notes : "";
  const [notes, setNotes] = useState(initialNotes);
  // eslint-disable-next-line no-unused-vars
  useEffect(() => {
    setDates(initialValue());
    setNotes(initialNotes);
    return () => {
      setNotes("");
    };
  }, [currentReservation, initialNotes]); // eslint-disable-line

  if (!currentReservation || !canEdit(user, currentReservation)) {
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
    const reservation = { ...currentReservation };
    reservation.notes = notes;
    //TODO: Create a helper function to handle the title.
    if (user.isAdmin && selectedUser) {
      reservation.title = selectedUser.name;
      reservation.user_id = selectedUser.id;
    }
    if (user.id === reservation.user_id && user.name !== reservation.title) {
      reservation.title = user.name;
    }
    if (reservationTitle.trim()) {
      reservation.title = reservationTitle.trim();
    }
    if (
      user.id === reservation.user_id &&
      user.name !== reservation.title &&
      !user.isAdmin
    ) {
      reservation.title = user.name;
    }
    const formattedReservation = formatReservation(
      reservation,
      checkinDate,
      checkoutDate
    );
    try {
      const cachedReservationsEtag = getCachedReservationsEtag();
      const updatedReservationResponse = await putReservation(
        formattedReservation,
        token,
        cachedReservationsEtag
      );
      const { reservationsEtag } = updatedReservationResponse;
      cacheReservationsEtag(reservationsEtag);
      updateReservation(updatedReservationResponse.reservation);
      closeViewReservationModal();
      toggleEditReservationPicker();
    } catch (err) {
      if (err.status && (err.status === 412 || err.status === 404)) {
        return thunkDispatch(
          handleEtagMismatch(
            toggleEditReservationPicker,
            closeViewReservationModal
          )
        );
      }
      const { error } = err;
      showToast("Unable to update reservation. " + error, "error");
    }
  };

  const nextReservation = surroundingReservations[1];

  const minDate = determineMinDate(currentReservation, reservations);
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
      onClose={() => toggleEditReservationPicker()}
    >
      <Box className="dates-picker modal-large">
        <Typography
          component="h2"
          variant="h2"
          sx={{ fontSize: "2rem", marginBottom: "30px", fontWeight: 400 }}
        >
          Update Reservation
        </Typography>
        <DateRangePicker
          views={["year", "month", "day"]}
          startText="Check-in"
          endText="Check-out"
          label="Edit Reservation Dates"
          value={dates}
          onChange={(newValue) => {
            setDates(newValue);
          }}
          minDate={minDate}
          maxDate={maxDate}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} className="date-range-picker" />
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
        <TextField
          id="notes"
          label="Notes"
          className="notes-title-and-member-select "
          placeholder="Checkin time, checkout, etc."
          multiline
          rows={2}
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
          justifyContent="space-between"
          alignItems="flex-end"
          className="reservation-buttons"
          sx={{ mt: 5 }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => toggleEditReservationPicker()}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            disabled={!canSubmit}
          >
            Modify
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export const mapStateToProps = (state) => ({
  isOpen: state.screen.edit_reservation_picker_open,
  currentReservation: state.data.current_reservation,
  reservations: state.data.reservations,
  surroundingReservations: state.data.surrounding_reservations,
  user: state.data.user,
  token: state.data.token,
  usersInfo: state.data.usersInfo,
  selectedUser: state.data.selected_user,
  reservationTitle: state.data.reservation_title
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleEditReservationPicker,
      showToast,
      updateReservation,
      closeViewReservationModal
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditReservationPicker);
