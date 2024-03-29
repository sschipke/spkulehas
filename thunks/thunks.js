import {
  getReservations,
  loginUser,
  updateEmail,
  updatePassword,
  resetPassword,
  requestPasswordReset,
  updateEmailSetting,
  validateResetToken,
  fetchMemberProfile,
  fetchMemberDetailsForAdmin,
  createNewMember,
  validateReservationsEtag,
  getDashboardData
} from "../utils/apiCalls";
import {
  closeLoadingModal,
  setReservations,
  showToast,
  loginUserSuccess,
  closeLoginModal,
  updateToken,
  closeUpdateCredentialsModal,
  updateUserEmail,
  showLoginModal,
  showLoadingModal,
  showUdpateCredentialsModal,
  toggleEmailSettings,
  setSelectedMember,
  updateSelectedMemberEmailSettings,
  updateSelectedMemberEmail,
  loadMemberDetails,
  setNewMember,
  clearNewMemberInfo,
  toggleConfirmAddMemberDialog,
  showViewReservationModal,
  updateViewDate,
  setCurrentReservation,
  setLoginData
} from "../actions";
import {
  cacheReservationData,
  getCachedReservations,
  getCachedReservationsEtag
} from "../utils/localStorage";

export const loadReservations = () => async (dispatch) => {
  return getReservations()
    .then((res) => {
      cacheReservationData(res);
      dispatch(setReservations(res.reservations));
      dispatch(closeLoadingModal());
    })
    .catch((err) => {
      console.error("Unable to fetch reservations", err);
      dispatch(showToast("Unable to fetch reservations.", "error"));
    });
};

export const handleReservationLoading = () => async (dispatch) => {
  const cachedReservations = getCachedReservations();
  const reservationsEtag = getCachedReservationsEtag();
  if (cachedReservations && cachedReservations.length && reservationsEtag) {
    const isEtagValid = await validateReservationsEtag(reservationsEtag);
    if (isEtagValid) {
      dispatch(setReservations(cachedReservations));
      dispatch(closeLoadingModal());
    } else dispatch(loadReservations());
  } else {
    dispatch(loadReservations());
  }
};

export const processLogin = (email, password) => async (dispatch) => {
  try {
    let data = await loginUser(email, password);
    dispatch(loginUserSuccess(data));
    dispatch(closeLoadingModal());
    dispatch(closeLoginModal());
  } catch (error) {
    console.error("Catching processlogin. ", error.Error);
    dispatch(showToast("Invalid username or password.", "error"));
  }
};

export const processPasswordChange =
  (newPassword, password, token, id) => async (dispatch) => {
    try {
      await updatePassword(newPassword, password, token, id);
      dispatch(showToast("Password sucessfully updated!", "success"));
      dispatch(closeUpdateCredentialsModal());
    } catch (err) {
      console.error("Catching process password change. ", err);
      const error = err.error ? error.error : "";
      dispatch(showToast("Unable to update password. " + error, "error"));
    }
  };

export const processEmailChange =
  (newEmail, password, token, id, isSelectedMember) => async (dispatch) => {
    try {
      let res = await updateEmail(newEmail, password, token, id);
      if (isSelectedMember) {
        dispatch(updateSelectedMemberEmail(res.email, res.token));
      } else {
        dispatch(updateUserEmail(res.email, res.token));
      }
      dispatch(showToast("Email sucessfully updated!", "success"));
      dispatch(closeUpdateCredentialsModal());
    } catch (error) {
      console.error("Catching process email change. ", error.Error);
      dispatch(showToast("Unable to update email. " + error.error, "error"));
    }
  };

export const processRequestPasswordReset = (email) => async (dispatch) => {
  dispatch(showLoadingModal());
  try {
    let res = await requestPasswordReset(email);
    dispatch(closeLoadingModal());
    dispatch(showToast(res, "success"));
    dispatch(closeLoginModal());
  } catch (err) {
    console.error("Unable to request reset. ", err);
    const error = err.error ? error.error : "";
    dispatch(closeLoadingModal());
    dispatch(showToast("Unable to request reset. " + error, "error"));
  }
};

export const processPasswordReset =
  (token, newPassword) => async (dispatch) => {
    try {
      await resetPassword(token, newPassword);
      dispatch(showToast("Reset successful. Please login.", "success"));
      dispatch(closeUpdateCredentialsModal());
      dispatch(updateToken(null));
      dispatch(showLoginModal());
    } catch (err) {
      let { error } = err;
      console.error("Catching process password. ", error);
      if (error && error.includes("This session has expired.")) {
        error = "This link has expired. Please request a new email.";
      }
      dispatch(showToast(error, "error"));
      if (
        (error && error.includes("please")) ||
        (error && error.includes("expire"))
      ) {
        dispatch(closeUpdateCredentialsModal());
      }
    }
  };

