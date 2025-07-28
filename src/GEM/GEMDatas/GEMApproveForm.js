import {
  Dialog,
  DialogTitle,
  Grid,
  Typography,
  Button,
  DialogContent,
  IconButton,
  Box,
  Autocomplete,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VisibilityIcon from "@mui/icons-material/Visibility";

function GEMApproveForm({
  gemID,
  approveGemDialog,
  setApproveGemDialog,
  fetchContactData,
  setGemID,
  type,
}) {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [GemData, setGemData] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [approvalType, setApprovalType] = useState("approve");
  const [userList, setUserList] = useState("");
  const [reason, setReason] = useState("");
  const [isReasonFocused, setIsReasonFocused] = useState(false);
  const [isReasonError, setIsReasonError] = useState(false);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [billingPDFs, setBillingPDFs] = useState([]);
  const [currentBillingPdfIndex, setCurrentBillingPdfIndex] = useState(0); // Separate state for billing PDFs
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedUserID, setSelectedUserID] = useState(null);

  useEffect(() => {
    if (gemID) {
      fetchContact();
    }
  }, [gemID]);

  useEffect(() => {
    if (GemData?.gemCertificate && Array.isArray(GemData.gemCertificate)) {
      const pdfs = GemData.gemCertificate
        .filter((certificate) => certificate && certificate !== "No Data")
        .map((certificate) => base64ToBlob(certificate, "application/pdf"));
      setBillingPDFs(pdfs);
    } else {
      setBillingPDFs([]);
    }

    if (type === true && Array.isArray(GemData?.quotation)) {
      const pdfs = GemData.quotation
        .filter((base64Pdf) => base64Pdf && base64Pdf !== "No Data")
        .map((base64Pdf) => base64ToBlob(base64Pdf, "application/pdf"));
      setPdfFiles(pdfs);
    }
  }, [GemData, type]);

  const fetchUserList = async () => {
    try {
      const approveData = await CRMBaseURL.get("usernamelist");
      setUserList(approveData.data?.data || []);
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    const selectedUser = userList.find(
      (user) => `${user.name} (${user.email})` === newInputValue
    );
    if (selectedUser) {
      setSelectedUserID(selectedUser.id);
    } else {
      setSelectedUserID(null);
    }
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
    if (event.target.value.length >= 30) {
      setIsReasonError(false);
    }
  };

  const handleReasonBlur = () => {
    setIsReasonFocused(false);
    if (reason.length < 30) {
      setIsReasonError(true);
    }
  };

  const handleApprove = async (type) => {
    if (type === "approve") {
      const values = {
        id: gemID,
        quotationUpdaterName: inputValue,
        quotationUpdaterID: selectedUserID,
        gemApproverID: storedUserData ? parseInt(storedUserData.id, 10) : null,
        gemApprover:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
      };
      try {
        const res = await CRMBaseURL.post("approvegem", values);
        console.log(res);
      } catch (e) {
        console.log(e);
      } finally {
        fetchContactData();
      }
    } else if (type === "deny") {
      const values = {
        id: gemID,
        deletedByID: storedUserData ? parseInt(storedUserData.id, 10) : null,
        reason: reason,
        deletedBy:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
      };
      try {
        const res = await CRMBaseURL.post("denygem", values);
      } catch (e) {
        console.log(e);
      } finally {
        fetchContactData();
      }
    }
    setApproveGemDialog(false);
    setInputValue("");
    setReason("");
    setIsReasonError(false);
  };

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
      setGemData(res.data?.data);
    } catch (err) {
      console.error("Error fetching GemData data:", err);
    }
  };

  const handleDownloadPdf = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
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

  return (
    <Dialog
      open={approveGemDialog}
      PaperProps={{
        sx: {
          width: "40%",
          height: "80%",
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
        <Typography variant="h6">GEM Details</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => {
            setApproveGemDialog(false);
            setGemID("");
            setGemData("");
            setPdfFiles("");
            setCurrentPdfIndex(0);
            setCurrentBillingPdfIndex(0);
          }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {GemData ? (
          <Box
            sx={{
              display: "flex",
              padding: "15px",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                pb: 1,
              }}
            >
              {/* Left side: GemData Details */}
              {[
                { label: "Dealer Name", value: GemData.dealerName },
                { label: "Customer Name", value: GemData.customerName },
                { label: "Due Date", value: GemData.dueDate },
                { label: "GEM Number", value: GemData.gemNumber },
                { label: "Quantity", value: GemData.quantity },
                { label: "Description", value: GemData.description },
                { label: "Created By", value: GemData.createdBy },
                { label: "Created At", value: GemData.gemRaisedAt },
              ].map(({ label, value }, index) => (
                <Grid
                  key={index}
                  container
                  item
                  xs={12}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      align="left"
                      padding={1.5}
                    >
                      {label}:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2" align="left">
                      {value}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
              {billingPDFs.length > 0 && (
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      align="left"
                      padding={1.5}
                    >
                      Billing PDF:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body2" align="left">
                      <IconButton
                        onClick={openPdfViewer}
                        aria-label="view"
                        sx={{ fontSize: 20, color: "#1976d2" }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Typography>
                  </Grid>
                </Grid>
              )}

              <Box sx={{ padding: "0px 0px 10px 12px" }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  Select Type:
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={approvalType}
                    onChange={(e) => {
                      setApprovalType(e.target.value);
                      setIsReasonError("");
                      setIsReasonFocused(false);
                    }}
                  >
                    <FormControlLabel
                      value="approve"
                      control={<Radio />}
                      label="Approve"
                    />
                    <FormControlLabel
                      value="deny"
                      control={<Radio />}
                      label="Deny"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              {approvalType === "approve" ? (
                <Autocomplete
                  freeSolo
                  options={
                    userList
                      ? userList.map((user) => `${user.name} (${user.email})`)
                      : []
                  }
                  inputValue={inputValue}
                  onInputChange={handleInputChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select user"
                      variant="outlined"
                    />
                  )}
                />
              ) : (
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={reason}
                  placeholder="Write Reason (at least 30 characters)"
                  onChange={handleReasonChange}
                  onFocus={() => setIsReasonFocused(true)}
                  onBlur={handleReasonBlur}
                  error={isReasonError && !isReasonFocused}
                  helperText={
                    isReasonError && !isReasonFocused
                      ? "Reason must be at least 30 characters"
                      : ""
                  }
                />
              )}

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setApproveGemDialog(false);
                    if (pdfFiles) {
                      URL.revokeObjectURL(pdfFiles);
                    }
                    setPdfFiles("");
                    setCurrentPdfIndex(0);
                    setCurrentBillingPdfIndex(0);
                  }}
                  // style={{ marginTop: "10px" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disabled={
                    approvalType === "approve"
                      ? !inputValue
                      : !reason || reason.length < 30
                  }
                  sx={{
                    backgroundImage:
                      ((approvalType === "approve" && inputValue) ||
                        (approvalType === "deny" &&
                          reason &&
                          reason.length > 30)) &&
                      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                    color: "#FFF",
                  }}
                  onClick={() => {
                    handleApprove(approvalType);
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </DialogContent>
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
                height="683px"
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
export default GEMApproveForm;
