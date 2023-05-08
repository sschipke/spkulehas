export const cacheReservationData = (response) => {
  const { reservationsEtag, reservations } = response;
  cacheReservations(reservations);
  cacheReservationsEtag(reservationsEtag);
};

export const getCachedReservations = () =>
  JSON.parse(localStorage.getItem("reservations"));

export const getCachedReservationsEtag = () =>
  JSON.parse(localStorage.getItem("reservationsEtag"));

export const cacheReservationsEtag = (newEtag) => {
  if (!newEtag) {
    return;
  }
  localStorage.setItem("reservationsEtag", JSON.stringify(newEtag));
};

export const cacheReservations = (reservations) => {
  localStorage.setItem("reservations", JSON.stringify(reservations));
};
