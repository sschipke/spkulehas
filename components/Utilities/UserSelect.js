import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Autocomplete, TextField } from "@mui/material";
import { updateSelectedUser } from "../../actions";

const UserSelect = ({
  user,
  usersInfo,
  updateSelectedUser,
  currentReservation,
  selectedUser,
  isEditReservationModalOpen
}) => {
  const handleSelect = (value) => {
    const userId = value && value.id ? value.id : "";
    updateSelectedUser(userId);
  };

  useEffect(() => {
    if (isEditReservationModalOpen && currentReservation && !selectedUser) {
      const userIdFromReservation = currentReservation.user_id;
      updateSelectedUser(userIdFromReservation);
    }
    return () => {
      updateSelectedUser(null);
    };
  }, [isEditReservationModalOpen, currentReservation]); // eslint-disable-line

  if (!user.isAdmin || !usersInfo) {
    return null;
  }

  const options = usersInfo.map((user) => ({ label: user.name, id: user.id }));

  const inputValue = selectedUser
    ? { label: selectedUser.name, id: selectedUser.id }
    : null;
  return (
    <div style={{ width: "80%" }}>
      <Autocomplete
        options={options}
        value={inputValue}
        onChange={(e, value) => handleSelect(value)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => <TextField {...params} label="Member" />}
      />
    </div>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  usersInfo: state.data.usersInfo,
  selectedUser: state.data.selected_user,
  currentReservation: state.data.current_reservation,
  isEditReservationModalOpen: state.screen.edit_reservation_picker_open
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ updateSelectedUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserSelect);
