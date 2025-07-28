import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

function DeleteDialog({ id, openDialog, setOpenDialog, type }) {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();

  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const handleDelete = async () => {
    const values = {
      id: id,
      deletedBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
      isCompany: type === "Company" ? 1 : 0,
    };
    setOpenDialog(false);
    try {
      const res = await CRMBaseURL.post("deletecompany", values);
    } catch (e) {
      console.log(e);
    }
    if (type === "Company") {
      navigate("/dashboard/company_table");
    } else if (type === "CompanyDetails") {
     
    } else {
      navigate("/dashboard/contact_table");
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };
  return (
    <Dialog open={openDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{"Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this {type && type} data ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCancel}>
          No
        </Button>
        <Button variant="contained" onClick={handleDelete}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
