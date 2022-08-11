import React from "react";
import { List, ListItemIcon, ListItemText, ListItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import { VALID_EMAIL_REGEX } from "../../utils/validators";

const successIcon = (
  <CheckCircleIcon color="success" sx={{ minWidth: "30px" }} />
);
const missingIcon = <BlockIcon color="error" sx={{ minWidth: "30px" }} />;

export const EmailValidationList = ({ newEmail, confirmNewEmail }) => {
  const isValidEmail = VALID_EMAIL_REGEX.test(newEmail);
  const doEmailsMatch = confirmNewEmail && newEmail === confirmNewEmail;

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          {isValidEmail ? successIcon : missingIcon}
          <ListItemText
            primary="Is a valid email address"
            sx={{ color: `${isValidEmail ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {doEmailsMatch ? successIcon : missingIcon}
          <ListItemText
            primary="Emails must match"
            sx={{ color: `${doEmailsMatch ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
    </List>
  );
};

export default EmailValidationList;
