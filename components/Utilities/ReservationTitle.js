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
  currentReservation
}) => {
  let shouldRender =
    user.status === "ADMIN" &&
    user.isAdmin &&
    selectedUser &&
    selectedUser.name === "Schipke SpKuLeHaS";

  useEffect(() => {
    if (
      shouldRender &&
      currentReservation &&
      selectedUser &&
      currentReservation.title !== selectedUser.name
    ) {
      updateReservationTitle(currentReservation.title);
    }
    if (!shouldRender) {
      updateReservationTitle("");
    }
    return () => {
      updateReservationTitle("");
    };
  }, [
    isNewReservationModalOpen,
    isEditReservationModalOpen,
    currentReservation,
    updateReservationTitle,
    selectedUser,
    user,
    shouldRender
  ]);

  if (!shouldRender) {
    updateReservationTitle("");
    return null;
  }

  const handleChange = (e) => {
    updateReservationTitle(e.target.value);
  };

  return (
    <TextField
      className="notes-title-and-member-select "
      id="reservation-title"
      label="Event Title"
      rows={1}
      value={reservationTitle}
      onChange={handleChange}
      inputProps={{
        maxLength: 20
      }}
    />
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  selectedUser: state.data.selected_user,
  currentReservation: state.data.current_reservation,
  reservationTitle: state.data.reservation_title,
  isEditReservationModalOpen: state.screen.edit_reservation_picker_open,
  isNewReservationModalOpen: state.screen.new_reservation_picker_open
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ updateReservationTitle }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReservationTitle);
