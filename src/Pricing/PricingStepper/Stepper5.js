import { Box, Button, Typography, IconButton, Grid } from "@mui/material";
import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PublishIcon from "@mui/icons-material/Publish";

export default function Stepper5({
  handleNext,
  pdfPreviewUrlsGEM,
  setPdfPreviewUrlsGEM,
  setAllQuotation,
  handleBack,
  dataSheet,
  pdfBlobUrl,
  MAFCertificatee,
  MIICertificatee,
  warrantyCertificate,
  GenuineCertificatee,
  MRPCertificatee,
  complianceCertificate
}) {
  const [pdfBase64s, setPdfBase64s] = useState([]);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);

  const handleFileChange = (event) => {

    const files = Array.from(event.target.files);
    if (pdfPreviewUrlsGEM.length + files.length > 10) {
      alert("You can only upload a maximum of 10 files.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setPdfBase64s((prevBase64s) => [...prevBase64s, base64]);
      };
      reader.readAsDataURL(file);

      const previewUrl = URL.createObjectURL(file);
      setPdfPreviewUrlsGEM((prevUrls) => [...prevUrls, previewUrl]);

    });
  };

  const handleRemoveFile = (index) => {
    if (pdfPreviewUrlsGEM[index]) {
      URL.revokeObjectURL(pdfPreviewUrlsGEM[index]);
    }
    setPdfPreviewUrlsGEM((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setPdfBase64s((prevBase64s) => prevBase64s.filter((_, i) => i !== index));
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prevIndex) =>
      prevIndex < pdfPreviewUrlsGEM.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  return (
    <Box
      sx={{
        paddingTop: 2,
        paddingX: 5,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d6d6d6",
          borderRadius: "10px",
        },
      }}
    >
      <Grid item xs={12}>
        {pdfPreviewUrlsGEM.length > 0 ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Button
                onClick={handlePreviousPdf}
                disabled={currentPdfIndex === 0}
                startIcon={<ArrowBackIosIcon />}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>
                  Quotation {currentPdfIndex + 1} of {pdfPreviewUrlsGEM.length}:
                </strong>
                <IconButton
                  sx={{ fontSize: 20, color: "#322E6F", ml: 1 }}
                  onClick={() => handleRemoveFile(currentPdfIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
              <Button
                onClick={handleNextPdf}
                disabled={currentPdfIndex === pdfPreviewUrlsGEM.length - 1}
                endIcon={<ArrowForwardIosIcon />}
              >
                Next
              </Button>
            </Box>
            <embed
              src={pdfPreviewUrlsGEM[currentPdfIndex]}
              type="application/pdf"
              width="100%"
              height="670px"
            />
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            paddingTop="100px"
          >
            <PictureAsPdfIcon sx={{ fontSize: 100, color: "#d32f2f" }} />

            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              id="pdf-upload"
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              component="span"
              onClick={() => document.getElementById("pdf-upload").click()}
              sx={{
                mt: 2,
                color: "#fff",
                backgroundImage:
                  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                "&:hover": {
                  backgroundImage:
                    "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                  color: "#fff",
                },
              }}
            >
              <PublishIcon sx={{ mr: 1 }} /> Upload PDFs
            </Button>
          </Box>
        )}
      </Grid>
      <div style={{ textAlign: "end", padding: "20px 100px 50px 0px" }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ marginRight: 2 }}
          onClick={() => {
      
            setAllQuotation((prevQuotations) =>
              [
                complianceCertificate || null,
                MAFCertificatee || null,
                MIICertificatee || null,
                dataSheet || null,
                pdfBlobUrl || null,
                warrantyCertificate || null,
                GenuineCertificatee || null,
                MRPCertificatee || null,
              ].filter(Boolean)
            );
            handleNext();
          }}
        >
          Skip
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ marginRight: 2 }}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          align="end"
          variant="contained"
          disabled={pdfPreviewUrlsGEM.length > 0 ? false : true}
          onClick={() => {
            setAllQuotation((prevQuotations) =>
              [
                complianceCertificate || null,
                MAFCertificatee || null,
                MIICertificatee || null,
                dataSheet || null,
                pdfBlobUrl || null,
                warrantyCertificate || null,
                GenuineCertificatee || null,
                MRPCertificatee || null,
                ...pdfPreviewUrlsGEM,
              ].filter(Boolean)
            ); // Filter out any null or undefined values
  
            handleNext();
          }}
        >
          Next
        </Button>
      </div>
    </Box>
  );
}
