import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import {
  TextField,
  Modal,
  Backdrop,
  Box,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { canEdit } from "../../utils/helpers";
import {
  toggleEditReservationPicker,
  toggleConfirmDeleteDialog,
  updateReservation,
  showViewReservationModal,
  closeViewReservationModal,
} from "../../actions";

export const ViewReservationModal = ({
  isOpen,
  user,
  currentReservation,
  closeViewReservationModal,
  toggleEditReservationPicker,
  toggleConfirmDeleteDialog,
}) => {
  if (!currentReservation) {
    return null;
  }

  const { title, start, end, notes } = currentReservation;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minHeight: "50%",
    minWidth: "50%",
    backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      style={modalStyle}
      onClose={() => closeViewReservationModal()}
    >
      <Box style={style} className="">
        <h3>{title}</h3>

        <TextField
          id="check-in-date"
          label="Check-in Date"
          value={moment(start).format("ddd, MMMM Do")}
          InputProps={{
            readOnly: true,
          }}
          sx={{ m: "15px" }}
        />
        <TextField
          id="check-out-date"
          label="Check-out Date"
          value={moment(end).format("ddd, MMMM Do")}
          InputProps={{
            readOnly: true,
          }}
          sx={{ m: "15px" }}
        />
        <TextField
          id="notes"
          label="Notes"
          multiline
          rows={3}
          value={notes}
          placeholder="Checkin time, checkout, etc."
          InputProps={{
            readOnly: true,
          }}
          sx={{ m: "15px" }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ 
            m: 3,
            justifyContent: "space-evenly"
          }}
        >
          <Button
            variant="outlined"
            onClick={() => closeViewReservationModal()}
          >
            Back
          </Button>
          {canEdit(user, currentReservation) && (
            <Stack
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                ml: 2
              }}
            >
              <IconButton
                size="large"
                edge="end"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => toggleEditReservationPicker()}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                color="error"
                sx={{ mr: 2 }}
                onClick={() => toggleConfirmDeleteDialog()}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export const mapStateToProps = (state) => ({
  isOpen: state.screen.view_reservation_modal_open,
  currentReservation: state.data.current_reservation,
  surroundingReservations: state.data.surrounding_reservations,
  user: state.data.user,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleEditReservationPicker,
      updateReservation,
      showViewReservationModal,
      closeViewReservationModal,
      toggleConfirmDeleteDialog,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewReservationModal);
