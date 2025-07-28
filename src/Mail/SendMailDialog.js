import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import AuthService from "../services/AuthService";

function SendMailDialog({ open, onClose, deal, pdfs, setLoading, dealID }) {
  const CRMBaseURL = AuthService();
  const [recipientEmail, setRecipientEmail] = useState(deal?.email || "");
  const [ccEmails, setCcEmails] = useState(""); // Added CC emails state
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const team = storedUserData?.team;
  const email = storedUserData?.email;
  const name = storedUserData?.name;

  useEffect(() => {
    if (deal) {
      setSubject(`Quotation for Deal`);
      setBody(`Dear ${deal.companyName || "Customer"},\n\nPlease find attached the quotation for the deal regarding ${deal.ProductType || "your product"}.\n\nBest regards,\nHoloware`);
    }
  }, [deal]);

  useEffect(() => {
    if (deal?.email) {
      setRecipientEmail(deal.email);
    }

    // Set default CC emails to the user's email
    if (email) {
      setCcEmails(email); // Pre-fill CC field with the user's email
    }
  }, [deal, email]);

  const refreshAccessToken = async () => {
    const refreshToken = storedUserData?.refreshToken;

    if (!refreshToken) {
      console.error("No refresh token available. User needs to re-login.");
      return null;
    }

    try {
      const tokenResponse = await CRMBaseURL.post(`refreshToken`, { refreshToken });

      const newAccessToken = tokenResponse.data.accessToken;

      const updatedUserData = {
        ...storedUserData,
        accessToken: newAccessToken,
        timestamp: new Date().getTime(),
      };

      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return null;
    }
  };

  const isTokenExpired = (tokenTimestamp) => {
    const tokenLifetime = 60 * 60 * 1000; // 1 hour
    const currentTime = new Date().getTime();

    return currentTime - tokenTimestamp > tokenLifetime;
  };

  const handleSendMail = async () => {
    setLoading(true); // Start loading

    let storedUserData = JSON.parse(localStorage.getItem("userData"));
    let accessToken = storedUserData?.accessToken;
    let refreshToken = storedUserData?.refreshToken;

    const attachments = pdfs.map((pdfBase64, index) => ({
      filename: `Quotation_${index + 1}.pdf`,
      data: pdfBase64.split(",")[1],  // This is the part after the comma (base64 data)
    }));

    // Check if CC emails have at least one valid email address
    const ccEmailsArray = ccEmails.split(",").map(email => email.trim()).filter(email => email !== "");
    
    if (ccEmailsArray.length === 0) {
      alert("Please enter at least one CC email address.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        recipient: recipientEmail,
        cc: ccEmailsArray, // Updated to include the cleaned CC emails
        subject: subject,
        body: body,
        refreshToken: refreshToken,
        accessToken: accessToken,
        team: team,
        attachments,
        dealID: deal?.id,
        name: name,
        email: email,
      };

      console.log("The payload data's are", payload);
      
      const res = await CRMBaseURL.post("sendgmail", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setLoading(false);
      onClose();
    } catch (e) {
      console.error("Error sending email:", e);
      setLoading(false); 
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Send Mail</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Recipient Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              fullWidth
              disabled // Disable the recipient email field since it's provided as a prop
            />
            <TextField
              label="CC Emails"
              value={ccEmails}
              onChange={(e) => setCcEmails(e.target.value)}
              fullWidth
              placeholder="Enter multiple emails separated by commas"
            />
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
            />
            <TextField
              label="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
            <Typography variant="body2">
              {pdfs.length} PDF(s) will be attached to the email.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSendMail} color="primary" variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SendMailDialog;
