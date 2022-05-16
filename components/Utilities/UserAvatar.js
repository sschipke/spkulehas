import React from "react";
import { Avatar } from "@mui/material";

const UserAvatar = ({ name }) => {

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: "secondary.main",
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

  return (
    <Avatar {...stringAvatar(name)} />
  )
}

export default UserAvatar;