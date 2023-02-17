import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  IconButton
} from "@mui/material";
import { toggleConfirmAddMemberDialog } from "../../actions";
import { handleAddNewMember } from "../../thunks/thunks";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountBox from "@mui/icons-material/AccountBox";
import House from "@mui/icons-material/House";
import Email from "@mui/icons-material/Email";
import Phone from "@mui/icons-material/Phone";
import Grade from "@mui/icons-material/Grade";

const ConfirmAddMemberDialog = ({ user, token, newMemberInfo, isOpen }) => {
  const initialState = {
    canAddMember: false,
    password: "",
    showPassword: false
  };
  const [values, setValues] = useState(initialState);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isOpen) {
      setValues(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const canSubmit = values.canAddMember && values.password;

  const handleCanAddChange = (isChecked) => {
    setValues({ ...values, canAddMember: isChecked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    let passwordVal = value;
    if (value.length > 1) {
      passwordVal = value.trim();
    }
    setValues({
      ...values,
      password: passwordVal
    });
  };

  const handleConfirmation = async () => {
    dispatch(handleAddNewMember(newMemberInfo, values.password, token, router));
  };

  if (!user || !user.isAdmin || !newMemberInfo) {
    return null;
  }
  const handleClose = () => {
    dispatch(toggleConfirmAddMemberDialog());
  };

  const {
    email,
    firstName,
    lastName,
    status,
    street,
    city,
    state,
    zipcode,
    phone
  } = newMemberInfo;
  const name = `${firstName} ${lastName}`;
  const fullAddress = `${street} ${city}, ${state} ${zipcode}`;

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="confirm-add-member-dialog"
      sx={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <DialogTitle
        id="confirm-add-member-dialog"
        sx={{ m: "auto", fontWeight: "bold", fontSize: "1.25rem" }}
      >
        Add <strong>{name}</strong> as a new member?
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <p>Please review that the following information is correct:</p>
        <List>
          <ListItem>
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary={name} secondary="Name" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Grade />
            </ListItemIcon>
            <ListItemText primary={status} secondary="Member Status" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText primary={email} secondary="Email" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <House />
            </ListItemIcon>
            <ListItemText primary={fullAddress} secondary="Address" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Phone />
            </ListItemIcon>
            <ListItemText primary={phone} secondary="Phone Number" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="NOTE: An email will be sent to the new member."
              secondary="They will have 6 days to create a new password from this email. After that they will need to 'reset' their password from the login screen."
            />
          </ListItem>
        </List>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormGroup sx={{ padding: 2 }}>
            <FormControlLabel
              sx={{ margin: "0 auto" }}
              control={
                <Checkbox
                  name="should_add_new_ember"
                  checked={values.canAddMember}
                  onChange={(e) => {
                    handleCanAddChange(e.target.checked);
                  }}
                />
              }
              label="Yes, this information is correct."
            />
            <TextField
              name="password"
              autoComplete="password"
              label="Password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handlePasswordChange}
              required
              fullWidth
              error={values.error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </FormGroup>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          m: "15px"
        }}
      >
        <Button variant="contained" onClick={handleClose} color="secondary">
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleConfirmation();
          }}
          disabled={!canSubmit}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  token: state.data.token,
  newMemberInfo: state.data.new_member_info,
  isOpen: state.screen.is_confirm_add_member_dialog_open
});

export default connect(mapStateToProps)(ConfirmAddMemberDialog);
