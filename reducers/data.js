/* eslint-disable no-case-declarations */
import dayjs from "dayjs";
import {
  mapEmailSettings,
  handleNameChangeReservationTitles,
  updateMemberDetails,
  updateUsersInfo,
  findNearestReservations,
  sortByStartDate,
  convertToMountainTimeDate
} from "../utils/helpers";
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
  selected_member_profile: null,
  selected_member_email_settings: null,
  reservation_title: "",
  member_details: null,
  new_member_info: null
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
    "#bf360c"
  ];
  return colors[index];
};

const data = (state = initialState, action) => {
  let new_state = { ...state };

  const {
    reservations,
    user,
    usersInfo,
    selected_member_profile,
    member_details
  } = state;

  switch (action.type) {
    case "RESERVATIONS_LOADED":
      const mappedReservationsToDate = action.reservations.map(
        (reservation) => {
          reservation.start = convertToMountainTimeDate(reservation.start);
          reservation.end = convertToMountainTimeDate(reservation.end);
          reservation.color = generateRandomColor();
          return reservation;
        }
      );
      if (user && !user.isAdmin) {
        new_state.user_reservations = mappedReservationsToDate.filter(
          (res) => res.user_id === user.id
        );
      } else {
        new_state.user_reservations = mappedReservationsToDate;
      }
      new_state.reservations = mappedReservationsToDate;
      new_state.are_reservations_loaded = true;
      return new_state;
    case "ADD_RESERVATION":
      reservations.push(action.reservation);
      const newSortedReservations = sortByStartDate(reservations);
      new_state.reservations = [...newSortedReservations];
      if (user && !user.isAdmin && action.reservation.user_id === user.id) {
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
        dayjs(action.reservation.start),
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
          reservation.start = convertToMountainTimeDate(reservation.start);
          reservation.end = convertToMountainTimeDate(reservation.end);
        }
        return reservation;
      });
      if (!user.isAdmin) {
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
      if (user.isAdmin) {
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
      new_state.emailSettings = mapEmailSettings(action.data.emailSettings);
      new_state.user_reservations = reservations.filter(
        (res) => res.user_id === userToLogin.id
      );
      if (userToLogin.isAdmin) {
        new_state.user_reservations = reservations;
      }
      return new_state;
    case "LOG_OUT":
      new_state.user = null;
      new_state.user_reservations = null;
      new_state.token = null;
      new_state.usersInfo = null;
      new_state.selected_user = null;
      new_state.selected_member_profile = null;
      new_state.selected_member_email_settings = null;
      new_state.member_details = null;
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
      const updatedUserWithEmail = { ...user, email };
      new_state.user = updatedUserWithEmail;
      updateUsersInfo(new_state, usersInfo, updatedUserWithEmail);
      return new_state;
    case "UPDATE_USER":
      new_state.user = action.user;
      if (user.name !== action.user.name) {
        updateUsersInfo(new_state, usersInfo, action.user);
      }
      new_state.token = action.token;
      return new_state;
    case "UPDATE_TOKEN":
      if (!action.token) {
        return state;
      }
      new_state.token = action.token;
      return new_state;
    case "TOGGLE_EMAIL_SETTING":
      const { setting_name, value } = action;
      new_state.emailSettings = { setting_name, value };
      return new_state;
    case "SET_SELECTED_MEMBER":
      const { selectedMember, selectedMemberEmailSettings } = action;
      new_state.selected_member_profile = selectedMember;
      new_state.selected_member_email_settings = mapEmailSettings(
        selectedMemberEmailSettings
      );
      return new_state;
    case "UPDATE_SELECTED_MEMBER":
      new_state.selected_member_profile = action.selectedMember;
      updateMemberDetails(new_state, member_details, action.selectedMember);
      return new_state;
    case "UPDATE_SELECTED_MEMBER_EMAIL_SETTINGS":
      const {
        selectedMemberEmailSettingName,
        selectedMemberEmailSettingValue
      } = action;
      new_state.selected_member_email_settings = {
        setting_name: selectedMemberEmailSettingName,
        value: selectedMemberEmailSettingValue
      };
      return new_state;
    case "UPDATE_SELECTED_MEMBER_EMAIL":
      const { selectedMemberEmail } = action;
      if (action.token) {
        new_state.token = action.token;
      }
      const updatedSelectedMember = {
        ...selected_member_profile,
        email: selectedMemberEmail
      };
      new_state.selected_member_profile = updatedSelectedMember;
      updateMemberDetails(new_state, member_details, updatedSelectedMember);
      return new_state;
    case "UPDATE_RESERVATION_TITLES_NEW_NAME":
      handleNameChangeReservationTitles(
        new_state,
        action.updatedReservations,
        user
      );
      return new_state;
    case "LOAD_MEMBER_DETAILS":
      new_state.member_details = action.memberDetails;
      return new_state;
    case "SET_NEW_MEMBER_INFO":
      new_state.new_member_info = action.newMemberInfo;
      return new_state;
    case "CLEAR_NEW_MEMBER_INFO":
      new_state.new_member_info = null;
      return new_state;
    case "SET_NEW_MEMBER":
      if (member_details) {
        new_state.member_details = [...member_details, action.newMember];
      }
      return new_state;
    default:
      return state;
  }
};

export default data;