export const processValidateToken = (token) => async (dispatch) => {
  if (!token) {
    return;
  }
  try {
    let isValid = await validateResetToken(token);
    if (isValid) {
      dispatch(showUdpateCredentialsModal("RESET_PASSWORD"));
    } else {
      dispatch(
        showToast(
          "This link is not valid. Please request another email.",
          "error"
        )
      );
    }
  } catch (err) {
    let { error } = err;
    console.error("Catching validate reset token. ", err);
    if (error && error.includes("This session has expired.")) {
      error = "This link has expired. Please request a new email.";
    }
    if (!error) {
      error = "Could not validate reset session. Please try again.";
    }
    dispatch(showToast(error, "error"));
  }
};

export const processEmailSettingChange =
  (settingName, value, userId, token, isSelectedMember) => async (dispatch) => {
    dispatch(showLoadingModal());
    try {
      let res = await updateEmailSetting(settingName, value, userId, token);
      if (isSelectedMember) {
        dispatch(updateSelectedMemberEmailSettings(settingName, value));
      } else {
        dispatch(toggleEmailSettings(settingName, value));
      }
      dispatch(showToast(`${res}`, "success"));
      dispatch(closeLoadingModal());
    } catch (er) {
      let { error } = er;
      console.error("Catching process email setting update. ", error);
      if (!error) {
        error = "";
      }
      dispatch(closeLoadingModal());
      dispatch(showToast("Unable to update preference. " + error, "error"));
    }
  };

export const updateSelectedMemberProfile =
  (member, token, router) => async (dispatch) => {
    dispatch(showLoadingModal());
    try {
      const { selectedMember, selectedMemberEmailSettings } =
        await fetchMemberProfile(member, token);
      dispatch(setSelectedMember(selectedMember, selectedMemberEmailSettings));
      dispatch(closeLoadingModal());
      dispatch(
        showToast(`${selectedMember.name} has been selected.`, "success")
      );
      router.push("/profile");
    } catch ({ error }) {
      dispatch(closeLoadingModal());
      dispatch(
        showToast("Unable to get selected member profile. " + error, "error")
      );
    }
  };

export const processGetMemberDetails = (token) => async (dispatch) => {
  try {
    const { memberDetails } = await fetchMemberDetailsForAdmin(token);
    dispatch(loadMemberDetails(memberDetails));
    dispatch(showToast("Member details loaded!", "success"));
  } catch (error) {
    console.error("ERROR getting member details: ", error);
    dispatch(showToast("Unabe to fetch member details.", "error"));
  }
};

export const handleAddNewMember =
  (member, password, token, router) => async (dispatch) => {
    dispatch(showLoadingModal());
    try {
      const { newMember } = await createNewMember(member, password, token);
      dispatch(setNewMember(newMember));
      dispatch(setSelectedMember(newMember));
      dispatch(clearNewMemberInfo());
      dispatch(toggleConfirmAddMemberDialog());
      dispatch(
        showToast(
          `${newMember.name} has been created and their email has been sent.`,
          "success"
        )
      );
      dispatch(closeLoadingModal());
      router.push("/profile");
    } catch (err) {
      let { error } = err;
      console.error("Error handling adding new member: ", err);
      if (!error) {
        error = "Something went wrong";
      }
      dispatch(closeLoadingModal());
      dispatch(showToast("Unable to add new member: " + error, "error"));
    }
  };

export const handleReservationIdFromUrl =
  (reservationId, reservations) => (dispatch) => {
    console.log("Looking for reservation!!: ", reservationId);
    const reservationNumber = Number(reservationId);
    const reservationFromUrl = reservations.find(
      (reservation) => reservation.id === reservationNumber
    );
    if (reservationFromUrl) {
      dispatch(updateViewDate(reservationFromUrl.start));
      dispatch(setCurrentReservation(reservationFromUrl));
      dispatch(showViewReservationModal());
    } else {
      dispatch(showToast("Unable to load reservation.", "error"));
    }
  };

export const handleEtagMismatch =
  (closeMainModal, closeSecondaryModal) => async (dispatch) => {
    dispatch(showToast("Try again. Getting updated reservations.", "error"));
    try {
      await dispatch(loadReservations());
      closeMainModal();
      if (closeSecondaryModal) {
        closeSecondaryModal();
      }
      dispatch(showToast("Reservations updated. Try again.", "warning"));
    } catch (err) {
      dispatch(
        showToast("Unable to update reservations. Please try again.", "error")
      );
    }
  };

export const handleDashboardData = (token) => async (dispatch) => {
  try {
    const loginData = await getDashboardData(token);
    dispatch(setLoginData(loginData));
    dispatch(showToast("Dashboard data loaded.", "success"));
  } catch (error) {
    dispatch(showToast(error.error, "error"));
  }
};
