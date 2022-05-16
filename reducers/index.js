import { combineReducers } from 'redux';
import data from './data';
import screen from './screen';
export const rootReducer = combineReducers({
  data,
  screen
});

export default rootReducer;