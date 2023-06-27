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
      className="big-calendar-container"
      style={{ flexGrow: 1, width: "100%" }}
      eventPropGetter={(event, start, end, title, isSelected) => ({
        event,
        start,
        end,
        title,
        isSelected,
        style: {
          backgroundColor: event.color ? event.color : "#006064",
          lineHeight: 1.5,
          textAlign: "center"
        }
      })}
      onSelectEvent={handleEventSelect}
      onDrillDown={(date) => {
        handleDrillDown(date);
      }}
      onNavigate={function () {}}
      min={new Date("2022-01-01")}
      max={new Date("2022-06-01")}
      toolbar={false}
    />
  );
};

export default BigCalendar;
