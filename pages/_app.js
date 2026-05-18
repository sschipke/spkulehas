import { Provider } from "react-redux";
import Head from "next/head";
import dynamic from "next/dynamic";
import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { AdapterMoment as DateAdapter } from "@mui/x-date-pickers/AdapterMoment";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import { rootReducer } from "../reducers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import createEmotionCache from "../utils/createEmotionCache";
import NavBar from "../components/NavBar/NavBar";

const clientSideEmotionCache = createEmotionCache();

const LoadingModal = dynamic(() => import("../components/Modal/LoadingModal"));
const EditReservationPicker = dynamic(
  () => import("../components/Modal/EditReservationPicker")
);
const NewReservationPicker = dynamic(
  () => import("../components/Modal/NewReservationPicker")
);
const LoginPrompt = dynamic(() => import("../components/Messages/LoginPrompt"));
const LoginModal = dynamic(() => import("../components/Modal/LoginModal"));
const ViewReservationModal = dynamic(
  () => import("../components/Modal/ViewReservationModal")
);
const ConfirmDeleteDialog = dynamic(
  () => import("../components/Messages/ConfirmDeleteDialog")
);
const ConfirmAddMemberDialog = dynamic(
  () => import("../components/Messages/ConfirmAddMemberDialog")
);
const UpdateCredentialsModal = dynamic(
  () => import("../components/Modal/UpdateCredentialsModal")
);
const Toast = dynamic(() => import("../components/Messages/Toast"));
const AddToCalendarModal = dynamic(
  () => import("../components/Modal/AddToCalendarModal")
);

import "../styles/main.scss";

const theme = createTheme({
  palette: {
    primary: {
      main: "#33691e"
    },
    secondary: {
      main: "#880e4f"
    },
    black: {
      main: "#000",
      contrastText: "#fff"
    }
  }
});

const createDevStore = () => {
  console.log("Creating redux store with devtools.");
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk), compose)
  );
};

const store =
  process.env.NODE_ENV === "production"
    ? createStore(rootReducer, applyMiddleware(thunk))
    : createDevStore();

export default function App({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  return (
    <CacheProvider value={emotionCache}>
    <Provider store={store}>
      <Head>
        <title>SpKuLeHaS</title>
        <meta
          name="description"
          content="Used for making reservations for Schipke's SpKuLeHaS members."
        />
      </Head>
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
          <ConfirmAddMemberDialog />
          <UpdateCredentialsModal />
          <AddToCalendarModal />
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
    </CacheProvider>
  );
}
