import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Divider,
  TableContainer,
  TableCell,
  TableRow,
  Table,
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/AuthService";
import HolowareLogo from "../../Image/HWLogo.png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Madeinindialogo from "../../Image/madeinindia.png";
import html2pdf from "html2pdf.js";

export default function MIICertificate({
  handleNext,
  handleBack,
  gemNumber,
  MIIData,
  setMIIData,
  setMIICertificatee,
  holowareValues
}) {
  const CRMBaseURL = AuthService();
  const contentRef = useRef();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const IssueBy = storedUserData && `${storedUserData.userName}`;
  const [productData, setProductData] = useState([]);
  const [componentDetails, setComponentDetails] = useState({
    processorNumberOptions: [],
  });
  const [chipset, setChipset] = useState({ ChipSetOptions: [] });
  const [ramval, setRamVal] = useState({ ramOption: [] });
  const [hddVal, setHddVal] = useState({ hddOption: [] });
  const [ssdval, setSsdVal] = useState({ ssdOptions: [] });
  const [graphics, setGraphics] = useState({ graphicsOption: [] });
  const [os, setOs] = useState({ osOption: [] });
  const [SMPS, setSMPS] = useState({ smpsOption: [] });

  const validationSchema = Yup.object({
    tenderGemNumber: Yup.string().required("Tender/GEM number is required"),
    gemDate: Yup.date().required("GEM date is required").nullable(),
    issuedBy: Yup.string().required("Issued By is required"),
    providedBy: Yup.string().required("Provided By is required"),
    percentage: Yup.number()
      .required("Percentage is required")
      .positive("Percentage must be a positive number")
      .max(100, "Percentage cannot exceed 100"),
    model: Yup.string().required("Model is required"),
    processor: Yup.string().required("Processor is required"),
    processorNumber: Yup.string().required("Processor Number is required"),
    motherboard: Yup.string().required("Motherboard is required"),
    ram: Yup.string().required("RAM is required"),
    ramType: Yup.string().required("RAM Type is required"),
    hdd: Yup.string().required("HDD is required"),
    ssd: Yup.string().required("SSD is required"),
    ssdStorage: Yup.number().required("SSD Storage is required"),
    graphics: Yup.string().required("Graphics is required"),
    graphicsDescription: Yup.string().required(
      "Graphics Description is required"
    ),
    osType: Yup.string().required("OS Type is required"),
    powerSupply: Yup.string().required("Power Supply is required"),
    warrantyYear: Yup.string().required("Warranty Year is required"),
  });

  const formik = useFormik({
    initialValues: {
      tenderGemNumber: gemNumber,
      gemDate: "",
      issuedBy: IssueBy,
      providedBy: "",
      percentage: "",
      model: "",
      processor: "",
      processorNumber: "",
      motherboard: "",
      ram: "",
      ramType: "",
      hdd: "",
      ssd: "",
      ssdStorage: "",
      graphics: "",
      graphicsDescription: "",
      graphicsStorage: "",
      osType: "",
      powerSupply: "",
      warrantyYear: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
     
    },
  });

  useEffect(() => {
    if (!MIIData || Object.keys(MIIData).length === 0) return; // Skip if MIIData is not ready

    formik.setFieldValue("motherboard", MIIData.motherboard);
    formik.setFieldValue("ramType", MIIData.ramType);
    formik.setFieldValue("hddType", MIIData.hddType);
    formik.setFieldValue("ssdType", MIIData.ssdType);
    formik.setFieldValue("graphics", MIIData.graphics);
    formik.setFieldValue("powerSupplyType", MIIData.powerSupplyType);
    formik.setFieldValue("powerSupply", MIIData.powerSupply);
    formik.setFieldValue("osType", MIIData.osType);
    formik.setFieldValue("graphicsDescription", MIIData.graphicsDescription);
    formik.setFieldValue("processorNumber", MIIData.processorNumber);
    formik.setFieldValue("chipset", MIIData.chipset);
    formik.setFieldValue("ram", MIIData.ram);
    formik.setFieldValue("hdd", MIIData.hdd);
    formik.setFieldValue("ssd", MIIData.ssd);
    formik.setFieldValue("os", MIIData.os);
    formik.setFieldValue("powerSupply", MIIData.powerSupply);
    formik.setFieldValue("tenderGemNumber", MIIData.tenderGemNumber);
    formik.setFieldValue("gemDate", MIIData.gemDate);
    formik.setFieldValue("issuedBy", MIIData.issuedBy);
    formik.setFieldValue("providedBy", MIIData.providedBy);
    formik.setFieldValue("percentage", MIIData.percentage);
    formik.setFieldValue("model", MIIData.model);
    formik.setFieldValue("warrantyYear", MIIData.warrantyYear);
    formik.setFieldValue("processor", MIIData.processor);
  }, [MIIData]);

  const generatePDF = async () => {
    const element = contentRef.current; // The element you want to convert to PDF

    // Options for pdf generation
    const options = {
      margin: [0.5, 0.6, 1.5, 0.8],
      filename: "MAF_certificate.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 }, // Higher scale for better quality
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Generate PDF and save it as Blob
    html2pdf()
      .from(element)
      .set(options)
      .outputPdf("blob") // Output as Blob
      .then((blob) => {
        // Create a Blob URL
        const url = URL.createObjectURL(blob);
        setMIICertificatee(url); // Save the Blob URL in state
      })
      .then(() => {
        // Handle any actions after PDF generation
        formik.handleSubmit();
        formik.values.tenderGemNumber = gemNumber; // Assuming gemNumber is defined in your scope
        setMIIData(formik.values);
        handleNext(); // Assuming handleNext is defined
      });
  };

  const fetchComponents = async () => {
    try {
      const response = await CRMBaseURL.get("getcomponentlist");
      const userData = response.data.components;

      setProductData(userData);
      // const initialOptions = selectedComponent.reduce((options, category) => {
      //   options[category.toLowerCase().replace(/ /g, "")] = userData
      //     .filter((component) => component.componentName === category)
      //     .map((component) => component.description);
      //   return options;
      // }, {});

      // setOptions(initialOptions, userData);
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  const fetchComponentDetails = async (id) => {
    try {
      const response = await CRMBaseURL.post("pricing", { id });
      const fetchedData = response.data.component; // Assume response.data contains details for the selected component
      return fetchedData;
    } catch (err) {
      console.error("Error fetching component details", err);
      return [];
    }
  };

  const getOptions = (componentName) => {
    return productData
      ?.filter((item) => item.componentName === componentName)
      .map((item) => ({
        label: item.description,
        id: item.id,
      }));
  };

  const handleComponentChange = async (id, value) => {
    const selectedValue = value?.label || value; // Extract the label (string) or fallback to value if not an object
    formik.setFieldValue(id, selectedValue);

    if (id === "processor" && value?.id) {
      const processorDetails = await fetchComponentDetails(value.id);
      setComponentDetails((prevState) => ({
        ...prevState,
        processorNumberOptions: Array.isArray(processorDetails)
          ? processorDetails.map((item) => item.variantName)
          : [],
      }));
    }
  };

  const handleMotherBoardComponentChange = async (id, value) => {
    const selectedValue = value?.label || value?.description || value; // Ensure valid data
    formik.setFieldValue(id, selectedValue);

    if (id === "motherboard" && value?.id) {
      const chipset = await fetchComponentDetails(value.id);
      setChipset((prevState) => ({
        ...prevState,
        ChipSetOptions: Array.isArray(chipset)
          ? chipset.map((item) => item.variantName)
          : [],
      }));
    }
  };

  const handleRAMComponentChange = async (id, value) => {
    const selectedValue = value?.label || value; // Extract the label
    formik.setFieldValue(id, selectedValue);

    if (id === "ramType" && value?.id) {
      const ram = await fetchComponentDetails(value.id);
      setRamVal((prevState) => ({
        ...prevState,
        ramOption: Array.isArray(ram)
          ? ram.map((item) => item.variantName)
          : [],
      }));
    }
  };

  const handleHDDComponentChange = async (id, value) => {
    const selectedValue = value?.label || value?.description || value; // Correctly handle description or label
    formik.setFieldValue(id, selectedValue);

    if (id === "hddType" && value?.id) {
      const HDD = await fetchComponentDetails(value.id);
      setHddVal((prevState) => ({
        ...prevState,
        hddOption: Array.isArray(HDD)
          ? HDD.map((item) => item.variantName)
          : [],
      }));
    }
  };

  const handleSSDComponentChange = async (id, value) => {
    const selectedValue = value?.label || value?.description || value; // Correctly handle description or label
    formik.setFieldValue(id, selectedValue);

    if (id === "ssdType" && value?.id) {
      const SSD = await fetchComponentDetails(value.id);
      setSsdVal((prevState) => ({
        ...prevState,
        ssdOptions: Array.isArray(SSD)
          ? SSD.map((item) => item.variantName)
          : [],
      }));
    }
  };

  const handleGraphicsComponentChange = async (id, value) => {
    const selectedValue = value?.label || value?.description || value;
    formik.setFieldValue(id, selectedValue);

    if (id === "graphics" && value?.id) {
      const Graph = await fetchComponentDetails(value.id);
      setGraphics((prevState) => ({
        ...prevState,
        graphicsOption: Array.isArray(Graph)
          ? Graph.map((item) => item.variantName)
          : [],
      }));
    }
  };

  const handleOSComponentChange = async (id, value) => {
    // Extract the label or description if it's an object
    const selectedValue = value?.label || value?.description || value;
    formik.setFieldValue(id, selectedValue); // Set the correct value in formik

    if (id === "osType" && value?.id) {
      try {
        const os = await fetchComponentDetails(value.id);
        setOs((prevState) => ({
          ...prevState,
          osOption: Array.isArray(os)
            ? os.map((item) => item.variantName) // Map the variantName for dropdown
            : [], // Fallback to empty array if not an array
        }));
      } catch (error) {
        console.error("Error fetching OS details:", error); // Handle fetch errors
      }
    }
  };

  const handleSMPSComponentChange = async (id, value) => {
    // Extract the label or description if it's an object
    const selectedValue = value?.label || value?.description || value;
    formik.setFieldValue(id, selectedValue); // Set the correct value in formik

    if (id === "powerSupplyType" && value?.id) {
      try {
        const smps = await fetchComponentDetails(value.id);
        setSMPS((prevState) => ({
          ...prevState,
          smpsOption: Array.isArray(smps)
            ? smps.map((item) => item.variantName) // Map the variantName for dropdown
            : [], // Fallback to empty array if not an array
        }));
      } catch (error) {
        console.error("Error fetching SMPS details:", error); // Handle fetch errors
      }
    }
  };



  useEffect(() => {
    fetchComponents();
  }, []);

  const renderTextField = (id, label, type = "text", componentName) => (
    <Grid item xs={12}>
      {id === "processor" ? (
        <Autocomplete
          options={getOptions(componentName)}
          onChange={(event, value) => handleComponentChange(id, value)}
          value={formik.values[id] || null}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "processorNumber" ? ( // For the processor number dropdown
        // <Autocomplete
        //   options={componentDetails.processorNumberOptions} // Use the options directly from state
        //   onChange={(event, value) => formik.setFieldValue(id, value)}
        //   value={formik.values[id] || null}
          // renderInput={(params) => (
            
          // )}
          <TextField
              // {...params}
              fullWidth
              label={label}
              value={holowareValues.processorNumber}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
        // />
      ) : id === "motherboard" ? (
        <Autocomplete
          options={getOptions("Motherboard")} // Update for motherboard
          onChange={(event, value) =>
            handleMotherBoardComponentChange(id, value)
          }
          value={formik.values[id] || null}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "chipset" ? (
        // <Autocomplete
        //   options={chipset.ChipSetOptions}
        //   onChange={(event, value) => formik.setFieldValue(id, value)}
        //   value={formik.values[id] || null}
        //   renderInput={(params) => (
           
        //   )}
        // />
        <TextField
        // {...params}
        fullWidth
        label={label}
        value={holowareValues.chipsetNumber}
        margin="normal"
        error={formik.touched[id] && Boolean(formik.errors[id])}
        helperText={formik.touched[id] && formik.errors[id]}
      />
      ) : id === "ramType" ? (
        <Autocomplete
          options={getOptions("RAM")}
          onChange={(event, value) =>
            handleRAMComponentChange("ramType", value)
          }
          value={formik.values[id] || null}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="RAM Type"
              margin="normal"
              error={formik.touched.ramType && Boolean(formik.errors.ramType)}
              helperText={formik.touched.ramType && formik.errors.ramType}
            />
          )}
        />
      ) : id === "ram" ? (
        // <Autocomplete
        //   options={ramval.ramOption}
        //   onChange={(event, value) => formik.setFieldValue(id, value)}
        //   value={formik.values[id] || null}
        //   renderInput={(params) => (
            
        //   )}
        // />
        <TextField
              // {...params}
              fullWidth
              label={label}
              margin="normal"
              value={holowareValues.ramSize}
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
      ) : id === "hddType" ? (
        <Autocomplete
          options={getOptions("HDD")}
          value={formik.values[id] || null}
          onChange={(event, value) => handleHDDComponentChange(id, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "hdd" ? (
        // <Autocomplete
        //   options={hddVal.hddOption}
        //   onChange={(event, value) => formik.setFieldValue(id, value)}
        //   value={formik.values[id] || null}
        //   renderInput={(params) => (
           
        //   )}
        // />
        <TextField
        // {...params}
        fullWidth
        label={label}
        margin="normal"
        error={formik.touched[id] && Boolean(formik.errors[id])}
        helperText={formik.touched[id] && formik.errors[id]}
      />
      ) : id === "ssdType" ? (
        <Autocomplete
          options={getOptions("SSD")}
          value={formik.values[id] || null}
          onChange={(event, value) => handleSSDComponentChange(id, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "ssd" ? (
        // <Autocomplete
        //   options={ssdval.ssdOptions}
        //   value={formik.values[id] || null}
        //   onChange={(event, value) => formik.setFieldValue(id, value)}
        //   renderInput={(params) => (
           
        //   )}
        // />
        <TextField
          // {...params}
          fullWidth
          label={label}
          value={holowareValues.totalSSDCapacity}
          margin="normal"
          error={formik.touched[id] && Boolean(formik.errors[id])}
          helperText={formik.touched[id] && formik.errors[id]}
        />
      ) : id === "osType" ? (
        <Autocomplete
          options={getOptions("Operating Systems")}
          value={formik.values[id] || null}
          onChange={(event, value) => handleOSComponentChange(id, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "os" ? (
        // <Autocomplete
        //   options={os.osOption}
        //   value={formik.values[id] || null}
        //   onChange={(event, value) => formik.setFieldValue(id, value)}
        //   renderInput={(params) => (
           
        //   )}
        // />
        <TextField
          // {...params}
          fullWidth
          label={label}
          value={holowareValues.operatingSystem}
          margin="normal"
          error={formik.touched[id] && Boolean(formik.errors[id])}
          helperText={formik.touched[id] && formik.errors[id]}
        />
      ) : id === "powerSupplyType" ? (
        <Autocomplete
          options={getOptions("Power Supply")}
          value={formik.values[id] || null}
          onChange={(event, value) => handleSMPSComponentChange(id, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "powerSupply" ? (
        <Autocomplete
          options={SMPS.smpsOption}
          value={formik.values[id] || null}
          onChange={(event, value) => formik.setFieldValue(id, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "graphics" ? (
        <Autocomplete
          options={getOptions("GRAPHICS")}
          value={formik.values[id] || null}
          onChange={(event, value) => handleGraphicsComponentChange(id, value)}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={label}
              margin="normal"
              error={formik.touched[id] && Boolean(formik.errors[id])}
              helperText={formik.touched[id] && formik.errors[id]}
            />
          )}
        />
      ) : id === "graphicsDescription" ? (
        // <Autocomplete
        //   options={graphics.graphicsOption}
        //   value={formik.values[id] || null}
        //   onChange={(event, value) => formik.setFieldValue(id, value)}
        //   renderInput={(params) => (
           
        //   )}
        // />
        <TextField
          // {...params}
          fullWidth
          label={label}
          value={holowareValues.graphicsType}
          margin="normal"
          error={formik.touched[id] && Boolean(formik.errors[id])}
          helperText={formik.touched[id] && formik.errors[id]}
        />
      ) : (
        <TextField
          fullWidth
          id={id}
          name={id}
          label={label}
          type={type}
          value={holowareValues.onSiteWarranty}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched[id] && Boolean(formik.errors[id])}
          helperText={formik.touched[id] && formik.errors[id]}
          margin="normal"
          InputLabelProps={{
            shrink: type === "date" ? true : undefined,
          }}
        />
      )}
    </Grid>
  );

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
          width: "30%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "0px 10px 0px 0px",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d6d6d6",
            borderRadius: "10px",
          },
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container sx={{ marginTop: "20px" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="tenderGemNumber"
                name="tenderGemNumber"
                label="Tender/GEM Number"
                type="text"
                value={formik.values.tenderGemNumber || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tenderGemNumber &&
                  Boolean(formik.errors.tenderGemNumber)
                }
                helperText={
                  formik.touched.tenderGemNumber &&
                  formik.errors.tenderGemNumber
                }
              />
            </Grid>
            {renderTextField("gemDate", "GEM Date", "date")} {/* Date Picker */}
            {/* {renderTextField("issuedBy", "Issued By")} */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="issuedBy"
                name="issuedBy"
                label="Issued By"
                type="text"
                value={formik.values.issuedBy || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.issuedBy && Boolean(formik.errors.issuedBy)
                }
                helperText={formik.touched.issuedBy && formik.errors.issuedBy}
              />
            </Grid>
            {renderTextField("providedBy", "Provided By")}
            {renderTextField("percentage", "Percentage")}
            {renderTextField("model", "Model")}
            {renderTextField("processor", "Processor", "text", "Processor")}
            {renderTextField("processorNumber", "Processor Number", "text")}
            {renderTextField(
              "motherboard",
              "Motherboard",
              "text",
              "Motherboard"
            )}
            {renderTextField("chipset", "Chipset", "text", "Chipset")}
            {renderTextField("ramType", "RAM Type", "text", "RamType")}
            {renderTextField("ram", "RAM", "text", "Ram")}
            {renderTextField("hddType", "HDD Type", "text", "hddType")}
            {renderTextField("hdd", "HDD", "text", "hdd")}
            {renderTextField("ssdType", "SSD Type", "text", "ssdType")}
            {renderTextField("ssd", "SSD", "text", "ssd")}
            {renderTextField("graphics", "Graphics", "text", "graphics")}
            {renderTextField("graphicsDescription", "Graphics Description")}
            {renderTextField("osType", "OS Type")}
            {renderTextField("os", "OS")}
            {renderTextField(
              "powerSupplyType",
              "Power Supply Type",
              "text",
              "powerSupply Type"
            )}
            {renderTextField(
              "powerSupply",
              "Power Supply",
              "text",
              "powerSupply"
            )}
            {renderTextField("warrantyYear", "Warranty Year")}
          </Grid>
          {/* <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
            Submit
          </Button> */}
        </form>
      </Box>
      <Box
        sx={{
          width: "70%",
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
        <div ref={contentRef}>
          <Box textAlign="center">
            <img src={HolowareLogo} alt="Holoware Logo" width="35%" />
            <Divider sx={{ borderColor: "#000", borderWidth: "2px" }} />
          </Box>

          <Box mt={2} textAlign="left">
            <Typography sx={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
              REGISTERED ADDRESS:- SN Tower, No.14, Rottu Street, Near Selva
              Vinayagar Temple, Moondramkattalai, Chennai - 600128
            </Typography>
          </Box>

          <Box textAlign="left">
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              <b>E-mail: info@holoware.co</b>
            </Typography>
          </Box>

          <Box textAlign="left">
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                fontWeight: 600,
                marginTop: 2,
              }}
            >
              <b>GSTIN- 33AAECJ8741L1Z9</b>
            </Typography>
          </Box>

          <Box textAlign="center">
            <img
              src={Madeinindialogo}
              alt="Holoware Logo"
              style={{ width: "250px" }}
            />
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography sx={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
              DECLARATION CERTIFICATE FOR LOCAL CONTENT
            </Typography>
          </Box>

          <Box mt={5} display="flex" justifyContent="space-between">
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              <b>IN RESPECT Tender/GEM No:</b> {gemNumber || "{ gemNumber }"}{" "}
              <span style={{ padding: "50px" }}>
                <b>Dated: </b>
                {formik.values.gemDate || "{date}"}
              </span>
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: 14, color: "#000", paddingTop: "15px" }}
            >
              <b>Issued to :</b> {formik.values.issuedBy || "{issued by}"}
            </Typography>
          </Box>

          <Box my={3}>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              I, the undersigned, Mr. Udhaya Prakash S do hereby declare, in my
              capacity as {"provided"} of Jaikrishna Technology Private Limited
              the following:
            </Typography>
          </Box>

          <Box my={3}>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              (a) The facts contained herein are within my own personal
              knowledge.
            </Typography>
          </Box>

          <Box my={3}>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              (b) I have read and understood the requirement of local content
              (LC) and the same is specified as percentage calculated in
              accordance with the definition provided at clause 2 of revised
              Public Procurement (preference to Make in India) Order 2017.
            </Typography>
          </Box>

          <Box my={3}>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              “Local content” as per above order means the amount of value added
              in India which shall be the total value of items procured
              (excluding net domestic indirect taxes) minus the value of
              imported content in the item (including all customs duties) as a
              proportion of the total value in percent.”
            </Typography>
          </Box>

          <Box my={3}>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              (c) I have satisfied myself that the goods/services/works to be
              delivered in terms of the above specified bid comply with the
              local content requirements as specified in the tender for ‘Class-
              I Local Supplier’ / ‘Class-II Local Supplier’, and as above.
            </Typography>
          </Box>

          <Box my={2}>
            <Typography sx={{ fontSize: 14, color: "#000", paddingBottom: 2 }}>
              (d) Public Procurement (preference to Make in India) Order 2017
            </Typography>
          </Box>

          {/* Table content */}
          <TableContainer>
            <Table aria-label="simple table" sx={{ border: "2px solid black" }}>
              <TableCell sx={{ borderRadius: "0px" }}>1.</TableCell>
              <TableCell
                className="table"
                sx={{
                  borderRadius: "0px",
                  border: "1px solid black",
                }}
              >
                <Typography sx={{ fontSize: 14, color: "#000" }}>
                  <p>Select one of the following only.</p>
                  <p>
                    1) Class-I Local Supplier{" "}
                    {formik.values.percentage ? (
                      formik.values.percentage > 50 ? (
                        <b>✓</b>
                      ) : (
                        <i>-Nil-</i>
                      )
                    ) : null}
                  </p>
                  <p>
                    2) Class-II Local Supplier{" "}
                    {formik.values.percentage ? (
                      formik.values.percentage < 50 ? (
                        <b>✓</b>
                      ) : (
                        <i>-Nil-</i>
                      )
                    ) : null}
                  </p>
                  <p>
                    (Note: Class-II local supplier means a supplier or service
                    provider, whose goods, services or works offered for
                    procurement, has content more than 20% but less than 50%, as
                    defined under this order. If local content is more than or
                    equal to 50% then it is a class-I local supplier.)
                  </p>
                </Typography>
              </TableCell>
            </Table>
          </TableContainer>

          <Box mt={70}>
            <Typography sx={{ fontSize: 14, color: "#000", paddingBottom: 2 }}>
              (e) The local content calculated using the definition given above
              are as under:
            </Typography>
          </Box>

          {/* Table content */}
          <TableContainer
            sx={{
              border: "1px solid black",
              borderRadius: "0px",
              marginTop: 2,
            }}
          >
            <Table sx={{ border: "1px solid black", borderRadius: "0px" }}>
              <TableRow sx={{ border: "1px solid black", borderRadius: "0px" }}>
                <TableCell
                  sx={{ border: "1px solid black", borderRadius: "0px" }}
                >
                  <Typography sx={{ fontSize: 14, color: "#000" }}></Typography>
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  <Typography sx={{ fontSize: 14, color: "#000" }}>
                    Local content calculated as above%(100%)
                  </Typography>
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  <Typography sx={{ fontSize: 14, color: "#000" }}>
                    Location of value addition (Location shall be the specified
                    name of city or district, etc.Location as name of country
                    will beconsidered as ambiguous and suchbids shall be
                    rejected)
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ border: "1px solid black" }}>
                  <Typography sx={{ fontSize: 14, color: "#000" }}>
                    <b>
                      {" "}
                      {formik.values
                        ? formik.values.processor
                        : "{Processor}"}{" "}
                      {formik.values
                        ? formik.values.processorNumber
                        : "{Processornumber}"}{" "}
                      | {formik.values ? formik.values.ram : "{ram storage}"}{" "}
                      {formik.values ? formik.values.ramType : "{ram type}"}{" "}
                      RAM|
                      {formik.values
                        ? formik.values.hdd === "No HDD"
                          ? null
                          : formik.values.hdd
                        : "{hdd}"}{" "}
                      {formik.values &&
                      formik.values.hdd !== "No HDD" &&
                      formik.values.ssd !== "No SSD"
                        ? "+"
                        : ""}{" "}
                      {formik.values
                        ? formik.values.ssdStorage
                        : "{ssd storage}"}{" "}
                      {formik.values
                        ? formik.values.ssd === "No SSD"
                          ? null
                          : formik.values.ssd
                        : "{Processor}"}{" "}
                      |
                      {formik.values ? (
                        formik.values.graphics === "Integrated" ? (
                          "Integrated"
                        ) : formik.values ? (
                          formik.values.graphics === "Dedicated" ? (
                            <>
                              {formik.values.graphicsDescription}{" "}
                              {formik.values.graphicsDescription}
                            </>
                          ) : null
                        ) : null
                      ) : null}
                      |
                      {formik.values ? formik.values.osType : "{windows type }"}
                      |
                      {formik.values
                        ? formik.values.motherboard
                        : "{mother board}"}
                      |
                      {formik.values
                        ? formik.values.powerSupply
                        : "{Power Supply}"}
                      W|
                      {formik.values
                        ? formik.values.warrantyYear
                        : "{year of warranty }"}{" "}
                      Onsite Warranty
                    </b>
                  </Typography>
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  <Typography sx={{ fontSize: 14, color: "#000" }}>
                    {formik.values.percentage ? formik.values.percentage : null}
                    %
                  </Typography>
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  <Typography sx={{ fontSize: 14, color: "#000" }}>
                    Chennai
                  </Typography>
                </TableCell>
              </TableRow>
            </Table>
          </TableContainer>

          <Box mt={2}>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              Yours Sincerely,
            </Typography>
          </Box>
        

          <Box>
            <Typography sx={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
              For Holoware (A Unit of Jaikrishna Technology Private Limited),
            </Typography>
          </Box>

          {/* <Box>
            <img src={"UdhayaSign"} alt="User Sign" width="30%" my={2} />
          </Box> */}

          <Box>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              Udhaya Prakash S
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              Product Manager (GEM)
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              Chennai - TN- India
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              Tel: 1800-572-5882
            </Typography>
          </Box>

          <Box mt={5} textAlign="center">
            <Divider sx={{ borderColor: "#000", borderWidth: "2px" }} />
            <Typography sx={{ fontSize: 14, color: "#000", mt: 2 }}>
              HOLOWARE - a unit of JaiKrishna Technology Private Limited
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              SN Tower, No.14, Rottu Street, Near Selva Vinayagar Temple,
              Moondramkattalai, Chennai - 600128
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#000", mb: 2 }}>
              Web: www.holoware.co Phone: 1800-572-5882
            </Typography>
          </Box>
        </div>

        <div style={{ textAlign: "end" }}>
          <Button
            onClick={() => {
              setMIIData(formik.values);
              handleBack();
            }}
            variant="outlined"
            sx={{ marginTop: 2, marginRight: 2 }}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              generatePDF(); // Download the content as PDF
              // Move to the next step
            }}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            // disabled={!(formik.isValid && formik.dirty)}
          >
            Next
          </Button>
        </div>
      </Box>

      
    </div>
  );
}
