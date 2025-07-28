import React from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomSnackbar({ errorOpen, setErrorOpen, snackbarType, snackbarMessage }) {
  const handleClose = () => {
    setErrorOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={errorOpen}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={snackbarType}
        iconMapping={{
          success: <CheckCircleIcon />,
          error: <ErrorIcon />,
        }}
        sx={{ backgroundColor: snackbarType === "error" ? "red" : "green" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;
