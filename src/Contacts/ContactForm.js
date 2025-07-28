import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Autocomplete,
  Snackbar,
  CircularProgress,
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

function ContactForm({
  openContactsForm,
  setOpenContactsForm,
  fetchContactData,
}) {
  const lifecycleStageOptions = [
    "Marketing Qualified Lead",
    "Sales Qualified Lead",
  ];
  const CRMBaseURL = AuthService();
  const leadStatusOptions = ["New", "Open"];

  const contactLevelType = ["Gold", "Silver", "bronze"];

  const [errorOpen, setErrorOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setErrorOpen(false);
  };

  const GetCompanyName = async () => {
    try {
      const res = await CRMBaseURL.get("getallcompany");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetCompanyName();
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email must be required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must be a valid email address"
      ),
    name: Yup.string().required("Name must be required"),
    phoneNumber: Yup.string()
      .required("Mobile number must be required")
      .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    lifeCycleStage: Yup.string()
      .required("Please select Lifecycle stage")
      .oneOf(lifecycleStageOptions, "Invalid lifecycle stage"),
    leadStatus: Yup.string()
      .required("Please Select Lead status")
      .oneOf(leadStatusOptions, "Invalid lead status"),
    contactLevelType: Yup.string().required(
      "Contact level type must be required"
    ),
    leadSource: Yup.string().required("Lead Source must be required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      jobTitle: "",
      phoneNumber: "",
      lifeCycleStage: "",
      leadStatus: "",
      contactLevelType: "",
      company: 0,
      isCompany: 0,
      leadSource: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true); // Set loading state to true
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      const OwnerId = storedUserData && `${storedUserData.id}`;
      values = {
        ...values,
        createdBy:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
        ownerId: parseInt(OwnerId),
      };

      try {
        const res = await CRMBaseURL.post("addcontact", values);
        if (res.data.Message === "Data Inserted Successfully") {
          setSnackbarType("success");
          setSnackbarMessage(res.data.Message);
          setErrorOpen(true);
          setOpenContactsForm(false);
          fetchContactData();
        } else {
          setSnackbarType("error");
          setSnackbarMessage(res.data.Message);
          setErrorOpen(true);
        }
      } catch (e) {
        console.error(e);
        setSnackbarType("error");
        setSnackbarMessage("An error occurred while submitting the form");
        setErrorOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const renderTextField = (id, label, value) => (
    <Grid item xs={6}>
      <TextField
        fullWidth
        id={id}
        name={id}
        required={value}
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
        maxWidth="md"
        fullWidth
        open={openContactsForm}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            color: "#fff",
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          }}
        >
          {"Contact Registration Form"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container columnSpacing={2}>
              {renderTextField("email", "Email", true)}
              {renderTextField("name", "Name", true)}

              {/* {renderTextField("companyAddress", "Company Address")} */}
              {renderTextField("jobTitle", "Job Title", false)}
              {renderTextField("leadSource", "Lead Source", true)}
              {renderTextField("phoneNumber", "Phone Number", true)}
              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  options={lifecycleStageOptions}
                  value={formik.values.lifeCycleStage}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("lifeCycleStage", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Lifecycle Stage"
                      margin="normal"
                      required
                      error={
                        formik.touched.lifeCycleStage &&
                        Boolean(formik.errors.lifeCycleStage)
                      }
                      helperText={
                        formik.touched.lifeCycleStage &&
                        formik.errors.lifeCycleStage
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  options={leadStatusOptions}
                  value={formik.values.leadStatus}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("leadStatus", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Lead Status"
                      margin="normal"
                      error={
                        formik.touched.leadStatus &&
                        Boolean(formik.errors.leadStatus)
                      }
                      helperText={
                        formik.touched.leadStatus && formik.errors.leadStatus
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  options={contactLevelType}
                  value={formik.values.contactLevelType}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("contactLevelType", newValue);
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Contact Level Type"
                      margin="normal"
                      error={
                        formik.touched.contactLevelType &&
                        Boolean(formik.errors.contactLevelType)
                      }
                      helperText={
                        formik.touched.contactLevelType &&
                        formik.errors.contactLevelType
                      }
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenContactsForm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting} // Disable button during submission
              sx={{
                paddingX: isSubmitting ? "30px" : "20px",
                backgroundImage:
                  !isSubmitting &&
                  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </DialogActions>
        </form>
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

export default ContactForm;
