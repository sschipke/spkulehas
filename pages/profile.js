import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useRouter } from "next/router";
import { updateReservationTitles } from "../actions";
import dynamic from "next/dynamic";

const TextField = dynamic(() =>
  import("@mui/material").then((mod) => mod.TextField)
);
const Box = dynamic(() => import("@mui/material").then((mod) => mod.Box));
const Button = dynamic(() => import("@mui/material").then((mod) => mod.Button));
const Stack = dynamic(() => import("@mui/material").then((mod) => mod.Stack));
const IconButton = dynamic(() =>
  import("@mui/material").then((mod) => mod.IconButton)
);
const Typography = dynamic(() =>
  import("@mui/material").then((mod) => mod.Typography)
);
const Paper = dynamic(() => import("@mui/material").then((mod) => mod.Paper));
const EditIcon = dynamic(() => import("@mui/icons-material/Edit"));
import { formatPhoneNumber } from "../utils/helpers";
import {
  showToast,
  updateUser,
  showUdpateCredentialsModal,
  updateSelectedMember
} from "../actions";
import { updateUserProfile } from "../utils/apiCalls";
import { cacheReservationsEtag } from "../utils/localStorage";
const ReceiveDeletionEmailControl = dynamic(() =>
  import("../components/Utilities/ReceiveCancelationEmailControl")
);
const MakeAdminControlSwitch = dynamic(() =>
  import("../components/Utilities/MakeAdminControlSwitch")
);
const SelectStatus = dynamic(() =>
  import("../components/Utilities/SelectStatus")
);

