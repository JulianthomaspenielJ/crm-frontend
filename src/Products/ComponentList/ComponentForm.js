import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/AuthService";
import CustomSnackbar from "../../Activities/SuccessSnackbar/Snackbar";

const validationSchema = Yup.object({
  componentName: Yup.string().required("Component name must be required"),
  description: Yup.string().required("Component description must be required"),
  productType: Yup.string().required("Product type must be required"),
});

const CRMBaseURL = AuthService();

const ComponentForm = ({
  componentFormOpen,
  setComponentFormOpen,
  fetch,
  editData,
  setEditData,
}) => {
  const productTypes = [
    { label: "Components", value: "Components" },
    { label: "Tablet", value: "Tablet" },
    { label: "Server", value: "Server" },
    { label: "All in one PC", value: "AOP" },
    { label: "Laptop", value: "Laptop" },
    { label: "Others", value: "Others" },
  ];
  const [componentsList, setComponentsList] = useState([]);
  const [newProductName, setNewProductName] = useState(false);
  const [errorOpen,setErrorOpen]=useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const fetchComponents = async () => {
    try {
      const components = await CRMBaseURL.get("getproductlist");
      const data = components.data;
      const datas = data["Data "];
      setComponentsList(datas);
    } catch (err) {
      console.error("Error fetching components", err);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    const payload = {
      ...values,
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    if (editData) {
      payload.id = editData.id;
    }
    try {
      let response;
      if (editData) {
        
        response = await CRMBaseURL.post(`/updatecomponentlist`, payload);
        
      } else {
        response = await CRMBaseURL.post("/componentlist", [payload]);
      }

      fetch();
      if (response.data.message === "Component Name already exist!") {
        setSnackbarType("error");
        setSnackbarMessage(response.data.message);
        setErrorOpen(true);
      } else {
        setSnackbarType("success");
        setSnackbarMessage(response.data.message);
        setErrorOpen(true);
      }
    } catch (error) {
     
      setSnackbarType("error");
      setSnackbarMessage("Something went wrong. Please try again.");
      setErrorOpen(true);
    } finally {
      setSubmitting(false);
      resetForm();
      setComponentFormOpen(false);
      setNewProductName(false);
      setEditData(null);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const getProductTypeValue = (value) => {
    return productTypes.find((type) => type.value === value) || null;
  };

  return (
    <>
    <Dialog
      open={componentFormOpen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {editData ? "Edit Component" : "Add Component"}
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            componentName: editData ? editData.componentName : "",
            description: editData ? editData.description : "",
            productType: editData ? editData.productType : "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ mb: 1 }}>
                {newProductName ? (
                  <TextField
                    sx={{ mt: 3 }}
                    fullWidth
                    focused={newProductName}
                    id="outlined-basic"
                    label="Component Name"
                    variant="outlined"
                    placeholder="Create new Component Name"
                    name="componentName"
                    value={values.componentName}
                    error={
                      touched.componentName && Boolean(errors.componentName)
                    }
                    helperText={touched.componentName && errors.componentName}
                    onChange={handleChange}
                  />
                ) : (
                  <Autocomplete
                    options={[
                      "Add New",
                      ...(componentsList
                        ? componentsList.map((type) => type.productName)
                        : []),
                    ]}
                    getOptionLabel={(option) => option}
                    value={values.componentName}
                    onChange={(event, value) => {
                      if (value === "Add New") {
                        setNewProductName(true);
                      } else {
                        setFieldValue("componentName", value);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Select Component Name"
                        variant="outlined"
                        sx={{ mt: 3 }}
                        error={
                          touched.componentName && Boolean(errors.componentName)
                        }
                        helperText={
                          touched.componentName && errors.componentName
                        }
                      />
                    )}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props; // Destructure key from props
                      return (
                        <li key={key} {...rest}>
                          {option === "Add New" ? (
                            <Typography
                              sx={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: "blue",
                              }}
                            >
                              CREATE NEW
                            </Typography>
                          ) : (
                            option
                          )}
                        </li>
                      );
                    }}
                  />
                )}
              </Box>
              <Box sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  required
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  variant="outlined"
                  margin="normal"
                />
              </Box>
              <Box sx={{ mb: 4 }}>
                <Autocomplete
                  options={productTypes ? productTypes : []}
                  getOptionLabel={(option) => option.label}
                  value={getProductTypeValue(values.productType)}
                  onChange={(event, newValue) => {
                    setFieldValue("productType", newValue ? newValue.value : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Product Type"
                      name="productType"
                      error={touched.productType && Boolean(errors.productType)}
                      helperText={touched.productType && errors.productType}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </Box>

              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setComponentFormOpen(false);
                    setNewProductName(false);
                    setEditData(null); // Clear editData
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {newProductName ? "Save & Submit" : "Update"}
                </Button>
              </DialogActions>
            </Box>
          )}
        </Formik>
      </DialogContent>
    </Dialog>


    <CustomSnackbar
        errorOpen={errorOpen}
        setErrorOpen={setErrorOpen}
        snackbarType={snackbarType}
        snackbarMessage={snackbarMessage}
      />

    </>
  );
};

export default ComponentForm;
