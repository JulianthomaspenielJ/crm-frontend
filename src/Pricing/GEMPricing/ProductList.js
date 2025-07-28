import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import AuthService from "../../services/AuthService";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function ProductList({
  setSelectedComponents,
  margin,
  product,
  handleNext,
  gemID,
  toggleSection,
}) {
  const CRMBaseURL = AuthService();
  const gemData = JSON.parse(localStorage.getItem("GEMData")) || {};
  const [componentsList, setComponentsList] = useState([]);
  const [productNameList, setProductNameList] = useState([]);
  const [newProductName, setNewProductName] = useState(false);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const components = await CRMBaseURL.get("getproductlist");
        const data = components.data;
        const datas = data["Data "];
        setComponentsList(datas || []);
      } catch (err) {
        console.error("Error fetching components", err);
      }
    };

    const fetchProductName = async () => {
      try {
        const productName = await CRMBaseURL.get("productmainlist");
        const data = productName.data.data;
        setProductNameList(data || []);
      } catch (err) {
        console.error("Error fetching product names", err);
      }
    };

    fetchComponents();
    fetchProductName();
  }, []);

  useEffect(() => {
    if (gemData[gemID]?.ProductList?.productName) {
      formik.setFieldValue("productName",gemData[gemID]?.ProductList?.productName)
      formik.setFieldValue("selectedComponents",gemData[gemID]?.ProductList?.selectedComponents)
    } else if (product) {
      handleChangeProductName("nil", product);
    }
  }, [product]);

  const isProductNameUnique = (value) => {
    return !productNameList?.some((product) => product.product === value);
  };

  const formik = useFormik({
    initialValues: {
      productName: gemData[gemID]?.ProductList?.productName || "",
      selectedComponents: gemData[gemID]?.ProductList?.selectedComponents || [],
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
                productName: selectedComponent?.productName || "",
                description: selectedComponent?.description || "",
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
          }
        } catch (err) {
          console.log(err);
        }
      } else {
     (gemData[gemID] = {
          ...gemData[gemID], // Preserve any existing data for this gemID
          ProductList: {
            productName: values?.productName || "",
            selectedComponents: values.selectedComponents,
          }, // Add or update pricingData
        });
        localStorage.setItem("GEMData", JSON.stringify(gemData));
      }

      toggleSection("productList");
      margin(values.selectedComponents);
      handleNext()
    },
  });

  const handleChangeProductName = async (event, value) => {
    if (value === "Add New") {
      const productID = 0;
      const res = await CRMBaseURL.post("productID", { productID });
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
    <Box
      sx={{
        width: "100%",
        padding: "10px 20px",
        height: "98%",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          width: "4px", // Adjust the width of the scrollbar
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d6d6d6",
          borderRadius: "10px",
          marginLeft: 10,
        },
      }}
    >
      <form onSubmit={formik.handleSubmit}>
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
              formik.touched.productName && Boolean(formik.errors.productName)
            }
            helperText={formik.touched.productName && formik.errors.productName}
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
            value={formik.values.productName}
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
              !formik.values.productName ? "Please select a product name" : ""
            }
          >
            <Autocomplete
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
                    label={`${selectedComponent?.productName || ""} - ${
                      selectedComponent?.description || ""
                    }`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                );
              })}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            pt: 5,
            pb: 2,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "end",
          }}
        >
          {/* <Button
            variant="outlined"
            sx={{ marginRight: 2 }}
            onClick={handleBack}
          >
            Back
          </Button> */}
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
}
