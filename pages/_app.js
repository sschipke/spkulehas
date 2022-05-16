import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import DateAdapter from '@mui/lab/AdapterMoment';
import { LocalizationProvider } from '@mui/lab';
import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {rootReducer} from '../reducers';
import NavBar from '../components/NavBar/NavBar';
import EditReservationPicker from "../components/Modal/EditReservationPicker";
import NewReservationPicker from "../components/Modal/NewReservationPicker";
import Toast from "../components/Messages/Toast";
import LoginPrompt from "../components/Messages/LoginPrompt";
import LoginModal from "../components/Modal/LoginModal";
import ViewReservationModal from "../components/Modal/ViewReservationModal";
import LoadingModal from "../components/Modal/LoadingModal";
import ConfirmDeleteDialog from '../components/Messages/ConfirmDeleteDialog';
import UpdateCredentialsModal from '../components/Modal/UpdateCredentialsModal';
import '../styles/main.scss';

const theme = createTheme({
  palette: {
    primary: {
      main: '#33691e',
    },
    secondary: {
      main: '#880e4f',
    },
  }
})

const devStore = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default function App({ Component, pageProps }) {
  const store = process.env.NODE_ENV === 'production' ? createStore(rootReducer, applyMiddleware(thunk)) : devStore;

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          <Component {...pageProps} />
          <EditReservationPicker />
          <NewReservationPicker />
          <Toast />
          <LoginPrompt />
          <LoginModal />
          <ViewReservationModal />
          <LoadingModal />
          <ConfirmDeleteDialog />
          <UpdateCredentialsModal />
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  )
}