import {
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Button,
  DialogContent,
  Box,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowLeft";
import userNotFound from "../Image/useeNotfound.webp";
import GEMPricing from "../Pricing/GEMPricing/GEMPricing";

const options = [
  "Gem Requested",
  "Gem Updated",
  "Appointment Scheduled",
  "Demo Scheduled",
  "Negotiation",
  "Won",
  "Loss",
];

function GemView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gemID, type, notificationID } = location.state;
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [GemData, setGemData] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [billingPDFs, setBillingPDFs] = useState([]);
  const [currentBillingPdfIndex, setCurrentBillingPdfIndex] = useState(0); // Separate state for billing PDFs
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPricing, setOpenPricing] = useState(false);
  const open = Boolean(anchorEl);
  const [GemUrl, setGemUrl] = useState("");
  const [Ticket, setTicket] = useState("")
  const [Email, setEmail] = useState("")

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const UpdateNotification = async (NotificationID) => {
    const datas = {
      id: NotificationID,
    };
    try {
      const res = await CRMBaseURL.post("updategemnotification", datas);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMenuItemClick = async (option) => {
    const datas = {
      id: gemID,
      status: option,
      editedBy: `${storedUserData.userName} (${storedUserData.email})`,
    };
    try {
      const res = await CRMBaseURL.post("updategemstatus", datas);
    } catch (e) {
      console.log(e);
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    if (gemID) {
      fetchContact();
    } else {
      navigate(-1);
    }
    if (notificationID) {
      UpdateNotification(notificationID);
    }
  }, [navigate, gemID]);

  useEffect(() => {
    if (GemData?.gemCertificate && Array.isArray(GemData.gemCertificate)) {
      const pdfs = GemData.gemCertificate
        .filter((certificate) => certificate && certificate !== "No Data")
        .map((certificate) => base64ToBlob(certificate, "application/pdf"));
      setBillingPDFs(pdfs);
    } else {
      setBillingPDFs([]);
    }

    if (
      (type === "Quotation Updated" || type === "My Gem") &&
      Array.isArray(GemData?.quotations)
    ) {
      const pdfs = GemData.quotations
        .filter((base64Pdf) => base64Pdf && base64Pdf !== "No Data")
        .map((base64Pdf) => base64ToBlob(base64Pdf, "application/pdf"));

      setPdfFiles(pdfs);
    }
  }, [GemData]);

  const base64ToBlob = (base64Data, contentType = "", sliceSize = 512) => {
    try {
      if (!base64Data) throw new Error("Base64 data is empty or null.");
      const padding = "=".repeat((4 - (base64Data.length % 4)) % 4);
      const base64 = (base64Data + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const byteCharacters = atob(base64);
      const byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      return new Blob(byteArrays, { type: contentType });
    } catch (error) {
      console.error("Error converting base64 to Blob:", error.message);
      return null;
    }
  };

  const fetchContact = async () => {
    const ID = gemID;
    try {
      const res = await CRMBaseURL.post("getdetailedgem", { ID });
      setEmail(res.data.data.dealOwnerEmail)
      setTicket(res.data.data.ticketNo)
      setGemData(res.data?.data);
      setGemUrl(res.data.data.gemURL);
    } catch (err) {
      console.error("Error fetching GemData data:", err);
    }
  };

  const handlePdfUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + pdfFiles.length > 10) {
      alert("You can only upload a maximum of 10 files.");
      return;
    }
    setPdfFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDownloadPdf = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
  };

  const handleDeletePdf = (index) => {
    setPdfFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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

  const handlePreviousBillingPdf = () => {
    setCurrentBillingPdfIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : 0
    );
  };

  const handleNextBillingPdf = () => {
    setCurrentBillingPdfIndex((prevIndex) =>
      prevIndex < billingPDFs.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const openPdfViewer = () => {
    setShowPdfViewer(true);
  };

  const closePdfViewer = () => {
    setShowPdfViewer(false);
  };

  const handleSubmit = async () => {
    if (pdfFiles.length === 0) {
      alert("No PDF files to submit.");
      return;
    }

    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result
            .replace("data:", "")
            .replace(/^.+,/, "");
          resolve(base64String);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      const base64Files = await Promise.all(pdfFiles.map(fileToBase64));
      const values = {
        quotation: base64Files,
        id: gemID,
        dealerId: GemData.dealerId,
      };
      const res = await CRMBaseURL.post("uploadpricinggem", values);
      // setOpenGemDetails(false);
      setPdfFiles("");
      setCurrentPdfIndex(0);
      setCurrentBillingPdfIndex(0);
      // fetchContactData();
    } catch (error) {
      console.error("Error converting files to base64:", error);
    }
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ height: "90vh" }}>
        <Grid item xs={12} md={3} sx={{ height: "100%" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              height: "100%",
              px: 2,
              pt: 2,
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pb: 3,
              }}
            >
              <Typography
                sx={{
                  color: "#e02b6a",
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  navigate("/dashboard/gem");
                }}
              >
                <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                <span style={{ marginLeft: 4 }}>GEM</span>
              </Typography>
            </Box>

            <Box sx={{ pb: 2 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                About this GEM
              </Typography>
            </Box>
            <Box
              sx={{
                height: "85%",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {GemData &&
                [
                  { label: "Ticket ID", value: Ticket },
                  { label: "Dealer name", value: GemData.dealerName },
                  { label: "Dealer Address", value: GemData.dealerAddress },
                  { label: "Dealer Email", value: GemData.dealerEmail },
                  { label: "Dealer Mobile", value: GemData.dealerMobile },
                  { label: "Customer Name", value: GemData.customerName },
                  { label: "GEM date", value: GemData.GEMDate },
                  { label: "Due date", value: GemData.dueDate },
                  { label: "GEM Number", value: GemData.gemNumber },
                  { label: "Product Type", value: GemData.productType },
                  { label: "Quantity", value: GemData.quantity },
                  { label: "Description", value: GemData.description },
                  { label: "GEM URL", value: GemData.gemURL },
                  { label: "Created By", value: GemData.createdBy },
                  { label: "Created At", value: GemData.gemRaisedAt },

                  {
                    label: "Status",
                    value: (
                      <>
                        {GemData.status}
                        {GemData.status !== "Gem Requested" && (
                          <>
                            <IconButton
                              size="small"
                              onClick={handleClick}
                              aria-label="select status"
                            >
                              <ArrowDropDownIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                            >
                              {options.map((option) => (
                                <MenuItem
                                  key={option}
                                  onClick={() => handleMenuItemClick(option)}
                                >
                                  {option}
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        )}
                      </>
                    ),
                  },
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
              {billingPDFs.length > 0 && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1 }}
                >
                  <Typography sx={{ fontWeight: 600, width: "150px" }}>
                    Billing PDF:
                  </Typography>
                  <IconButton
                    onClick={openPdfViewer}
                    aria-label="view"
                    sx={{ fontSize: 20, color: "#1976d2" }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            height: "100%",
            display: "flex",
            // alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              bgcolor: "#fff",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
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
                      onClick={() =>
                        handleDownloadPdf(pdfFiles[currentPdfIndex])
                      }
                    >
                      <PictureAsPdfIcon />
                    </IconButton>
                    <IconButton
                      sx={{ fontSize: 20, color: "#FF0000", ml: 1 }}
                      onClick={() => handleDeletePdf(currentPdfIndex)}
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
                  src={URL.createObjectURL(pdfFiles[currentPdfIndex])}
                  type="application/pdf"
                  width="100%"
                  height="810px"
                />
              </Box>
            ) : type === "Quotation Required" ? (
              storedUserData?.team === "Pricing" ||
              storedUserData?.team === "Admin" ? (
                openPricing ? (
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      width: "100%",
                      height: "100%",
                      p: 2,
                    }}
                  >
                    {/* <GEMPricingStepper
                      setOpenPricing={setOpenPricing}
                      fetchDeals={fetchContact}
                      id={gemID}
                      gemUrl={GemUrl}
                      type="GEM"
                      gemNumber={GemData.gemNumber}
                      CustomerName={GemData.customerName}
                      partnerName={GemData.dealerName}
                      partnerAddress={GemData.dealerAddress}
                      partnerEmail={GemData.dealerEmail}
                      partnerMobile ={GemData.dealerMobile}
                      product={GemData.productType}
                      GEMDate={GemData.GEMDate}
                    /> */}

                    <GEMPricing
                      setOpenPricing={setOpenPricing}
                      fetchDeals={fetchContact}
                      gemID={gemID}
                      gemUrl={GemUrl}
                      type="GEM"
                      gemNumber={GemData.gemNumber}
                      CustomerName={GemData.customerName}
                      partnerName={GemData.dealerName}
                      partnerAddress={GemData.dealerAddress}
                      partnerEmail={GemData.dealerEmail}
                      partnerMobile={GemData.dealerMobile}
                      product={GemData.productType}
                      GEMDate={GemData.GEMDate}
                      Ticket={Ticket}
                      Email={Email}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      pt: 15,
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={userNotFound}
                      alt="User Not Found"
                      style={{ width: "250px", height: "250px" }}
                    />
                    <Typography sx={{ textAlign: "center" }}>
                      Awaiting for Quotation
                    </Typography>
                    {storedUserData &&
                      (storedUserData.team === "Admin" ||
                        storedUserData.team === "Pricing")}
                    <Box sx={{ textAlign: "center", py: 3 }}>
                      <Button
                        variant="contained"
                        sx={{
                          py: 1,
                          px: 5,
                          fontSize: 14,
                          backgroundImage:
                            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                        }}
                        onClick={() => {
                          setOpenPricing(true);
                        }}
                      >
                        Add Pricing
                      </Button>
                    </Box>
                  </Box>
                )
              ) : (
                <Typography
                  sx={{
                    paddingTop: 20,
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  The quotation has not been uploaded.
                </Typography>
              )
            ) : (
              <Typography
                sx={{
                  paddingTop: 20,
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                The quotation has not been uploaded.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={showPdfViewer}
        onClose={closePdfViewer}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
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
          <Typography variant="h6">Billing PDF Viewer</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={closePdfViewer}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {billingPDFs.length > 0 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Button
                  onClick={handlePreviousBillingPdf}
                  disabled={currentBillingPdfIndex === 0}
                  startIcon={<ArrowBackIosIcon />}
                >
                  Previous
                </Button>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>
                    Quotation {currentBillingPdfIndex + 1} of{" "}
                    {billingPDFs.length}:
                  </strong>
                  <IconButton
                    sx={{ fontSize: 20, color: "#322E6F", ml: 1 }}
                    onClick={() =>
                      handleDownloadPdf(billingPDFs[currentBillingPdfIndex])
                    }
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </Typography>
                <Button
                  onClick={handleNextBillingPdf}
                  disabled={currentBillingPdfIndex === billingPDFs.length - 1}
                  endIcon={<ArrowForwardIosIcon />}
                >
                  Next
                </Button>
              </Box>
              <embed
                src={URL.createObjectURL(billingPDFs[currentBillingPdfIndex])}
                type="application/pdf"
                width="100%"
                height="810px"
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GemView;
