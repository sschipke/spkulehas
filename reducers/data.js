import moment from "moment";
import mockReservations from "../utils/reservations";
import { findNearestReservations, sortByStartDate } from "../utils/helpers";
let initialState = {
  current_reservation: null,
  reservations: [],
  are_reservations_loaded: false,
  surrounding_reservations: [null, null],
  user: null,
  token: null,
  usersInfo: null,
  user_reservations: null,
  selected_user: null,
};

initialState.user = {
  name: "Scott Schipke",
  status: "D1",
  street: "755 S Dexter S #118",
  city: "Denver",
  state: "CO",
  zipcode: "80246",
  phone: "605-431-9294",
  id: "e48de300-affb-40a0-88bf-e39e14126ab5",
  email: "swschipke@gmail.com",
};

const data = (state = initialState, action) => {
  let new_state = { ...state };

  const { reservations, user } = state;

  switch (action.type) {
    case "RESERVATIONS_LOADED":
      new_state.reservations = action.reservations.map((reservation) => {
        reservation.start = new Date(reservation.start);
        reservation.end = new Date(reservation.end);
        return reservation;
      });
      new_state.are_reservations_loaded = true;
      return new_state;
    case "ADD_RESERVATION":
      reservations.push(action.reservation);
      const newSortedReservations = sortByStartDate(reservations);
      new_state.reservations = [...newSortedReservations];
      if (
        user &&
        user.status !== "ADMIN" &&
        action.reservation.user_id === user.id
      ) {
        new_state.user_reservations = newSortedReservations.filter(
          (res) => res.user_id === user.id
        );
      } else {
        new_state.user_reservations = newSortedReservations;
      }
      return new_state;
    case "SET_CURRENT_RESERVATION":
      new_state.current_reservation = action.reservation;
      new_state.surrounding_reservations = findNearestReservations(
        moment(action.reservation.start),
        reservations
      );
      return new_state;
    case "SET_SURROUNDING_RESERVATIONS":
      new_state.surrounding_reservations = action.surroundingReservations;
      return new_state;
    case "UPDATE_RESERVATION":
      const reservationToUpdate = action.reservation;
      const updatedReservations = reservations.map((reservation) => {
        if (reservation.id === reservationToUpdate.id) {
          reservation = reservationToUpdate;
          reservation.start = new Date(reservationToUpdate.start);
          reservation.end = new Date(reservation.end);
        }
        return reservation;
      });
      if (user.status !== "ADMIN") {
        new_state.user_reservations = updatedReservations.filter(
          (res) => res.user_id === user.id
        );
      } else {
        new_state.user_reservations = updatedReservations;
      }
      new_state.reservations = [...updatedReservations];
      return new_state;
    case "REMOVE_RESERVATION":
      const { id } = action;
      const filteredReservations = reservations.filter(
        (reservation) => reservation.id !== id
      );
      new_state.reservations = filteredReservations;
      if (user.status === "ADMIN") {
        new_state.user_reservations = filteredReservations;
      }
      new_state.user_reservations = filteredReservations.filter(
        (res) => res.user_id === user.id
      );
      new_state.current_reservation = null;
      return new_state;
    case "USER_LOGIN_SUCCESS":
      const { user, token } = action.data;
      new_state.user = user;
      new_state.token = token;
      new_state.user_reservations = reservations.filter(
        (res) => res.user_id === user.id
      );
      if (action.data["usersInfo"]) {
        new_state.usersInfo = action.data.usersInfo;
        new_state.user_reservations = reservations;
      }
      return new_state;
    case "LOG_OUT":
      new_state.user = null;
      new_state.user_reservations = null;
      new_state.token = null;
      new_state.usersInfo = null;
      new_state.selected_user = null;
      return new_state;
    case "UPDATE_SELECTED_USER":
      const values = action.value.split("_");
      new_state.selected_user = { id: values[0], name: values[1] };
      return new_state;
    case "UPDATE_EMAIL":
      const { email } = action;
      new_state.user = { ...user, email };
      return new_state;
    case "UPDATE_USER":
      new_state.user = action.user;
      return new_state;
    default:
      return state;
  }
};

export default data;
