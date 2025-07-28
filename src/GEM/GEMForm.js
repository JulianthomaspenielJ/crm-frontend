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
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../services/AuthService";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function GEMForm({
  openContactsForm,
  setOpenContactsForm,
  fetchContactData,
  PartnerID,
  PartnerName,
}) {
  const CRMBaseURL = AuthService();
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
  const [partnerOptions, setPartnerOptions] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [uploadRequired, setUploadRequired] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    if (pdfFiles.length > 10) {
      setError("You can only upload up to 10 PDF files.");
      setSelectedFiles([]);
      return;
    }

    setError("");
    setUploadRequired(false);

    const promises = pdfFiles.map((file) =>
      convertToBase64(file).then((base64) => ({
        base64: base64.split(",")[1],
        name: file.name,
      }))
    );

    Promise.all(promises)
      .then((base64Files) => {
        setSelectedFiles(base64Files);
      })
      .catch((err) => {
        setError("Error converting files to base64.");
        console.error(err);
      });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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

  const handleClose = () => {
    setErrorOpen(false);
  };

  const validationSchema = Yup.object({
    gemNumber: Yup.string().required("GEM Number is required"),
    GEMDate: Yup.string().required("Start Date is required"),
    dueDate: Yup.string().required("Due Date is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
    // dealerName: Yup.string().required("Dealer Name is required"),
    productType: Yup.string().required("Product type must be required"),
    customerName: Yup.string().required("Customer Name is required"),
    description: Yup.string().required("Description is required"),
    gemURL: Yup.string()
      .url("Invalid URL format")
      .required("gemURL is required"),
  });

  const productTypeOptions = [
    "Tower Desktop",
    "WorkStation",
    "All in one pc",
    "Server",
    "Laptop",
    "Tablet",
    "Mini PC",
    "Gaming Laptop",
  ];

  const formik = useFormik({
    initialValues: {
      gemNumber: "",
      GEMDate: "",
      dueDate: "",
      //dueDate: "",
      quantity: "",
      customerName: "",
      description: "",
      gemURL: "",
      productType: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      if (selectedFiles.length === 0) {
        setUploadRequired(true);
        return;
      } else {
        values = {
          ...values,
          dealerName: PartnerName,
          dealerId: PartnerID,
          quantity: parseInt(values.quantity, 10),
          team: storedUserData && `${storedUserData.team}`,
          ownerId: parseInt(storedUserData && `${storedUserData.id}`, 10),
          createdBy: storedUserData && `${storedUserData.userName}`,
          gemCertificate: selectedFiles.map((file) => file.base64),
        };
      }

      try {
        const res = await CRMBaseURL.post("addgem", values);
        if (res.data.message === "Gem added successfully") {
          setSnackbarType("success");
          setSnackbarMessage(res.data.message);
          setErrorOpen(true);
          setOpenContactsForm(false);
        } else {
          setSnackbarType("error");
          setSnackbarMessage(res.data.message);
          setErrorOpen(true);
        }
      } catch (e) {
        setSnackbarType("error");
        setSnackbarMessage("An error occurred while adding the GEM.");
        setErrorOpen(true);
      }
      fetchContactData();
    },
  });

  const renderTextField = (id, label, isDateField = false) => (
    <Grid item xs={6}>
      <TextField
        fullWidth
        id={id}
        focused={isDateField}
        type={isDateField ? "date" : "text"}
        value={
          isDateField
            ? formik.values[id].split("/").reverse().join("-")
            : formik.values[id]
        }
        name={id}
        label={label}
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
        <DialogTitle>{"GEM Registration Form"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container columnSpacing={2}>
              {renderTextField("gemNumber", "GEM Number")}
              {/* <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  options={partnerOptions || []}
                  getOptionLabel={(option) => option.partner || ""}
                  value={
                    partnerOptions.find(
                      (option) => option.partner === formik.values.dealerName
                    ) || null
                  }
                  onChange={(event, value) => {
                    formik.setFieldValue("dealerName", value?.partner || "");
                    formik.setFieldValue("dealerId", value?.id || "");
                  }}
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Dealer Name"
                      margin="normal"
                      error={
                        formik.touched.dealerName &&
                        Boolean(formik.errors.dealerName)
                      }
                      helperText={
                        formik.touched.dealerName && formik.errors.dealerName
                      }
                    />
                  )}
                />
              </Grid> */}

              {renderTextField("customerName", "Department / Customer")}

              {renderTextField("quantity", "Quantity")}
              <Grid item xs={12} sm={6} mt={2}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  options={productTypeOptions}
                  value={formik.values.productType}
                  onChange={(e, newValue) =>
                    formik.setFieldValue("productType", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product Type"
                      error={
                        formik.touched.productType &&
                        Boolean(formik.errors.productType)
                      }
                      helperText={
                        formik.touched.productType && formik.errors.productType
                      }
                    />
                  )}
                />
              </Grid>
              {renderTextField("gemURL", "GeM URL")}
              {renderTextField("description", "Description")}

              {renderTextField("GEMDate", "GEM Date", true)}
              {/* Date Field */}
              {renderTextField("dueDate", "Due Date", true)}

              <Grid item xs={12}>
                <Box>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="pdf-upload-input"
                  />
                  <Typography
                    sx={{
                      m: 1,
                      display: "flex",
                      fontWeight: 500,
                      alignItems: "center",
                    }}
                  >
                    Upload PDFs
                    <label htmlFor="pdf-upload-input">
                      <IconButton component="span" color="error">
                        <PictureAsPdfIcon />
                      </IconButton>
                    </label>
                  </Typography>

                  {selectedFiles.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        Selected PDF Files:
                      </Typography>
                      <ul>
                        {selectedFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </Box>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {uploadRequired && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Please select at least one PDF file to upload.
                    </Alert>
                  )}
                </Box>
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

export default GEMForm;
