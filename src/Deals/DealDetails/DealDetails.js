import { Box, Grid, Typography, Button, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import userNotFound from "../../Image/useeNotfound.webp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PricingStepper from "../../Pricing/PricingStepper/PricingStepper";
import Loading from "../../Loading/Loading";
import ApproveDialog from "../ApproveDealList/ApproveDialog";

function DealDetails() {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const userID = parseInt(storedUserData && `${storedUserData.id}`, 10);
  const location = useLocation();
  const navigate = useNavigate();
  const { ID } = location.state || {};
  const { productType } = location.state || {};
  const { notificationID } = location.state || {};

  const [approveID, setApproveID] = useState("");
  const [formData, setFormData] = useState("");
  const [dealDetails, setDealDetails] = useState("");
  const [openPricing, setOpenPricing] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState([]);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Initially set to true to indicate loading
  const [openValidate, setOpenValidate] = useState(false);
  const [dataSheet, setDataSheet] = useState(null);
  const [Ticket, setTicket] = useState("")
  const [SalesOwnerEmail, setSalesOwnerEmail] = useState("");

  const fetchDeals = async () => {
    const values = {
      id: ID,
      notificationID: notificationID,
      userId: userID,
    };

    setLoading(true);
    try {
      const res = await CRMBaseURL.post("dealdetaileddata", values);
      setSalesOwnerEmail(res.data.data.dealOwnerEmail)
      const ticket = res.data.data.ticketID
      setTicket(ticket)
      setFormData(res.data?.data);
      setDealDetails(res.data?.data);
    } finally {
      setLoading(false); // Ensure loading is false after data fetching
    }
  };

  useEffect(() => {
    if (!ID) {
      navigate(-1);
    } else {
      fetchDeals();
    }
  }, [navigate, ID]);

  useEffect(() => {
    if (dealDetails?.quotation && Array.isArray(dealDetails.quotation)) {
      setLoading(true);
      const pdfs = dealDetails.quotation
        .filter((certificate) => certificate && certificate !== "No Data")
        .map((certificate, index) => {
          const blob = base64ToBlob(certificate, "application/pdf");
          if (!blob) {
            console.error(`Failed to create Blob from Base64 data at index ${index}`);
            return null;
          }
          return blob;
        })
        .filter((pdf) => pdf !== null);

      setPdfPreviewUrl(pdfs);
      setLoading(false);
    } else {
      setPdfPreviewUrl([]);
      setLoading(false);
    }
  }, [dealDetails]);

  useEffect(() => {
    if (pdfPreviewUrl.length > 0) {
      const data = URL.createObjectURL(pdfPreviewUrl[0]);
      setDataSheet(data);
    }
  }, [pdfPreviewUrl]);

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prevIndex) =>
      prevIndex < pdfPreviewUrl.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleValidate = (id) => {
    setOpenValidate(true);
    setApproveID(id);
  };

  const handleDownloadPdf = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${dealDetails.productType}_Quotation.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const base64ToBlob = (base64, mimeType) => {
    try {
      if (!base64 || typeof base64 !== "string") {
        console.error("Invalid Base64 data");
        return null;
      }

      const byteCharacters = atob(base64.split(",")[1] || base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mimeType });
    } catch (error) {
      console.error("Error converting Base64 to Blob:", error);
      return null;
    }
  };

  // Return early if loading is true
  if (loading) {
    return <Loading />;
  }


  if (!dealDetails) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ mt: 4 }}
      ></Typography>
    );
  }

  const renderField = (label, value, name, options) => (
    <Box
      sx={{
        pb: 3,
        position: "relative",
        "&:hover .editButton": {
          display: "flex",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#00000082" }}>
          {label}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
  if (!loading) {
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
                    navigate(-1);
                  }}
                >
                  <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                  <span style={{ marginLeft: 4 }}>Deals</span>
                </Typography>
              </Box>

              <Box sx={{ pb: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                  About this Deals
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
                {renderField("Ticket No", formData.ticketID)}
                {renderField("Customer Name", formData.companyName)}
                {renderField("Deal", formData.productType)}
                {renderField(
                  "Product Description",
                  formData.productDescription
                )}
                
                {renderField("Quantity", formData.quantity)}
                {renderField("Deal Owner", formData.dealOwnerName)}
                {renderField("Deal Approver", formData.dealApprover)}
                {renderField("Priority", formData.priority)}
                {renderField("Current Status", formData.status)}
                {renderField("Start Date", formData.createdAt)}
                {renderField(
                  "Approximate Closing Date",
                  formData.approximateClosingDate
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
              // display: "flex",
              // alignItems: "center",
              justifyContent: "center",
            }}
          >
           <Box
              sx={{ display: "flex", justifyContent: "end" }}
              onClick={() => {
                setOpenPricing(true);
              }}
            >
              {formData.status === "Negotiation" && !openPricing&&(
                <Button variant="outlined">Update</Button>
              )}
            </Box>
            {openPricing ? (
              <Box
                sx={{
                  bgcolor: "#fff",
                  width: "100%",
                  height: "100%",
                  p: 2,
                }}
              >
                <PricingStepper
                  setOpenPricing={setOpenPricing}
                  fetchDeals={fetchDeals}
                  id={ID}
                  product={productType}
                  CustomerName={formData?.companyName}
                  CustomerAddress={formData?.address}
                  CustomerMobile={formData?.mobile}
                  CustomerEmail={formData?.email}
                  SalesOwnerEmail={SalesOwnerEmail}
                  status={formData?.status}
                  modelName={formData?.modelName}
                  pdfPreviewUrl={pdfPreviewUrl}
                  Ticket={Ticket}
                />
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: "100%" }}>
                {pdfPreviewUrl.length > 0 ? (
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
                          Quotation {currentPdfIndex + 1} of{" "}
                          {pdfPreviewUrl.length}:
                        </strong>
                        <IconButton
                          sx={{ fontSize: 20, color: "#322E6F", ml: 1 }}
                          onClick={() =>
                            handleDownloadPdf(pdfPreviewUrl[currentPdfIndex])
                          }
                        >
                          <PictureAsPdfIcon />
                        </IconButton>
                      </Typography>
                      <Button
                        onClick={handleNextPdf}
                        disabled={currentPdfIndex === pdfPreviewUrl.length - 1}
                        endIcon={<ArrowForwardIosIcon />}
                      >
                        Next
                      </Button>
                    </Box>
                    <embed
                      src={URL.createObjectURL(pdfPreviewUrl[currentPdfIndex])}
                      type="application/pdf"
                      width="100%"
                      height="840px"
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
                        (storedUserData.team === "Pricing" && storedUserData.userRole === "Manager") ||
                        formData.quotationUpdaterID === userID) &&
                        formData.status === "Quotation Required" && (
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
                      )}

                    {storedUserData &&
                      (storedUserData.team === "Admin" ||
                        (storedUserData.team === "Pricing" && storedUserData.userRole === "Manager")) &&
                        formData.status === "Waiting for Approval" && (
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
                              handleValidate(formData.id)
                            }}
                          >
                            Validate
                          </Button>
                        </Box>
                      )}
                  </Box>
                )}
              </Box>
            )}
          </Grid>
          <ApproveDialog
            approveDialog={openValidate}
            setApproveDialog={setOpenValidate}
            approveID={approveID}
            fetchDealsData={fetchDeals}
          />
        </Grid>
      </div>
    );
  } else {
    return <Loading />;
  }
}

export default DealDetails; 