import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import React, { useState } from "react";
import CustomSnackbar from "../../Activities/SuccessSnackbar/Snackbar";
import AuthService from "../../services/AuthService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteComponentDialog({
  id,
  deleteDialogOpen,
  setDeleteDialogOpen,
  fetch,
}) {
  const CRMBaseURL = AuthService();
  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const handleDelete = async () => {
    

    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const params = {
      id: id,
      updatedBy: storedUserData ? storedUserData.userName : "",
    };
    try {
      const res = await CRMBaseURL.post("deletecomponentlist", { id });
     
      if (res.data.message === "Data Deleted successfully") {
        setErrorOpen(true);
        setSnackbarMessage("Component list deleted successfully");
        setSnackbarType("success");
        fetch();
      } else {
        setErrorOpen(true);
        setSnackbarMessage("Something went wrong");
        setSnackbarType("error");
        fetch();
      }
    } catch (err) {
      setErrorOpen(true);
      setSnackbarMessage("Error deleting component");
      setSnackbarType("error");
    }
    setDeleteDialogOpen(false);
  };
  return (
    <>
      <Dialog
        open={deleteDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Are you sure you want delete this Component list data?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setDeleteDialogOpen(false);
            }}
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleDelete();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        errorOpen={errorOpen}
        setErrorOpen={setErrorOpen}
        snackbarType={snackbarType}
        snackbarMessage={snackbarMessage}
      />
    </>
  );
}

export default DeleteComponentDialog;
