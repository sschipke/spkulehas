import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { determineIfAdmin } from "../utils/helpers";

dynamic(() => import("@mui/material/styles"));

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

import { updateSelectedMemberProfile } from "../thunks/thunks";

const MembersContactPage = ({ user, usersInfo, token }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]); // eslint-disable-line

  const isAdmin = determineIfAdmin(user);

  const contactInfoTable = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "70vh", overflow: "scroll" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="reservation-table-head-row">
              <TableCell>Member</TableCell>
              <TableCell>Email</TableCell>
              {isAdmin && <TableCell>Select</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {usersInfo.map((member) => (
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
                {isAdmin && (
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
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <main>
      <Typography variant="h4" component="h4">
        Members Contact Info
      </Typography>
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
  usersInfo: state.data.usersInfo,
  token: state.data.token,
});

export default connect(mapStateToProps)(MembersContactPage);
