import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Select, MenuItem, InputLabel } from "@mui/material";
import { updateSelectedUser } from "../../actions";

const UserSelect = ({
  user,
  usersInfo,
  updateSelectedUser,
  currentReservation,
  selectedUser,
  isEditReservationModalOpen,
}) => {
  if (user.status !== "ADMIN" || !usersInfo) {
    return null;
  }
  const handleSelect = (e) => {
    updateSelectedUser(e.target.value);
  };

  useEffect(() => {
    if (isEditReservationModalOpen && currentReservation && !selectedUser) {
      const userIdFromReservation = currentReservation.user_id;
      updateSelectedUser(userIdFromReservation);
    }
    return () => {
      updateSelectedUser(null);
    };
  }, [isEditReservationModalOpen, currentReservation]);

  const options = usersInfo.map((user) => (
    <MenuItem color="secondary" key={user.id} value={user.id}>
      {user.name}
    </MenuItem>
  ));

  options.unshift(<MenuItem key={"none"} value="">None</MenuItem>);
  return (
    <div style={{ width: "80%" }}>
      <InputLabel>Member</InputLabel>
      <Select
        label="Member"
        value={selectedUser ? selectedUser.id : ""}
        id="selectUserId"
        onChange={handleSelect}
        sx={{ width: "80%" }}
      >
        {options}
      </Select>
    </div>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  usersInfo: state.data.usersInfo,
  selectedUser: state.data.selected_user,
  currentReservation: state.data.current_reservation,
  isEditReservationModalOpen: state.screen.edit_reservation_picker_open,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ updateSelectedUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserSelect);
