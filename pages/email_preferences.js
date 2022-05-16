import React, { useState } from "react";
import {
  Paper,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
} from "@mui/material";
const EmailSettingsPage = ({}) => {
  const [settings, updateSettings] = useState({
    reminder_email: false,
    delete_reservation: true,
  });
  const handleOff = () => {
    const allSettingsOff = {};
    for (let setting in settings) {
      allSettingsOff[setting] = false;
    }
    updateSettings(allSettingsOff);
  };

  const handleOn = () => {
    const allSettingsOn = {};
    for (let setting in settings) {
      allSettingsOn[setting] = true;
    }
    updateSettings(allSettingsOn);
  };

  return (
    <Paper>
      <FormGroup sx={{ padding: 2 }}>
        <FormControlLabel
          control={
            <Switch
              name="reminder_email"
              checked={settings["reminder_email"]}
              onChange={(e) => {
                updateSettings({
                  ...settings,
                  [e.target.name]: e.target.checked,
                });
              }}
            />
          }
          label="Reminder of reservation"
        />
        <FormControlLabel
          control={
            <Switch
              name="delete_reservation"
              checked={settings["delete_reservation"]}
              onChange={(e) => {
                console.log(
                  e.target.name,
                  " ",
                  e.target.checked,
                  "settings",
                  settings
                );
                updateSettings({
                  ...settings,
                  [e.target.name]: e.target.checked,
                });
              }}
            />
          }
          label="Reservation is deleted."
        />
        <Stack sx={{ width: "200px" }}>
          <Button onClick={handleOff} variant="contained" color="secondary">
            Turn Off All
          </Button>
          <Button onClick={handleOn} variant="contained">
            Turn On All
          </Button>
        </Stack>
      </FormGroup>
    </Paper>
  );
};

export default EmailSettingsPage;
