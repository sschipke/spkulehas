import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Avatar from "@mui/material/Avatar";
import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  TextField,
  Modal,
  Backdrop,
  Box,
  Button,
  IconButton,
  Typography,
  InputAdornment,
  FormHelperText
} from "@mui/material";
import { closeLoginModal } from "../../actions";
import { processLogin, processRequestPasswordReset } from "../../thunks/thunks";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const LoginModal = ({ isOpen, user, closeLoginModal }) => {
  const initialState = {
    email: "",
    password: "",
    error: false,
    showPassword: false,
    resetPassword: false
  };
  const [values, setValues] = useState(initialState);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) {
      setValues(initialState);
    }
  }, [isOpen]); // eslint-disable-line

  if (user) {
    return null;
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = values;

    setValues({ ...values, error: false });
    if (values.resetPassword) {
      dispatch(processRequestPasswordReset(email.toLowerCase()));
    } else {
      dispatch(processLogin(email.toLowerCase(), password));
    }
  };

  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      className="modal-background"
      onClose={() => closeLoginModal()}
    >
      <Box className="modal-large">
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          {values.resetPassword ? <EmailIcon /> : <LockOutlinedIcon />}
        </Avatar>
        <Typography component="h1" variant="h5">
          {values.resetPassword ? "Reset password" : "Sign In"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            onChange={handleChange}
            value={values.email}
            error={values.error}
            autoFocus
            inputProps={{
              minLength: 2
            }}
          />
          {!values.resetPassword && (
            <TextField
              name="password"
              autoComplete="password"
              label="Password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              required
              fullWidth
              error={values.error}
              inputProps={{
                minLength: 8,
                maxLength: 20
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={
              !values.email.trim() ||
              (!values.resetPassword && !values.password.trim())
            }
            sx={{ mt: 3, mb: 2 }}
          >
            {values.resetPassword ? "Reset Password" : "Sign In"}
          </Button>
          {!values.resetPassword && (
            <div style={{ width: "100%", textAlign: "center" }}>
              <Button
                variant="outlined"
                color="secondary"
                edge="end"
                onClick={() => setValues({ ...values, resetPassword: true })}
                sx={{
                  m: "auto",
                  width: { xs: "85%", sm: "60%", md: "50%", lg: "40%" }
                }}
              >
                Forgot password?
              </Button>
            </div>
          )}
          {values.error && (
            <FormHelperText sx={{ color: "red" }}>
              Invalid email or password.
            </FormHelperText>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  isOpen: state.screen.show_login_modal
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ closeLoginModal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
