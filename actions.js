export const addReservation = (reservation) => ({
  type: "ADD_RESERVATION",
  reservation
});

export const toggleEditReservationPicker = () => ({
  type: "TOGGLE_EDIT_RESERVATION_PICKER"
});

export const setCurrentReservation = (reservation) => ({
  type: "SET_CURRENT_RESERVATION",
  reservation
});

export const setSurroundingReservations = (surroundingReservations) => ({
  type: "SET_SURROUNDING_RESERVATIONS",
  surroundingReservations
});

export const updateReservation = (reservation) => ({
  type: "UPDATE_RESERVATION",
  reservation
});

export const toggleNewReservationPicker = () => ({
  type: "TOGGLE_NEW_RESERVATION_PICKER"
});

export const showToast = (message, toastType) => ({
  type: "OPEN_TOAST",
  message,
  toastType
});

export const hideToast = () => ({
  type: "HIDE_TOAST"
});

export const viewNextMonth = () => ({
  type: "VIEW_NEXT_MONTH"
});

export const viewPreviousMonth = () => ({
  type: "VIEW_PREVIOUS_MONTH"
});

export const updateViewDate = (date) => ({
  type: "UPDATE_VIEW_DATE",
  date
});

export const viewToday = () => ({
  type: "VIEW_TODAY"
});

export const showViewReservationModal = () => ({
  type: "OPEN_VIEW_RESERVATION_MODAL"
});

export const closeViewReservationModal = () => ({
  type: "CLOSE_VIEW_RESERVATION_MODAL"
});

export const showLoginPrompt = () => ({
  type: "SHOW_LOGIN_PROMPT"
});

export const closeLoginPrompt = () => ({
  type: "CLOSE_LOGIN_PROMPT"
});

export const showLoginModal = () => ({
  type: "SHOW_LOGIN_MODAL"
});

export const closeLoginModal = () => ({
  type: "CLOSE_LOGIN_MODAL"
});

export const loginUserSuccess = (data) => ({
  type: "USER_LOGIN_SUCCESS",
  data
});

export const logOut = () => ({
  type: "LOG_OUT"
});

export const showLoadingModal = () => ({
  type: "IS_LOADING"
});

export const closeLoadingModal = () => ({
  type: "CLOSE_LOADING_MODAL"
});

export const setReservations = (reservations) => ({
  type: "RESERVATIONS_LOADED",
  reservations
});

export const removeReservation = (id) => ({
  type: "REMOVE_RESERVATION",
  id
});

export const toggleConfirmDeleteDialog = () => ({
  type: "TOGGLE_CONFIRM_DELETE_DIALOG"
});

export const updateSelectedUser = (userId) => ({
  type: "UPDATE_SELECTED_USER",
  userId
});

export const updateUser = (user, token) => ({
  type: "UPDATE_USER",
  user,
  token
});

export const showUdpateCredentialsModal = (kind) => ({
  type: "SHOW_UPDATE_CREDENTIALS_MODAL",
  kind
});

export const closeUpdateCredentialsModal = () => ({
  type: "CLOSE_UPDATE_CREDENTIALS_MODAL"
});

export const updateUserEmail = (email, token) => ({
  type: "UPDATE_EMAIL",
  email,
  token
});

export const updateToken = (token) => ({
  type: "UPDATE_TOKEN",
  token
});

export const updateReservationTitle = (value) => ({
  type: "UPDATE_RESERVATION_TITLE",
  value
});

export const toggleEmailSettings = (setting_name, value) => ({
  type: "TOGGLE_EMAIL_SETTING",
  setting_name,
  value
});

export const setSelectedMember = (member, emailSettings) => ({
  type: "SET_SELECTED_MEMBER",
  selectedMember: member,
  selectedMemberEmailSettings: emailSettings
});

export const updateSelectedMember = (member) => ({
  type: "UPDATE_SELECTED_MEMBER",
  selectedMember: member
});

export const updateSelectedMemberEmailSettings = (setting_name, value) => ({
  type: "UPDATE_SELECTED_MEMBER_EMAIL_SETTINGS",
  selectedMemberEmailSettingName: setting_name,
  selectedMemberEmailSettingValue: value
});

export const updateSelectedMemberEmail = (email, token) => ({
  type: "UPDATE_SELECTED_MEMBER_EMAIL",
  selectedMemberEmail: email,
  token
});

export const updateReservationTitles = (updatedReservations) => {
  if (!updatedReservations || !updatedReservations.length) {
    return { type: null };
  }
  return { type: "UPDATE_RESERVATION_TITLES_NEW_NAME", updatedReservations };
};
