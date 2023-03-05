import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { MOUNTAIN_TZ } from "./constants";

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const WINTER_SEASON_START_2022 = "2022-10-24";
const WINTER_SEASON_END_2022 = "2023-05-21";
const WINTER_SEASON_START_2023 = "2023-10-22";
const WINTER_SEASON_END_2023 = "2024-05-20";
const WINTER_SEASON_START_2024 = "2024-10-21";
const WINTER_SEASON_END_2024 = "2025-05-18";

const PHONE_REGEX = new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/);

const NOON_HOUR = 12;

const CABIN_ADDRESS = process.env.NEXT_PUBLIC_CABIN_ADDRESS;

const FE_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

export const isInWinter = (date) => {
  return (
    dayjs(date).isBetween(
      WINTER_SEASON_START_2022,
      WINTER_SEASON_END_2022,
      "day"
    ) ||
    dayjs(date).isBetween(
      WINTER_SEASON_START_2023,
      WINTER_SEASON_END_2023,
      "day"
    ) ||
    dayjs(date).isBetween(
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
  let comparisonDate = dayjs(desiredDate);
  for (let index = 0; index < reservations.length; index++) {
    const reservation = reservations[index];
    const reservationStart = dayjs(reservation.start);
    const reservationEnd = dayjs(reservation.end);
    const nearestStart = dayjs(nearestReservation.start);
    const nearestEnd = dayjs(nearestReservation.end);

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
    dayjs(nearestReservation.start).isAfter(nextReservation.start)
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
      dayjs(nearestReserveration.start),
      dayjs(nearestReserveration.end)
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
    return dayjs(previousReservation.end).add(1, "day");
  } else {
    return dayjs("2022-05-20").tz(MOUNTAIN_TZ);
  }
};

export const determineMinDateForNewReservation = (previousReservation) => {
  if (!previousReservation) {
    return dayjs();
  } else {
    return dayjs(previousReservation.end).add(1, "day");
  }
};

export const determineMaxDate = (checkinDate, nextReservation, isAdmin) => {
  const longestDate = isInWinter(checkinDate)
    ? dayjs(checkinDate).add(13, "day")
    : dayjs(checkinDate).add(6, "day");
  const nextReservationStart = dayjs(
    nextReservation ? nextReservation.start : null
  )
    .tz(MOUNTAIN_TZ)
    .set("hour", NOON_HOUR)
    .subtract(1, "day");
  if (nextReservationStart && isAdmin && nextReservationStart.isValid()) {
    return nextReservationStart;
  } else if (nextReservation && isAdmin && !!nextReservation.isValid()) {
    return dayjs(process.env.NEXT_PUBLIC_MAX_DATE);
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
  return user.isAdmin || user.id === reservation.user_id;
};

export const sortByStartDate = (reservations) =>
  reservations.sort((reservationA, reservationB) =>
    dayjs(reservationA.start).diff(reservationB.start)
  );

export const formatReservation = (reservation, checkinDate, checkoutDate) => {
  const start = checkinDate ? dayjs(checkinDate) : dayjs(reservation.start);
  const end = checkoutDate ? dayjs(checkoutDate) : dayjs(reservation.end);
  reservation.start = start
    .tz(MOUNTAIN_TZ)
    .set("hour", NOON_HOUR)
    .toISOString();
  reservation.end = end.tz(MOUNTAIN_TZ).set("hour", NOON_HOUR).toISOString();
  return reservation;
};

export const formatPhoneNumber = (digits) => {
  if (PHONE_REGEX.test(digits)) {
    return digits;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const determineIfAdmin = (member) => {
  return member && member.isAdmin;
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

export const updateMemberDetails = (
  new_state,
  memberDetails,
  updatedMember
) => {
  if (!memberDetails || (memberDetails || []).length === 0) {
    return;
  }
  const updatedMemberDetails = memberDetails.map((user) => {
    if (user.id === updatedMember.id) {
      user = { ...updatedMember };
    }
    return user;
  });
  new_state.member_details = [...updatedMemberDetails];
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
  if (user.isAdmin && !selectedUser) {
    return false;
  }
  return true;
};

export const handleNameChangeReservationTitles = (
  newState,
  updatedReservations,
  user
) => {
  const { reservations } = newState;
  const reservationsWithNewName = reservations.map((reservation) => {
    const correspondingReservation = updatedReservations.find(
      (newReservation) => newReservation.id === reservation.id
    );
    if (correspondingReservation) {
      reservation.title = correspondingReservation.title;
    }
    return reservation;
  });
  newState.reservations = [...reservationsWithNewName];
  if (user && !user.isAdmin) {
    let updatedUserReservations = reservationsWithNewName.filter(
      (res) => res.user_id === user.id
    );
    newState.user_reservations = [...updatedUserReservations];
  } else {
    newState.user_reservations = [...reservationsWithNewName];
  }
};

export const convertToMountainTimeDate = (dateString) =>
  new Date(
    new Date(dateString).toLocaleString("en-US", {
      timeZone: MOUNTAIN_TZ
    })
  );

export const generateCalendarLinks = (reservation) => {
  const feLink = createFeLinkToReservation(reservation);

  const calendarEvent = {
    id: reservation.id,
    start: reservation.start.toISOString().replace(/-|:|\.\d+/g, ""),
    end: reservation.end.toISOString().replace(/-|:|\.\d+/g, ""),
    title: `${reservation.title} at the Cabin`,
    description: `${feLink}
    ${reservation.notes}`,
    location: CABIN_ADDRESS
  };
  const googleCalendarLink = generateGoogleCalendarLink(calendarEvent);
  const outLookLink = generateOutlookCalendarLink(reservation, calendarEvent);
  const appleLink = generateAppleCalendarLink(calendarEvent);

  return { googleCalendarLink, outLookLink, appleLink };

};

export const generateGoogleCalendarLink = (event) => {
  const link = `https://www.google.com/calendar/render?action=TEMPLATE&dates=${event.start}/${event.start}&text=${event.title}&location=${event.location}&details=${event.description}`;

  return new URL(link).href;
};

export const generateOutlookCalendarLink = (reservation, event) => {
  const outlookEvent = {
    start: reservation.start.toISOString(),
    end: reservation.end.toISOString()
  };

  const outlookLink = `https://outlook.office.com/calendar/action/compose?subject=${encodeURIComponent(
    event.title
  )}&body=${encodeURI(event.description)}&location=${encodeURIComponent(
    event.location
  )}&startdt=${encodeURIComponent(
    outlookEvent.start
  )}&enddt=${encodeURIComponent(outlookEvent.end)}`;

  return outlookLink;
};

export const generateAppleCalendarLink = (event) => {
  // TODO: Add notes & url in here
  const icsFileContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
PRODID:${event.id}
DTSTAMP:${event.start}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
LOCATION:${event.location}
NOTES:${event.description}
END:VEVENT
END:VCALENDAR`;

  const dataURI = `data:text/calendar;charset=utf-8,${encodeURIComponent(
    icsFileContent
  )}`;
  return dataURI;
};

export const createFeLinkToReservation = (reservation) =>
  new URL(`${FE_BASE_URL}?reservationId=${reservation.id}`).href;
