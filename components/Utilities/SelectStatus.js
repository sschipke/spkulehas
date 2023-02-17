import React from "react";
import { connect } from "react-redux";
import { Select, MenuItem, InputLabel } from "@mui/material";
import dynamic from "next/dynamic";

const Typography = dynamic(() =>
  import("@mui/material").then((mod) => mod.Typography)
);

const SelectStatus = ({
  user,
  selectedMember,
  isEditting,
  updateUserStatus,
  userReference,
  addNewMember
}) => {
  const handleSelect = (e) => {
    updateUserStatus({ ...userReference, status: e.target.value });
  };

  if (!user) {
    return null;
  }

  const selectStatusMenu = (
    <div>
      <InputLabel>Status</InputLabel>
      <Select
        label="Status"
        value={userReference ? userReference.status : "U"}
        id="selectUserId"
        onChange={handleSelect}
        sx={{ width: "100%" }}
        required
      >
        <MenuItem color="secondary" value="S1">
          S1
        </MenuItem>
        <MenuItem color="secondary" value="S2">
          S2
        </MenuItem>
        <MenuItem color="secondary" value="D1">
          D1
        </MenuItem>
        <MenuItem color="secondary" value="D2">
          D2
        </MenuItem>
        <MenuItem color="secondary" value="U">
          U
        </MenuItem>
      </Select>
    </div>
  );

  if (!user) {
    return null;
  }

  if (
    user.isAdmin &&
    selectedMember &&
    userReference.id === selectedMember.id &&
    isEditting
  ) {
    return selectStatusMenu;
  } else if (addNewMember) {
    return selectStatusMenu;
  } else {
    return (
      <Typography component="h4" variant="h4">
        Member Status: {userReference.status}
      </Typography>
    );
  }
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  selectedMember: state.data.selected_member_profile
});

export default connect(mapStateToProps)(SelectStatus);
