import dynamic from "next/dynamic";
const Typography = dynamic(() =>
  import("@mui/material").then((mod) => mod.Typography)
);
const Stack = dynamic(() => import("@mui/material").then((mod) => mod.Stack));

const ErrorPage = () => (
  <Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    sx={{ mt: 5 }}
  >
    <Typography
      component="h4"
      variant="h4"
      sx={{ fontSize: "2rem", marginBottom: "30px", fontWeight: 400 }}
      color="error"
    >
      Whoops! Something Went Wrong.
    </Typography>
    <Typography variant="body1" color="info">
      Please reload the page and try again. If the problem persists, contact the
      administrator.
    </Typography>
  </Stack>
);

export default ErrorPage;
