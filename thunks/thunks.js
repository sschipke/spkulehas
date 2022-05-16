import {
  getReservations,
  loginUser,
  updateEmail,
  updatePassword,
} from "../utils/apiCalls";
import {
  closeLoadingModal,
  setReservations,
  showToast,
  loginUserSuccess,
  closeLoginModal,
  closeUpdateCredentialsModal,
  updateUserEmail,
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
      dispatch(updateUserEmail(res.email));
      dispatch(showToast("Email sucessfully updated!", "success"));
      dispatch(closeUpdateCredentialsModal());
    } catch (error) {
      console.error("Catching process email change. ", error.Error);
      dispatch(showToast("Unable to updated email. " + error.error, "error"));
    }
  };
