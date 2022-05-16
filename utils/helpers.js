import moment from "moment";

export const isInWinter = (date) => {
  return moment(date).isBetween('2022-10-23', '2023-05-20', 'day') || moment(date).isBetween('2023-10-18', '2024-05-20', 'day')
}

export const isInReservation = (date, reservationStart, reservationEnd) => {
  let dateIsInReservation = false;
  if (date.isBetween(reservationStart, reservationEnd, 'day') || date.isSame(reservationStart) || date.isSame(reservationEnd, 'day')) {
    dateIsInReservation = true;
  }
  return dateIsInReservation;
}

export const findNearestReservations = (desiredDate, reservations) => {
    let nearestReservation = reservations[0];
    let nextReservation;
    let comparisonDate = moment(desiredDate);
    for (let index = 0; index < reservations.length; index++) {
      const reservation = reservations[index];
      const reservationStart = moment(reservation.start);
      const reservationEnd = moment(reservation.end);
      const nearestStart = moment(nearestReservation.start);
      const nearestEnd = moment(nearestReservation.end)

      const differenceOfNearestStart = Math.abs(nearestStart.diff(comparisonDate, 'days'));
      const differenceOfCurrentStart = Math.abs(reservationStart.diff(comparisonDate, 'days'));
      const differenceOfNearestEnd = Math.abs(nearestEnd.diff(comparisonDate, 'days'));
      const differenceOfCurrentEnd = Math.abs(reservationEnd.diff(comparisonDate, 'days'));
      if (isInReservation(comparisonDate, reservationStart, reservationEnd)) {
        nearestReservation = reservation;
        nextReservation = determineNextReservation(comparisonDate, nearestReservation, reservations, index);
        return [nearestReservation, nextReservation]
      } else if (differenceOfCurrentStart <= differenceOfNearestStart || differenceOfCurrentEnd <= differenceOfNearestEnd) {
        nearestReservation = reservation;
        nextReservation = determineNextReservation(comparisonDate, nearestReservation, reservations, index);
      }
    }

    if (nextReservation && moment(nearestReservation.start).isAfter(nextReservation.start)) {
      return [nextReservation, nearestReservation]
    }

    return [nearestReservation, nextReservation];
  }

  const determineNextReservation = (comparisonDate, nearestReserveration, reservations, index) => {
      let nextReservation;
      if (isInReservation(comparisonDate, moment(nearestReserveration.start), moment(nearestReserveration.end)) && index <= reservations.length - 2) {
        nextReservation = reservations[index + 1]
      } else if (index + 1 < reservations.length - 1 && comparisonDate.isBetween(nearestReserveration.end, reservations[index + 1].start, 'day')) {
        nextReservation = reservations[index + 1]
      } else if (index - 1 >= 0 && comparisonDate.isBetween(reservations[index - 1].end, nearestReserveration.start, 'day')) {
        nextReservation = reservations[index - 1]
      }
      return nextReservation;
  }

  export const findPreviousReservation = (currentReservation, reservations) => {
    if (!currentReservation) {
      return null
    }
    const currentReservationIndex = reservations.findIndex(res => res.id === currentReservation.id);
    const previousReservationIndex = currentReservationIndex - 1;
    if (previousReservationIndex >= 0) {
      return reservations[previousReservationIndex]
    } else {
      return null;
    }
  }

  export const determineMinDate = (currentReservation, reservations) => {
    const previousReservation = findPreviousReservation(currentReservation, reservations)
    if (previousReservation) {
      return moment(previousReservation.end).add(1, 'day');
    } else {
      return moment('2022-01-01')
    }
  }

  export const determineMinDateForNewReservation = (previousReservation) => {
    if (!previousReservation) {
      return moment()
    } else {
      return moment(previousReservation.end).add(1, 'day');
    }
  }

  export const determineMaxDate = (checkinDate, nextReservation) => {
    const longestDate = isInWinter(checkinDate) ? moment(checkinDate).add(13, 'day') : moment(checkinDate).add(6, 'day');
    const nextReservationStart = moment(nextReservation ? nextReservation.start : null).set({
      hour:12,
      minute:0,
      second:0,
      millisecond:0
    })
    .subtract(1, 'day')
    if (nextReservationStart.isValid() && nextReservationStart.isBefore(longestDate)) {
      return nextReservationStart;
    } else {
      return longestDate;
    }
  }

  export const canEdit = (user, reservation) => {
    if (!user || !reservation) {
      return false;
    }
    return user.status === "ADMIN" || user.id === reservation.user_id;
  }

  export const sortByStartDate = (reservations) => reservations.sort((reservationA, reservationB) => moment(reservationA.start).diff(reservationB.start));

  export const formatReservation = (reservation, checkinDate, checkoutDate) => {
    const start = checkinDate ? moment(checkinDate) : moment(reservation.start);
    const end = checkoutDate ? moment(checkoutDate) : moment(reservation.end);
    reservation.start = start.set({}).set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString();
    reservation.end = end.set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      .toISOString();
    return reservation;
  }

  export const formatPhoneNumber = (digits) => {
    return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`
  }