import React from "react";
import { connect } from "react-redux";
import { Modal, Backdrop, CircularProgress } from "@mui/material";

export const LoadingModal = ({ isOpen }) => {
  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  return (
    <Modal open={isOpen} BackdropComponent={Backdrop} style={modalStyle}>
      <CircularProgress />
    </Modal>
  );
};

export const mapStateToProps = (state) => ({
  isOpen: state.screen.is_loading
});

export default connect(mapStateToProps, null)(LoadingModal);
