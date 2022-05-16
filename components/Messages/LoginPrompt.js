import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { showLoginModal, closeLoginPrompt } from '../../actions';
import { AlertTitle } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Toast = ({ isOpen, closeLoginPrompt, showLoginModal }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeLoginPrompt();
  }

  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
      style={{width: '50%'}}
    >
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          <AlertTitle>Please Login</AlertTitle>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <p>To add or change reservations you must be logged in.</p>
            <Button 
              onClick={() => {
                handleClose()
                showLoginModal()
              }} 
              variant="text" 
              sx={{textDecoration: 'underline', color: 'white'}}>
              <strong>Login</strong>
            </Button>
          </div>
        </Alert>
      </Snackbar>
  )
}

export const mapStateToProps = (state) => ({
  isOpen: state.screen.show_login_prompt
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({  closeLoginPrompt, showLoginModal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Toast);