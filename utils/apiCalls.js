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
      "Content-Type": "application/json",
    },
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

export const putReservation = async (reservation, token) => {
  const url = `${baseUrl}reservations/${reservation.id}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ reservation }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 404:
      case 422:
        throw error;
      default:
        console.error("Error updating reservation");
        throw new Error("Failed to update reservation.");
    }
  }
  return res.json();
};

export const postReservation = async (reservation, token) => {
  const url = `${baseUrl}reservations/new`;
  const options = {
    method: "POST",
    body: JSON.stringify({ reservation }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 403:
      case 404:
      case 422:
        throw error;
      default:
        console.error("Error adding reservation");
        throw { error: "Something went wrong." };
    }
  }
  return res.json();
};

export const deleteReservation = async (reservation, token) => {
  const url = `${baseUrl}reservations/${reservation.id}`;
  const options = {
    method: "DELETE",
    body: JSON.stringify({ reservation }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    switch (res.status) {
      case 401:
      case 404:
      case 403:
      case 422:
        console.error("Error deleting reservation: ", error);
        throw error;
      default:
        console.error("Error deleting reservation");
        throw new Error("Could not delete email.", {
          error: "Something went wrong.",
        });
    }
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
      Authorization: `Bearer ${token}`,
    },
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
      Authorization: `Bearer ${token}`,
    },
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
      Authorization: `Bearer ${token}`,
    },
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
      "Content-Type": "application/json",
    },
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
      Authorization: `Bearer ${token}`,
    },
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
      Authorization: `Bearer ${token}`,
    },
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
      Authorization: `Bearer ${token}`,
    },
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
      error: "No member id present.",
    });
  }
  const url = `${baseUrl}user/${member.id}`;
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  let res = await fetch(url, options);
  if (!res.ok) {
    const err = res.json();
    console.error("Unable to get member profile. ", err);
    const { error } = err;
    if (!error) {
      error = "Could not fetch member profile.";
    }
    throw { error };
  }
  return res.json();
};
