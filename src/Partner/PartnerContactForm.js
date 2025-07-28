import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Snackbar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../services/AuthService";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PartnerContactForm({
  openContactsForm,
  setOpenContactsForm,
  fetchContactData,
  PartnerID,
}) {
  const CRMBaseURL = AuthService();
  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [partnerOptions, setPartnerOptions] = useState([]);

  const handleClose = () => {
    setErrorOpen(false);
  };

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await CRMBaseURL.get("getpartnerlist");
        const data = response.data.partners;
        setPartnerOptions(data);
      } catch (err) {
        console.error("Error fetching partner data:", err);
      }
    };
    fetchPartner();
  }, []);

  const validationSchema = Yup.object({
    // partner: Yup.string().required("Partner Name is required"),
    contactPersonName: Yup.string().required("Contact Person Name is required"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: Yup.string()
      .required("Email is required")
      .email("Enter a valid email address"),
  });

  // Formik form handler
  const formik = useFormik({
    initialValues: {
      // partner: "",
      partnerId: PartnerID,
      contactName: "",
      mobile: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      values = {
        ...values,
        createdBy: storedUserData
          ? `${storedUserData.userName}`
          : "Unknown User",
      };
      try {
        const res = await CRMBaseURL.post("addcontactperson", values);
        if (res.data.message === "Contact added successfully") {
          setSnackbarType("success");
          setSnackbarMessage(res.data.message);
          setErrorOpen(true);
          setOpenContactsForm(false);
          fetchContactData();
        } else {
          setSnackbarType("error");
          setSnackbarMessage(res.data.message);
          setErrorOpen(true);
        }
      } catch (e) {
        console.error("Error during form submission:", e);
      }
    },
  });

  // Render text fields for form
  const renderTextField = (id, label) => (
    <Grid item xs={12}>
      <TextField
        required
        fullWidth
        id={id}
        name={id}
        label={label}
        value={formik.values[id]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[id] && Boolean(formik.errors[id])}
        helperText={formik.touched[id] && formik.errors[id]}
        margin="normal"
      />
    </Grid>
  );

  return (
    <>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={openContactsForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Contact Registration Form</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Autocomplete for selecting a partner */}
              {/* <Grid item xs={12}>
                  <Autocomplete
                    options={partnerOptions||[]}
                    getOptionLabel={(option) => option.partner || ""}
                    onChange={(event, value) => {
                      formik.setFieldValue("partner", value?.partner || "");
                      formik.setFieldValue("partnerId", value?.id || ""); // Store the ID
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Partner Name"
                        variant="outlined"
                        error={formik.touched.partner && Boolean(formik.errors.partner)}
                        helperText={formik.touched.partner && formik.errors.partner}
                        margin="normal"
                        fullWidth
                      />
                    )}
                  />
                </Grid> */}

              {/* Contact Person Name field */}
              {renderTextField("contactPersonName", "Contact Person Name")}

              {/* Mobile field */}
              {renderTextField("mobile", "Mobile Number")}

              {/* Email field */}
              {renderTextField("email", "Email")}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setOpenContactsForm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for feedback */}
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
          sx={{
            backgroundColor: snackbarType === "error" ? "red" : "green",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PartnerContactForm;
