import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Formik, Form, Field ,ErrorMessage } from "formik";
import * as Yup from "yup";
import { Autocomplete } from "@mui/material";
import AuthService from "../../services/AuthService";

const VariantForm = () => {
  const CRMBaseURL = AuthService();
  const [variantType, setVariantType] = useState([]);
  const [preview, setPreview] = useState(null);

  const fetch = async () => {
    try {
      const UserData = await CRMBaseURL.get("getcomponentlist");
      setVariantType(UserData.data.components);
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);


  const validationSchema = Yup.object().shape({
    variantName: Yup.string().required("Variant Name is required"),
    variantType: Yup.string().required("Variant Type is required"),
    variantPrice: Yup.number()
      .required("Variant Price is required")
      .positive("Price must be positive"),
    variantDescription: Yup.string().required("Description is required"),
    warrantyInfo: Yup.string().required("Warranty Info is required"),
    brand: Yup.string().required("Brand is required"),
    image: Yup.mixed()
    .required('Image is required')
    .test('fileSize', 'Image must be lessthan 1 MB', value => {
      return value && value.size <= 1024 * 1024;
    }),

  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        paddingTop: 4,
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 450,
          borderRadius: 1,
          padding: 4,
          backgroundColor: "#fff",
          boxShadow: 1,
        }}
      >
        <Formik
          initialValues={{
            variantName: "",
            variantType: "",
            variantPrice: "",
            variantDescription: "",
            warrantyInfo: "",
            brand: "",
            image:null
          }}
          validationSchema={validationSchema}
          onSubmit={ async (values) => {
            const variantTypeMatch = values.variantType.match(/^(.*)\//);
            const variantIdMatch = values.variantType.match(/\/(\d+)$/);

            if (variantTypeMatch && variantIdMatch) {
              const variantType = variantTypeMatch[1];
              const variantId = variantIdMatch[1];

              try{
                values = { ...values, variantType, variantId };        
                const response = await CRMBaseURL.post("postcomponentsdata", values, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

              }catch(err){
                console.log("Error occurred : " , err)
              }
             
              
            } else {
              console.error("Invalid format for variantType");
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Typography variant="h5" sx={{ paddingBottom: 2 }}>
                Product Components
              </Typography>

              <Field
                as={TextField}
                fullWidth
                variant="outlined"
                label="Variant Name"
                name="variantName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.variantName}
                error={touched.variantName && Boolean(errors.variantName)}
                helperText={touched.variantName && errors.variantName}
                sx={{ marginBottom: 2 }}
              />

              <Autocomplete
                options={variantType?variantType.map(
                  (type) => `${type.description}(${type.componentName})/${type.id}`
                ):[]}
                getOptionLabel={(option) => option.split('/')[0]}
                onChange={(event, newValue) => {
                  setFieldValue("variantType", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Variant Type"
                    variant="outlined"
                    error={touched.variantType && Boolean(errors.variantType)}
                    helperText={touched.variantType && errors.variantType}
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />

              <Field
                as={TextField}
                fullWidth
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

              <Field
                as={TextField}
                fullWidth
                variant="outlined"
                label="Variant Description"
                name="variantDescription"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.variantDescription}
                error={touched.variantDescription && Boolean(errors.variantDescription)}
                helperText={touched.variantDescription && errors.variantDescription}
                sx={{ marginBottom: 2 }}
              />

              <Field
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
              />

              <Field
                as={TextField}
                fullWidth
                variant="outlined"
                label="Brand"
                name="brand"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.brand}
                error={touched.brand && Boolean(errors.brand)}
                helperText={touched.brand && errors.brand}
                sx={{ marginBottom: 2 }}
              />
              <div>
              <div>
            <label htmlFor="image">Upload Image:</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue('image', file);
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
        <ErrorMessage name="image" component="div" style={{ color: '#d32f2f',fontSize:14,paddingLeft:18 ,paddingBottom:15}} />
          </div>
          {preview && (
            <div>
              <h3>Image Preview:</h3>
              <img src={preview} alt="Preview" style={{ width: '300px', height: 'auto' }} />
            </div>
          )}
              </div>

              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default VariantForm;
