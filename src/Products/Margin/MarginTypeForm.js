import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MarginTypeForm({
  addMarginTypeDialogOpen,
  setAddMarginTypeDialogOpen,
  fetchMarginType,
  marginData,
}) {
  const CRMBaseURL = AuthService();

  // Initial state for formData
  const [formData, setFormData] = useState({
    marginType: "",
    marginID: "",
    tier: "",
    tierPercentage: "",
  });
  const [marginListType, setMarginListType] = useState([]);
  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  useEffect(() => {
    if (marginData) {
      setFormData({
        marginType: marginData.MarginName,
        marginID: marginData.id,
        tier: marginData.tier,
        tierPercentage: marginData.tierPercentage,
      });
    } else {
      setFormData({
        marginType: "",
        marginID: "",
        tier: "",
        tierPercentage: "",
      });
    }
  }, [marginData]);

  const handleClose = () => {
    setErrorOpen(false);
  };

  const fetchMarginTypeList = async () => {
    try {
      const res = await CRMBaseURL.get("getmargin");
      setMarginListType(res.data?.data);
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

  useEffect(() => {
    fetchMarginTypeList();
  }, []);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "tierPercentage") {
      if (
        value === "" ||
        (/^\d{1,3}$/.test(value) && value >= 0 && value <= 100)
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

  const handleAutocompleteChange = (event, newValue) => {
    const matchedMargin = marginListType.find(
      (data) => data.marginType === newValue
    );

    const id = matchedMargin ? matchedMargin.id : null;
    setFormData((prevState) => ({
      ...prevState,
      marginType: newValue || "",
      marginID: id || null,
    }));
  };

  const handleSubmit = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));

      const parsedFormData = {
        ...formData,
        tierPercentage: parseInt(formData.tierPercentage, 10), // Ensure base 10 parsing
      };

      const values = {
        ...parsedFormData,
        createdBy: storedUserData
          ? `${storedUserData.userName} (${storedUserData.email})`
          : "",
      };

      let res;
      if (marginData) {
        res = await CRMBaseURL.post("updatemarginvalues", {
          ...values,
          id: marginData.id,
        });
      } else {
        res = await CRMBaseURL.post("addmarginvalues", values);
      }

      if (
        res.data.message === "Data inserted Successfully" ||
        res.data.message === "Data updated successfully."
      ) {
        setSnackbarType("success");
        setSnackbarMessage(res.data.message);
        setErrorOpen(true);
        setAddMarginTypeDialogOpen(false);
        fetchMarginType();
        setFormData({ marginType: "", tier: "", tierPercentage: "" });
      } else {
        setSnackbarType("error");
        setSnackbarMessage(res.data.message);
        setErrorOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setSnackbarType("error");
      setSnackbarMessage("An error occurred while submitting the form.");
      setErrorOpen(true);
    }
  };

  const handleCancel = () => {
    setAddMarginTypeDialogOpen(false);
    setFormData({ marginType: "", tier: "", tierPercentage: "" });
  };

  return (
    <Dialog open={addMarginTypeDialogOpen} onClose={setAddMarginTypeDialogOpen}>
      <Dialog
        open={addMarginTypeDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {marginData ? "Edit Margin" : "Add Margin"}
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            id="marginType"
            options={
              marginListType
                ? marginListType.map((data) => data.marginType)
                : []
            }
            value={formData.marginType}
            onChange={handleAutocompleteChange}
            fullWidth
            sx={{ my: 2 }}
            renderInput={(params) => (
              <TextField required {...params} label="Margin Type" variant="outlined" />
            )}
          />
          <TextField
            id="tier"
            label="Tier"
            required
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
            value={formData.tier}
            onChange={handleInputChange}
          />
          <TextField
            id="tierPercentage"
            required
            label="Tier Percentage"
            variant="outlined"
            fullWidth
            sx={{ my: 2 }}
            value={formData.tierPercentage}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={
              !formData.marginType || !formData.tier || !formData.tierPercentage
            }
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
    </Dialog>
  );
}

export default MarginTypeForm;
