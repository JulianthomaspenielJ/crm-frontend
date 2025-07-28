import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function DeleteComponentDialog({ open, onClose, onConfirm, componentType }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{"Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this {componentType && componentType}{" "}
          data ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          No
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteComponentDialog;
