import React from "react";
import { Switch, FormGroup, FormControlLabel } from "@mui/material";

export const MakeAdminControlSwitch = ({
  user,
  userInfo,
  updateUserInfo,
  disabled
}) => {
  const value = userInfo.isAdmin;
  if (!user.isAdmin || userInfo.email === "spkulehas@gmail.com") {
    return null;
  }
  return (
    <FormGroup sx={{ padding: 2 }}>
      <FormControlLabel
        control={
          <Switch
            disabled={disabled}
            name="make-admin-control-switch"
            checked={value}
            onChange={(e) => {
              const makeAdmin = e.target.checked;
              updateUserInfo({ ...userInfo, isAdmin: makeAdmin });
            }}
          />
        }
        label={"Is admin"}
      />
    </FormGroup>
  );
};

export default MakeAdminControlSwitch;
