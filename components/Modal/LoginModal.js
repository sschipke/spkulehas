import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  TextField,
  Modal,
  Backdrop,
  Box,
  Button,
  InputLabel,
  Input,
  OutlinedInput,
  FilledInput,
  IconButton,
  Typography,
  InputAdornment,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { closeLoginModal, setUser } from "../../actions";
import { processLogin } from "../../thunks/thunks";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const LoginModal = ({ isOpen, user, closeLoginModal, setUser }) => {
  const initialState = {
    email: "",
    password: "",
    error: false,
    showPassword: false,
  };
  const [values, setValues] = useState(initialState);

  useEffect(() => {
    if (!isOpen) {
      setValues(initialState);
    }
  }, [isOpen]);

  if (user) {
    return null;
  }

  const dispatch = useDispatch();

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = values;

    setValues({ ...values, error: false });
    dispatch(processLogin(email.toLowerCase(), password));
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
          />
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
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!values.email.trim() || !values.password.trim()}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
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
  isOpen: state.screen.show_login_modal,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ closeLoginModal, setUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
