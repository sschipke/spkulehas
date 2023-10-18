import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { handleDashboardData } from "../../thunks/thunks";

const Table = dynamic(() => import("@mui/material").then((mui) => mui.Table));
const TableBody = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableBody)
);
const TableCell = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableCell)
);
const TableContainer = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableContainer)
);
const TableHead = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableHead)
);
const TableRow = dynamic(() =>
  import("@mui/material").then((mui) => mui.TableRow)
);
const Paper = dynamic(() => import("@mui/material").then((mui) => mui.Paper));
const Typography = dynamic(() =>
  import("@mui/material").then((mui) => mui.Typography)
);
const LoadingDataMessage = dynamic(() =>
  import("../../components/Utilities/LoadingDataMessage")
);

const DashboardPage = ({ user, loginData, token }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
      return;
    }
    if (!loginData || !loginData.length) {
      dispatch(handleDashboardData(token));
    }
  }, [user, loginData]); // eslint-disable-line

  if (!user || !user.isAdmin) {
    return null;
  }

  const loginDataTable = () => {
    return (
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "80vh", overflow: "scroll" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow className="reservation-table-head-row">
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Last Login</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loginData.map((memberLogin) => (
              <TableRow
                key={memberLogin.email}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{memberLogin.name}</TableCell>
                <TableCell>{memberLogin.email}</TableCell>
                <TableCell>{memberLogin.lastLogin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <main className="main-container">
      <Typography variant="h4" component="h4">
        Dashboard:
      </Typography>
      {loginData && loginData.length ? (
        loginDataTable()
      ) : (
        <LoadingDataMessage message="Dashsboard" />
      )}
    </main>
  );
};

export const mapStateToProps = (state) => ({
  user: state.data.user,
  loginData: state.data.login_data,
  token: state.data.token
});

export default connect(mapStateToProps)(DashboardPage);
