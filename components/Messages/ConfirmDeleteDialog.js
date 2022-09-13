import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import moment from "moment";
import {
  toggleConfirmDeleteDialog,
  removeReservation,
  showToast,
} from "../../actions";
import { deleteReservation } from "../../utils/apiCalls";

const ConfirmDeleteDialog = ({
  currentReservation,
  user,
  token,
  toggleConfirmDeleteDialog,
  showToast,
  removeReservation,
  isOpen,
}) => {
  const handleConfirmation = async () => {
    try {
      let deletedReservation = await deleteReservation(
        currentReservation,
        token
      );
      removeReservation(deletedReservation && currentReservation.id);
      toggleConfirmDeleteDialog();
    } catch (err) {
      const { error } = err;
      const messageToDisplay = error ? error : "Something went wrong."
      console.error("Error in delete reservation confirmation.", err, error);
      showToast("Unable to delete reservation. " + messageToDisplay, "error");
    }
  };

  if (!currentReservation) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => toggleConfirmDeleteDialog()}
      aria-labelledby="confirm-dialog"
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <DialogTitle id="confirm-dialog" sx={{ m: "auto", fontWeight: "bold", fontSize: "1.25rem" }}>
        Delete this reservation
      </DialogTitle>
      <DialogContent>
        <p>
          Would you like to dete this reservation for{" "}
          <strong>{currentReservation.title}</strong> beginning on{" "}
          <strong>
            {moment(currentReservation.start).format("dddd, MMMM DD, YYYY")}
          </strong>{" "}
          ?
        </p>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          m: "15px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => toggleConfirmDeleteDialog()}
          color="secondary"
        >
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleConfirmation();
          }}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const mapStateToProps = (state) => ({
  currentReservation: state.data.current_reservation,
  user: state.data.user,
  token: state.data.token,
  isOpen: state.screen.is_confirm_delete_dialog_open,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { toggleConfirmDeleteDialog, removeReservation, showToast },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmDeleteDialog);
