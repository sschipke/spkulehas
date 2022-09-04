import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";

import { DatePicker } from "@mui/lab";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import {
  viewNextMonth,
  viewPreviousMonth,
  viewToday,
  updateViewDate,
} from "../../actions";

const minDate = process.env.NEXT_PUBLIC_MIN_DATE;
const maxDate = process.env.NEXT_PUBLIC_MAX_DATE;

const CalendarNavBar = ({
  viewNextMonth,
  viewPreviousMonth,
  viewToday,
  updateViewDate,
  viewDate,
}) => {
  const momentViewDate = moment(viewDate, "YYYY-MM-DD");
  return (
    <Box sx={{ flexGrow: 1, width: "100vw" }}>
      <AppBar color="secondary" position="static">
        <Toolbar style={{ justifyContent: "center" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="previous month"
            onClick={viewPreviousMonth}
            disabled={momentViewDate.isSameOrBefore(moment(minDate), "month")}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <DatePicker
            views={["month", "year"]}
            // label="Go to date"
            value={moment(viewDate)}
            onChange={(newValue) => {
              if (moment(newValue).isValid()) {
                updateViewDate(newValue);
              }
            }}
            showTodayButton
            todayText="Today"
            variant="filled"
            minDate={moment(minDate)}
            maxDate={moment(maxDate)}
            sx={{
              display: "flex",
              border: "none",
              width: "30%",
              flexDirection: "column",
              backgroundColor: "white",
              color: "white",
            }}
            renderInput={(params) => (
              <TextField
                sx={{
                  svg: { color: "white" },
                  input: { color: "white" },
                  label: { color: "white" },
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
            onClick={viewNextMonth}
            disabled={momentViewDate.isSameOrAfter(moment(maxDate), "month")}
          >
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export const mapStateToProps = (state) => ({
  viewDate: state.screen.view_date,
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { viewNextMonth, viewPreviousMonth, viewToday, updateViewDate },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CalendarNavBar);
