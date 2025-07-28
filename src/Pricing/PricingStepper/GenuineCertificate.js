import React, { useRef } from "react";
import {
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
import html2pdf from "html2pdf.js";

export default function GenuineCertificate({
  handleNext,
  handleBack,
  gemNumber,
  GenuineData,
  setGenuineData,
  setGenuineCertificatee,GEMDate
}) {
  const CRMBaseURL = AuthService();
  const contentRef = useRef();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  // Validation schema using Yup
  const validationSchema = Yup.object({
    tenderGemNumber: Yup.string().required("Tender/GEM number is required"),
    gemDate: Yup.date().required("GEM date is required").nullable(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      tenderGemNumber: GenuineData.tenderGemNumber || gemNumber || "", // default to gemNumber prop
      gemDate: GenuineData.gemDate ||(GEMDate !== "N/A" && new Date(GEMDate)) || null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
    },
  });

  // Function to download the certificate as a PDF
  const downloadPDF = async () => {
    const element = contentRef.current; // The element you want to convert to PDF

    // Options for pdf generation
    const options = {
      margin: [0.4, 0.5, 0, 0.7],
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
        setGenuineCertificatee(url); // Save the Blob URL in state
      })
      .then(() => {
        // Handle any actions after PDF generation
        formik.handleSubmit();
        formik.values.tenderGemNumber = gemNumber; // Assuming gemNumber is defined in your scope
        setGenuineData(formik.values);
        handleNext(); // Assuming handleNext is defined
      });
  };

  setGenuineData(formik.values);

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
      {/* Left Form Section */}
      <Box
        sx={{
          width: "30%",
          height: "100%",
          overflowY: "auto",
          paddingRight: "10px",
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
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                id="tenderGemNumber"
                name="tenderGemNumber"
                label="Tender/GEM Number"
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
                onChange={(e) =>
                  formik.setFieldValue("gemDate", new Date(e.target.value))
                }
                onBlur={formik.handleBlur}
                error={formik.touched.gemDate && Boolean(formik.errors.gemDate)}
                helperText={formik.touched.gemDate && formik.errors.gemDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Right Certificate Preview Section */}
      <Box
        sx={{
          width: "70%",
          height: "100%",
          overflowY: "auto",
          padding: "0px 10px",
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
            <img src={HolowareLogo} alt="Holoware Logo" width="35%" />
            <Divider
              sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
            />
          </div>

          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              marginTop: "10px",
              marginBottom: "35px",
              textAlign: "center",
            }}
          >
            <u>TO WHOMSOEVER IT MAY CONCERN</u>
          </Typography>

          {/* Tender Info */}
          <Box
            display="flex"
            sx={{ padding: "0px 10px 10px 20px", fontWeight: "bold" }}
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, paddingRight: "5px" }}
            >
              Sub:
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              Microsoft Windows Certification
            </Typography>
          </Box>
          <Box display="flex" sx={{ padding: "0px 10px 10px 20px" }}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, paddingRight: "5px" }}
            >
              Gem Number:
            </Typography>
            <Typography sx={{ fontSize: 14 }}>{gemNumber}</Typography>
          </Box>
          <Box display="flex" sx={{ padding: "0px 10px 10px 20px" }}>
            <Typography
              sx={{ fontSize: 14, fontWeight: 600, paddingRight: "5px" }}
            >
              Dated:
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              {formik.values.gemDate
                ? formik.values.gemDate.toLocaleDateString()
                : ""}
            </Typography>
          </Box>

          {/* Warranty Content */}
          <Box my={3} textAlign="justify" pl={2.5}>
            <Typography sx={{ fontSize: 16 }}>
              We Holoware hearby declares that windows offered in the current
              specification, will be preinstalled at Holoware factor and 100%
              genuine Microsoft Product.
            </Typography>
          </Box>

          {/* Signature & Footer */}
          <Box my={3} textAlign="justify" pl={2.5}>
            <Typography sx={{ fontSize: 14 }}>Yours Sincerely,</Typography>
            {/* <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Udhaya Prakash S
            </Typography> */}
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              For Holoware (A Unit of Jaikrishna Technology Private Limited),
            </Typography>
            <Box my={4}>
              <Typography sx={{ fontSize: 14 }}>Udhaya Prakash S</Typography>
              <Typography sx={{ fontSize: 14 }}>
                Product Manager (GEM)
              </Typography>
              <Typography sx={{ fontSize: 14 }}>Chennai - TN- India</Typography>
              <Typography sx={{ fontSize: 14 }}>Tel: 1800-572-5882</Typography>
            </Box>
            <Divider
              sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
            />
            <Box textAlign="center">
              <Typography sx={{ fontSize: 14 }}>
                HOLOWARE - a unit of JaiKrishna Technology Private Limited
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                SN Tower, No.14, Rottu Street, Near Selva Vinayagar Temple,
                Moondramkattalai, Chennai - 600128
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                Web: www.holoware.co Phone: 1800-572-5882
              </Typography>
            </Box>
          </Box>
        </div>

        {/* Back & Next Button */}
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
            onClick={downloadPDF}
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
