import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MarginForm({ open, onClose, fetchMargin, marginData }) {
  const CRMBaseURL = AuthService();
  const [formData, setFormData] = useState({
    marginType: "",
    bpPercentage: "",
  });
  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  useEffect(() => {
    if (marginData) {
      setFormData({
        marginType: marginData.marginType,
        bpPercentage: marginData.bpPercentage,
      });
    } else {
      setFormData({
        marginType: "",
        bpPercentage: "",
      });
    }
  }, [marginData]);

  const handleClose = () => {
    setErrorOpen(false);
    onClose();
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "bpPercentage") {
      if (
        value === "" ||
        (/^\d{1,3}$/.test(value) && value >= 1 && value <= 100)
      ) {
        setFormData((prevState) => ({
          ...prevState,
          [id]: value,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));

      const parsedFormData = {
        ...formData,
        bpPercentage: parseInt(formData.bpPercentage), // Ensure base 10 parsing
      };

      const values = {
        ...parsedFormData,
        createdBy: storedUserData
          ? `${storedUserData.userName} (${storedUserData.email})`
          : "",
      };

      let res;
      if (marginData) {
        res = await CRMBaseURL.post("updatemargin", {
          ...values,
          id: marginData.id,
        });
      } else {
        res = await CRMBaseURL.post("addmargin", values);
      }

      if (
        res.data.message === "Data inserted Successfully" ||
        res.data.message === "Data updated successfully"
      ) {
        setSnackbarType("success");
        setSnackbarMessage(res.data.message);
        setErrorOpen(true);
        onClose();
        fetchMargin();
        setFormData({
          marginType:"",bpPercentage:""
        })
      } else {
        setSnackbarType("error");
        setSnackbarMessage(res.data.message);
        setErrorOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const handleCancel = () => {
    onClose();
    setFormData({
      marginType: "",
      bpPercentage: "",
    });
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {marginData ? "Edit Margin" : "Add Margin"}
        </DialogTitle>
        <DialogContent>
          <TextField
          required
            id="marginType"
            label="Margin Type"
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
            value={formData.marginType}
            onChange={handleInputChange}
          />
          <TextField
            id="bpPercentage"
            label="Base Price Percentage"
            variant="outlined"
            fullWidth
            required
            type="number"
            sx={{ my: 2 }}
            value={formData.bpPercentage}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={!formData.marginType || !formData.bpPercentage}
            variant="contained"
            onClick={handleSubmit}
          >
            {marginData ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}

export default MarginForm;
