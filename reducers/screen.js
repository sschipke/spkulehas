import moment from "moment";
const minDate = process.env.NEXT_PUBLIC_MIN_DATE;
const maxDate = process.env.NEXT_PUBLIC_MAX_DATE;
let initialState = {
  edit_reservation_picker_open: false,
  new_reservation_picker_open: false,
  view_reservation_modal_open: false,
  show_toast: false,
  toast_message: null,
  toast_type: null,
  show_login_prompt: false,
  show_login_modal: false,
  show_update_credentials_modal: false,
  update_credentials_modal_kind: null,
  is_loading: false,
  is_confirm_delete_dialog_open: false,
  view_date: new Date()
};

const screen = (state = initialState, action) => {
  let new_state = { ...state };
  const {
    edit_reservation_picker_open,
    new_reservation_picker_open,
    view_date,
    is_confirm_delete_dialog_open
  } = state;
  switch (action.type) {
    case "IS_LOADING":
      new_state.is_loading = true;
      return new_state;
    case "RESERVATIONS_LOADED":
      new_state.is_loading = false;
      return new_state;
    case "CLOSE_LOADING_MODAL":
      new_state.is_loading = false;
      return new_state;
    case "TOGGLE_EDIT_RESERVATION_PICKER":
      new_state.edit_reservation_picker_open = !edit_reservation_picker_open;
      return new_state;
    case "TOGGLE_NEW_RESERVATION_PICKER":
      new_state.new_reservation_picker_open = !new_reservation_picker_open;
      return new_state;
    case "OPEN_TOAST":
      new_state.show_toast = true;
      new_state.toast_message = action.message
        ? action.message
        : "Something went wrong";
      new_state.toast_type = action.toastType;
      return new_state;
    case "HIDE_TOAST":
      new_state.show_toast = false;
      return new_state;
    case "VIEW_NEXT_MONTH":
      new_state.view_date = moment(view_date).add(1, "month").toDate();
      return new_state;
    case "VIEW_PREVIOUS_MONTH":
      new_state.view_date = moment(view_date).subtract(1, "month").toDate();
      return new_state;
    case "UPDATE_VIEW_DATE":
      let { date } = action;
      if (!moment(date).isValid()) {
        return new_state;
      }
      if (date) {
        new_state.view_date = moment(date).toDate();
      }
      if (moment(date).isBefore(minDate)) {
        new_state.view_date = moment(minDate).toDate();
      }
      if (moment(date).isAfter(maxDate)) {
        new_state.view_date = moment(maxDate).toDate();
      }
      return new_state;
    case "VIEW_TODAY":
      new_state.view_date = new Date();
      return new_state;
    case "SHOW_LOGIN_PROMPT":
      new_state.show_login_prompt = true;
      return new_state;
    case "CLOSE_LOGIN_PROMPT":
      new_state.show_login_prompt = false;
      return new_state;
    case "SHOW_LOGIN_MODAL":
      new_state.show_login_modal = true;
      return new_state;
    case "CLOSE_LOGIN_MODAL":
      new_state.show_login_modal = false;
      return new_state;
    case "OPEN_VIEW_RESERVATION_MODAL":
      new_state.view_reservation_modal_open = true;
      return new_state;
    case "CLOSE_VIEW_RESERVATION_MODAL":
      new_state.view_reservation_modal_open = false;
      return new_state;
    case "TOGGLE_CONFIRM_DELETE_DIALOG":
      new_state.is_confirm_delete_dialog_open = !is_confirm_delete_dialog_open;
      return new_state;
    case "SHOW_UPDATE_CREDENTIALS_MODAL":
      new_state.show_update_credentials_modal = true;
      new_state.update_credentials_modal_kind = action.kind;
      return new_state;
    case "CLOSE_UPDATE_CREDENTIALS_MODAL":
      new_state.show_update_credentials_modal = false;
      new_state.update_credentials_modal_kind = null;
      return new_state;
    default:
      return state;
  }
};

export default screen;
