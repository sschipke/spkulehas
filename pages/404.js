import dynamic from "next/dynamic";
import Link from "next/link";
const Typography = dynamic(() =>
  import("@mui/material").then((mod) => mod.Typography)
);
const Stack = dynamic(() => import("@mui/material").then((mod) => mod.Stack));

const NotFoundPage = () => (
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
      color="secondary"
    >
      Looks like that page doesn&apos;t exist!
    </Typography>
    <Typography variant="body1" color="info">
      Click <Link href="/">here</Link> to go home.
    </Typography>
  </Stack>
);

export default NotFoundPage;
