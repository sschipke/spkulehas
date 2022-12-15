import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

dynamic(() => import("@mui/material/styles"));

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
const SearchBar = dynamic(() => import("../components/Utilities/SearchBar"));

const MembersContactPage = ({ user, usersInfo }) => {
  const router = useRouter();
  const [searchMember, setSearchMember] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]); // eslint-disable-line

  const membersToDisplay = (usersInfo || []).filter((member) =>
    member.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  const contactInfoTable = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "80vh", overflow: "scroll" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="reservation-table-head-row">
              <TableCell>Member</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membersToDisplay.map((member) => (
              <TableRow
                key={member.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{member.name}</TableCell>
                <TableCell>
                  <a
                    href={`mailto:${member.email}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {member.email}
                  </a>
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
        Members Contact Info
      </Typography>
      <SearchBar searchText={searchMember} updateSearchText={setSearchMember} />
      {usersInfo && usersInfo.length ? (
        contactInfoTable()
      ) : (
        <Typography variant="p" component="p">
          No Member Info to Display
        </Typography>
      )}
    </main>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  usersInfo: state.data.usersInfo
});

export default connect(mapStateToProps)(MembersContactPage);
