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

const MyReservationsPage = ({
  user,
  userReservations,
  setCurrentReservation,
  toggleEditReservationPicker,
  toggleConfirmDeleteDialog,
  updateViewDate,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  const convertReservationData = (reservation) => {};

  const reservationsDataTable = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "70vh", overflow: "scroll" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="reservation-table-head-row">
              <TableCell>Member</TableCell>
              <TableCell>Checkin Date</TableCell>
              <TableCell>Checkout Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userReservations.map((reservation) => (
              <TableRow
                key={reservation.title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell className={user.status === "ADMIN" ? "sticky" : ""}>{reservation.title}</TableCell>
                <TableCell>
                  {moment(reservation.start).format("MM/DD/YY")}
                </TableCell>
                <TableCell>
                  {moment(reservation.end).format("MM/DD/YY")}
                </TableCell>
                <TableCell>{reservation.notes}</TableCell>
                <TableCell>
                  <IconButton
                    size="large"
                    edge="end"
                    color="info"
                    onClick={() => {
                      setCurrentReservation(reservation);
                      toggleEditReservationPicker();
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="large"
                    edge="end"
                    color="error"
                    onClick={() => {
                      setCurrentReservation(reservation);
                      toggleConfirmDeleteDialog();
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="large"
                    edge="end"
                    color="info"
                    onClick={() => {
                      setCurrentReservation(reservation);
                      updateViewDate(reservation.start);
                      router.push("/");
                    }}
                  >
                    <Visibility />
                  </IconButton>
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
      <Typography variant="h4" component="h4">My Reservations:</Typography>
      {userReservations && userReservations.length ? reservationsDataTable() : <Typography variant="p" component="p">No Reservations</Typography>}
    </main>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  userReservations: state.data.user_reservations,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setCurrentReservation,
      toggleEditReservationPicker,
      toggleConfirmDeleteDialog,
      updateViewDate,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MyReservationsPage);
