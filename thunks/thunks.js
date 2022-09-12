import {
  getReservations,
  loginUser,
  updateEmail,
  updatePassword,
  resetPassword,
  requestPasswordReset,
  updateEmailSetting,
  validateResetToken,
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
} from "../actions";

export const loadReservations = () => async (dispatch) => {
  return getReservations()
    .then((res) => {
      dispatch(setReservations(res.reservations));
      dispatch(closeLoadingModal());
    })
    .catch((err) => {
      console.error("Unable to fetch reservations", err);
      dispatch(showToast("Unable to fetch reservations.", "error"));
    });
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
      let data = await updatePassword(newPassword, password, token, id);
      dispatch(showToast("Password sucessfully updated!", "success"));
      dispatch(closeUpdateCredentialsModal());
    } catch (error) {
      console.error("Catching process password change. ", error.Error);
      dispatch(
        showToast("Unable to updated password. " + error.error, "error")
      );
    }
  };

export const processEmailChange =
  (newEmail, password, token, id) => async (dispatch) => {
    try {
      let res = await updateEmail(newEmail, password, token, id);
      dispatch(updateUserEmail(res.email, res.token));
      dispatch(showToast("Email sucessfully updated!", "success"));
      dispatch(closeUpdateCredentialsModal());
    } catch (error) {
      console.error("Catching process email change. ", error.Error);
      dispatch(showToast("Unable to updated email. " + error.error, "error"));
    }
  };

export const processRequestPasswordReset = (email) => async (dispatch) => {
  dispatch(showLoadingModal());
  try {
    let res = await requestPasswordReset(email);
    dispatch(closeLoadingModal());
    dispatch(showToast(res, "success"));
    dispatch(closeLoginModal());
  } catch (error) {
    console.error("Unable to request reset. ", error);
    dispatch(closeLoadingModal());
    dispatch(showToast("Unable to request reset. " + error.error, "error"));
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
      const { error } = err;
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
  console.log("VALD ", token);
  try {
    let isValid = await validateResetToken(token);
    console.log({ isValid });
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
    const { error } = err;
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
  (settingName, value, userId, token) => async (dispatch) => {
    dispatch(showLoadingModal());
    try {
      let res = await updateEmailSetting(settingName, value, userId, token);
      dispatch(toggleEmailSettings(settingName, value));
      dispatch(showToast(`${res}`, "success"));
      dispatch(closeLoadingModal());
    } catch (error) {
      console.error("Catching process email setting update. ", error.Error);
      dispatch(closeLoadingModal());
      dispatch(showToast("Unable to updated email. " + error.error, "error"));
    }
  };
