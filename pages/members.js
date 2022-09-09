import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useRouter } from "next/router";
import moment from "moment";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Visibility from "@mui/icons-material/Visibility";
import "@mui/material/styles";
import {
  setCurrentReservation,
  toggleEditReservationPicker,
  toggleConfirmDeleteDialog,
  updateViewDate,
} from "../actions";

const MembersContactPage = ({
  user,
  userReservations,
  usersInfo,
  toggleEditReservationPicker,
  toggleConfirmDeleteDialog,
  updateViewDate,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]); // eslint-disable-line

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
  usersInfo: state.data.usersInfo
});

export default connect(mapStateToProps)(MembersContactPage);
