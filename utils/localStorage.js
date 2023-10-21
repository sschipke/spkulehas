export const cacheReservationData = (response) => {
  const { reservationsEtag, reservations } = response;
  cacheReservations(reservations);
  cacheReservationsEtag(reservationsEtag);
};

export const getCachedReservations = () => {
  const cachedReservationData = localStorage.getItem("reservations");
  if (cachedReservationData) {
    return JSON.parse(cachedReservationData);
  }
  return "";
};

export const getCachedReservationsEtag = () => {
  const cachedEtag = localStorage.getItem("reservationsEtag");

  return cachedEtag ? JSON.parse(cachedEtag) : "";
};

export const cacheReservationsEtag = (newEtag) => {
  if (!newEtag) {
    return;
  }
  localStorage.setItem("reservationsEtag", JSON.stringify(newEtag));
};

export const cacheReservations = (reservations) => {
  if (!reservations || !reservations.length) {
    return;
  }
  localStorage.setItem("reservations", JSON.stringify(reservations));
};
