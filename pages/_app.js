import { Provider } from "react-redux";
import Head from "next/head";
import dynamic from "next/dynamic";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import DateAdapter from "@mui/lab/AdapterMoment";
import { createTheme } from "@mui/material";
import { rootReducer } from "../reducers";

const LocalizationProvider = dynamic(() =>
  import("@mui/lab/LocalizationProvider")
);
const ThemeProvider = dynamic(() =>
  import("@mui/material").then((mui) => mui.ThemeProvider)
);
const CssBaseline = dynamic(() => import("@mui/material/CssBaseline"));
const NavBar = dynamic(() => import("../components/NavBar/NavBar"));
const LoadingModal = dynamic(() => import("../components/Modal/LoadingModal"));
const EditReservationPicker = dynamic(() =>
  import("../components/Modal/EditReservationPicker")
);
const NewReservationPicker = dynamic(() =>
  import("../components/Modal/NewReservationPicker")
);
const LoginPrompt = dynamic(() => import("../components/Messages/LoginPrompt"));
const LoginModal = dynamic(() => import("../components/Modal/LoginModal"));
const ViewReservationModal = dynamic(() =>
  import("../components/Modal/ViewReservationModal")
);
const ConfirmDeleteDialog = dynamic(() =>
  import("../components/Messages/ConfirmDeleteDialog")
);
const UpdateCredentialsModal = dynamic(() =>
  import("../components/Modal/UpdateCredentialsModal")
);
const Toast = dynamic(() => import("../components/Messages/Toast"));

import "../styles/main.scss";

const theme = createTheme({
  palette: {
    primary: {
      main: "#33691e",
    },
    secondary: {
      main: "#880e4f",
    },
  },
});

const devStore = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const store =
  process.env.NODE_ENV === "production"
    ? createStore(rootReducer, applyMiddleware(thunk))
    : devStore;

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>SpKuLeHaS</title>
        <meta
          name="description"
          content="Used for making reservations for Schipke's SpKuLeHaS members."
        />
        <html lang="en"></html>
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
          <UpdateCredentialsModal />
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  );
}
