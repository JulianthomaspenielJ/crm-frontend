import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "../services/AuthService";

function AddContact({ contactOpen, setContactOpen, companyID, fetchCompanyData }) {
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    designation: "",
  });
 const CRMBaseURL = AuthService();
  // State for form errors
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    designation: "",
  });
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validate = () => {
    let errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    // Email validation (simple regex for demonstration)
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is not valid";
    }

    // phoneNumber number validation (must be digits and required)
    if (!formData.phoneNumber) {
      errors.phoneNumber = "mobile number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "mobile number must be 10 digits";
    }

    // Designation validation
    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
    }

    setFormErrors(errors);

    // Return true if no errors
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const ComID =  companyID.toString();
      const values ={
        ...formData,
        companyID: ComID,
        createdBy: `${storedUserData.userName}`,
      }
    
    
      try{
        const res = await CRMBaseURL.post("insertcompanycontact", values);
        fetchCompanyData()
      }catch(e){
        console.log(e)
      }
      setContactOpen(false);
    }
  };

  return (
    <Dialog open={contactOpen} onClose={() => setContactOpen(false)}>
      <DialogTitle
        sx={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#fff" }}>
          Add Contact
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => {
            setContactOpen(false);
          }}
          aria-label="close"
          sx={{ color: "#FFF" }}
        >
          <CloseIcon sx={{ color: "#FFF" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            required
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />

          <TextField
            label="Email"
            required
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />

          <TextField
            label="Mobile Number"
            name="phoneNumber"
            required
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!formErrors.phoneNumber}
            helperText={formErrors.phoneNumber}
          />

          <TextField
            label="Designation"
            required
            name="designation"
            fullWidth
            margin="normal"
            value={formData.designation}
            onChange={handleChange}
            error={!!formErrors.designation}
            helperText={formErrors.designation}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            color: "#FFF",
            mr: 2,
            mb: 2,
          }}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddContact;
