import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from 'next/Link';
import { AppBar, Box, Toolbar, Button, IconButton, TextField, Menu, MenuItem, Tooltip } from '@mui/material'
import { logOut } from '../../actions';
import UserAvatar from '../Utilities/UserAvatar';


const UserAvatarMenu = ({ user, logOut }) => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleOpen = () => {
    setIsMenuOpen(true);
  }

  const handleClose = () => {
    setIsMenuOpen(false);
  }

  const handleLogout = () => {
    logOut();
  }

  const links = [
    {
      label: 'My Profile',
      page: 'profile'
    },
    {
      label: 'My Reservations',
      page: 'my_reservations'
    },
    // {
    //   label: 'Email Preferences',
    //   page: 'email_preferences'
    // }
  ]

  const menuItems = links.map(link => {
            return (
          <MenuItem key={link.page}
          className="unstyled-link"
          >
            <Link 
            href={link.page}
            ariaRole="link"
            >
              {link.label}
            </Link>
          </MenuItem>
            )
          })
      
    menuItems.push(<MenuItem key={'logout-button'} onClick={handleLogout}>
            Log out
          </MenuItem>)


  return (
    <>
      <Tooltip title="User Settings">
        <IconButton onClick={() => handleOpen()} sx={{ p: 0 }} >
          <UserAvatar name={user.name}/>
        </IconButton>
      </Tooltip>
      <Menu
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
          { menuItems }
      </Menu>
    </>
  )
}

export const mapStateToProps = (state) => ({
  user: state.data.user
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ logOut }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatarMenu);