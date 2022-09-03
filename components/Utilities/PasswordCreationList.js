import React from "react";
import { List, ListItemIcon, ListItemText, ListItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;
const HAS_CAPITAL_REGEX = new RegExp(/(?=.*[A-Z])/);
const HAS_LOWERCASE_REGEX = new RegExp(/(?=.*[a-z])/);
const HAS_NUMBER_REGEX = new RegExp(/(?=.*[0-9])/);
const HAS_SPECIAL_CHARACTER_REGEX = new RegExp(/(?=.*[!@#$%^&*])/);

const successIcon = (
  <CheckCircleIcon color="success" sx={{ minWidth: "30px" }} />
);
const missingIcon = <BlockIcon color="error" sx={{ minWidth: "30px" }} />;

const PasswordCreationChecklist = ({ newPassword, confirmNewPassword }) => {
  const isValidLength =
    newPassword &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword.length <= MAX_PASSWORD_LENGTH;
  const hasCapital = newPassword && HAS_CAPITAL_REGEX.test(newPassword);
  const hasLowerCase = newPassword && HAS_LOWERCASE_REGEX.test(newPassword);
  const hasNumber = newPassword && HAS_NUMBER_REGEX.test(newPassword);
  const hasSpecialCharacter =
    newPassword && HAS_SPECIAL_CHARACTER_REGEX.test(newPassword);
  const doPasswordsMatch = newPassword && newPassword === confirmNewPassword;
  return (
    <List>
      <ListItem>
        <ListItemIcon>
          {isValidLength ? successIcon : missingIcon}
          <ListItemText
            primary="Is between 8 and 20 characters"
            sx={{ color: `${isValidLength ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {hasCapital ? successIcon : missingIcon}
          <ListItemText
            primary="Has at least one capital letter"
            sx={{ color: `${hasCapital ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {hasLowerCase ? successIcon : missingIcon}
          <ListItemText
            primary="Has at least one lower case letter"
            sx={{ color: `${hasLowerCase ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {hasNumber ? successIcon : missingIcon}
          <ListItemText
            primary="Has at least one number"
            sx={{ color: `${hasNumber ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {hasSpecialCharacter ? successIcon : missingIcon}
          <ListItemText
            primary="Has one of the following: !@#$%^&*"
            sx={{ color: `${hasSpecialCharacter ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          {doPasswordsMatch ? successIcon : missingIcon}
          <ListItemText
            primary="Passwords must match"
            sx={{ color: `${doPasswordsMatch ? "green" : "red"}` }}
          />
        </ListItemIcon>
      </ListItem>
    </List>
  );
};

export default PasswordCreationChecklist;
