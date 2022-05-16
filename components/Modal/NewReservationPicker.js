import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import { TextField, Modal, Backdrop, Box, Stack, Button } from "@mui/material";
import { DateRangePicker, DatePicker } from "@mui/lab";
import {
  addReservation,
  toggleNewReservationPicker,
  showToast,
} from "../../actions";
import {
  determineMinDateForNewReservation,
  determineMaxDate,
  formatReservation,
} from "../../utils/helpers";
import { postReservation } from "../../utils/apiCalls";
import UserSelect from "../Utilities/UserSelect";

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
}) => {
  const [dates, setDates] = useState([new Date(viewDate), null]);
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

  const canSubmit = checkinDate && checkoutDate && user;

  const handleSubmit = async () => {
    const { name, id } = user;
    const reservation = {
      user_id: user.status === "ADMIN" ? selectedUser.id : id,
      title: user.status === "ADMIN" ? selectedUser.name : name,
      notes: notes.trim(),
    };
    reservation = formatReservation(reservation, checkinDate, checkoutDate);
    try {
      const newReservation = await postReservation(reservation, token);
      addReservation(newReservation.reservation);
      toggleNewReservationPicker();
    } catch (error) {
      showToast("Unable to add reservation." + error, "error");
    }
  };

  const [previousReservation, nextReservation] = surroundingReservations;

  const maxDate = determineMaxDate(checkinDate, nextReservation);
  const minDate = determineMinDateForNewReservation(previousReservation);

  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      className="modal-background"
      onClose={() => toggleNewReservationPicker()}
    >
      <Box className="modal-large date-picker">
        <h1>New </h1>
        <DateRangePicker
          disablePast
          views={["year", "month", "day"]}
          startText="Check-in"
          endText="Check-out"
          label="Reservation Dates"
          value={dates}
          onChange={(newValue) => {
            setDates(newValue);
          }}
          // onError={() => setError(true)}
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
          multiline
          rows={1}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          inputProps={{
            maxLength: 60,
          }}
        />
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
  token: state.data.token,
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
