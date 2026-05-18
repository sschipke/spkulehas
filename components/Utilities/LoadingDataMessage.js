import React from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";

const LoadingDataMessage = ({ message }) => (
  <Stack
    direction="column"
    sx={{
      justifyContent: "center",
      alignItems: "center",
      mt: 5
    }}>
    <Typography
      component="h4"
      variant="h4"
      sx={{ fontSize: "1.5rem", marginBottom: "30px", fontWeight: 400 }}
    >
      Loading {message}...
    </Typography>
    <CircularProgress color="secondary" />
  </Stack>
);

export default LoadingDataMessage;
