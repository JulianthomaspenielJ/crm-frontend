import React, { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import {
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import Slide from "@mui/material/Slide";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DetailedView({ ID, openDealDetails, setOpenDealDetails, fetchDealsData }) {
  const CRMBaseURL = AuthService();
  const [dealData, setDealData] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfBase64s, setPdfBase64s] = useState([]);
  const [pdfPreviewUrls, setPdfPreviewUrls] = useState([]);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);

  const fetchContact = async () => {
    try {
      const res = await CRMBaseURL.post("dealdetaileddata", { ID });
      setDealData(res.data?.data);
    } catch (err) {
      console.error("Error fetching deal data:", err);
    }
  };

  useEffect(() => {
    if (ID) {
      fetchContact();
    }
  }, [ID]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPdfFiles = [...pdfFiles, ...files];
    if (newPdfFiles.length > 10) {
      alert("You can only upload a maximum of 10 files.");
      return;
    }
    setPdfFiles(newPdfFiles);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        setPdfBase64s((prevBase64s) => [...prevBase64s, base64]);
      };
      reader.readAsDataURL(file);

      const previewUrl = URL.createObjectURL(file);
      setPdfPreviewUrls((prevUrls) => [...prevUrls, previewUrl]);
    });
  };

  const handleRemoveFile = (index) => {
    if (pdfPreviewUrls[index]) {
      URL.revokeObjectURL(pdfPreviewUrls[index]);
    }
    setPdfFiles(pdfFiles.filter((_, i) => i !== index));
    setPdfBase64s(pdfBase64s.filter((_, i) => i !== index));
    setPdfPreviewUrls(pdfPreviewUrls.filter((_, i) => i !== index));
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prevIndex) =>
      prevIndex < pdfFiles.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleSubmit = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (pdfFiles.length === 0) {
      alert("Please upload at least one PDF file");
      return;
    }
    const values = {
      quotations: pdfBase64s,
      id: ID,
      quotationUpdaterID: storedUserData ? parseInt(storedUserData.id, 10) : null,
      quotationUpdaterName: storedUserData ? storedUserData.userName : null,
    };
    try {
      const res = await CRMBaseURL.post("updatequotation", values);
      alert("PDF uploaded successfully");
      fetchDealsData();
      setOpenDealDetails(false);
    } catch (err) {
      console.error("Error uploading PDF:", err);
      alert("Failed to upload PDF");
    }
  };

  if (!dealData) {
    return <Typography></Typography>;
  }

  return (
    <Dialog
      open={openDealDetails}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: "70%",
          height: "95%",
          maxWidth: "none",
          maxHeight: "none",
          borderRadius: "12px",
          boxShadow: 10,
          backgroundColor: "#f4f4f4",
        },
      }}
    >
       <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundImage:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          color: "#fff",
        }}
      >
        <Typography variant="h6">Deal Details</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => {
            setOpenDealDetails(false);
            pdfPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
            setPdfFiles([]);
            setPdfBase64s([]);
            setPdfPreviewUrls([]);
            setCurrentPdfIndex(0);
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box p={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} sx={{ pb: 1,borderRight:"2px solid #cfcfcf" }}>
              
              {[
                { label: "Deal Owner", value: dealData.dealOwnerName },
                { label: "Priority", value: dealData.priority },
                { label: "Product Type", value: dealData.productType },
                { label: "Quantity", value: dealData.quantity },
                { label: "Company Name", value: dealData.companyName },
                { label: "Created At", value: dealData.createdAt },
                { label: "Status", value: dealData.status },
                { label: "Approximate Closing Date", value: dealData.approximateClosingDate },
                { label: "Deal Start Date", value: dealData.dealStartDate },
                { label: "Product Description", value: dealData.productDescription },
              ].map(({ label, value }) => (
                <Box sx={{ pb: 2 }} key={label}>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  {label}:
                </Typography>
                <Typography sx={{ fontSize: 13, pb: 0.5 }}>
                  {value}
                </Typography>
              </Box>
              ))}

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpenDealDetails(false);
                    pdfPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
                    setPdfFiles([]);
                    setPdfBase64s([]);
                    setPdfPreviewUrls([]);
                    setCurrentPdfIndex(0);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    color: "#fff",
                    backgroundImage: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                    '&:hover': {
                      backgroundImage: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                      color: "#fff",
                    },
                    '&:disabled': {
                      backgroundColor: "#ccc",
                      color: "#fff",
                    },
                  }}
                  disabled={pdfFiles.length === 0}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              {pdfFiles.length > 0 ? (
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
                        Quotation {currentPdfIndex + 1} of {pdfFiles.length}:
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
                      disabled={currentPdfIndex === pdfFiles.length - 1}
                      endIcon={<ArrowForwardIosIcon />}
                    >
                      Next
                    </Button>
                  </Box>
                  <embed
                    src={pdfPreviewUrls[currentPdfIndex]}
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
                      backgroundImage: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                      '&:hover': {
                        backgroundImage: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                        color: "#fff",
                      },
                    }}
                  >
                    <PublishIcon sx={{ mr: 1 }} /> Upload PDFs
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default DetailedView;
