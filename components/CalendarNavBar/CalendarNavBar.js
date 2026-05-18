import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AppBar, Box, Toolbar, IconButton, Typography } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";

import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

import {
  viewNextMonth,
  viewPreviousMonth,
  viewToday,
  updateViewDate
} from "../../actions";

const minDate = process.env.NEXT_PUBLIC_MIN_DATE;
const maxDate = process.env.NEXT_PUBLIC_MAX_DATE;

const CalendarNavBar = ({
  viewNextMonth,
  viewPreviousMonth,
  updateViewDate,
  viewDate
}) => {
  const momentViewDate = moment(viewDate, "YYYY-MM-DD");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar color="secondary" position="static">
        <Toolbar style={{ justifyContent: "center", overflow: "hidden" }}>
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
          {mounted ? (
            <DatePicker
              views={["month", "year"]}
              value={moment(viewDate)}
              onChange={(newValue) => {
                if (moment(newValue).isValid()) {
                  updateViewDate(newValue);
                }
              }}
              minDate={moment(minDate)}
              maxDate={moment(maxDate)}
              sx={{
                "& .MuiPickersOutlinedInput-root": {
                  backgroundColor: "transparent !important",
                  "& .MuiPickersOutlinedInput-notchedOutline": { border: "none !important" },
                  "&:hover .MuiPickersOutlinedInput-notchedOutline": { border: "none !important" },
                  "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": { border: "none !important" }
                },
                "& .MuiPickersSectionList-sectionContent": { color: "white !important" },
                "& .MuiPickersSectionList-sectionSeparator": { color: "white !important" },
                "& .MuiPickersSectionList-sectionBefore, & .MuiPickersSectionList-sectionAfter": {
                  color: "white !important"
                }
              }}
              slotProps={{
                openPickerButton: { sx: { color: "white" } },
                textField: { size: "small" },
                actionBar: { actions: ["today", "cancel", "accept"] }
              }}
            />
          ) : (
            <Typography sx={{ color: "white", fontSize: "1rem", fontWeight: 500, mx: 2 }}>
              {momentViewDate.format("MMMM YYYY")}
            </Typography>
          )}
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
  viewDate: state.screen.view_date
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { viewNextMonth, viewPreviousMonth, viewToday, updateViewDate },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CalendarNavBar);
