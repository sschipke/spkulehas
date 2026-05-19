import { Avatar } from "@mui/material";

const UserAvatar = ({ user }) => {
  function stringAvatar(user) {
    const { firstName, lastName, name } = user;
    const initials =
      firstName && lastName
        ? `${firstName[0]}${lastName[0]}`
        : (name || "?")[0];
    return {
      sx: { bgcolor: "secondary.main" },
      children: initials
    };
  }

  return <Avatar {...stringAvatar(user)} />;
};

export default UserAvatar;
