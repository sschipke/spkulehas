import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Select,
  MenuItem,
  InputLabel
} from "@mui/material"
import { updateSelectedUser } from '../../actions';

const UserSelect = ({
  user,
  usersInfo,
  updateSelectedUser,
  selectedUser
}) => {
    if (user.status !== "ADMIN" || !usersInfo) {
      return null;
    }
    const handleSelect = (value) => {
      updateSelectedUser(value);
    }

    const options = usersInfo.map(user => 
      (<MenuItem color="secondary" value={`${user.id}_${user.name}`}>{user.name}</MenuItem>)
    )

    options.unshift(<MenuItem value="">None</MenuItem>)
    return (
      <div style={{width: "80%"}}>
        <InputLabel>Member</InputLabel>
        <Select 
          label="Member"
          value={selectedUser ? `${selectedUser.id}_${selectedUser.name}`: ""}
          id="selectUserId"
          onChange={e =>{
            handleSelect(e.target.value);
            console.log("Select ",e.target.value, e.target)
          }}
          sx={{width: "80%"}}
        >
          {options}
        </Select>
      </div>
    )
  }

export const mapStateToProps = (state) => ({
  user: state.data.user,
  usersInfo: state.data.usersInfo,
  selectedUser: state.data.selected_user
})

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ updateSelectedUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserSelect);