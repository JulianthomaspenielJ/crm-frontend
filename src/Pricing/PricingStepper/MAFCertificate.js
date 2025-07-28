import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import HolowareLogo from "../../Image/HWLogo.png";
import AuthService from "../../services/AuthService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { values } from "pdf-lib";
import html2pdf from "html2pdf.js";

export default function MAFCertificate({
  handleNext,
  handleBack,
  gemNumber,
  MAFData,
  setMAFData,
  setMAFCertificatee,
  holowareValues,
  partnerName,
  partnerAddress,
  product,
  GEMDate,
}) {
  const CRMBaseURL = AuthService();
  const contentRef = useRef(); // Create a ref to the content to be downloaded
  const [partnerOptions, setPartnerOptions] = useState([]);
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const validationSchema = Yup.object({
    partnerName: Yup.string().required("Partner name is required"),
    partnerAddress: Yup.string(), // Address is NOT required
    tenderGemNumber: Yup.string().required("Tender/GEM number is required"),
    gemDate: Yup.date().required("GEM date is required").nullable(),
    warrantyYear: Yup.string().required("Warranty Year is required"),
    supplyProduct: Yup.string().required("Supply product is required"),
  });

  const formik = useFormik({
    initialValues: {
      partnerName: MAFData.partnerName || partnerName || "",
      partnerAddress: MAFData.partnerAddress || partnerAddress || "",
      tenderGemNumber: MAFData.tenderGemNumber || gemNumber || "",
      gemDate:
        MAFData.gemDate || (GEMDate !== "N/A" && new Date(GEMDate)) || null,
      warrantyYear: MAFData.warrantyYear || "",
      supplyProduct: MAFData.supplyProduct || product || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("values", values);
    },
  });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await CRMBaseURL.get("getpartnerlist");
        const data = response.data.partners;
        setPartnerOptions(data); // Populate the Autocomplete options
      } catch (err) {
        console.error("Error fetching partner data:", err);
      }
    };
    fetchPartner();
  }, []);

  const downloadPDF = () => {
    const element = contentRef.current;

    const options = {
      margin: [0.1, 0.2, 0, 0.4],
      filename: "MAF_certificate.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(options)
      .outputPdf("blob") // Output as Blob
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setMAFCertificatee(url);
      })
      .then(() => {
        formik.handleSubmit();
        formik.values.tenderGemNumber = gemNumber;
        setMAFData(formik.values);
        handleNext();
      });
  };
  setMAFData(formik.values);

  useEffect(() => {
    if (holowareValues.onSiteWarranty) {
      const warrantyYears = parseInt(holowareValues.onSiteWarranty, 10);
      const warrantyValue =
        warrantyYears === 1 ? "1 Year" : `${warrantyYears} Years`;

      formik.setFieldValue("warrantyYear", warrantyValue);
    }
  }, [holowareValues]);

  useEffect(() => {
    if (MAFData) {
      const value = {
        address: MAFData.partnerAddress,
        partner: MAFData.partnerName,
      };
      handlePartnerChange("nil", value);
    }
  }, [MAFData]);

  const [isAddressEditable, setIsAddressEditable] = useState(true); // State to control address field editability

  const handlePartnerChange = (event, value) => {
    if (value) {
      // When a partner is selected, update the address and make it non-editable
      formik.setFieldValue("partnerName", value.partner);
      formik.setFieldValue("partnerAddress", value.address || ""); // Assuming 'address' is the field for partner address
      setIsAddressEditable(false); // Disable editing of the address field
    } else {
      // If no partner is selected, clear the address and allow editing
      formik.setFieldValue("partnerName", "");
      formik.setFieldValue("partnerAddress", "");
      setIsAddressEditable(true); // Enable editing of the address field
    }
  };

  const renderTextField = (id, label, type = "text", options = null) => (
    <Grid item xs={12}>
      <TextField
        fullWidth
        id={id}
        name={id}
        label={label}
        select={Boolean(options)}
        value={formik.values[id]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[id] && Boolean(formik.errors[id])}
        helperText={formik.touched[id] && formik.errors[id]}
        margin="normal"
        InputLabelProps={{
          shrink: type === "date" ? true : undefined,
        }}
      >
        {options &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </TextField>
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
            width: "4px", // Adjust the width of the scrollbar
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d6d6d6",
            borderRadius: "10px",
          },
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <TextField
                label="Partner Name"
                variant="outlined"
                value={formik.values.partnerName}
                onChange={(event) => {
                  formik.setFieldValue("partnerName", event.target.value);
                }}
                error={
                  formik.touched.partnerName &&
                  Boolean(formik.errors.partnerName)
                }
                helperText={
                  formik.touched.partnerName && formik.errors.partnerName
                }
                margin="normal"
                fullWidth
              />
              {/* <Autocomplete
                options={partnerOptions || []}
                getOptionLabel={(option) => option.partner || ""}
                value={
                  partnerOptions.find(
                    (option) => option.partner === formik.values.partnerName
                  ) || null
                } // Pre-select the saved partner
                onChange={handlePartnerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Partner Name"
                    variant="outlined"
                    error={
                      formik.touched.partnerName &&
                      Boolean(formik.errors.partnerName)
                    }
                    helperText={
                      formik.touched.partnerName && formik.errors.partnerName
                    }
                    margin="normal"
                    fullWidth
                  />
                )}
              /> */}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="partnerAddress"
                name="partnerAddress"
                label="Partner Address"
                type="text"
                value={formik.values.partnerAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.partnerAddress &&
                  Boolean(formik.errors.partnerAddress)
                }
                helperText={
                  formik.touched.partnerAddress && formik.errors.partnerAddress
                }
                margin="normal"
                disabled={!isAddressEditable} // Dynamically disable the field
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="tenderGemNumber"
                name="tenderGemNumber"
                label="Tender/GEM Number"
                type="text"
                variant="outlined"
                value={formik.values.tenderGemNumber}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="warrantyYear"
                name="warrantyYear"
                label="Warranty Year"
                type="text"
                value={formik.values.warrantyYear}
                margin="normal"
              />
            </Grid>
            {renderTextField("supplyProduct", "Supply Product")}
          </Grid>
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
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d6d6d6",
            borderRadius: "10px",
          },
        }}
      >
        <div ref={contentRef}>
          <div style={{ textAlign: "center" }}>
            <img src={HolowareLogo} alt="Holoware Logo" width="35%" mr={2} />
            <Divider
              sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
            />
          </div>
          <div>
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                fontWeight: 600,
                padding: "10px 10px 10px 20px",
              }}
            >
              Sub: OEM Authorization Letter
            </Typography>
            <Box display="flex" sx={{ padding: "0px 10px 10px 20px" }}>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#000",
                  fontWeight: 600,
                  paddingRight: "5px",
                }}
              >
                Tender/GEM Number:
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
                {gemNumber}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#000",
                  fontWeight: 600,
                  paddingLeft: "20px",
                  paddingRight: "5px",
                }}
              >
                Dated :{" "}
                {formik.values.gemDate
                  ? formik.values.gemDate.toLocaleDateString()
                  : ""}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                lineHeight: 2,
                paddingLeft: 2,
              }}
            >
              This is to certify that the <b>{formik.values.partnerName},</b>
              {formik.values.partnerAddress} is representing us, i.e.,
              Jaikrishna Technology Private Limited for the{" "}
              <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
                Supply of {formik.values.supplyProduct}
              </span>{" "}
              for the above referred{" "}
              <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
                Tender/GEM Number:
              </span>{" "}
              {gemNumber}{" "}
              <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
                {"  "} Dated:
              </span>{" "}
              {formik.values.gemDate
                ? formik.values.gemDate.toLocaleDateString()
                : ""}
            </Typography>

            <Box my={3} textAlign="justify">
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#000",
                  paddingLeft: 2,
                  lineHeight: 2,
                }}
              >
                Where as Jaikrishna Technology Private Limited, who are official
                producers of{" "}
                <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
                  The Supply of Desktops, Workstations, All In One PCs, Laptops
                  & Tablets
                </span>{" "}
                and having production facilities at SN Tower, No.14, Rottu
                Street, Near Selva Vinayagar Temple, Moondramkattalai, Chennai -
                600128 Tel: 1800-572-5882 do hereby authorize the{" "}
                <b>{formik.values.partnerName}</b>,{" "}
                {formik.values.partnerAddress} (hereinafter, the “Bidder”) to
                submit a bid of the following Products produced by us, for the
                Supply and Technical Support Requirements during execution
                period and after sales, service up to{" "}
                <b>minimum {formik.values.warrantyYear}</b> from the date of
                completion of work.
              </Typography>
            </Box>
            <Box my={3} textAlign="justify">
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#000",
                  paddingLeft: 2,
                  lineHeight: 2,
                }}
              >
                We assure you that in the event of not being able to fulfil its
                obligation as our Service Provider in respect of our standard
                Warranty Terms we would continue to meet our Warranty Terms as
                prescribed in the terms.
              </Typography>
            </Box>
            <Box my={3} textAlign="justify">
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#000",
                  paddingLeft: 2,
                  lineHeight: 2,
                }}
              >
                We confirm the technical compliance submitted by the has been
                duly endorsed by us with stamp and signature.
              </Typography>
            </Box>
            <Box my={3} textAlign="justify">
              <Typography
                sx={{
                  fontSize: 14,
                  color: "#000",
                  paddingLeft: 2,
                  lineHeight: 2,
                }}
              >
                Yours Sincerely,
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "#000",
                  fontWeight: 600,
                  paddingLeft: 2,
                }}
              >
                For Holoware (A Unit of Jaikrishna Technology Private Limited),
              </Typography>
              <Box my={4}>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#000",
                    paddingLeft: 2,
                    lineHeight: 2,
                  }}
                >
                  Udhaya Prakash S
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#000",
                    paddingLeft: 2,
                    lineHeight: 2,
                  }}
                >
                  Product Manager (GEM)
                </Typography>{" "}
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#000",
                    paddingLeft: 2,
                    lineHeight: 2,
                  }}
                >
                  Chennai - TN- India
                </Typography>{" "}
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#000",
                    paddingLeft: 2,
                    lineHeight: 2,
                  }}
                >
                  Tel: 1800-572-5882
                </Typography>
              </Box>
              <Divider
                sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
              />
              <Box my={4} sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#000",
                    paddingLeft: 2,
                    lineHeight: 2,
                  }}
                >
                  HOLOWARE - a unit of JaiKrishna Technology Private Limited
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#000",
                    paddingLeft: 2,
                    lineHeight: 2,
                  }}
                >
                  SN Tower, No.14, Rottu Street, Near Selva Vinayagar Temple,
                  Moondramkattalai, Chennai - 600128
                </Typography>{" "}
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#000",
                    paddingLeft: 2,
                    lineHeight: 2,
                  }}
                >
                  Web: www.holoware.co Phone: 1800-572-5882
                </Typography>{" "}
              </Box>
            </Box>
          </div>
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
            onClick={handleBack}
            variant="outlined"
            sx={{ marginTop: 2, marginRight: 2 }}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={() => {
              downloadPDF(); // Download the content as PDF
              // Move to the next step
            }}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Next
          </Button>
        </div>
      </Box>
    </div>
  );
}
