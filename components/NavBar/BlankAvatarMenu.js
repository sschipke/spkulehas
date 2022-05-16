import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from 'next/Link';
import { AppBar, Box, Toolbar, Button, IconButton, TextField, Menu, MenuItem, Avatar, Tooltip } from '@mui/material'
import { showLoginModal } from '../../actions';


const BlankAvatarMenu = ({ user, showLoginModal }) => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleOpen = () => {
    showLoginModal()
  }


  return (
    <>
      <Tooltip title="Login">
        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <Avatar alt="" src="/" />
        </IconButton>
      </Tooltip>
      {/* <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleClose}
        >
          <MenuItem key={'login-menu-prompt'} onClick={() => showLoginModal()}>
            Login
          </MenuItem>
      </Menu> */}
    </>
  )
}

export const mapStateToProps = (state) => ({
  user: state.data.user
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ showLoginModal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BlankAvatarMenu);