export const ProfilePage = ({
  user,
  token,
  updateUser,
  showToast,
  showUdpateCredentialsModal,
  selectedMember,
  updateSelectedMember,
  updateReservationTitles
}) => {
  const router = useRouter();
  const userToUpdate = selectedMember ? selectedMember : user;
  const userClone = useMemo(() => ({ ...userToUpdate }), [userToUpdate]);
  const [isEditting, setIsEditting] = useState(false);
  const [userInfo, updateUserInfo] = useState(userClone);

  useEffect(() => {
    if (!isEditting) {
      updateUserInfo(userClone);
    }
    if (!userToUpdate) {
      router.push("/");
    }
  }, [isEditting, userToUpdate, userClone, router]);

  if (userToUpdate) {
    userClone.phone = ((userToUpdate && userToUpdate.phone) || "")
      .split("-")
      .join("");
  } else {
    return null;
  }

  const userReference = isEditting ? userInfo : userClone;
  const phoneFormat = isEditting
    ? { length: 10, pattern: "[0-9]{10}" }
    : { length: 12, pattern: "^[0-9]{3}-[0-9]{3}-[0-9]{4}$" };

  const hasChanges = JSON.stringify(userClone) !== JSON.stringify(userInfo);

  const handleChange = (e) => {
    let inputValue;
    const type = e.target.id;
    switch (type) {
      case "street":
      case "city":
        if (e.target.value.length === 1) {
          inputValue = e.target.value.trim().toUpperCase();
          break;
        }
        inputValue = e.target.value;
        break;
      case "state":
        inputValue = e.target.value.trim().toUpperCase();
        break;
      case "firstName":
      case "lastName":
        if (e.target.value.length === 1) {
          inputValue = e.target.value.trim().toUpperCase();
          break;
        }
        inputValue = e.target.value;
        break;
      default:
        inputValue = e.target.value.trim();
        break;
    }
    updateUserInfo({ ...userInfo, [e.target.id]: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    userInfo.phone = formatPhoneNumber(userInfo.phone || "");
    //TODO: Validate phone format/reset
    try {
      const response = await updateUserProfile(userInfo, token);
      const updatedUser = response.user;
      const newToken = response.token;
      const { updatedReservations, reservationsEtag } = response;
      if (reservationsEtag) {
        cacheReservationsEtag(reservationsEtag);
      }
      updateReservationTitles(updatedReservations);
      if (selectedMember && updatedUser.id === selectedMember.id) {
        updateSelectedMember(updatedUser);
      } else {
        updateUser(updatedUser, newToken);
      }
      showToast("Profile updated.", "success");
      setIsEditting(false);
    } catch (error) {
      console.error(error);
      let phoneNumber = user.phone;
      updateUserInfo({ ...userInfo, phone: phoneNumber });
      showToast("Unable to update profile. " + error.error, "error");
    }
  };

  return (
    <Paper
      component="main"
      sx={{ minHeight: "90vh" }}
      className="profile-page main-container"
    >
      <Stack sx={{ alignItems: "center" }} className="profile-page-headers">
        <Typography component="h3" variant="h3">
          {userReference.name}
        </Typography>
        <SelectStatus
          updateUserStatus={updateUserInfo}
          isEditting={isEditting}
          userReference={userReference}
        />
        <MakeAdminControlSwitch
          user={user}
          userInfo={userInfo}
          updateUserInfo={updateUserInfo}
          disabled={!isEditting}
        />
      </Stack>
      <Stack sx={{ alignItems: "center", mt: "10px" }}>
        <TextField
          id="email"
          label="Email"
          inputProps={{
            readOnly: true
          }}
          sx={{ width: { xs: "85%", sm: "85%", md: "20%", lg: "20%" } }}
          value={userReference.email}
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          {userToUpdate.email !== "spkulehas@gmail.com" && (
            <Button
              variant="contained"
              onClick={() => showUdpateCredentialsModal("EMAIL")}
            >
              Update Email
            </Button>
          )}
          {user.id === userToUpdate.id && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => showUdpateCredentialsModal("PASSWORD")}
            >
              Change Password
            </Button>
          )}
        </Stack>
        <ReceiveDeletionEmailControl />
      </Stack>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          m: "10px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: "column"
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          <TextField
            id="firstName"
            label="First Name"
            inputProps={{
              readOnly: !isEditting,
              maxLength: 29,
              minLength: 1
            }}
            onChange={handleChange}
            value={userReference.firstName}
            required={isEditting}
          />
          <TextField
            id="lastName"
            label="Last Name"
            inputProps={{
              readOnly: !isEditting,
              maxLength: 30,
              minLength: 1
            }}
            onChange={handleChange}
            value={userReference.lastName}
            required={isEditting}
          />
        </Stack>
        <Stack
          direction="row"
          spacing="10px"
          className="demographics-container"
          sx={{
            mt: "35px",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center"
          }}
        >
          <TextField
            id="street"
            label="Street Address"
            helperText={isEditting ? "U.S. Addresses Only" : ""}
            inputProps={{
              readOnly: !isEditting
            }}
            onChange={handleChange}
            value={userReference.street}
            required={isEditting}
          />
          <TextField
            id="city"
            label="City"
            helperText={isEditting ? "U.S. Cities Only Please" : ""}
            value={userReference.city}
            onChange={handleChange}
            required={isEditting}
            inputProps={{
              readOnly: !isEditting,
              maxLength: 50,
              minLength: 3
            }}
          />
          <TextField
            id="state"
            label="State"
            name="state"
            helperText={isEditting ? "Two letter state code." : ""}
            value={userReference.state}
            onChange={handleChange}
            required={isEditting}
            placeholder="State"
            inputProps={{
              readOnly: !isEditting,
              maxLength: 2,
              minLength: 2,
              pattern:
                "^(([Aa][EeLlKkSsZzRr])|([Cc][AaOoTt])|([Dd][EeCc])|([Ff][MmLl])|([Gg][AaUu])|([Hh][Ii])|([Ii][DdLlNnAa])|([Kk][SsYy])|([Ll][Aa])|([Mm][EeHhDdAaIiNnSsOoTt])|([Nn][EeVvHhJjMmYyCcDd])|([Mm][Pp])|([Oo][HhKkRr])|([Pp][WwAaRr])|([Rr][Ii])|([Ss][CcDd])|([Tt][NnXx])|([Uu][Tt])|([Vv][TtIiAa])|([Ww][AaVvIiYy]))$"
            }}
          />
          <TextField
            id="zipcode"
            label="Zip Code"
            helperText={isEditting ? "5 Digit Zip Code" : ""}
            value={userReference.zipcode}
            onChange={handleChange}
            required={isEditting}
            placeholder="Zip Code"
            inputProps={{
              readOnly: !isEditting,
              inputMode: "numeric",
              maxLength: 5,
              minLength: 5,
              pattern: "[0-9]{5}"
            }}
          />
          <TextField
            id="phone"
            label="Phone"
            value={userReference.phone}
            onChange={handleChange}
            required={isEditting}
            placeholder="Phone Number"
            helperText={isEditting ? "Please only enter 10 digits." : ""}
            inputProps={{
              readOnly: !isEditting,
              inputMode: "numeric",
              minLength: phoneFormat.length,
              maxLength: phoneFormat.length,
              pattern: phoneFormat.pattern
            }}
          />
        </Stack>
        <Stack direction="row" sx={{ mt: "25px", justifyContent: "center" }}>
          {isEditting ? (
            <Button
              type="submit"
              color="info"
              variant="contained"
              disabled={!hasChanges}
            >
              Submit
            </Button>
          ) : (
            <IconButton
              size="large"
              edge="end"
              color="primary"
              sx={{ mr: 2 }}
              onClick={() => setIsEditting(true)}
            >
              <EditIcon />
            </IconButton>
          )}
          {isEditting && (
            <Button
              onClick={() => {
                setIsEditting(false);
              }}
              color="secondary"
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  token: state.data.token,
  selectedMember: state.data.selected_member_profile
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateUser,
      showToast,
      showUdpateCredentialsModal,
      updateSelectedMember,
      updateReservationTitles
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
