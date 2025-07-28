import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Snackbar,
  Slide,
  Box,
  Typography,
  Tooltip,
  IconButton,
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../services/AuthService";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} timeout={500} {...props} />;
});

function PartnerForm({
  openContactsForm,
  setOpenContactsForm,
  fetchContactData,
}) {
  const CRMBaseURL = AuthService();
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [contacts, setContacts] = useState([]);
  const [salesPerson, setSalesPerson] = useState([]);

  const handleClose = () => {
    setErrorOpen(false);
  };

  const todayDate = new Date();
  const formattedToday = `${String(todayDate.getDate()).padStart(
    2,
    "0"
  )}/${String(todayDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${todayDate.getFullYear()}`;
  const nextYearDate = new Date(todayDate);
  nextYearDate.setFullYear(todayDate.getFullYear() + 1);
  const formattedNextYear = `${String(nextYearDate.getDate()).padStart(
    2,
    "0"
  )}/${String(nextYearDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${nextYearDate.getFullYear()}`;

  const validationSchema = Yup.object({
    partner: Yup.string().required("Partner Name must be required"),
    address: Yup.string().required("Address must be required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Contact Email must be required"),
    phoneNumber: Yup.string()
      .required("Phone number must be required")
      .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    authCode: Yup.string().required("Authorization code must be required"),
    areaCovered: Yup.string().required("Area Covered must be required"),
    respectiveSalesPerson: Yup.string().required(
      "Respective sales person name must be required"
    ),
    registeredDate: Yup.string().required("Registered date must be required"),
    dueDate: Yup.string().required("Partner Expiry Date Required"),
    turnOver: Yup.string().required("Turn over must be required"),
  });

  const fetchSalesPerson = async () => {
    try {
      const data = await CRMBaseURL.get("respectivesalesperson");
      const ResPerson = data.data.data;
      setSalesPerson(ResPerson);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchSalesPerson();
  }, []);

  const formik = useFormik({
    initialValues: {
      partner: "",
      address: "",
      email: "",
      phoneNumber: "",
      authCode: "",
      areaCovered: "",
      respectiveSalesPerson: "",
      registeredDate: formattedToday,
      dueDate: formattedNextYear,
      turnOver: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      values = {
        ...values,
        contacts: contacts,
        createdBy: storedUserData && `${storedUserData.userName}`,
      };

      try {
        const res = await CRMBaseURL.post("addpartner", values);
        if (res.data.message === "Data Inserted Successfully") {
          setSnackbarType("success");
          setSnackbarMessage(res?.data.Message);
          setErrorOpen(true);
          setOpenContactsForm(false);
        } else {
          setSnackbarType("error");
          setSnackbarMessage(res?.data.Message);
          setErrorOpen(true);
        }
      } catch (e) {
        console.log(e);
      }
      fetchContactData();
    },
  });

  const renderTextField = (id, label, isDate = false) => (
    <Grid item xs={6}>
      <TextField
        fullWidth
        id={id}
        required
        name={id}
        label={label}
        type={isDate ? "date" : "text"}
        // Convert DD/MM/YYYY to YYYY-MM-DD for date input
        value={
          isDate
            ? formik.values[id].split("/").reverse().join("-")
            : formik.values[id]
        }
        // disabled={isDate}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[id] && Boolean(formik.errors[id])}
        helperText={formik.touched[id] && formik.errors[id]}
        margin="normal"
      />
    </Grid>
  );

  const renderSalesPersonAutocomplete = (id, label) => (
    <Grid item xs={6}>
      <Autocomplete
        id={id}
        options={salesPerson} // salesPerson is your array of objects
        getOptionLabel={(option) => option.salesPerson || ""} // Access salesPerson field of each option
        onChange={(event, value) => {
          formik.setFieldValue(id, value ? value.salesPerson : ""); // update formik state with selected value
        }}
        onBlur={formik.handleBlur}
        value={
          salesPerson.find(
            (person) => person.salesPerson === formik.values[id]
          ) || null
        } // Find matching object based on formik value
        renderInput={(params) => (
          <TextField
            required
            {...params}
            label={label}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            helperText={formik.touched[id] && formik.errors[id]}
            margin="normal"
            fullWidth
          />
        )}
      />
    </Grid>
  );

  const renderContactTextField = (label, name, value, index) => (
    <Grid item xs={6} key={name}>
      <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={(e) => handleContactChange(index, e)}
        margin="normal"
      />
    </Grid>
  );

  const addContact = () => {
    setContacts([
      ...contacts,
      { name: "", email: "", phone: "", lifecycleStage: "", leadStatus: "" },
    ]);
  };

  const handleContactChange = (index, event) => {
    const { name, value } = event.target;
    const newContacts = [...contacts];
    newContacts[index][name] = value;
    setContacts(newContacts);
  };

  const removeContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <Dialog
        maxWidth="md"
        fullWidth
        open={openContactsForm}
        // TransitionComponent={Transition}
        aria-describedby="alert-dialog-slide-description"
        onExited={() => {
          setOpenContactsForm(false);
        }}
      >
        <DialogTitle>{"Partner Registration Form"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container columnSpacing={2}>
              {renderTextField("partner", "Partner")}
              {renderTextField("address", "Address")}
              {renderTextField("email", "Email")}
              {renderTextField("phoneNumber", "Phone Number")}
              {renderTextField("authCode", "Authorization Code")}
              {renderTextField("areaCovered", "Area Covered")}
              {renderSalesPersonAutocomplete(
                "respectiveSalesPerson",
                "Respective Sales Person"
              )}
              {renderTextField("registeredDate", "Registered Date", true)}
              {renderTextField("dueDate", "Expiry Date", true)}
              {renderTextField("turnOver", "Turn Over")}
            </Grid>

            <Box>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  paddingTop: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Add Contact Details
                <Tooltip title="Add contact">
                  <IconButton
                    onClick={addContact}
                    color="primary"
                    sx={{ marginLeft: 1 }}
                  >
                    <PersonAddAlt1RoundedIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
              {contacts.map((contact, index) => (
                <Grid
                  key={index}
                  container
                  spacing={2}
                  sx={{
                    marginBottom: 2,
                    alignItems: "center",
                  }}
                >
                  {["name", "email", "phone"].map((field) => (
                    <>
                      {renderContactTextField(
                        capitalizeFirstLetter(field),
                        field,
                        contact[field],
                        index
                      )}
                    </>
                  ))}

                  <Grid item>
                    <Tooltip title="Remove contact">
                      <IconButton
                        onClick={() => removeContact(index)}
                        color="error"
                      >
                        <PersonRemoveAlt1RoundedIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              ))}
            </Box>
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

export default PartnerForm;
