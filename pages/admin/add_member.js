import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { formatPhoneNumber } from "../../utils/helpers";
import { setNewMemberInfo, toggleConfirmAddMemberDialog } from "../../actions";

const TextField = dynamic(() =>
  import("@mui/material").then((mod) => mod.TextField)
);
const Box = dynamic(() => import("@mui/material").then((mod) => mod.Box));
const Button = dynamic(() => import("@mui/material").then((mod) => mod.Button));
const Stack = dynamic(() => import("@mui/material").then((mod) => mod.Stack));
const Typography = dynamic(() =>
  import("@mui/material").then((mod) => mod.Typography)
);
const Paper = dynamic(() => import("@mui/material").then((mod) => mod.Paper));
const SelectStatus = dynamic(() =>
  import("../../components/Utilities/SelectStatus")
);

export const AddMemberPage = ({ user }) => {
  const blankMember = {
    status: "",
    isAdmin: false,
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    phone: ""
  };
  const router = useRouter();
  const dispatch = useDispatch();
  const [userInfo, updateUserInfo] = useState(blankMember);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const phoneFormat = { length: 10, pattern: "[0-9]{10}" };

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
      case "email":
        inputValue = e.target.value.trim().toLowerCase();
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
    dispatch(setNewMemberInfo(userInfo));
    dispatch(toggleConfirmAddMemberDialog());
  };

  return (
    <Paper
      component="main"
      sx={{ minHeight: "90vh" }}
      className="profile-page main-container"
    >
      <Stack sx={{ alignItems: "center" }} className="profile-page-headers">
        <Typography component="h3" variant="h3">
          Add a New Member
        </Typography>
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
        <Stack sx={{ alignItems: "center", mb: "25px", mt: "15px" }}>
          <SelectStatus
            updateUserStatus={updateUserInfo}
            userReference={userInfo}
            addNewMember={true}
            width="50%"
          />
          <TextField
            id="email"
            label="Email"
            onChange={handleChange}
            type="email"
            required
            value={userInfo.email}
            sx={{ mt: "20px" }}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: "100%", justifyContent: "center" }}
        >
          <TextField
            id="firstName"
            label="First Name"
            inputProps={{
              maxLength: 29,
              minLength: 1
            }}
            onChange={handleChange}
            value={userInfo.firstName}
            required
          />
          <TextField
            id="lastName"
            label="Last Name"
            inputProps={{
              maxLength: 30,
              minLength: 1
            }}
            onChange={handleChange}
            value={userInfo.lastName}
            required
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
            helperText="U.S. Addresses Only"
            required
            onChange={handleChange}
            value={userInfo.street}
          />
          <TextField
            id="city"
            label="City"
            helperText="U.S. Cities Only"
            value={userInfo.city}
            onChange={handleChange}
            required
            inputProps={{
              maxLength: 50,
              minLength: 3
            }}
          />
          <TextField
            id="state"
            label="State"
            name="state"
            helperText="Two letter state code."
            value={userInfo.state}
            onChange={handleChange}
            required
            placeholder="State"
            inputProps={{
              maxLength: 2,
              minLength: 2,
              pattern:
                "^(([Aa][EeLlKkSsZzRr])|([Cc][AaOoTt])|([Dd][EeCc])|([Ff][MmLl])|([Gg][AaUu])|([Hh][Ii])|([Ii][DdLlNnAa])|([Kk][SsYy])|([Ll][Aa])|([Mm][EeHhDdAaIiNnSsOoTt])|([Nn][EeVvHhJjMmYyCcDd])|([Mm][Pp])|([Oo][HhKkRr])|([Pp][WwAaRr])|([Rr][Ii])|([Ss][CcDd])|([Tt][NnXx])|([Uu][Tt])|([Vv][TtIiAa])|([Ww][AaVvIiYy]))$"
            }}
          />
          <TextField
            id="zipcode"
            label="Zip Code"
            helperText="5 Digit Zip Code"
            value={userInfo.zipcode}
            onChange={handleChange}
            required
            placeholder="Zip Code"
            inputProps={{
              inputMode: "numeric",
              maxLength: 5,
              minLength: 5,
              pattern: "[0-9]{5}"
            }}
          />
          <TextField
            id="phone"
            label="Phone"
            value={userInfo.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            helperText="Please only enter 10 digits."
            inputProps={{
              inputMode: "numeric",
              minLength: phoneFormat.length,
              maxLength: phoneFormat.length,
              pattern: phoneFormat.pattern
            }}
          />
        </Stack>
        <Stack
          direction="row"
          sx={{
            m: { xs: "10px 0", sm: "10px 0", md: "25px auto", lg: "25px auto" },
            width: { md: "50%", lg: "30%" }
          }}
          justifyContent="space-between"
          alignItems="flex-end"
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              updateUserInfo(blankMember);
            }}
          >
            Clear
          </Button>
          <Button type="submit" color="info" variant="contained">
            Add New Member
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user
});

export default connect(mapStateToProps)(AddMemberPage);
