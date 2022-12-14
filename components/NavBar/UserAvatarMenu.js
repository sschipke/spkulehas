import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "next/link";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { logOut } from "../../actions";
import UserAvatar from "../Utilities/UserAvatar";

const UserAvatarMenu = ({ user, logOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleOpen = () => {
    setIsMenuOpen(true);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logOut();
  };

  const links = [
    {
      label: "My Profile",
      page: "/profile"
    },
    {
      label: "My Reservations",
      page: "/my_reservations"
    },
    {
      label: "Contact Members",
      page: "/members"
    },
    {
      label: "Search Reservations",
      page: "/all_reservations"
    }
  ];

  const menuItems = links.map((link) => {
    return (
      <MenuItem
        key={link.page}
        className="unstyled-link"
        onClick={() => handleClose()}
      >
        <Link href={link.page} ariaRole="link">
          {link.label}
        </Link>
      </MenuItem>
    );
  });

  if (user && user.isAdmin) {
    menuItems.pop();
    menuItems.pop();
    menuItems.push(
      <MenuItem
        key="amin_view_members"
        className="unstyled-link"
        onClick={() => handleClose()}
      >
        <Link href="/admin/view_members" ariaRole="link">
          Member Details
        </Link>
      </MenuItem>
    );
  }

  menuItems.push(
    <MenuItem key={"logout-button"} onClick={handleLogout}>
      Log out
    </MenuItem>
  );

  return (
    <>
      <Tooltip title="User Settings">
        <IconButton onClick={() => handleOpen()} sx={{ p: 0 }}>
          <UserAvatar user={user} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={isMenuOpen}
        onClose={handleClose}
      >
        {menuItems}
      </Menu>
    </>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ logOut }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatarMenu);
