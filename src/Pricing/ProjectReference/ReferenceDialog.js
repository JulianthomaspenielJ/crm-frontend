import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  Box,
  Chip,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AuthService from "../../services/AuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import Pricing from "./PricingComponents/Pricing";

export default function ReferenceDialog({
  setReferenceDialog,
  referenceDialog,
  fetch,
}) {
  const CRMBaseURL = AuthService();
  const [componentsList, setComponentsList] = useState([]);
  const [productNameList, setProductNameList] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [openPricing, setOpenPricing] = useState(false);
  const [newProductName, setNewProductName] = useState(false);

  useEffect(() => {
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

    const fetchProductName = async () => {
      try {
        const productName = await CRMBaseURL.get("productmainlist");
        const data = productName.data.data;
        setProductNameList(data);
      } catch (err) {
        console.error("Error fetching product names", err);
      }
    };

    fetchComponents();
    fetchProductName();
  }, []);
  const isProductNameUnique = (value) => {
    return !productNameList?.some((product) => product.product === value);
  };

  const formik = useFormik({
    initialValues: {
      productName: "",
      selectedComponents: [],
    },
    validationSchema: Yup.object({
      productName: newProductName
        ? Yup.string()
            .required("Product Name is required")
            .test(
              "is-unique",
              "Product Name already exists",
              isProductNameUnique
            )
        : Yup.string().required("Product Name is required"),
      selectedComponents: Yup.array().min(1, "Select at least one component"),
    }),
    onSubmit: async (values) => {
      if (newProductName) {
        const selectedComponentArray = values.selectedComponents;

        if (values) {
          const updatedComponents = values.selectedComponents.map(
            (component) => {
              const selectedComponent = componentsList.find(
                (comp) => comp.productName === component
              );
              return {
                productName: selectedComponent.productName,
                description: selectedComponent.description,
              };
            }
          );
          const storedUserData = JSON.parse(localStorage.getItem("userData"));
          values = {
            ...values,
            selectedComponents: updatedComponents,
            createdBy:
              storedUserData &&
              `${storedUserData.userName} (${storedUserData.email})`,
          };
        }

        try {
          const res = await CRMBaseURL.post("createproductmainlist", values);
          if (res) {
            setSelectedComponents(selectedComponentArray);
            setOpenPricing(true);
            setReferenceDialog(false);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        setSelectedComponents(values.selectedComponents);
        setOpenPricing(true);
        setReferenceDialog(false);
      }
      formik.resetForm();
      setNewProductName(false);
    },
  });

  const handleChangeProductName = async (event, value) => {
    if (value === "Add New") {
      const productID = 0;
      const res = await CRMBaseURL.post("productID", { productID });
      console.log("res", res);
      setNewProductName(true);
    } else {
      const data = productNameList.find((type) => type.product === value);
      const productID = data?.id;
      const res = await CRMBaseURL.post("productID", { productID });
      const componentsValueData = res.data?.Res;
      const componentsValue = componentsValueData?.map(
        (data) => data.productName
      );
      formik.setFieldValue("selectedComponents", componentsValue || []);
      formik.setFieldValue("productName", value);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={referenceDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="alert-dialog-title">{"Add Components"}</DialogTitle>
          <DialogContent>
            {newProductName ? (
              <TextField
                sx={{ mt: 3 }}
                fullWidth
                focused={newProductName}
                id="outlined-basic"
                label="Product Name"
                variant="outlined"
                placeholder="Create new ProductName"
                name="productName"
                value={formik.values.productName}
                error={
                  formik.touched.productName &&
                  Boolean(formik.errors.productName)
                }
                helperText={
                  formik.touched.productName && formik.errors.productName
                }
                onChange={formik.handleChange}
              />
            ) : (
              <Autocomplete
                sx={{ mt: 3 }}
                fullWidth
                id="productName"
                options={[
                  "Add New",
                  ...(productNameList
                    ? productNameList.map((type) => type.product)
                    : []),
                ]}
                getOptionLabel={(option) => option}
                onChange={handleChangeProductName}
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product Name"
                    variant="outlined"
                    name="productName"
                    error={
                      formik.touched.productName &&
                      Boolean(formik.errors.productName)
                    }
                    helperText={
                      formik.touched.productName && formik.errors.productName
                    }
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...rest } = props; // Destructure key from props
                  return (
                    <li key={key} {...rest}>
                      {option === "Add New" ? (
                        <Typography
                          sx={{ fontSize: 14, fontWeight: 700, color: "blue" }}
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

            <Box>
              <Tooltip
                title={
                  !formik.values.productName
                    ? "Please select a product name"
                    : ""
                }
              >
                <Autocomplete
                  disabled={!formik.values.productName}
                  multiple
                  options={
                    componentsList
                      ? componentsList.map((type) => type.productName)
                      : []
                  }
                  getOptionLabel={(option) => option}
                  value={formik.values.selectedComponents}
                  onChange={(event, value) => {
                    formik.setFieldValue("selectedComponents", value || []);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Components"
                      variant="outlined"
                      sx={{ mt: 3 }}
                      error={
                        formik.touched.selectedComponents &&
                        Boolean(formik.errors.selectedComponents)
                      }
                      helperText={
                        formik.touched.selectedComponents &&
                        formik.errors.selectedComponents
                      }
                    />
                  )}
                />
              </Tooltip>
              {formik.values.selectedComponents && (
                <Box sx={{ mt: 2 }}>
                  <Typography>
                    <b>Description:</b>
                  </Typography>
                  {formik.values.selectedComponents.map((component, index) => {
                    const selectedComponent = componentsList.find(
                      (comp) => comp.productName === component
                    );
                    return (
                      <Chip
                        key={index}
                        label={`${selectedComponent.productName} - ${selectedComponent.description}`}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setReferenceDialog(false);
                formik.resetForm();
                setNewProductName(false);
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {newProductName ? "Save & Next" : "Next"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Pricing
        setOpenPricing={setOpenPricing}
        openPricing={openPricing}
        selectedComponent={selectedComponents}
        fetch={fetch}
      />
    </React.Fragment>
  );
}
