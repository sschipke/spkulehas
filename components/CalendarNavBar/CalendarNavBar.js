import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppBar, Box, Toolbar, Button, IconButton, TextField } from '@mui/material'

import { DatePicker } from '@mui/lab';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';

import { viewNextMonth, viewPreviousMonth, viewToday, updateViewDate } from '../../actions';


const CalendarNavBar = ({ viewNextMonth, viewPreviousMonth, viewToday, updateViewDate, viewDate }) => {
  const todaysDate = new Date();
  const momentViewDate = moment(viewDate);
  const calendarHeader = `${momentViewDate.format('MMMM YYYY')}`
  return (
    <Box sx={{ flexGrow: 1, width: '100vw' }}>
      <AppBar color="secondary" position="static">
        <Toolbar style={{justifyContent: 'center'}}>
          {/* <div className="calendar-nav-navigations" style={{width: '20%'}} > */}
              {/* <Button 
                color="secondary"
                variant="outlined"
                sx={{ display: {lg:'inline-block', md: 'inline-block', sm: 'none', xs: 'none'}, background: 'white' }}
                // style={{display: 'inline-block', background: 'white'}}
                onClick={viewToday}
                disabled={momentViewDate.isSame(todaysDate, 'month')}
              >
                Today
              </Button> */}
            
          {/* </div> */}
          {/* <h3 className='calendar-nav-header'>{calendarHeader}</h3> */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="previous month"
            onClick={viewPreviousMonth}
            disabled={moment(viewDate).subtract(1, 'month').isSameOrBefore('2022-02-01', 'month')}
            >
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
            <DatePicker
              views={['month', 'year']}
              // label="Go to date"
              value={moment(viewDate)}
              onChange={(newValue) => {
              if (moment(newValue).isValid()) {
                updateViewDate(newValue);
                }
              }}
              showTodayButton
              // showClearButton
              todayText='Today'
              variant="filled"
              minDate={moment('2022-01-01')}
              maxDate={moment('2024-05-15')}
              sx={{display: "flex", border: 'none', width: '30%', flexDirection: "column", backgroundColor: "white", color: "white"}}
              renderInput={(params) => <TextField sx={{
                  svg: { color: 'white' },
                  input: { color: 'white' },
                  label: { color: 'white' }
                }} {...params}
              />}
          />
          <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="next month"
              sx={{ mr: 2}}
              onClick={viewNextMonth}
              disabled={moment(viewDate).add(1, 'month').isSameOrAfter('2024-06-01', 'month')}
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export const mapStateToProps = (state) => ({
  viewDate: state.screen.view_date
});

export const mapDispatchToProps = (dispatch) =>
  bindActionCreators({  viewNextMonth, viewPreviousMonth, viewToday, updateViewDate }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CalendarNavBar);

