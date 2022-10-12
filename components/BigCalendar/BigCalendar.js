import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dynamic from "next/dynamic";
import moment from "moment";
import { momentLocalizer } from "react-big-calendar";
const Calendar = dynamic(() =>
  import("react-big-calendar").then((mod) => mod.Calendar)
);

moment.updateLocale("en-US", {
  week: {
    dow: 1,
    doy: 1
  }
});

const localizer = momentLocalizer(moment);
const BigCalendar = ({
  viewDate,
  reservations,
  handleEventSelect,
  handleDrillDown
}) => {
  return (
    <Calendar
      localizer={localizer}
      date={viewDate}
      views={["month"]}
      events={reservations}
      style={{ height: "85vh", width: "100vw" }}
      eventPropGetter={(event, start, end, title, isSelected) => ({
        event,
        start,
        end,
        title,
        isSelected,
        style: { backgroundColor: event.color ? event.color : "#006064" }
      })}
      onSelectEvent={handleEventSelect}
      onDrillDown={(date) => {
        handleDrillDown(date);
      }}
      onNavigate={function () {}}
      min={moment("2022-01-01").toDate()}
      max={moment("2022-06-01").toDate()}
      toolbar={false}
    />
  );
};

export default BigCalendar;
