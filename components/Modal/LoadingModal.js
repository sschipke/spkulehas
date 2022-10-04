import React from "react";
import { connect } from "react-redux";
import { Modal, Backdrop, CircularProgress } from "@mui/material";

export const LoadingModal = ({ isOpen }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "80%",
    width: "60%",
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  };

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
