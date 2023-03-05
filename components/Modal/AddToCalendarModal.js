import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Backdrop, Box, Button, Stack } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import AppleIcon from "@mui/icons-material/Apple";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import GoogleIcon from "@mui/icons-material/Google";

import { generateCalendarLinks } from "../../utils/helpers";
import { toggleAddToCalendarModal } from "../../actions";

export const AddToCalendarModal = ({
  isOpen,
  currentReservation,
  toggleAddToCalendarModal
}) => {
  if (!currentReservation) {
    return null;
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
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

  const { googleCalendarLink, outLookLink, appleLink } =
    generateCalendarLinks(currentReservation);

  return (
    <Modal
      open={isOpen}
      BackdropComponent={Backdrop}
      style={modalStyle}
      onClose={() => toggleAddToCalendarModal()}
    >
      <Box style={style} className="view-reservation-add-calendar-modal">
        <h3>Add to Calendar</h3>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            justifyContent: "space-evenly"
          }}
        >
          <Button
            sx={{ borderRadius: 10 }}
            variant="contained"
            color="primary"
            endIcon={<GoogleIcon />}
            href={googleCalendarLink}
            target="_blank"
          >
            Add to Google Calendar
          </Button>
          <Button
            sx={{ borderRadius: 10, m: "10px" }}
            variant="contained"
            color="info"
            endIcon={<BusinessIcon />}
            href={outLookLink}
            target="_blank"
          >
            Add to Outlook Calendar
          </Button>
          <Button
            sx={{
              borderRadius: 10,
              color: "black.contrastText"
            }}
            color="black"
            variant="contained"
            endIcon={<AppleIcon />}
            startIcon={<DownloadForOfflineIcon />}
            href={appleLink}
          >
            Add to Calendar
          </Button>
        </Stack>
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
            color="secondary"
            onClick={() => toggleAddToCalendarModal()}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export const mapStateToProps = (state) => ({
  isOpen: state.screen.is_add_to_calendar_modal_open,
  currentReservation: state.data.current_reservation
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      toggleAddToCalendarModal
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddToCalendarModal);
