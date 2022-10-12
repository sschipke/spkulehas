import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { hideToast } from "../../actions";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = ({ isOpen, message, type, hideToast }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    hideToast();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      style={{ width: 350 }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export const mapStateToProps = (state) => ({
  isOpen: state.screen.show_toast,
  message: state.screen.toast_message,
  type: state.screen.toast_type
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ hideToast }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Toast);
