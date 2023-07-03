import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  processGetMemberDetails,
  updateSelectedMemberProfile
} from "../../thunks/thunks";

const Button = dynamic(() => import("@mui/material").then((mui) => mui.Button));
const Table = dynamic(() => import("@mui/material").then((mui) => mui.Table));
const TableBody = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableBody)
);
const TableCell = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableCell)
);
const TableContainer = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableContainer)
);
const TableHead = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableHead)
);
const TableRow = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableRow)
);
const Paper = dynamic(() => import("@mui/material").then((mui) => mui.Paper));
const Typography = dynamic(() =>
  import("@mui/material").then((mui) => mui.Typography)
);
const LoadingDataMessage = dynamic(() =>
  import("../../components/Utilities/LoadingDataMessage")
);
const SearchBar = dynamic(() => import("../../components/Utilities/SearchBar"));
dynamic(() => import("@mui/material/styles"));
const CheckBoxIcon = dynamic(() => import("@mui/icons-material/CheckBox"));

const MemberDetailsPage = ({ user, memberDetails, token }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return;
    }
    if (!memberDetails || !memberDetails.length) {
      dispatch(processGetMemberDetails(token));
    }
  }, [user, memberDetails]); // eslint-disable-line

  if (!user || !user.isAdmin) {
    return null;
  }

  const membersToDisplay = (memberDetails || []).filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const memberInfoTable = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "80vh", overflow: "scroll" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="reservation-table-head-row">
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Admin?</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zip</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membersToDisplay.map((member) => (
              <TableRow
                key={member.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell>
                  {member.isAdmin && <CheckBoxIcon color="primary" />}
                </TableCell>
                <TableCell>{member.street}</TableCell>
                <TableCell>{member.city}</TableCell>
                <TableCell>{member.state}</TableCell>
                <TableCell>{member.zipcode}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>
                  <a
                    href={`mailto:${member.email}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {member.email}
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => {
                      dispatch(
                        updateSelectedMemberProfile(member, token, router)
                      );
                    }}
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <main className="main-container">
      <Typography variant="h4" component="h4">
        Member Details:
      </Typography>
      <SearchBar searchText={searchText} updateSearchText={setSearchText} />
      {memberDetails && memberDetails.length ? (
        memberInfoTable()
      ) : (
        <LoadingDataMessage message="Member Details" />
      )}
    </main>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  memberDetails: state.data.member_details,
  token: state.data.token
});

export default connect(mapStateToProps)(MemberDetailsPage);
