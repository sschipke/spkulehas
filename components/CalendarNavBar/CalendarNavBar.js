import React from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AppBar, Box, Toolbar, IconButton, TextField } from "@mui/material";

import { DatePicker } from "@mui/lab";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import {
  viewNextMonth,
  viewPreviousMonth,
  viewToday,
  updateViewDate
} from "../../actions";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const minDate = process.env.NEXT_PUBLIC_MIN_DATE;
const maxDate = process.env.NEXT_PUBLIC_MAX_DATE;

const CalendarNavBar = ({
  viewNextMonth,
  viewPreviousMonth,
  updateViewDate,
  viewDate
}) => {
  const dayJsViewDate = dayjs(viewDate);
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar color="secondary" position="static">
        <Toolbar style={{ justifyContent: "center" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="previous month"
            onClick={() => viewPreviousMonth()}
            disabled={dayJsViewDate.isSameOrBefore(minDate, "month")}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <DatePicker
            views={["month", "year"]}
            value={dayJsViewDate}
            onChange={(newValue) => {
              if (dayjs(newValue).isValid()) {
                updateViewDate(newValue);
              }
            }}
            showTodayButton
            todayText="Today"
            variant="filled"
            minDate={dayjs(minDate)}
            maxDate={dayjs(maxDate)}
            sx={{
              display: "flex",
              border: "none",
              width: "30%",
              flexDirection: "column",
              backgroundColor: "white",
              color: "white"
            }}
            renderInput={(params) => (
              <TextField
                sx={{
                  svg: { color: "white" },
                  input: { color: "white" },
                  label: { color: "white" }
                }}
                {...params}
              />
            )}
          />
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="next month"
            sx={{ mr: 2 }}
            onClick={() => viewNextMonth()}
            disabled={dayJsViewDate.isSameOrAfter(maxDate, "month")}
          >
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export const mapStateToProps = (state) => ({
  viewDate: state.screen.view_date
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { viewNextMonth, viewPreviousMonth, viewToday, updateViewDate },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CalendarNavBar);
