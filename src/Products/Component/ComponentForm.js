import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Autocomplete } from "@mui/material";
import AuthService from "../../services/AuthService";

const VariantForm = ({
  componentFormOpen,
  setComponentFormOpen,
  fetch,
  editData,
  setEditData,
  setSnackbarMessage,
  setSnackbarType,
  setDataUpdateMsg,
}) => {
  const CRMBaseURL = AuthService();
  const [variantType, setVariantType] = useState([]);
  const [brandDisabled, setBrandDisabled] = useState(false);
  const brands = [
    "Others",
    "Intel",
    "AMD",
    "NVIDIA",
    "Holoware",
    "Samsung",
    "Microsoft",
    "Gigabyte",
    "Aorus",
    "Corsair",
    "G. SKILL",
    "Kingston",
    "Crucial",
    "Adata",
    "Seagate",
    "Western Digital",
    "Toshiba",
    "Blue Feather",
    "Sabrent",
    "Asus",
    "MSI",
    "Asrock",
  ];
  const fetchVariantType = useCallback(async () => {
    try {
      const UserData = await CRMBaseURL.get("getcomponentlist");
      setVariantType(UserData.data.components);
    } catch (err) {
      console.error("Error occurred", err);
    }
  }, [CRMBaseURL, setVariantType]);

  useEffect(() => {
    fetchVariantType();
  }, []);

  const validationSchema = Yup.object().shape({
    variantName: Yup.string().required("Variant Name is required"),
    variantType: editData
      ? null
      : Yup.string().required("Variant Type is required"),
    variantPrice: Yup.number()
      .required("Variant Price is required")
      .positive("Price must be positive"),
    variantDescription: Yup.string().required("Description is required"),
    // warrantyInfo: Yup.string().required("Warranty Info is required"),
    brand: Yup.string().required("Brand is required"),
    // image: Yup.mixed()
    //   .required("Image is required")
    //   .test("fileSize", "Image must be lessthan 1 MB", (value) => {
    //     return value && value.size <= 1024 * 1024;
    //   }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (!editData) {
      const variantTypeMatch = values.variantType.match(/^(.*)\//);
      const variantIdMatch = values.variantType.match(/\/(\d+)$/);

      if (variantTypeMatch && variantIdMatch) {
        //const variantType = variantTypeMatch[1];
        const variantId = variantIdMatch[1];

        try {
          values = {
            ...values,
            variantId,
            createdBy:
              storedUserData &&
              `${storedUserData.userName} (${storedUserData.email})`,
          };
          const response = await CRMBaseURL.post("postcomponentsdata", values, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.message === "name") {
            setSnackbarType("error");
            setSnackbarMessage("Component Name already exist!");
            setDataUpdateMsg(true);
            return;
          } else {
            setSnackbarType("success");
            setSnackbarMessage(response && response.data?.message);
            setDataUpdateMsg(true);
          }
        } catch (err) {
          console.log("Error occurred : ", err);
          setSnackbarType("error");
          setSnackbarMessage("Something went wrong. Please try again.");
          setDataUpdateMsg(true);
        }
      } else {
        console.error("Invalid format for variantType");
        setSnackbarType("error");
        setSnackbarMessage("Something went wrong. Please try again.");
        setDataUpdateMsg(true);
      }
    } else {
      values = {
        ...values,
        id: editData.id,
        createdBy:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
      };
      try {

        const response = await CRMBaseURL.post("updatecomponent", values);
        setSnackbarType("success");
        setSnackbarMessage(response && response.data?.message);
        setDataUpdateMsg(true);
      } catch (e) {
        setSnackbarType("error");
        setSnackbarMessage("Something went wrong. Please try again.");
        setDataUpdateMsg(true);
      }
    }
    resetForm();
    fetch();
    setComponentFormOpen(false);
    setEditData();
  };

  return (
    <Dialog
      open={componentFormOpen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Product Component"}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            variantName: editData ? editData.variantName : "",
            variantType: "",
            variantPrice: editData ? editData.variantPrice : "",
            variantDescription: editData ? editData.variantDescription : "",
            // warrantyInfo: "",
            brand: editData ? editData.brand : "",
            // image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              {!editData && (
                <Autocomplete
                  options={
                    variantType
                      ? variantType.map(
                          (type) =>
                            `${type.description}(${type.componentName})/${type.id}`
                        )
                      : []
                  }
                  getOptionLabel={(option) => option.split("/")[0]}
                  onChange={(event, newValue) => {
                    setFieldValue("variantType", newValue);

                    const regex = /(.*)\((.*)\)/;
                    const matches = newValue && newValue.match(regex);
                    if (matches && matches.length === 3) {
                      const valueType = `${matches[2]} ${matches[1]}`;
                      const updatedDescription = `${
                        valueType ? valueType : ""
                      } ${values.variantName || ""}`;

                      setFieldValue(
                        "variantDescription",
                        updatedDescription || ""
                      );
                    } else {
                      setFieldValue("variantDescription", "");
                    }

                    const variantBrand = newValue?.split("(")[0];
                    if (variantBrand?.toLowerCase().startsWith("amd")) {
                      setFieldValue("brand", "AMD");
                      setBrandDisabled(true);
                    } else if (
                      variantBrand?.toLowerCase().startsWith("intel")
                    ) {
                      setFieldValue("brand", "Intel");
                      setBrandDisabled(true);
                    } else {
                      setFieldValue("brand", "");
                      setBrandDisabled(false);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                    required
                      {...params}
                      label="Variant Type"
                      variant="outlined"
                      error={touched.variantType && Boolean(errors.variantType)}
                      helperText={touched.variantType && errors.variantType}
                      sx={{ marginTop: 2 }}
                    />
                  )}
                />
              )}

              <Field
                as={TextField}
                fullWidth
                required
                variant="outlined"
                label="Variant Name"
                name="variantName"
                onChange={(e) => {
                  setFieldValue("variantName", e.target.value);

                  const regex = /(.*)\((.*)\)/;
                  const newValue = values.variantType;
                  const matches = newValue && newValue.match(regex);
                  if (matches && matches.length === 3) {
                    const valueType = `${matches[2]} ${matches[1]}`;
                    const updatedDescription = `${valueType} ${e.target.value}`;
                    setFieldValue("variantDescription", updatedDescription);
                  }
                }}
                onBlur={handleBlur}
                value={values.variantName}
                error={touched.variantName && Boolean(errors.variantName)}
                helperText={touched.variantName && errors.variantName}
                sx={{ marginY: 2 }}
              />

              <Field
                as={TextField}
                fullWidth
                required
                variant="outlined"
                label="Variant Description"
                name="variantDescription"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.variantDescription}
                error={
                  touched.variantDescription &&
                  Boolean(errors.variantDescription)
                }
                helperText={
                  touched.variantDescription && errors.variantDescription
                }
                sx={{ marginBottom: 2 }}
              />

              {/* <Field
                as={TextField}
                fullWidth
                variant="outlined"
                label="Warranty Info"
                name="warrantyInfo"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.warrantyInfo}
                error={touched.warrantyInfo && Boolean(errors.warrantyInfo)}
                helperText={touched.warrantyInfo && errors.warrantyInfo}
                sx={{ marginBottom: 2 }}
              /> */}

              <Autocomplete
                options={brands ? brands : []}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => {
                  setFieldValue("brand", newValue);
                }}
                filterOptions={(options, { inputValue }) =>
                  options.filter(
                    (option) =>
                      inputValue.length > 0 &&
                      option.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                renderInput={(params) => (
                  <TextField
                  required
                    {...params}
                    label="Brand"
                    variant="outlined"
                    error={touched.brand && Boolean(errors.brand)}
                    helperText={touched.brand && errors.brand}
                    sx={{ marginBottom: 2 }}
                    disabled={brandDisabled}
                  />
                )}
                value={values.brand}
              />
              <Field
                as={TextField}
                fullWidth
                required
                variant="outlined"
                label="Variant Price"
                name="variantPrice"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.variantPrice}
                error={touched.variantPrice && Boolean(errors.variantPrice)}
                helperText={touched.variantPrice && errors.variantPrice}
                type="number"
                sx={{ marginBottom: 2 }}
              />
              {/* <div>
                <div>
                  <label htmlFor="image">Upload Image:</label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("image", file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setPreview(null);
                      }
                    }}
                  />
                  <ErrorMessage
                    name="image"
                    component="div"
                    style={{
                      color: "#d32f2f",
                      fontSize: 14,
                      paddingLeft: 18,
                      paddingBottom: 15,
                    }}
                  />
                </div>
                {preview && (
                  <div>
                    <h3>Image Preview:</h3>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: "300px", height: "auto" }}
                    />
                  </div>
                )}
              </div> */}

              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setComponentFormOpen(false);
                    setEditData();
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="contained" color="primary">
                  {editData ? "update" : "submit"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default VariantForm;
