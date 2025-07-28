import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import AuthService from "../../services/AuthService";

function RestoreUser({
  restoreID,
  restoreDialogOpen,
  setRestoreDialogOpen,
  setDataUpadateMsg,
  setSnackbarMessage,
  setSnackbarType,
  fetch,
}) {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const handleDelete = async () => {
    const values = {
      id: restoreID,
      editedBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    try {
      const response = await CRMBaseURL.post("restoreuser", values);
      
      if (response.status === 200) {
        setDataUpadateMsg(true);
        setSnackbarMessage(response && response.data?.message);
        setSnackbarType("success");
        setRestoreDialogOpen(false);
      } else {
        setDataUpadateMsg(true);
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarType("error");
        setRestoreDialogOpen(false);
      }

      fetch();
    } catch (e) {
      console.error("Error deleting component:", e);
      setSnackbarMessage("Something went wrong. Please try again.");
      setSnackbarType("error");
    }
  };

  const handleCancel = () => {
    setRestoreDialogOpen(false);
  };
  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={restoreDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to Restore the user ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              handleCancel();
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            sx={{
                backgroundImage: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              }}
            onClick={() => {
              handleDelete();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default RestoreUser;
