import moment from "moment";

const WINTER_SEASON_START_2022 = "2022-10-24";
const WINTER_SEASON_END_2022 = "2023-05-21";
const WINTER_SEASON_START_2023 = "2023-10-23";
const WINTER_SEASON_END_2023 = "2024-05-20";
const WINTER_SEASON_START_2024 = "2024-10-21";
const WINTER_SEASON_END_2024 = "2025-05-18";

const NOON_HOUR = {
  hour: 12,
  minute: 0,
  second: 0,
  millisecond: 0
};

export const isInWinter = (date) => {
  return (
    moment(date).isBetween(
      WINTER_SEASON_START_2022,
      WINTER_SEASON_END_2022,
      "day"
    ) ||
    moment(date).isBetween(
      WINTER_SEASON_START_2023,
      WINTER_SEASON_END_2023,
      "day"
    ) ||
    moment(date).isBetween(
      WINTER_SEASON_START_2024,
      WINTER_SEASON_END_2024,
      "day"
    )
  );
};

export const isInReservation = (date, reservationStart, reservationEnd) => {
  let dateIsInReservation = false;
  if (
    date.isBetween(reservationStart, reservationEnd, "day") ||
    date.isSame(reservationStart) ||
    date.isSame(reservationEnd, "day")
  ) {
    dateIsInReservation = true;
  }
  return dateIsInReservation;
};

export const findNearestReservations = (desiredDate, reservations) => {
  let nearestReservation = reservations[0];
  let nextReservation;
  let comparisonDate = moment(desiredDate);
  for (let index = 0; index < reservations.length; index++) {
    const reservation = reservations[index];
    const reservationStart = moment(reservation.start);
    const reservationEnd = moment(reservation.end);
    const nearestStart = moment(nearestReservation.start);
    const nearestEnd = moment(nearestReservation.end);

    const differenceOfNearestStart = Math.abs(
      nearestStart.diff(comparisonDate, "days")
    );
    const differenceOfCurrentStart = Math.abs(
      reservationStart.diff(comparisonDate, "days")
    );
    const differenceOfNearestEnd = Math.abs(
      nearestEnd.diff(comparisonDate, "days")
    );
    const differenceOfCurrentEnd = Math.abs(
      reservationEnd.diff(comparisonDate, "days")
    );
    if (isInReservation(comparisonDate, reservationStart, reservationEnd)) {
      nearestReservation = reservation;
      nextReservation = determineNextReservation(
        comparisonDate,
        nearestReservation,
        reservations,
        index
      );
      return [nearestReservation, nextReservation];
    } else if (
      differenceOfCurrentStart <= differenceOfNearestStart ||
      differenceOfCurrentEnd <= differenceOfNearestEnd
    ) {
      nearestReservation = reservation;
      nextReservation = determineNextReservation(
        comparisonDate,
        nearestReservation,
        reservations,
        index
      );
    }
  }

  if (
    nextReservation &&
    moment(nearestReservation.start).isAfter(nextReservation.start)
  ) {
    return [nextReservation, nearestReservation];
  }

  return [nearestReservation, nextReservation];
};

const determineNextReservation = (
  comparisonDate,
  nearestReserveration,
  reservations,
  index
) => {
  let nextReservation;
  if (
    isInReservation(
      comparisonDate,
      moment(nearestReserveration.start),
      moment(nearestReserveration.end)
    ) &&
    index <= reservations.length - 2
  ) {
    nextReservation = reservations[index + 1];
  } else if (
    index + 1 < reservations.length - 1 &&
    comparisonDate.isBetween(
      nearestReserveration.end,
      reservations[index + 1].start,
      "day"
    )
  ) {
    nextReservation = reservations[index + 1];
  } else if (
    index - 1 >= 0 &&
    comparisonDate.isBetween(
      reservations[index - 1].end,
      nearestReserveration.start,
      "day"
    )
  ) {
    nextReservation = reservations[index - 1];
  }
  return nextReservation;
};

export const findPreviousReservation = (currentReservation, reservations) => {
  if (!currentReservation) {
    return null;
  }
  const currentReservationIndex = reservations.findIndex(
    (res) => res.id === currentReservation.id
  );
  const previousReservationIndex = currentReservationIndex - 1;
  if (previousReservationIndex >= 0) {
    return reservations[previousReservationIndex];
  } else {
    return null;
  }
};

export const determineMinDate = (currentReservation, reservations) => {
  const previousReservation = findPreviousReservation(
    currentReservation,
    reservations
  );
  if (previousReservation) {
    return moment(previousReservation.end).add(1, "day");
  } else {
    return moment("2022-05-20");
  }
};

export const determineMinDateForNewReservation = (previousReservation) => {
  if (!previousReservation) {
    return moment();
  } else {
    return moment(previousReservation.end).add(1, "day");
  }
};

export const determineMaxDate = (checkinDate, nextReservation, isAdmin) => {
  const longestDate = isInWinter(checkinDate)
    ? moment(checkinDate).add(13, "day")
    : moment(checkinDate).add(6, "day");
  const nextReservationStart = moment(
    nextReservation ? nextReservation.start : null
  )
    .set(NOON_HOUR)
    .subtract(1, "day");
  if (nextReservationStart && isAdmin && nextReservationStart.isValid()) {
    return nextReservationStart;
  } else if (nextReservation && isAdmin && !!nextReservation.isValid()) {
    return moment(process.env.NEXT_PUBLIC_MAX_DATE);
  }
  if (
    nextReservationStart.isValid() &&
    nextReservationStart.isBefore(longestDate)
  ) {
    return nextReservationStart;
  } else {
    return longestDate;
  }
};

export const canEdit = (user, reservation) => {
  if (!user || !reservation) {
    return false;
  }
  return user.status === "ADMIN" || user.id === reservation.user_id;
};

export const sortByStartDate = (reservations) =>
  reservations.sort((reservationA, reservationB) =>
    moment(reservationA.start).diff(reservationB.start)
  );

export const formatReservation = (reservation, checkinDate, checkoutDate) => {
  const start = checkinDate ? moment(checkinDate) : moment(reservation.start);
  const end = checkoutDate ? moment(checkoutDate) : moment(reservation.end);
  reservation.start = start.set(NOON_HOUR).toISOString();
  reservation.end = end.set(NOON_HOUR).toISOString();
  return reservation;
};

export const formatPhoneNumber = (digits) => {
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const determineIfAdmin = (member) => {
  return member && member.status === "ADMIN";
};

export const mapEmailSettings = (emailSettings) => {
  if (!emailSettings) {
    emailSettings = {
      setting_name: "reservation_deleted",
      value: false
    };
  }
  return emailSettings;
};

export const updateUsersInfo = (new_state, usersInfo, updatedUser) => {
  const updatedUsersInfo = usersInfo.map((user) => {
    if (user.id === updatedUser.id) {
      user.name = updatedUser.name;
      user.email = updatedUser.email;
    }
    return user;
  });
  new_state.usersInfo = [...sortByName(updatedUsersInfo)];
};

const sortByName = (usersInfo) => {
  return usersInfo.sort((userA, userB) => {
    if (userA.name < userB.name) {
      return -1;
    }
    if (userA.name > userB.name) {
      return 1;
    }
    return 0;
  });
};

export const canSubmitReservation = (
  user,
  selectedUser,
  checkinDate,
  checkoutDate
) => {
  if (!user || !checkinDate || !checkoutDate) {
    return false;
  }
  if (user.status === "ADMIN" && !selectedUser) {
    return false;
  }
  return true;
};
