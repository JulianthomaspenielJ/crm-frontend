import React, { useRef,useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import HolowareLogo from "../../Image/HWLogo.png";
import AuthService from "../../services/AuthService";
import html2pdf from "html2pdf.js";

// Function to convert numbers to words (Indian number system)
const numberToWords = (num) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const getTens = (n) => {
    if (n < 20) {
      return ones[n];
    } else {
      return tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + ones[n % 10] : "");
    }
  };

  const convert = (n) => {
    if (n === 0) return "zero";

    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const hundred = Math.floor((n % 1000) / 100);
    const remainder = n % 100;

    let words = "";

    if (crore > 0) {
      words += convert(crore) + " Crore ";
    }
    if (lakh > 0) {
      words += convert(lakh) + " Lakh ";
    }
    if (thousand > 0) {
      words += convert(thousand) + " Thousand ";
    }
    if (hundred > 0) {
      words += convert(hundred) + " Hundred ";
    }
    if (remainder > 0) {
      words += (words !== "" ? "and " : "") + getTens(remainder);
    }

    return words.trim();
  };

  return convert(num);
};

export default function MRPCertificate({
  handleNext,
  handleBack,
  gemNumber,
  MRPData,
  setMRPData,
  setMRPCertificatee,
  pricingAmount,
  modelNumber
}) {
  const contentRef = useRef();


  
  // Yup validation schema
  const validationSchema = Yup.object({
    modelNumber: Yup.string().required("Model number is required"),
    Amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      modelNumber: MRPData.modelNumber ||modelNumber|| "",
      Amount:  Math.floor(Number(pricingAmount)) || 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
    },
  });

  // PDF download logic
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
        setMRPCertificatee(url); // Save the Blob URL in state
      })
      .then(() => {
        // Handle any actions after PDF generation
        formik.handleSubmit();
        formik.values.tenderGemNumber = gemNumber; // Assuming gemNumber is defined in your scope
        setMRPData(formik.values);
        handleNext(); // Assuming handleNext is defined
      });
  };

  setMRPData(formik.values);

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
      {/* Left side form */}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="modelNumber"
                name="modelNumber"
                sx={{ marginTop: 2 }}
                label="Model Number"
                value={formik.values.modelNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.modelNumber &&
                  Boolean(formik.errors.modelNumber)
                }
                helperText={
                  formik.touched.modelNumber && formik.errors.modelNumber
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="Amount"
                name="Amount"
                label="Amount INR"
                type="number"
                value={formik.values.Amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Amount && Boolean(formik.errors.Amount)}
                helperText={formik.touched.Amount && formik.errors.Amount}
              />
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Right side preview */}
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
              fontSize: 14,
              fontWeight: 600,
              marginTop: "10px",
              marginBottom: "35px",
              textAlign: "center",
            }}
          >
            TO WHOMSOEVER IT MAY CONCERN
          </Typography>

          <Box my={3} textAlign="justify">
            <Typography sx={{ fontSize: 14 }}>
              This is to confirm that we{" "}
              <b>JaiKrishna Technology Private Limited</b> are OEM of{" "}
              <b>
                <u>HOLOWARE</u>
              </b>{" "}
              brand.
            </Typography>
          </Box>

          <Box my={3} textAlign="justify">
            <Typography sx={{ fontSize: 14 }}>
              We hereby certify that the MRP for the product having model number{" "}
              <b>{formik.values.modelNumber}</b> (Product model number to be
              specified in “Model” ﬁeld on GEM during catalog upload) of the
              brand mentioned above is INR <b>{formik.values.Amount}</b> (
              {numberToWords(formik.values.Amount)}) only. This MRP is
              applicable to this model of the product only.
            </Typography>
          </Box>

          {/* Signature & Footer */}
          <Box my={3} textAlign="justify">
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
            // disabled={!(formik.isValid && formik.dirty)}
          >
            Next
          </Button>
        </div>
      </Box>
    </div>
  );
}
