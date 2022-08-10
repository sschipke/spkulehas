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
  reservation_title: "",
};
//TODO: REMOVE!!
const generateRandomColor = () => {
  const index = Math.floor(parseInt(Math.random() * 10));
  const colors = [
    "#880e4f",
    "#b71c1c",
    "#4a148c",
    "#0d47a1",
    "#006064",
    "#004d40",
    "#f57f17",
    "#ff6f00",
    "#e65100",
    "#bf360c",
  ];
  return colors[index];
};

const data = (state = initialState, action) => {
  let new_state = { ...state };

  const { reservations, user, usersInfo } = state;

  switch (action.type) {
    case "RESERVATIONS_LOADED":
      new_state.reservations = action.reservations.map((reservation) => {
        reservation.start = new Date(reservation.start);
        reservation.end = new Date(reservation.end);
        reservation.color = generateRandomColor();
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
      let userReservations;
      const filteredReservations = reservations.filter(
        (reservation) => reservation.id !== id
      );
      if (user.status === "ADMIN") {
        userReservations = filteredReservations;
      } else {
        userReservations = filteredReservations.filter(
          (res) => res.user_id === user.id
        );
      }
      new_state.reservations = filteredReservations;
      new_state.user_reservations = userReservations;
      new_state.current_reservation = null;
      return new_state;
    case "USER_LOGIN_SUCCESS":
      const { token } = action.data;
      const userToLogin = action.data.user;
      new_state.user = userToLogin;
      new_state.token = token;
      new_state.usersInfo = action.data.usersInfo;
      new_state.user_reservations = reservations.filter(
        (res) => res.user_id === userToLogin.id
      );
      if (userToLogin.status === "ADMIN") {
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
      const { userId } = action;
      if (userId) {
        let name = usersInfo.find((user) => user.id === userId)["name"];
        new_state.selected_user = { id: userId, name };
      } else {
        new_state.selected_user = null;
      }
      return new_state;
    case "UPDATE_RESERVATION_TITLE":
      new_state.reservation_title = action.value;
      return new_state;
    case "UPDATE_EMAIL":
      const { email } = action;
      new_state.token = action.token;
      new_state.user = { ...user, email };
      return new_state;
    case "UPDATE_USER":
      new_state.user = action.user;
      new_state.token = action.token;
      return new_state;
    case "UPDATE_TOKEN":
      new_state.token = action.token;
      return new_state;
    default:
      return state;
  }
};

export default data;
