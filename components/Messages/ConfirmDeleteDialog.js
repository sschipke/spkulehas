import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, FormGroup, FormControlLabel } from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import dayjs from "dayjs";
import {
  toggleConfirmDeleteDialog,
  removeReservation,
  showToast
} from "../../actions";
import { deleteReservation } from "../../utils/apiCalls";
import { cacheReservationsEtag } from "../../utils/localStorage";

const ConfirmDeleteDialog = ({
  currentReservation,
  user,
  token,
  toggleConfirmDeleteDialog,
  showToast,
  removeReservation,
  isOpen
}) => {
  const [shouldSendEmail, setShouldSendEmail] = useState(true);

  const handleConfirmation = async () => {
    try {
      let deleteResponse = await deleteReservation(
        currentReservation,
        token,
        shouldSendEmail
      );
      removeReservation(deleteResponse && currentReservation.id);
      const { reservationsEtag } = deleteResponse;
      cacheReservationsEtag(reservationsEtag);
      toggleConfirmDeleteDialog();
    } catch (err) {
      const { error } = err;
      const messageToDisplay = error ? error : "Something went wrong.";
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
        justifyContent: "center"
      }}
    >
      <DialogTitle
        id="confirm-dialog"
        sx={{ m: "auto", fontWeight: "bold", fontSize: "1.25rem" }}
      >
        Delete this reservation?
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <p>
          Would you like to dete this reservation for{" "}
          <strong>{currentReservation.title}</strong> beginning on{" "}
          <strong>
            {dayjs(currentReservation.start).format("dddd, MMMM D, YYYY")}
          </strong>{" "}
          and ending{" "}
          <strong>
            {dayjs(currentReservation.end).format("dddd, MMMM D, YYYY")}
          </strong>
          ?
        </p>
        {user && user.isAdmin && (
          <FormGroup sx={{ padding: 2 }}>
            <FormControlLabel
              sx={{ margin: "0 auto" }}
              control={
                <Switch
                  name="should_send_deletion_email"
                  checked={shouldSendEmail}
                  onChange={(e) => {
                    setShouldSendEmail(e.target.checked);
                  }}
                />
              }
              label="Notify other members of this deletion?"
            />
          </FormGroup>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "space-around",
          m: "15px"
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
  isOpen: state.screen.is_confirm_delete_dialog_open
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
