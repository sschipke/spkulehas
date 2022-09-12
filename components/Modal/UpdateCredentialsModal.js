import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Avatar from "@mui/material/Avatar";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import {
  TextField,
  Modal,
  Backdrop,
  Box,
  Button,
  Divider,
  InputLabel,
  Input,
  OutlinedInput,
  FilledInput,
  IconButton,
  Switch,
  FormControlLabel,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { validateUpdatingCredentials } from "../../utils/validators";
import { closeUpdateCredentialsModal } from "../../actions";
import {
  processPasswordChange,
  processEmailChange,
  processPasswordReset,
} from "../../thunks/thunks";

import PasswordCreationChecklist from "../Utilities/PasswordCreationList";
import EmailValidationList from "../Utilities/EmailValidationList";

export const UpdateCredentialsModal = ({
  isOpen,
  user,
  closeUpdateCredentialsModal,
  token,
  kind,
}) => {
  const initialState = {
    email: "",
    password: "",
    newEmail: "",
    confirmNewEmail: "",
    newPassword: "",
    confirmNewPassword: "",
    error: false,
    showPassword: false,
  };

  const [values, setValues] = useState(initialState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) {
      setValues(initialState);
    }
  }, [isOpen]); // eslint-disable-line

  //TODO: CHange this!
  if (!user && kind !== "RESET_PASSWORD") {
    return null;
  }

  const clearError = () => {
    setValues({ ...values, error: null });
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value.trim() });
  };

  let content;
  switch (kind) {
    case "EMAIL":
      content = (
        <div>
          <TextField
            margin="normal"
            fullWidth
            id="email-update"
            label="Current Email Address"
            name="email"
            autoComplete="email"
            inputProps={{
              readOnly: true,
            }}
            type="email"
            value={user.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="new-email"
            label="New Email Address"
            name="newEmail"
            autoComplete="email"
            type="email"
            value={values.newEmail}
            error={values.error}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirm-new-email"
            label="Confirm New Email Address"
            name="confirmNewEmail"
            autoComplete="email"
            type="email"
            value={values.confirmNewEmail}
            error={values.error}
            onChange={handleChange}
          />
          <EmailValidationList
            newEmail={values.newEmail}
            confirmNewEmail={values.confirmNewEmail}
          />
        </div>
      );
      break;
    case "RESET_PASSWORD":
    case "PASSWORD":
      content = (
        <div>
          <TextField
            margin="normal"
            required
            fullWidth
            id="new-password"
            label="New Password"
            name="newPassword"
            autoComplete="password"
            type={values.showPassword ? "text" : "password"}
            value={values.newPassword}
            error={values.error}
            onChange={handleChange}
            autoFocus
            InputProps={{
              maxLength: 20,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="confirm-new-password"
            label="Confirm New Password"
            name="confirmNewPassword"
            autoComplete="email"
            type={values.showPassword ? "text" : "password"}
            value={values.confirmNewPassword}
            error={values.error}
            onChange={handleChange}
            InputProps={{
              maxLength: 20,
            }}
          />
          <PasswordCreationChecklist
            newPassword={values.newPassword}
            confirmNewPassword={values.confirmNewPassword}
          />
        </div>
      );
    default:
      break;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { newEmail, newPassword, password } = values;
    setValues({ ...values, error: false });
    switch (kind) {
      case "EMAIL":
        dispatch(
          processEmailChange(
            newEmail.trim().toLowerCase(),
            password,
            token,
            user.id
          )
        );
        break;
      case "PASSWORD":
        dispatch(processPasswordChange(newPassword, password, token, user.id));
        break;
      case "RESET_PASSWORD":
        dispatch(processPasswordReset(token, newPassword));
        break;
      default:
        break;
    }
  };

  const checkIsValid = () => {
    return validateUpdatingCredentials(kind, values);
  };
  const isValid = checkIsValid();
  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      className="modal-background"
      onClose={() => closeUpdateCredentialsModal()}
    >
      <Box className="modal-large">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          {kind === "EMAIL" ? <EmailIcon /> : <PasswordIcon />}
        </Avatar>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {content}
          {kind !== "RESET_PASSWORD" && (
            <TextField
              name="password"
              autoComplete="password"
              label={kind === "EMAIL" ? "Password" : "Current Password"}
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              required
              fullWidth
              InputProps={{
                maxLength: 20,
              }}
            />
          )}
          <FormControlLabel
            sx={{ m: "auto" }}
            control={
              <Switch
                color="info"
                name="showPassword?"
                checked={values["showPassword"]}
                onChange={(e) => {
                  setValues({
                    ...values,
                    showPassword: e.target.checked,
                  });
                }}
              />
            }
            label="Show password?"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isValid}
            sx={{ mt: 3, mb: 2 }}
          >
            Update {kind === "EMAIL" ? "Email" : "Password"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  token: state.data.token,
  isOpen: state.screen.show_update_credentials_modal,
  kind: state.screen.update_credentials_modal_kind,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ closeUpdateCredentialsModal }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateCredentialsModal);
