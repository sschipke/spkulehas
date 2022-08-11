export const VALID_EMAIL_REGEX = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/);

const VALID_PASSWORD_REGEX = new RegExp(
  /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/
);

export const validateUpdatingCredentials = (kind, values) => {
  const {
    newEmail,
    confirmNewEmail,
    password,
    newPassword,
    confirmNewPassword,
    error,
  } = values;
  if (kind !== "RESET_PASSWORD" && !password) {
    return false;
  }
  if (kind === "EMAIL") {
    if (!confirmNewEmail || !newEmail) {
      return false;
    }
    if (newEmail !== confirmNewEmail) {
      return false;
    }
    if (!VALID_EMAIL_REGEX.test(newEmail)) {
      return false;
    }
  }
  if (kind === "PASSWORD" || kind === "RESET_PASSWORD") {
    if (!newPassword || !confirmNewPassword) {
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      return false;
    }
    if (!VALID_PASSWORD_REGEX.test(newPassword)) {
      return false;
    }
  }
  return true;
};
