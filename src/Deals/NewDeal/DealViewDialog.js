import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AuthService from "../../services/AuthService";
import ChatDialog from "../AllDeals/ChatScreen";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import SendMailDialog from "../../Mail/SendMailDialog";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";

function DealViewDialog({
  open,
  deal,
  onClose,
  sum,
  onEditOutcome,
  editedFinalOutcome,
  setEditedFinalOutcome,
  setLoading,
}) {
  const CRMBaseURL = AuthService();
  const [editingOutcome, setEditingOutcome] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [sendMailOpen, setSendMailOpen] = useState(false);
  const [pdfPreviewUrls, setPdfPreviewUrls] = useState([]);

  // Define eventIcons outside the JSX but inside the component
  const eventIcons = {
    "Deal Created": <AddCircleIcon color="primary" />,
    "Deal Approved": <CheckCircleIcon color="success" />,
    "Quotation Sent": <MailOutlineIcon color="primary" />,
    Negotiated: <SwapHorizIcon color="info" />,
    Won: <EmojiEventsIcon color="success" />,
    Lost: <CancelIcon color="error" />,
    Invalid: <ErrorOutlineIcon color="error" />,
  };

  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const userName = storedUserData?.name;
  const role = storedUserData?.userRole;
  const team = storedUserData?.team;

  const canShowSendMailButton =
    deal &&
    deal.status === "Quotation Sent" &&
    (userName === deal.dealOwnerName ||
      ((role !== "Manager" || team !== "Pricing") &&
        ["Manager", "Admin", "Super Admin"].includes(role)));

  useEffect(() => {
    if (deal?.quotation && Array.isArray(deal.quotation)) {
      const pdfs = deal.quotation
        .filter((certificate) => certificate && certificate !== "No Data")
        .map((certificate) => base64ToBlob(certificate, "application/pdf"));
      setPdfPreviewUrl(pdfs);
    } else {
      setPdfPreviewUrl([]);
    }
  }, [deal, open]);

  useEffect(() => {
    if (deal?.quotation && Array.isArray(deal.quotation)) {
      const pdfs = deal.quotation
        .filter((certificate) => certificate && certificate !== "No Data")
        .map((certificate) => `data:application/pdf;base64,${certificate}`); // Keep as base64
      setPdfPreviewUrls(pdfs);
    } else {
      setPdfPreviewUrls([]);
    }
  }, [deal, open]);
  useEffect(() => {
    setEditedFinalOutcome(deal?.finalOutCome || "");
  }, [open, deal]);

  const handleEditOutcomeClick = async () => {
    onEditOutcome(editedFinalOutcome);
    setEditingOutcome(false);
    const dealID = deal.id;
    const values = {
      id: dealID,
      finalOutCome: editedFinalOutcome,
    };
    try {
      const res = await CRMBaseURL.post("updateStatus", values);
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleDeletePdf = (index) => {
    setPdfPreviewUrl((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prevIndex) =>
      prevIndex < pdfPreviewUrl.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleDownloadPdf = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${deal.productType}_Quotation.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleChat = async (id) => {
    const data = {
      dealID: id,
    };
    fetchChatData(data);
    setChatOpen(true);
    setSelectedId(id);
  };

  const fetchChatData = async (data) => {
    try {
      const response = await CRMBaseURL.post("getchat", data);
      setChatData(response.data?.data);
    } catch (e) {
    }
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedId(null);
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  return (
    <>
      <Dialog
        open={open}
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
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between", // Align content to sides
            alignItems: "center", // Vertically center the content
          }}
        >
          <Typography>{deal?.productType} - Deal Details</Typography>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => {
              onClose();
              setCurrentPdfIndex(0);
            }}
          />
        </DialogTitle>

        <DialogContent dividers>
          {deal ? (
            <Box
              sx={{
                display: "flex",
                padding: "15px",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "16px",
                height: "calc(100% - 32px)",
              }}
            >
              <Box
                sx={{
                  width: "45%",
                  mr: 2,
                  pb: 1,
                  borderRight: "2px solid #cfcfcf",
                  overflowY: "auto",
                  maxHeight: "100%", 
                }}
              >
                {/* Left side: Deal Details */}
                <Box sx={{ pb: 2 }}>
                {[
                  { label: "Deal Owner", value: deal.dealOwnerName },
                  {
                    label: "Deal Approver",
                    value: deal.dealApprover.split(" ")[0],
                  },
                  {
                    label: "Quotation Updater",
                    value: deal.quotationUpdaterName.split(" ")[0],
                  },
                  { label: "Product Type", value: deal.productType },
                  {
                    label: "Product Description",
                    value: deal.productDescription,
                  },

                  { label: "Quantity", value: deal.quantity },
                  { label: "Priority", value: deal.priority },
                  { label: "Current Status", value: deal.status },
                  ...(team === "Admin" || team === "Pricing"
                    ? deal.marginType && deal.tier && deal.tier !== "N/A"
                      ? [
                          {
                            label: "Margin Type",
                            value: `${deal.marginType} (${deal.tier} ${deal.marginTypePercentage}%)`,
                          },
                        ]
                      : []
                    : []),
                  ...(deal.reason && deal.reason !== "N/A"
                    ? [{ label: "Deleted Reason", value: deal.reason }]
                    : []),
                  ...(deal.statusCommand && deal.statusCommand !== "N/A"
                    ? [{ label: "Comments", value: deal.statusCommand }]
                    : []),
                  { label: "Start Date", value: deal.dealStartDate },
                  {
                    label: "Approximate Closing Date",
                    value: deal.approximateClosingDate,
                  },
                  { label: "Mail Status", value: deal.mailStatus },
                ].map(({ label, value }) => (
                  <Box
                    sx={{
                      pb: 2,
                    }}
                    key={label}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 14, pb: 0.5 }}>
                      {label}:
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>{value}</Typography>
                  </Box>
                ))}
                {/* { label: "Pricing", value: `₹${deal.pricing}` }, */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, pb: 1 }}
                >
                  <Typography sx={{ fontWeight: 600, width: "150px" }}>
                    Chat:
                  </Typography>
                  <Typography
                    onClick={() => {
                      handleChat(deal?.id);
                    }}
                  >
                    <ChatIcon sx={{ cursor: "pointer", color: "#00E096" }} />
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 2 }}>
                    Deal History:
                  </Typography>
                  <Timeline position="right">
                    {sum?.map((item, index) => {
                      const { description, byPerson } = item;
                      const eventType = description.includes("created")
                        ? "Deal Created"
                        : description.includes("approved")
                        ? "Deal Approved"
                        : description.includes("Quotation")
                        ? "Quotation Sent"
                        : description.includes("Negotiated")
                        ? "Negotiated"
                        : description.includes("Won")
                        ? "Won"
                        : description.includes("Lost")
                        ? "Lost"
                        : "Invalid";

                      return (
                        <TimelineItem key={index}>
                          <TimelineOppositeContent sx={{ flex: 0.1 }}>
                            {eventIcons[eventType]}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            {index < sum.length - 1 && <TimelineConnector />}
                          </TimelineSeparator>
                          <TimelineContent sx={{ py: "12px", px: 2 }}>
                            <Typography variant="h6" component="span">
                              {byPerson.split(" ")[0]}
                            </Typography>
                            <Typography>{description}</Typography>
                          </TimelineContent>
                        </TimelineItem>
                      );
                    })}
                  </Timeline>
                </Box>
                </Box>
              </Box>

              {/* Right side: PDF Preview */}
              <Box 
                sx={{ 
                  width: "100%",
                  overflowY: "auto", 
                  maxHeight: "100%",
                }}
              >
                {deal.status === "Negotiation" && (
                  <div style={{display:"flex",alignItems:"end",justifyContent:"end"}}>
                    <Button variant="contained">Update</Button>
                  </div>
                )}

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
                        {/* <IconButton
                          sx={{ fontSize: 20, color: "#FF0000", ml: 1 }}
                          onClick={() => handleDeletePdf(currentPdfIndex)}
                        >
                          <DeleteIcon />
                        </IconButton> */}
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
                      height="625px"
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Quotation:</strong> No Data Available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose();
              setCurrentPdfIndex(0);
            }}
            color="primary"
          >
            Close
          </Button>
          {canShowSendMailButton && (
            <Button
              onClick={() => setSendMailOpen(true)}
              variant="contained"
              color="primary"
            >
              Send Mail
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <SendMailDialog
        open={sendMailOpen}
        onClose={() => setSendMailOpen(false)}
        deal={deal}
        pdfs={pdfPreviewUrls}
        setLoading={setLoading}
      />
      <ChatDialog
        open={chatOpen}
        onClose={handleCloseChat}
        id={selectedId}
        data={chatData}
        fetchChatData={fetchChatData}
      />
    </>
  );
}

export default DealViewDialog;
