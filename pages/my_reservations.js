import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import moment from "moment";

const IconButton = dynamic(() =>
  import("@mui/material").then((mui) => mui.IconButton)
);
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
const EditIcon = dynamic(() => import("@mui/icons-material/Edit"));
const DeleteForeverIcon = dynamic(() =>
  import("@mui/icons-material/DeleteForever")
);
const Visibility = dynamic(() => import("@mui/icons-material/Visibility"));
const SearchBar = dynamic(() => import("../components/Utilities/SearchBar"));
dynamic(() => import("@mui/material/styles"));
import {
  setCurrentReservation,
  toggleEditReservationPicker,
  toggleConfirmDeleteDialog,
  updateViewDate
} from "../actions";

const MyReservationsPage = ({
  user,
  userReservations,
  setCurrentReservation,
  toggleEditReservationPicker,
  toggleConfirmDeleteDialog,
  updateViewDate
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]); // eslint-disable-line

  const reservationsToDisplay = (userReservations || []).filter((reservation) =>
    reservation.title.includes(searchText)
  );

  const reservationsDataTable = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "80vh", overflow: "scroll" }}
      >
        {user && user.status === "ADMIN" && (
          <SearchBar searchText={searchText} updateSearchText={setSearchText} />
        )}
        <Table stickyHeader>
          <TableHead>
            <TableRow className="reservation-table-head-row">
              <TableCell>Member/Title</TableCell>
              <TableCell>Checkin Date</TableCell>
              <TableCell>Checkout Date</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>View In Calendar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservationsToDisplay.map((reservation) => (
              <TableRow
                key={reservation.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell className={user.status === "ADMIN" ? "sticky" : ""}>
                  {reservation.title}
                </TableCell>
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
      <Typography variant="h4" component="h4">
        My Reservations:
      </Typography>
      {userReservations && userReservations.length ? (
        reservationsDataTable()
      ) : (
        <Typography variant="p" component="p">
          No Reservations
        </Typography>
      )}
    </main>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  userReservations: state.data.user_reservations
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setCurrentReservation,
      toggleEditReservationPicker,
      toggleConfirmDeleteDialog,
      updateViewDate
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MyReservationsPage);
