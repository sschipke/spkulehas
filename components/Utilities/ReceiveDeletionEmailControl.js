import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { processEmailSettingChange } from "../../thunks/thunks";
import { Switch, FormGroup, FormControlLabel } from "@mui/material";

export const ReceiveDeletionEmailControl = ({
  emailSettings,
  userId,
  token,
}) => {
  const { value, setting_name } = emailSettings;
  const dispatch = useDispatch();
  return (
    <FormGroup sx={{ padding: 2 }}>
      <FormControlLabel
        control={
          <Switch
            name="reservation_deleted"
            checked={value}
            onChange={(e) => {
              dispatch(
                processEmailSettingChange(
                  setting_name,
                  e.target.checked,
                  userId,
                  token
                )
              );
            }}
          />
        }
        label="Receive an email when another member deletes their reservation?"
      />
    </FormGroup>
  );
};

export const mapStateToProps = (state) => ({
  emailSettings: state.data.emailSettings,
  userId: state.data.user.id,
  token: state.data.token,
});

export default connect(mapStateToProps)(ReceiveDeletionEmailControl);
