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
import Madeinindialogo from "../../Image/madeinindia.png";
import html2pdf from "html2pdf.js";

export default function MIICertificate({
  handleNext,
  handleBack,
  gemNumber,
  MIIData,
  setMIIData,
  setMIICertificatee,
  holowareValues,
  CustomerName,
  GEMDate,
}) {
  const CRMBaseURL = AuthService();
  const contentRef = useRef();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const IssueBy = storedUserData && `${storedUserData.userName}`;
  const [productData, setProductData] = useState([]);
  const [warrantyValue, setWarrantyValue] = useState("");
  const [componentDetails, setComponentDetails] = useState({
    processorNumberOptions: [],
  });
  
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
    
    warrantyYear: Yup.string().required("Warranty Year is required"),
  });

  const formik = useFormik({
    initialValues: {
      tenderGemNumber: gemNumber,
      gemDate:(GEMDate !== "N/A" && new Date(GEMDate))|| null,
      issuedBy: CustomerName||"",
      providedBy: "",
      percentage: "51",
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
      console.log("values", values);
    },
  });

  useEffect(() => {
    if (!MIIData || Object.keys(MIIData).length === 0) return; 
    // Restore form values from MIIData
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

  useEffect(() => {
    if (holowareValues) {
      formik.setFieldValue("processorNumber", holowareValues.processorNumber || "");
      formik.setFieldValue("chipset", holowareValues.chipsetNumber || "");
      formik.setFieldValue("ram", holowareValues.ramSize || "");
      formik.setFieldValue("hdd", holowareValues.totalHDDCapacity || "");
      formik.setFieldValue("ssd", holowareValues.totalSSDCapacity || "");
      formik.setFieldValue("graphicsDescription", holowareValues.graphicsType || "");
      formik.setFieldValue("os", holowareValues.operatingSystem || "");
      const warrantyYears = parseInt(holowareValues.onSiteWarranty, 10);
      const warrantyValue = warrantyYears === 1 ? "1 Year" : `${warrantyYears} Years`;
      formik.setFieldValue("warrantyYear", warrantyValue || "");
      setWarrantyValue(warrantyValue);
    }
  }, [holowareValues]);  // Watch holowareValues
  

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
    const fetchComponents = async () => {
      try {
        const response = await CRMBaseURL.get("getcomponentlist");
        const userData = response.data.components;
        setProductData(userData);
      } catch (err) {
        console.error("Error occurred", err);
      }
    };
    fetchComponents();
 
  }, []);

  const renderNormalTextField = (id, label, type = "text", componentName) => (
    <Grid item xs={12}>
      <TextField
        fullWidth
        id={id}
        name={id}
        label={label}
        type={type}
        value={formik.values[id] || ""} // Bind to formik.values
        onChange={formik.handleChange}  // Let formik handle onChange
        onBlur={formik.handleBlur}
        error={formik.touched[id] && Boolean(formik.errors[id])}
        helperText={formik.touched[id] && formik.errors[id]}
        margin="normal"
        InputLabelProps={{
          shrink: type === "date" ? true : undefined,
        }}
      />
    </Grid>
  );
  
  const renderTextField = (id, label, type = "text", componentName) => (
    <Grid item xs={12}>
      {id === "powerSupplyType" ? (
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
      ) : (
        <TextField
          fullWidth
          id={id}
          name={id}
          label={label}
          type={type}
          value={formik.values[id]}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="gemDate"
                name="gemDate"
                label="GEM Date"
                type="date"
                value={
                  formik.values.gemDate
                    ? formik.values.gemDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  formik.setFieldValue("gemDate", date);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.gemDate && Boolean(formik.errors.gemDate)}
                helperText={formik.touched.gemDate && formik.errors.gemDate}
                margin="normal"
                InputLabelProps={{
                  shrink: true, // Keep the label above the input for date
                }}
              />
            </Grid>
            {/* {renderTextField("issuedBy", "Issued By")} */}
            <Grid item xs={12} my={2}>
              <TextField
                fullWidth
                id="issuedBy"
                name="issuedBy"
                label="Issued To"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="providedBy"
                name="providedBy"
                label="Provided By"
                type="text"
                value={"Udhaya Prakash"}
                // value={formik.values.issuedBy || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.providedBy && Boolean(formik.errors.providedBy)
                }
                helperText={
                  formik.touched.providedBy && formik.errors.providedBy
                }
              />
            </Grid>
            {/* {renderTextField("providedBy", "Provided By")} */}
            {renderNormalTextField("percentage", "Percentage")}
            {renderNormalTextField("model", "Model", "text")}
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
            {/* {renderTextField("processor", "Processor", "text", "Processor")} */}
            {renderNormalTextField("processorNumber", "Processor Number", "text")}
            {/* {renderTextField(
              "motherboard",
              "Motherboard",
              "text",
              "Motherboard"
            )} */}
            {renderNormalTextField("chipset", "Chipset", "text", "Chipset")}
            {/* {renderTextField("ramType", "RAM Type", "text", "RamType")} */}
            {renderNormalTextField("ram", "RAM", "text", "Ram")}
            {/* {renderTextField("hddType", "HDD Type", "text", "hddType")} */}
            {renderNormalTextField("hdd", "HDD", "text", "hdd")}
            {/* {renderTextField("ssdType", "SSD Type", "text", "ssdType")} */}
            {renderNormalTextField("ssd", "SSD", "text", "ssd")}
            {/* {renderTextField("graphics", "Graphics", "text", "graphics")} */}
            {renderNormalTextField("graphicsDescription", "Graphics Description")}
            {/* {renderTextField("osType", "OS Type")} */}
            {renderNormalTextField("os", "OS")}
           
            {renderNormalTextField("warrantyYear", "Warranty Year", "text")}
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
                {formik.values.gemDate
                  ? formik.values.gemDate.toLocaleDateString()
                  : ""}
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
                      {formik.values.processorNumber}| {" "}
                      {formik.values.ram} RAM | {" "}
                      {(formik.values.hdd > 0 || formik.values.ssd > 0) && (
                        <div>
                          {formik.values.hdd > 0 && (
                            <span>{formik.values.hdd} GB HDD | </span> 
                          )}
                          {formik.values.ssd > 0 && (
                            <span>{formik.values.ssd} GB SSD | </span>
                          )}
                        </div>
                      )}
                      {formik.values.powerSupply} | {" "}
                      {formik.values.graphicsDescription} |{" "}
                      {formik.values.os} | {formik.values.warrantyYear} Onsite
                      Warranty
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
            onClick={handleNext}
            variant="outlined"
            sx={{ marginTop: 2, marginRight: 2 }}
          >
            Skip
          </Button>
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
