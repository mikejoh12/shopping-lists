import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackBar } from "../features/uiSlice";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {
  const open = useSelector((state: RootState) => state.ui.isSnackBarOpen);
  const msg = useSelector((state: RootState) => state.ui.snackBarMsg);
  const severity = useSelector((state: RootState) => state.ui.snackBarSeverity);

  const dispatch = useDispatch();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideSnackBar());
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
