const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const getReservations = async () => {
  const url = baseUrl + "reservations";
  return fetch(url).then((res) => res.json());
};

export const loginUser = async (email, password) => {
  const url = baseUrl + "user/login";
  const options = {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json"
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    switch (res.status) {
      case 401:
      case 403:
      case 404:
        throw new Error("Invalid username or password.");
      default:
        console.error("Error logging user in.");
        throw new Error("Error logging user in.");
    }
  }
  return res.json();
};

export const putReservation = async (reservation, token, reservationsEtag) => {
  const url = `${baseUrl}reservations/${reservation.id}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ reservation }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "If-Match": reservationsEtag
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    if (res.status === 412) {
      const mismatchError = {
        status: 412,
        message: "Reload reservations."
      };
      throw mismatchError;
    }
    if (res.status === 404) {
      throw { status: 404 };
    }
    const err = await res.json();
    let { error } = err;
    console.error("Error updating reservation: ", err);
    if (!error) {
      error = "Something went wrong.";
    }
    throw { error };
  }
  return res.json();
};

export const postReservation = async (reservation, token, reservationsEtag) => {
  const url = `${baseUrl}reservations/new`;
  const options = {
    method: "POST",
    body: JSON.stringify({ reservation }),
    headers: {
      "Content-Type": "application/json",
      "If-Match": reservationsEtag,
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    if (res.status === 412) {
      const mismatchError = {
        status: 412,
        message: "Reload reservations."
      };
      throw mismatchError;
    }
    const err = await res.json();
    let { error } = err;
    console.error("Error adding reservation: ", err);
    if (!error) {
      error = "Something went wrong.";
    }
    throw { error };
  }
  return res.json();
};

export const deleteReservation = async (
  reservation,
  token,
  shouldSendDeletionEmail
) => {
  const url = `${baseUrl}reservations/${reservation.id}`;
  const options = {
    method: "DELETE",
    body: JSON.stringify({ reservation, shouldSendDeletionEmail }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    if (res.status === 404) {
      console.warn("Unable to find reservation with id: ", reservation.id);
      throw { status: 404, message: "Unable to find reservation" };
    }
    const err = await res.json();
    let { error } = err;
    console.error("Error deleting reservation: ", error);
    if (!error) {
      error = "Something went wrong.";
    }
    throw { error };
  }
  return res.json();
};

export const updateUserProfile = async (user, token) => {
  const url = `${baseUrl}user/${user.id}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ user }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 404:
      case 422:
        console.error("Error updating profile: ", error);
        throw error;
      default:
        console.error("Error updating profile", error);
        throw new Error("Unable update profile.");
    }
  }
  return res.json();
};

export const updateEmail = async (newEmail, password, token, id) => {
  const url = `${baseUrl}user/update/email/${id}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ newEmail, password }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 403:
      case 404:
      case 409:
      case 422:
        console.error("Error updating email: ", error);
        throw error;
      default:
        console.error("Error updating email", error);
        throw { error: "Something went wrong." };
    }
  }
  return res.json();
};

export const updatePassword = async (newPassword, password, token, id) => {
  const url = `${baseUrl}user/update/password/${id}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ newPassword, password }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 404:
      case 429:
      case 422:
        console.error("Error updating password: ", error);
        throw error;
      default:
        console.error("Error updating password", error);
        throw new Error("Unable update password.");
    }
  }
  return res.json();
};

export const requestPasswordReset = async (email) => {
  const url = `${baseUrl}user/forgot/password`;
  const options = {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json"
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 404:
      case 429:
        console.error("Error requesting reset: ", error);
        throw error;
      default:
        console.error("Error requesting reset", error);
        throw new Error("Unable to request reset.");
    }
  }
  return res.json();
};

export const resetPassword = async (token, newPassword) => {
  const url = `${baseUrl}user/reset/password`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ newPassword }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 403:
      case 404:
      case 429:
        console.error("Error resetting password: ", error);
        throw error;
      default:
        console.error("Error resetting password", error);
        throw { error: "Unable to reset password." };
    }
  }
  return res.json();
};

export const updateEmailSetting = async (settingName, value, userId, token) => {
  const url = `${baseUrl}user/email_setting/${userId}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ settingName, value }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 403:
      case 422:
        console.error("Error updating email setting: ", error);
        throw error;
      default:
        console.error("Error updating email setting:", error);
        throw new Error("Unable to update email setting.");
    }
  }
  return res.json();
};

export const validateResetToken = async (token) => {
  const url = `${baseUrl}session/reset/validate`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 404:
      case 403:
      case 422:
      case 429:
        console.error("Invalid reset token.", error);
        throw error;
      default:
        console.error("Error validating reset token.");
        throw { error: "This session is not valid." };
    }
  }
  return res.json();
};

export const fetchMemberProfile = async (member, token) => {
  if (!member.id) {
    throw new Error("No member id present.", {
      error: "No member id present."
    });
  }
  const url = `${baseUrl}admin/select/${member.id}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const err = res.json();
    console.error("Unable to get member profile. ", err);
    let { error } = err;
    if (!error) {
      error = "Could not fetch member profile.";
    }
    throw { error };
  }
  return res.json();
};

export const fetchMemberDetailsForAdmin = async (token) => {
  if (!token) {
    throw new Error("A jwt must be present.", {
      error: "No jwt present."
    });
  }
  const url = `${baseUrl}admin/member_details`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const err = res.json();
    console.error("Error fetching member details. ", err);
    let { error } = err;
    if (!error) {
      error = "Could not get member details.";
    }
    throw { error };
  }
  return res.json();
};

export const createNewMember = async (member, password, token) => {
  if (!member.email) {
    throw new Error("No new member email present.", {
      error: "No member email present."
    });
  }
  if (!token) {
    throw { error: "A token is required for this action." };
  }
  const url = new URL(`${baseUrl}admin/add_member`);
  const options = {
    method: "POST",
    body: JSON.stringify({ user: member, password }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let res = await fetch(url.href, options);
  if (!res.ok) {
    const err = await res.json();
    console.error("Unable to add new member.", err);
    let { error } = err;
    if (!error) {
      error = "Failed to add new member.";
    }
    if (res.status === 401) {
      error = "Unauthorized";
    }
    throw { error };
  }
  return res.json();
};

export const validateReservationsEtag = async (etag) => {
  const url = `${baseUrl}reservations/validate/${etag}`;
  try {
    let res = await fetch(url);
    if (res.status === 204) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Unable to validate reservations state, ", error);
    return false;
  }
};

export const getDashboardData = async (token) => {
  const url = new URL(`${baseUrl}admin/dashboard`);
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  try {
    const res = await fetch(url.href, options);
    return res.json();
  } catch (error) {
    console.error("Error getting dashboard. ", error);
    throw { error: "Unable to get dashboard." };
  }
};
