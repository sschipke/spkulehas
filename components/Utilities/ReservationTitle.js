import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TextField } from "@mui/material";
import { updateReservationTitle } from "../../actions";

const ReservationTitle = ({
  user,
  reservationTitle,
  updateReservationTitle,
  selectedUser,
  isEditReservationModalOpen,
  isNewReservationModalOpen,
  currentReservation,
}) => {
  let shouldRender =
    user.status === "ADMIN" &&
    selectedUser &&
    selectedUser.name === "Schipke SpKuLeHaS";
  if (!shouldRender) {
    return null;
  }

  const handleChange = (e) => {
    updateReservationTitle(e.target.value);
  };

  useEffect(() => {
    if (isEditReservationModalOpen && currentReservation) {
      updateReservationTitle(currentReservation.title);
    }
    return () => {
      updateReservationTitle("");
    };
  }, [
    isNewReservationModalOpen,
    isEditReservationModalOpen,
    currentReservation,
  ]);

  return (
    <TextField
      id="reservation-title"
      label="Event Title"
      rows={1}
      value={reservationTitle}
      onChange={handleChange}
      inputProps={{
        maxLength: 20,
      }}
      sx={{ width: "20%" }}
    />
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  selectedUser: state.data.selected_user,
  currentReservation: state.data.current_reservation,
  reservationTitle: state.data.reservation_title,
  isEditReservationModalOpen: state.screen.edit_reservation_picker_open,
  isNewReservationModalOpen: state.screen.new_reservation_picker_open,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ updateReservationTitle }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReservationTitle);
