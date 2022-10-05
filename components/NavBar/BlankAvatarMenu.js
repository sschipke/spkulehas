import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IconButton, Avatar, Tooltip } from "@mui/material";
import { showLoginModal } from "../../actions";

const BlankAvatarMenu = ({ showLoginModal }) => {
  const handleOpen = () => {
    showLoginModal();
  };

  return (
    <>
      <Tooltip title="Login">
        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <Avatar alt="" src="/" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ showLoginModal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BlankAvatarMenu);
