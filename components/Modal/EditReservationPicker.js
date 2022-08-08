import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { TextField, Modal, Backdrop, Box, Button, Stack } from "@mui/material";
import { DateRangePicker, DatePicker } from "@mui/lab";
import {
  toggleEditReservationPicker,
  updateReservation,
  closeViewReservationModal,
  showToast,
} from "../../actions";
import {
  determineMinDate,
  determineMaxDate,
  canEdit,
  formatReservation,
} from "../../utils/helpers";
import { putReservation } from "../../utils/apiCalls";
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
  token,
}) => {
  const initialValue = () => {
    if (!currentReservation) {
      return [moment().startOf("isoWeek"), moment().endOf("isoWeek")];
    } else return [currentReservation.start, currentReservation.end];
  };
  const [dates, setDates] = useState(initialValue());
  const initialNotes = currentReservation ? currentReservation.notes : "";
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState("");
  useEffect(() => {
    setDates(initialValue());
    setNotes(initialNotes);
    return () => {
      // setDates([null, null])
      setNotes("");
    };
  }, [currentReservation]);

  if (!currentReservation || !canEdit(user, currentReservation)) {
    return null;
  }

  const [checkinDate, checkoutDate] = dates;

  const canSubmit = checkinDate && checkoutDate && user;

  const handleSubmit = async () => {
    const reservation = { ...currentReservation };
    reservation.notes = notes;
    if (user.status === "ADMIN" && selectedUser) {
      reservation.title = selectedUser.name;
      reservation.user_id = selectedUser.id;
    }
    if (reservationTitle.trim()) {
      reservation.title = reservationTitle.trim();
    }
    const formattedReservation = formatReservation(
      reservation,
      checkinDate,
      checkoutDate
    );
    try {
      const updatedReservation = await putReservation(
        formattedReservation,
        token
      );
      updateReservation(updatedReservation.reservation);
      closeViewReservationModal();
      toggleEditReservationPicker();
    } catch (error) {
      let err;
      if (typeof error === "object") {
        err = error.error;
      }

      console.error("Error updating reservation.", error);
      showToast("Error updating reservation. " + err, "error");
    }
  };

  const nextReservation = surroundingReservations[1];

  const maxDate = determineMaxDate(checkinDate, nextReservation);
  const minDate = determineMinDate(currentReservation, reservations);

  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      className="modal-background"
      onClose={() => toggleEditReservationPicker()}
    >
      <Box className="dates-picker modal-large">
        <DateRangePicker
          disablePast
          views={["year", "month", "day"]}
          startText="Check-in"
          endText="Check-out"
          label="Basic example"
          value={dates}
          onChange={(newValue) => {
            setDates(newValue);
          }}
          minDate={minDate}
          maxDate={maxDate}
          style={{ display: "flex", margin: "auto", flexDirection: "column" }}
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
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          inputProps={{
            maxLength: 60,
          }}
        />
        <ReservationTitle />
        <UserSelect />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
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
            Submit
          </Button>
          {error && <p color="red">{error}</p>}
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
  reservationTitle: state.data.reservation_title,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleEditReservationPicker,
      showToast,
      updateReservation,
      closeViewReservationModal,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditReservationPicker);
