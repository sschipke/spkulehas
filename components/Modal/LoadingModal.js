import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal, Box, Backdrop, CircularProgress
} from '@mui/material';


export const LoadingModal = ({ isOpen }) => {
    const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: "80%",
  width: "60%",
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
  };

  const modalStyle = {
    // backgroundColor: 'white',
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      style={modalStyle}
    >
      {/* <Box style={style}> */}
      <CircularProgress />
      {/* </Box> */}
    </Modal>
  )
}

export const mapStateToProps = (state) => ({
  isOpen: state.screen.is_loading
});


export default connect(mapStateToProps, null)(LoadingModal);