import React from "react";
import { connect, useDispatch } from "react-redux";
import { processEmailSettingChange } from "../../thunks/thunks";
import { Switch, FormGroup, FormControlLabel } from "@mui/material";

export const ReceiveCancelationEmailControl = ({
  userEmailSettings,
  userId,
  selectedMember,
  selectedMemberEmailSettings,
  token
}) => {
  const currentEmailSettings =
    selectedMember && selectedMemberEmailSettings
      ? selectedMemberEmailSettings
      : userEmailSettings;
  const { value, setting_name } = currentEmailSettings;
  const memberId = selectedMember ? selectedMember.id : userId;
  const isSelectedMember = selectedMember && selectedMember.id === memberId;
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
                  memberId,
                  token,
                  isSelectedMember
                )
              );
            }}
          />
        }
        label="Receive an email when another member cancels their reservation?"
      />
    </FormGroup>
  );
};

export const mapStateToProps = (state) => ({
  userEmailSettings: state.data.emailSettings,
  userId: state.data.user.id,
  selectedMember: state.data.selected_member_profile,
  selectedMemberEmailSettings: state.data.selected_member_email_settings,
  token: state.data.token
});

export default connect(mapStateToProps)(ReceiveCancelationEmailControl);
