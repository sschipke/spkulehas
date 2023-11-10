import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { IconButton, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import { showLoginModal } from "../../actions";

const BlankAvatarMenu = ({ showLoginModal, isLoginModalOpen }) => {
  const handleOpen = () => {
    showLoginModal();
  };

  const BlackToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black
    }
  }));

  return (
    <>
      <BlackToolTip
        title="Login"
        open={!isLoginModalOpen}
        arrow
        placement="left"
      >
        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <Avatar alt="" src="/" />
        </IconButton>
      </BlackToolTip>
    </>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  isLoginModalOpen: state.screen.show_login_modal
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ showLoginModal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BlankAvatarMenu);
