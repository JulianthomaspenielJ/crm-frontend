import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Autocomplete from "@mui/material/Autocomplete";
import AuthService from "../../services/AuthService";
import PreviousStepper1PDF from "./PreviousStepper1PDF"; // Import the PDFPreview component

export default function FormComponent({
  handleNext,
  handleBack,
  previewData,
  setPreviewData,
  dataSheet,
  setDataSheet,
  setAllQuotation,
  product,
  uploadedImage,
  setUploadedImage,
  type,
  modelNumber,
  holowareValues,
}) {
  const CRMBaseURL = AuthService();
  const [chipSetOptions, setChipSetOptions] = useState([]);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [processorOptions, setProcessorOptions] = useState(null);
  const [isCreateNewProcessor, setIsCreateNewProcessor] = useState(false);

  const [openPDF, setOpenPdf] = useState(false);

  const validationSchemaLaptop = Yup.object({
    laptopModel: Yup.string().required("Laptop Model is required"),
    processor: Yup.string().required("Processor is required"),
    memory: Yup.string().required("Memory is required"),
    memorySlots: Yup.string().required("Memory slots are required"),
    storage: Yup.string().required("Storage is required"),
    graphics: Yup.string().required("Graphics is required"),
    ports: Yup.string().required("Ports are required"),
    screen: Yup.string().required("Screen is required"),
    camera: Yup.string().required("Camera is required"),
    battery: Yup.string().required("Battery is required"),
    audio: Yup.string().required("Speacker is required"),
    wifiBt: Yup.string().required("WiFi/Bluetooth is required"),
    dimensions: Yup.string().required("Dimensions are required"),
    weight: Yup.string().required("Weight is required"),
    powerAdapter: Yup.string().required("Power Adapter is required"),
    availableOS: Yup.string().required("Operating System is required"),
    warranty: Yup.string().required("Warranty is required"),
  });

  const validationSchemaGLaptop = Yup.object({
    laptopModel: Yup.string().required("Laptop Model is required"),
    processor: Yup.string().required("Processor is required"),
    memory: Yup.string().required("Memory is required"),
    memorySlots: Yup.string().required("Memory slots are required"),
    storage: Yup.string().required("Storage is required"),
    graphics: Yup.string().required("Graphics is required"),
    ports: Yup.string().required("Ports are required"),
    touchPanel: Yup.string().required("Panel is required"),
    camera: Yup.string().required("Camera is required"),
    battery: Yup.string().required("Battery is required"),
    audio: Yup.string().required("Speacker is required"),
    wifiBt: Yup.string().required("WiFi/Bluetooth is required"),
    dimensions: Yup.string().required("Dimensions are required"),
    weight: Yup.string().required("Weight is required"),
    keyboard: Yup.string().required("Keyboard is required"),
    availableOS: Yup.string().required("Operating System is required"),
    warranty: Yup.string().required("Warranty is required"),
  });

  // Validation schema for Desktop
  const validationSchema = Yup.object({
    processor: Yup.string().required("Processor is required"),
    modelNumber: Yup.string().required("Model Number is required"),
    chipSet: Yup.string().required("Chipset is required"),
    memory: Yup.string().required("Memory is required"),
    memorySlots: Yup.string().required("Memory slots are required"),
    storage: Yup.string().required("Storage is required"),
    storageSupport: Yup.string().required("Storage Support is required"),
    storageInterface: Yup.string().required("Storage Interface is required"),
    graphics: Yup.string().required("Graphics is required"),
    graphicsSupport: Yup.string().required("Graphics Support is required"),
    monitor: Yup.string().required("Monitor is required"),
    audio: Yup.string().required("Audio is required"),
    lan: Yup.string().required("LAN is required"),
    ports: Yup.string().required("Ports are required"),
    pci: Yup.string().required("PCI is required"),
    wifiBt: Yup.string().required("WiFi/Bluetooth is required"),
    WLANSupport: Yup.string().required("WLAN Support is required"),
    dimensions: Yup.string().required("Dimensions are required"),
    cabinetColor: Yup.string().required("Cabinet Color is required"),
    cabinetLitres: Yup.string().required("Cabinet Litres is required"),
    power: Yup.string().required("Power is required"),
    availableOS: Yup.string().required("Available OS is required"),
    security: Yup.string().required("Security is required"),
    warranty: Yup.string().required("Warranty is required"),
  });

  const validationSchemaMiniPC = Yup.object({
    productModelName: Yup.string().required("Product Model name is required"),
    processor: Yup.string().required("Processor is required"),
    modelNumber: Yup.string().required("Model Number is required"),
    memory: Yup.string().required("Memory is required"),
    memorySlots: Yup.string().required("Memory slots are required"),
    storage: Yup.string().required("Storage is required"),
    graphics: Yup.string().required("Graphics is required"),
    monitor: Yup.string().required("Monitor is required"),
    audio: Yup.string().required("Audio is required"),
    lan: Yup.string().required("LAN is required"),
    ports: Yup.string().required("Ports are required"),
    wifiBt: Yup.string().required("WiFi/Bluetooth is required"),
    dimensions: Yup.string().required("Dimensions are required"),
    weight: Yup.string().required("Weight is required"),
    power: Yup.string().required("Power is required"),
    availableOS: Yup.string().required("Available OS is required"),
    warranty: Yup.string().required("Warranty is required"),
  });
  const validationSchemaAllIN1 = Yup.object({
    processor: Yup.string().required("Processor is required"),
    modelNumber: Yup.string().required("Model Number is required"),
    chipSet: Yup.string().required("Chipset is required"),
    memory: Yup.string().required("Memory is required"),
    memorySlots: Yup.string().required("Memory slots are required"),
    storage: Yup.string().required("Storage is required"),
    graphics: Yup.string().required("Graphics is required"),
    monitor: Yup.string().required("Monitor is required"),
    audio: Yup.string().required("Speackers is required"),
    lan: Yup.string().required("LAN is required"),
    ports: Yup.string().required("Ports are required"),
    wifiBt: Yup.string().required("WiFi/Bluetooth is required"),
    power: Yup.string().required("Power Supply is required"),
    availableOS: Yup.string().required("Available OS is required"),
    warranty: Yup.string().required("Warranty is required"),
    camera: Yup.string().required("Camera is required"),
    mic: Yup.string().required("Mic is required"),
  });

  // Validation schema for Tablet
  const validationSchemaTab = Yup.object({
    productModelName: Yup.string().required("Product Model name is required"),
    processor: Yup.string().required("Processor is required"),
    memory: Yup.string().required("Memory is required"),
    storage: Yup.string().required("Storage is required"),
    graphics: Yup.string().required("Graphics is required"),
    ports: Yup.string().required("Ports are required"),
    weight: Yup.string().required("Weight is required"),
    screen: Yup.string().required("Display is required"),
    battery: Yup.string().required("Battery is required"),
    sensor: Yup.string().required("Sensor is required"),
    camera: Yup.string().required("Camera is required"),
    connectivity: Yup.string().required("Connectivity is required"),
    touchPanel: Yup.string().required("Touch Panel is required"),
    availableOS: Yup.string().required("Available OS is required"),
    warranty: Yup.string().required("Warranty is required"),
  });

  const InitialValues = {
    modelNumber: previewData.modelNumber || modelNumber || "",
    laptopModel: previewData.laptopModel || "",
    chipSet: "",
    processor: previewData.processor || "",
    productModelName: previewData.productModelName || "",
    memory: previewData.memory || "",
    memorySlots: previewData.memorySlots || "",
    storage: previewData.storage || "",
    storageSupport: previewData.storageSupport || "",
    storageInterface: previewData.storageInterface || "",
    graphics: previewData.graphics || "",
    graphicsSupport: previewData.graphicsSupport || "",
    audio: previewData.audio || "",
    ports: previewData.ports || "",
    lan: previewData.lan || "",
    pci: previewData.pci || "",
    monitor: previewData.monitor || "",
    power: previewData.power || "",
    wifiBt: previewData.wifiBt || "",
    dimensions: previewData.dimensions || "",
    weight: previewData.weight || "",
    availableOS: previewData.availableOS || "",
    warranty: previewData.warranty || "",
    // expansionSlots: previewData.expansionSlots || "",
    WLANSupport: previewData.WLANSupport || "",
    cabinetColor: previewData.cabinetColor || "",
    cabinetLitres: previewData.cabinetLitres || "",
    security: previewData.security || "",
    screen: previewData.screen || "",
    camera: previewData.camera || "",
    battery: previewData.battery || "",
    powerAdapter: previewData.powerAdapter || "",
    touchPanel: previewData.touchPanel || "",
    sensor: previewData.sensor || "",
    connectivity: previewData.connectivity || "",
    mic: previewData.mic || "",
    keyboard: previewData?.keyboard || "",
  };

  useEffect(() => {
    handleGetDataName();
    handleProcessorName();
  }, []);

  useEffect(() => {
    if (holowareValues?.onSiteWarranty) {
      const warrantyYears = parseInt(holowareValues.onSiteWarranty, 10);
      const warrantyValue =
        warrantyYears === 1 ? "1 Year" : `${warrantyYears} Years`;

      formik.setFieldValue("warranty", warrantyValue);
    }
  }, [holowareValues]);

  useEffect(() => {
    const fetchData = async () => {
      if (holowareValues?.chipsetNumber) {
        const value = {
          chipSet: holowareValues.chipsetNumber,
          processor: holowareValues.processorNumber,
          product: product,
        };

        handleChipSetChange("nil", value);

        try {
          const response = await CRMBaseURL.post("getdatasheetdatas", value);

          const fetchedData = response.data.ChipSet;

          formik.setFieldValue("chipSet", holowareValues.chipsetNumber || "");
          formik.setFieldValue(
            "processor",
            holowareValues.processorNumber || ""
          );
          formik.setFieldValue("memorySlots", fetchedData.memorySlots || "");
          formik.setFieldValue(
            "storage",
            holowareValues.totalSSDCapacity || ""
          );
          formik.setFieldValue("memory", holowareValues.ramSize || "");
          formik.setFieldValue("audio", fetchedData.audio || "");
          formik.setFieldValue("lan", fetchedData.lan || "");
          formik.setFieldValue("pci", fetchedData.pci || "");
          formik.setFieldValue("monitor", fetchedData.monitor || "");
          formik.setFieldValue("power", fetchedData.power || "");
          formik.setFieldValue("wifiBt", fetchedData.wifiBt || "");
          formik.setFieldValue("dimensions", fetchedData.dimensions || "");
          formik.setFieldValue("weight", fetchedData.weight || "");
          formik.setFieldValue(
            "storageSupport",
            fetchedData.storageSupport || ""
          );
          formik.setFieldValue(
            "storageInterface",
            fetchedData.storageInterface || ""
          );
          formik.setFieldValue("WLANSupport", fetchedData.wlanSupport || "");
          formik.setFieldValue("cabinetColor", fetchedData.cabinetColor || "");
          formik.setFieldValue(
            "cabinetLitres",
            holowareValues.cabinetFormFactor || ""
          );
          formik.setFieldValue("security", fetchedData.security || "");
          formik.setFieldValue("screen", fetchedData.screen || "");
          formik.setFieldValue("camera", fetchedData.camera || "");
          formik.setFieldValue("battery", fetchedData.battery || "");
          formik.setFieldValue("powerAdapter", fetchedData.powerAdapter || "");
        } catch (e) {
          console.error("Error fetching data", e);
        }
      }
    };

    fetchData();
  }, [holowareValues]);
  useEffect(() => {
    if (holowareValues) {
      formik.setFieldValue("availableOS", holowareValues.operatingSystem);
      formik.setFieldValue("warranty", holowareValues.onSiteWarranty);
      formik.setFieldValue("cabinetLitres", holowareValues.cabinetFormFactor);
      formik.setFieldValue("monitor", holowareValues.monitorTechnology);
      formik.setFieldValue("memory", holowareValues.ramSize);
      formik.setFieldValue("storage", holowareValues.totalSSDCapacity);
      formik.setFieldValue("graphics", holowareValues.graphicsType);
    }
  }, [holowareValues]);

  useEffect(() => {
    if (previewData.length !== 0) {
      setOpenPdf(true);
    }
    formik.setFieldValue("chipSet", previewData.chipSet);
  }, [previewData]);

  const handleGetDataName = async () => {
    try {
      const res = await CRMBaseURL.get("getdatasheetname");
      const result = res.data.Data || [];
      const options = result.map((item) => ({
        label: item.chipSet,
        id: item.id,
      }));
      setChipSetOptions([
        { label: "Create New", id: "create-new" },
        ...options,
      ]);
    } catch (e) {
      console.error(e);
      setChipSetOptions([{ label: "Create New", id: "create-new" }]);
    }
  };
  const handleProcessorName = async () => {
    try {
      const res = await CRMBaseURL.get("getprocessor");
      const result = res.data.Data || [];

      const options = result.map((item) => ({
        label: item.processor,
        id: item.id,
      }));
      setProcessorOptions([
        { label: "Create New", id: "create-new" },
        ...options,
      ]);
    } catch (e) {
      console.error(e);
      setProcessorOptions([{ label: "Create New", id: "create-new" }]);
    }
  };

  useEffect(() => {
    fetchProductImage();
  }, []);

  const fetchProductImage = async () => {
    try {
      const res = await CRMBaseURL.post("getproduct", { product });
      setUploadedImage(res.data.Image);
    } catch (e) {
      console.log(e);
    }
  };

  const handleProcessor = async (e, value) => {
    if (value?.label === "Create New") {
      setIsCreateNewProcessor(true);
      formik.setFieldValue("processor", "");
    } else {
      setIsCreateNewProcessor(false);

      if (value?.id) {
        const input = {
          id: value?.id,
        };
        const response = await CRMBaseURL.post("getprocessordata", input);
        const data = response.data.data;

        formik.setFieldValue("graphics", data.graphics || "");
        formik.setFieldValue("graphicsSupport", data.graphicsSupport || "");
        formik.setFieldValue("monitor", data.monitorSupport || "");
        formik.setFieldValue("processor", data.processor || "");
        formik.setFieldValue("screen", data.screen || "");
      } else {
        formik.setFieldValue("graphics", "");
        formik.setFieldValue("graphicsSupport", "");
        formik.setFieldValue("monitor", "");
        formik.setFieldValue("processor", "");
        formik.setFieldValue("screen", "");
      }
    }
  };

  const handleChipSetChange = async (event, value) => {
    if (value?.id === "create-new") {
      setIsCreateNew(true);
      formik.setFieldValue("chipSet", "");
      formik.setFieldValue("laptopModel", "");
      formik.setFieldValue("productModelName", "");
    } else if (value) {
      setIsCreateNew(false);
      formik.setFieldValue("chipSet", value.label);
      formik.setFieldValue("laptopModel", value.label);
      formik.setFieldValue("productModelName", value.label);

      const input = {
        id: value.id,
        product: product,
        chipSet: value.label,
      };
      try {
        const response = await CRMBaseURL.post("getdatasheetdatas", input);
        const data = response.data.ChipSet;
        if (data) {
          formik.setFieldValue("laptopModel", data.chipSet || "");
          formik.setFieldValue("productModelName", data.chipSet || "");
          formik.setFieldValue("chipSet", data.chipSet || "");
          formik.setFieldValue("weight", data.weight || "");
          formik.setFieldValue("powerAdapter", data.powerAdapter || "");
          formik.setFieldValue("security", data.security || "");
          formik.setFieldValue("storageInterface", data.storageInterface || "");

          formik.setFieldValue("storageSupport", data.storageSupport || "");

          formik.setFieldValue("wlanSupport", data.wlanSupport || "");
          formik.setFieldValue("cabinetColor", data.cabinetColor || "");

          formik.setFieldValue("cabinetLitres", data.cabinetLitres || "");
          formik.setFieldValue("camera", data.camera || "");
          formik.setFieldValue("battery", data.battery || "");
          formik.setFieldValue("powerAdapter", data.powerAdaptor || "");
          formik.setFieldValue("touchPanel", data.touchPanel || "");
          formik.setFieldValue("sensor", data.sensor || "");
          formik.setFieldValue("connectivity", data.connectivity || "");

          formik.setFieldValue("memorySlots", data.memorySlots || "");
          formik.setFieldValue("audio", data.audio || "");
          formik.setFieldValue("ports", data.ports || "");
          formik.setFieldValue("lan", data.lan || "");
          formik.setFieldValue("pci", data.pci || "");
          formik.setFieldValue("power", data.power || "");
          formik.setFieldValue("wifiBt", data.wifiBt || "");
          formik.setFieldValue("dimensions", data.dimensions || "");
        } else {
          console.error("No data found for the selected chipset.");
        }
      } catch (error) {
        console.error("Error fetching chipset data:", error);
      }
    }
  };

  const handleSubmit = async (values) => {
    setPreviewData(values);
    setOpenPdf(true);

    const ChipSetValues = {
      laptopModel: values?.laptopModel || values?.productModelName || "N/A",
      chipSet: values?.chipSet || "N/A",
      lan: values?.lan || "N/A",
      memorySlots: values?.memorySlots || "N/A",
      pci: values?.pci || "N/A",
      audio: values?.audio || "N/A",
      dimensions: values?.dimensions || "N/A",
      weight: values?.weight || "N/A",
      ports: values?.ports || "N/A",
      power: values?.power || "N/A",
      powerAdapter: values?.powerAdapter || "N/A",
      security: values?.security || "N/A",
      storageInterface: values?.storageInterface || "N/A",
      storageSupport: values?.storageSupport || "N/A",
      wifiBt: values?.wifiBt || "N/A",
      wlanSupport: values?.wlanSupport || "N/A",
      cabinetColor: values?.cabinetColor || "N/A",
      cabinetLitres: values?.cabinetLitres || "N/A",
      camera: values?.camera || "N/A",
      battery: values?.battery,
      touchPanel: values?.touchPanel || "N/A",
      sensor: values?.sensor || "N/A",
      connectivity: values?.connectivity || "N/A",
    };

    try {
      const responseData = await CRMBaseURL.post("adddatasheet", ChipSetValues);
      console.log("Submitted to adddatasheet:", responseData.data);
    } catch (e) {
      console.error("Error submitting data:", e);
    }
    const ProcessorValues = {
      graphics: values?.graphics,
      graphicsSupport: values?.graphicsSupport,
      monitorSupport: values?.monitor,
      processor: values?.processor,
      screen: values?.screen,
    };
    try {
      const responseData = await CRMBaseURL.post(
        "addprocessor",
        ProcessorValues
      );
      console.log("Submitted to adddatasheet:", responseData.data);
    } catch (e) {
      console.error("Error submitting data:", e);
    }
  };

  const formik = useFormik({
    initialValues: InitialValues,
    validationSchema:
      product === "Laptop"
        ? validationSchemaLaptop
        : product === "Tablet"
        ? validationSchemaTab
        : product === "All in one pc"
        ? validationSchemaAllIN1
        : product === "Mini PC"
        ? validationSchemaMiniPC
        : product === "Gaming Laptop"
        ? validationSchemaGLaptop
        : validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "97%",
        display: "flex",
        padding: "20px 10px 10px 10px",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          width: "50%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0px 10px 0px 0px",
          "&::-webkit-scrollbar": {
            width: "4px", // Adjust the width of the scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d6d6d6",
            borderRadius: "10px",
          },
        }}
      >
        <form onSubmit={formik.handleSubmit} style={{ height: "100%" }}>
          <Grid
            container
            spacing={3}
            sx={{ paddingTop: "20px", height: "100%" }}
          >
            {product !== "Laptop" &&
              product !== "Tablet" &&
              product !== "Gaming Laptop" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      name="modelNumber"
                      label="Model Number"
                      variant="outlined"
                      fullWidth
                      onChange={formik.handleChange}
                      value={formik.values.modelNumber}
                      error={
                        formik.touched.modelNumber &&
                        Boolean(formik.errors.modelNumber)
                      }
                      helperText={
                        formik.touched.modelNumber && formik.errors.modelNumber
                      }
                    />
                  </Grid>

                  {product !== "Mini PC" && (
                    <Grid item xs={12}>
                      {isCreateNew ? (
                        <TextField
                          name="chipSet"
                          label="Enter New Chip Set"
                          variant="outlined"
                          fullWidth
                          onChange={formik.handleChange}
                          value={formik.values.chipSet}
                          error={
                            formik.touched.chipSet &&
                            Boolean(formik.errors.chipSet)
                          }
                          helperText={
                            formik.touched.chipSet && formik.errors.chipSet
                          }
                        />
                      ) : (
                        <Autocomplete
                          options={chipSetOptions || []}
                          value={formik.values.chipSet}
                          onChange={(event, newValue) => {
                            handleChipSetChange(event, newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="chipSet"
                              label="Chip Set"
                              variant="outlined"
                              error={
                                formik.touched.chipSet &&
                                Boolean(formik.errors.chipSet)
                              }
                              helperText={
                                formik.touched.chipSet && formik.errors.chipSet
                              }
                            />
                          )}
                        />
                      )}
                    </Grid>
                  )}
                </>
              )}

            {(product === "Tablet" || product === "Mini PC") && (
              <Grid item xs={12}>
                {isCreateNew ? (
                  <TextField
                    name="productModelName"
                    label="New Product Model"
                    variant="outlined"
                    fullWidth
                    onChange={formik.handleChange}
                    value={formik.values.productModelName}
                    error={
                      formik.touched.productModelName &&
                      Boolean(formik.errors.productModelName)
                    }
                    helperText={
                      formik.touched.productModelName &&
                      formik.errors.productModelName
                    }
                  />
                ) : (
                  <Autocomplete
                    options={chipSetOptions || []}
                    value={formik.values.productModelName}
                    onChange={(event, newValue) => {
                      handleChipSetChange(event, newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="productModelName"
                        label="Product ModelName"
                        variant="outlined"
                        error={
                          formik.touched.productModelName &&
                          Boolean(formik.errors.productModelName)
                        }
                        helperText={
                          formik.touched.productModelName &&
                          formik.errors.productModelName
                        }
                      />
                    )}
                  />
                )}
              </Grid>
            )}

            {(product === "Laptop" || product === "Gaming Laptop") && (
              <Grid item xs={12}>
                {isCreateNew ? (
                  <TextField
                    name="laptopModel"
                    label="New Laptop Model"
                    variant="outlined"
                    fullWidth
                    onChange={formik.handleChange}
                    value={formik.values.laptopModel}
                    error={
                      formik.touched.laptopModel &&
                      Boolean(formik.errors.laptopModel)
                    }
                    helperText={
                      formik.touched.laptopModel && formik.errors.laptopModel
                    }
                  />
                ) : (
                  <Autocomplete
                    options={chipSetOptions || []}
                    value={formik.values.laptopModel}
                    onChange={(event, newValue) => {
                      handleChipSetChange(event, newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="laptopModel"
                        label="Laptop Model"
                        variant="outlined"
                        error={
                          formik.touched.laptopModel &&
                          Boolean(formik.errors.laptopModel)
                        }
                        helperText={
                          formik.touched.laptopModel &&
                          formik.errors.laptopModel
                        }
                      />
                    )}
                  />
                )}
              </Grid>
            )}
            <Grid item xs={12}>
              {isCreateNewProcessor ? (
                <TextField
                  name="processor"
                  label="New Processor"
                  variant="outlined"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.processor}
                  error={
                    formik.touched.processor && Boolean(formik.errors.processor)
                  }
                  helperText={
                    formik.touched.processor && formik.errors.processor
                  }
                />
              ) : (
                <Autocomplete
                  options={processorOptions || []}
                  value={formik.values.processor}
                  onChange={(event, newValue) => {
                    handleProcessor(event, newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="processor"
                      label="Processor"
                      variant="outlined"
                      error={
                        formik.touched.processor &&
                        Boolean(formik.errors.processor)
                      }
                      helperText={
                        formik.touched.processor && formik.errors.processor
                      }
                    />
                  )}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="memory"
                label="Memory"
                variant="outlined"
                fullWidth
                value={formik.values.memory}
                onChange={formik.handleChange}
                error={formik.touched.memory && Boolean(formik.errors.memory)}
                helperText={formik.touched.memory && formik.errors.memory}
              />
            </Grid>

            {product !== "Tablet" && (
              <Grid item xs={12}>
                <TextField
                  name="memorySlots"
                  label="Memory Slot"
                  variant="outlined"
                  fullWidth
                  value={formik.values.memorySlots}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.memorySlots &&
                    Boolean(formik.errors.memorySlots)
                  }
                  helperText={
                    formik.touched.memorySlots && formik.errors.memorySlots
                  }
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                name="storage"
                label="Storage"
                variant="outlined"
                fullWidth
                value={formik.values.storage}
                onChange={formik.handleChange}
                error={formik.touched.storage && Boolean(formik.errors.storage)}
                helperText={formik.touched.storage && formik.errors.storage}
              />
            </Grid>
            {product !== "Laptop" &&
              product !== "Gaming Laptop" &&
              product !== "Tablet" &&
              product !== "All in one pc" &&
              product !== "Mini PC" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      name="storageSupport"
                      label="Storage Support"
                      variant="outlined"
                      fullWidth
                      value={formik.values.storageSupport}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.storageSupport &&
                        Boolean(formik.errors.storageSupport)
                      }
                      helperText={
                        formik.touched.storageSupport &&
                        formik.errors.storageSupport
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="storageInterface"
                      label="Storage Interface"
                      variant="outlined"
                      fullWidth
                      value={formik.values.storageInterface}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.storageInterface &&
                        Boolean(formik.errors.storageInterface)
                      }
                      helperText={
                        formik.touched.storageInterface &&
                        formik.errors.storageInterface
                      }
                    />
                  </Grid>
                </>
              )}

            <Grid item xs={12}>
              <TextField
                name="graphics"
                label="Graphics"
                variant="outlined"
                fullWidth
                value={formik.values.graphics}
                onChange={formik.handleChange}
                error={
                  formik.touched.graphics && Boolean(formik.errors.graphics)
                }
                helperText={formik.touched.graphics && formik.errors.graphics}
              />
            </Grid>
            {product !== "Laptop" &&
              product !== "Gaming Laptop" &&
              product !== "Tablet" &&
              product !== "All in one pc" &&
              product !== "Mini PC" && (
                <Grid item xs={12}>
                  <TextField
                    name="graphicsSupport"
                    label="Graphics Support"
                    variant="outlined"
                    fullWidth
                    value={formik.values.graphicsSupport}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.graphicsSupport &&
                      Boolean(formik.errors.graphicsSupport)
                    }
                    helperText={
                      formik.touched.graphicsSupport &&
                      formik.errors.graphicsSupport
                    }
                  />
                </Grid>
              )}

            {product !== "Tablet" && (
              <Grid item xs={12}>
                <TextField
                  name="audio"
                  label={
                    product === "Laptop" ||
                    product === "Gaming Laptop" ||
                    product === "All in one pc"
                      ? "Speaker"
                      : "Audio"
                  }
                  variant="outlined"
                  fullWidth
                  value={formik.values.audio}
                  onChange={formik.handleChange}
                  error={formik.touched.audio && Boolean(formik.errors.audio)}
                  helperText={formik.touched.audio && formik.errors.audio}
                />
              </Grid>
            )}

            {product === "All in one pc" && (
              <Grid item xs={12}>
                <TextField
                  name="mic"
                  label="Mic"
                  variant="outlined"
                  fullWidth
                  value={formik.values.mic}
                  onChange={formik.handleChange}
                  error={formik.touched.mic && Boolean(formik.errors.mic)}
                  helperText={formik.touched.mic && formik.errors.mic}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                name="ports"
                label="Ports"
                variant="outlined"
                fullWidth
                value={formik.values.ports}
                onChange={formik.handleChange}
                error={formik.touched.ports && Boolean(formik.errors.ports)}
                helperText={formik.touched.ports && formik.errors.ports}
              />
            </Grid>

            {(product === "Laptop" ||
              product === "Gaming Laptop" ||
              product === "Tablet") && (
              <>
                {product !== "Gaming Laptop" && (
                  <Grid item xs={12}>
                    <TextField
                      name="screen"
                      label={product === "Laptop" ? "Screen" : "Display"}
                      variant="outlined"
                      fullWidth
                      value={formik.values.screen}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.screen && Boolean(formik.errors.screen)
                      }
                      helperText={formik.touched.screen && formik.errors.screen}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    name="battery"
                    label="Battery"
                    variant="outlined"
                    fullWidth
                    value={formik.values.battery}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.battery && Boolean(formik.errors.battery)
                    }
                    helperText={formik.touched.battery && formik.errors.battery}
                  />
                </Grid>
              </>
            )}

            {(product === "Laptop" ||
              product === "Tablet" ||
              product === "Gaming Laptop" ||
              product === "All in one pc") && (
              <Grid item xs={12}>
                <TextField
                  name="camera"
                  label="Camera"
                  variant="outlined"
                  fullWidth
                  value={formik.values.camera}
                  onChange={formik.handleChange}
                  error={formik.touched.camera && Boolean(formik.errors.camera)}
                  helperText={formik.touched.camera && formik.errors.camera}
                />
              </Grid>
            )}

            {product !== "Laptop" &&
              product !== "Tablet" &&
              product !== "Gaming Laptop" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      name="lan"
                      label="LAN"
                      variant="outlined"
                      fullWidth
                      value={formik.values.lan}
                      onChange={formik.handleChange}
                      error={formik.touched.lan && Boolean(formik.errors.lan)}
                      helperText={formik.touched.lan && formik.errors.lan}
                    />
                  </Grid>

                  {product !== "All in one pc" && product !== "Mini PC" && (
                    <Grid item xs={12}>
                      <TextField
                        name="pci"
                        label="PCIe Ports"
                        variant="outlined"
                        fullWidth
                        value={formik.values.pci}
                        onChange={formik.handleChange}
                        error={formik.touched.pci && Boolean(formik.errors.pci)}
                        helperText={formik.touched.pci && formik.errors.pci}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      name="monitor"
                      label={
                        product === "All in one pc"
                          ? "Monitor"
                          : "Monitor Support"
                      }
                      variant="outlined"
                      fullWidth
                      value={formik.values.monitor}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.monitor && Boolean(formik.errors.monitor)
                      }
                      helperText={
                        formik.touched.monitor && formik.errors.monitor
                      }
                    />
                  </Grid>
                </>
              )}

            {product === "Tablet" && (
              <>
                {" "}
                <Grid item xs={12}>
                  <TextField
                    name="sensor"
                    label="Sensor"
                    variant="outlined"
                    fullWidth
                    value={formik.values.sensor}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.sensor && Boolean(formik.errors.sensor)
                    }
                    helperText={formik.touched.sensor && formik.errors.sensor}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="connectivity"
                    label="Connectivity"
                    variant="outlined"
                    fullWidth
                    value={formik.values.connectivity}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.connectivity &&
                      Boolean(formik.errors.connectivity)
                    }
                    helperText={
                      formik.touched.connectivity && formik.errors.connectivity
                    }
                  />
                </Grid>
              </>
            )}
            {(product === "Tablet" || product === "Gaming Laptop") && (
              <Grid item xs={12}>
                <TextField
                  name="touchPanel"
                  label={product === "Tablet" ? "Touch Panel" : "Panel"}
                  variant="outlined"
                  fullWidth
                  value={formik.values.touchPanel}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.touchPanel &&
                    Boolean(formik.errors.touchPanel)
                  }
                  helperText={
                    formik.touched.touchPanel && formik.errors.touchPanel
                  }
                />
              </Grid>
            )}
            {product === "Gaming Laptop" && (
              <Grid item xs={12}>
                <TextField
                  name="keyboard"
                  label="Keyboard"
                  variant="outlined"
                  fullWidth
                  value={formik.values.keyboard}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.keyboard && Boolean(formik.errors.keyboard)
                  }
                  helperText={formik.touched.keyboard && formik.errors.keyboard}
                />
              </Grid>
            )}

            {product === "Laptop" || product === "Mini PC" ? (
              <Grid item xs={12}>
                <TextField
                  name="powerAdapter"
                  label="Power Adapter"
                  variant="outlined"
                  fullWidth
                  value={formik.values.powerAdapter}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.powerAdapter &&
                    Boolean(formik.errors.powerAdapter)
                  }
                  helperText={
                    formik.touched.powerAdapter && formik.errors.powerAdapter
                  }
                />
              </Grid>
            ) : (
              product !== "Tablet" &&
              product !== "Gaming Laptop" && (
                <Grid item xs={12}>
                  <TextField
                    name="power"
                    label={
                      product === "All in one pc" ? "Power Supply" : "Power"
                    }
                    variant="outlined"
                    fullWidth
                    value={formik.values.power}
                    onChange={formik.handleChange}
                    error={formik.touched.power && Boolean(formik.errors.power)}
                    helperText={formik.touched.power && formik.errors.power}
                  />
                </Grid>
              )
            )}

            {product !== "Tablet" && (
              <>
                {" "}
                <Grid item xs={12}>
                  <TextField
                    name="wifiBt"
                    label="Wifi-/BT"
                    variant="outlined"
                    fullWidth
                    value={formik.values.wifiBt}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.wifiBt && Boolean(formik.errors.wifiBt)
                    }
                    helperText={formik.touched.wifiBt && formik.errors.wifiBt}
                  />
                </Grid>
                {product !== "All in one pc" && (
                  <Grid item xs={12}>
                    <TextField
                      name="dimensions"
                      label="Dimensions"
                      variant="outlined"
                      fullWidth
                      value={formik.values.dimensions}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.dimensions &&
                        Boolean(formik.errors.dimensions)
                      }
                      helperText={
                        formik.touched.dimensions && formik.errors.dimensions
                      }
                    />
                  </Grid>
                )}
              </>
            )}

            {product !== "Laptop" &&
              product !== "Gaming Laptop" &&
              product !== "Tablet" &&
              product !== "All in one pc" &&
              product !== "Mini PC" && (
                <>
                  {" "}
                  {/* <Grid item xs={12}>
                  <TextField
                    name="expansionSlots"
                    label="Expansion Slots"
                    variant="outlined"
                    fullWidth
                    value={formik.values.expansionSlots}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.expansionSlots &&
                      Boolean(formik.errors.expansionSlots)
                    }
                    helperText={
                      formik.touched.expansionSlots &&
                      formik.errors.expansionSlots
                    }
                  />
                </Grid> */}
                  <Grid item xs={12}>
                    <TextField
                      name="WLANSupport"
                      label="WLAN Support"
                      variant="outlined"
                      fullWidth
                      value={formik.values.WLANSupport}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.WLANSupport &&
                        Boolean(formik.errors.WLANSupport)
                      }
                      helperText={
                        formik.touched.WLANSupport && formik.errors.WLANSupport
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="cabinetColor"
                      label="Cabinet Color"
                      variant="outlined"
                      fullWidth
                      value={formik.values.cabinetColor}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.cabinetColor &&
                        Boolean(formik.errors.cabinetColor)
                      }
                      helperText={
                        formik.touched.cabinetColor &&
                        formik.errors.cabinetColor
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="cabinetLitres"
                      label="Cabinet Litres"
                      variant="outlined"
                      fullWidth
                      value={formik.values.cabinetLitres}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.cabinetLitres &&
                        Boolean(formik.errors.cabinetLitres)
                      }
                      helperText={
                        formik.touched.cabinetLitres &&
                        formik.errors.cabinetLitres
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="security"
                      label="Security"
                      variant="outlined"
                      fullWidth
                      value={formik.values.security}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.security &&
                        Boolean(formik.errors.security)
                      }
                      helperText={
                        formik.touched.security && formik.errors.security
                      }
                    />
                  </Grid>
                </>
              )}

            {(product === "Tablet" ||
              product === "Laptop" ||
              product === "Gaming Laptop" ||
              product === "Mini PC") && (
              <Grid item xs={12}>
                <TextField
                  name="weight"
                  label="Weight"
                  variant="outlined"
                  fullWidth
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  error={formik.touched.weight && Boolean(formik.errors.weight)}
                  helperText={formik.touched.weight && formik.errors.weight}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                name="availableOS"
                label="Available OS"
                variant="outlined"
                fullWidth
                value={formik.values.availableOS}
                onChange={formik.handleChange}
                error={
                  formik.touched.availableOS &&
                  Boolean(formik.errors.availableOS)
                }
                helperText={
                  formik.touched.availableOS && formik.errors.availableOS
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="warranty"
                label="Warranty"
                variant="outlined"
                fullWidth
                value={formik.values.warranty}
                onChange={formik.handleChange}
                error={
                  formik.touched.warranty && Boolean(formik.errors.warranty)
                }
                helperText={formik.touched.warranty && formik.errors.warranty}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  paddingTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                {/* <Button
                  type="button"
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                  onClick={handleBack}
                >
                  Back
                </Button> */}
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Box sx={{ height: "100%", width: "100%" }}>
        <PreviousStepper1PDF
          values={previewData}
          dataSheet={dataSheet}
          setDataSheet={setDataSheet}
          openPDF={openPDF}
          setOpenPdf={setOpenPdf}
          handleNext={handleNext}
          handleBack={handleBack}
          setAllQuotation={setAllQuotation}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          product={product}
          previewData={previewData}
          type={type}
        />
      </Box>
    </div>
  );
}
