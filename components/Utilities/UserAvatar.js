import React from "react";
import { Avatar } from "@mui/material";

const UserAvatar = ({ user }) => {
  function stringAvatar(user) {
    const { firstName, lastName } = user;
    return {
      sx: {
        bgcolor: "secondary.main"
      },
      children: `${firstName[0]}${lastName[0]}`
    };
  }

  return <Avatar {...stringAvatar(user)} />;
};

export default UserAvatar;
