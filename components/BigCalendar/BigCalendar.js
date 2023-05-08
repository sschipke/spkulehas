import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { dayjsLocalizer } from "react-big-calendar";
import updateLocale from "dayjs/plugin/updateLocale";

const Calendar = dynamic(() =>
  import("react-big-calendar").then((mod) => mod.Calendar)
);

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1
});

const localizer = dayjsLocalizer(dayjs);
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
