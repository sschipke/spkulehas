import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from 'next/link';
import { AppBar, Box, Toolbar } from '@mui/material'
import { viewNextMonth, viewPreviousMonth, viewToday, updateViewDate } from '../../actions';
import BlankAvatarMenu from './BlankAvatarMenu';
import UserAvatarMenu from './UserAvatarMenu';
const NavBar = ({ user }) => {
  
  const avatarMenu = user ? <UserAvatarMenu /> : <BlankAvatarMenu />;

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <AppBar color="primary" position="sticky">
        <Toolbar style={{justifyContent: 'space-between'}}>
          <Link href="/" style={{textDecoration: "none"}}>
            <h2 style={{cursor: "pointer"}}>SpKuLeHaS Inc</h2>
          </Link>
          <Box sx={{ flexGrow: 0 }}>
            {avatarMenu}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export const mapStateToProps = (state) => ({
  user: state.data.user
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({  viewNextMonth, viewPreviousMonth, viewToday, updateViewDate }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

