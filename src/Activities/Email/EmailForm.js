import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  Box,
  Tooltip,
  List,
  ListItemButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import AuthService from "../../services/AuthService";
import CustomSnackbar from "../SuccessSnackbar/Snackbar";

const commonDomains = [
  "gmail.com",
  "gmail.in",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "icloud.com",
  "mail.com",
  "holoware.co",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailForm = ({ emailOpen, setEmailOpen, id, type, fetchData }) => {
  const CRMBaseURL = AuthService();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [bccEmail, setBccEmail] = useState("");
  const [selectedToEmails, setSelectedToEmails] = useState([]);
  const [selectedCcEmails, setSelectedCcEmails] = useState([]);
  const [selectedBccEmails, setSelectedBccEmails] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [typeData, setTypeData] = useState("");
  const [tooltipAnchor, setTooltipAnchor] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [openInFullIcon, setOpenInFullIcon] = useState(false);
  const toEmailRef = useRef(null);
  const ccEmailRef = useRef(null);
  const bccEmailRef = useRef(null);
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const handleSend = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    const data = attachments.map((attachment) => attachment.data);

    const mailData = {
      companyID: id,
      isCompany: type === "Company" ? 1 : 0,
      UserId: storedUserData?.id,
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,

      fromEmail: storedUserData?.email,
      toMail: selectedToEmails,
      cc: selectedCcEmails,
      bcc: selectedBccEmails,
      subject: subject ? subject : "(no subject)",
      body: body,
      attachments: data,
    };

    try {
      const res = await CRMBaseURL.post("mail", mailData);
      setSnackbarType("success");
      setSnackbarMessage(res && res.data.message);
      setErrorOpen(true);
      setSelectedBccEmails([]);
      setSelectedCcEmails([]);
      setSelectedToEmails([]);
      setBody("");
      setSubject("");
      setAttachments([]);
      setEmailOpen(false);
      fetchData();
    } catch (e) {
      setSnackbarType("error");
      setSnackbarMessage("Something went wrong ! Please try again");
      setErrorOpen(true);
    }
  };

  const handleEmailInputChange = (e, type) => {
    const value = e.target.value;
    setTypeData(type);

    if (type === "to") setToEmail(value);
    if (type === "cc") setCcEmail(value);
    if (type === "bcc") setBccEmail(value);

    // Split the input to check for domain part
    const [localPart, domainPart] = value.split("@");

    if (domainPart) {
      // Suggest domain completions if "@" is typed
      const suggestions = commonDomains
        .filter((domain) => domain.startsWith(domainPart.toLowerCase()))
        .map((domain) => `${localPart}@${domain}`);

      setFilteredSuggestions(suggestions);
      setTooltipAnchor(e.target);
    } else {
      setFilteredSuggestions([]);
      setTooltipAnchor(null);
    }
  };

  const addEmail = (email, type) => {
    if (emailPattern.test(email)) {
      if (type === "to" && !selectedToEmails.includes(email)) {
        setSelectedToEmails((prev) => [...prev, email]);
      }
      if (type === "cc" && !selectedCcEmails.includes(email)) {
        setSelectedCcEmails((prev) => [...prev, email]);
      }
      if (type === "bcc" && !selectedBccEmails.includes(email)) {
        setSelectedBccEmails((prev) => [...prev, email]);
      }
    }
    if (type === "to") {
      setToEmail("");
      toEmailRef.current.focus();
    }
    if (type === "cc") {
      setCcEmail("");
      ccEmailRef.current.focus();
    }
    if (type === "bcc") {
      setBccEmail("");
      bccEmailRef.current.focus();
    }
    setFilteredSuggestions([]);
    setTooltipAnchor(null);
  };

  const removeEmail = (email, type) => {
    if (type === "to") {
      setSelectedToEmails((prev) => prev.filter((e) => e !== email));
      toEmailRef.current.focus(); // Focus the "To" TextField after removing a Chip
    }
    if (type === "cc") {
      setSelectedCcEmails((prev) => prev.filter((e) => e !== email));
      ccEmailRef.current.focus(); // Focus the "CC" TextField after removing a Chip
    }
    if (type === "bcc") {
      setSelectedBccEmails((prev) => prev.filter((e) => e !== email));
      bccEmailRef.current.focus(); // Focus the "BCC" TextField after removing a Chip
    }
  };

  const handleEmailKeyDown = (e, type) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      addEmail(e.target.value, type);
    }
  };

  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);

    // Filter out files that are not PNG or PDF
    const filteredFiles = files.filter(
      (file) => file.type === "image/png" || file.type === "application/pdf"
    );

    // Convert each file to base64
    const promises = filteredFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result;
          const [metadata, base64Data] = result.split(",");
          resolve({
            name: file.name,
            data: `${metadata},${base64Data}`, // Ensure data URL format is correct
          });
        };
        reader.onerror = (error) => reject(error);
      });
    });

    // Set attachments
    Promise.all(promises)
      .then((results) => {
        const newAttachments = results
          .map((result) => {
            // Extract the MIME type from the metadata
            const metadata = result.data.split(",")[0];
            const contentType = metadata.split(":")[1].split(";")[0];
            if (
              contentType === "image/png" ||
              contentType === "application/pdf"
            ) {
              return {
                name: result.name,
                data: result.data, // Use the complete data URL including MIME type
              };
            }
            return null;
          })
          .filter(Boolean); // Remove any null entries

        setAttachments((prev) => [...prev, ...newAttachments]);
      })
      .catch((error) => console.error("Error reading files:", error));
  };

  const removeAttachment = (fileName) => {
    setAttachments((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <>
      <Dialog
        open={emailOpen}
        fullWidth
        maxWidth={openInFullIcon ? "lg" : "sm"}
        sx={{
          "& .MuiDialog-paper": {
            minHeight: openInFullIcon ? "800px" : "700px", // Minimum height
            maxHeight: openInFullIcon ? "800px" : "700px", // Maximum height (ensures it's fixed)
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Compose Email</Typography>
          <Box>
            <IconButton
              color="inherit"
              onClick={() => {
                setOpenInFullIcon(!openInFullIcon);
              }}
            >
              {openInFullIcon ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => {
                setEmailOpen(false);
                setOpenInFullIcon(false);
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  alignItems: "start",
                }}
              >
                <Typography sx={{ mr: 1, mt: 1 }}>To:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "start",
                  }}
                >
                  {selectedToEmails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => removeEmail(email, "to")}
                      sx={{ mr: 1, mb: 0.5 }}
                    />
                  ))}
                  <Tooltip
                    open={filteredSuggestions.length > 0}
                    title={
                      <List>
                        {filteredSuggestions.map((suggestion, index) => (
                          <ListItemButton
                            key={index}
                            onClick={() => addEmail(suggestion, typeData)}
                          >
                            {suggestion}
                          </ListItemButton>
                        ))}
                      </List>
                    }
                    placement="bottom-start"
                    PopperProps={{
                      disableInteractive: true,
                      anchorEl: tooltipAnchor,
                    }}
                  >
                    <TextField
                      autoFocus
                      margin="dense"
                      type="email"
                      value={toEmail}
                      onChange={(e) => handleEmailInputChange(e, "to")}
                      onKeyDown={(e) => handleEmailKeyDown(e, "to")}
                      InputProps={{
                        sx: {
                          padding: 0,
                          "& input": {
                            padding: 0, // Adjust padding for the input field itself
                          },
                        },
                      }}
                      sx={{
                        flexGrow: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            border: "none", // Hide the border
                          },
                          "&:hover fieldset": {
                            border: "none", // Hide the border on hover
                          },
                          "&.Mui-focused fieldset": {
                            border: "none",
                          },
                        },
                      }}
                      inputRef={toEmailRef} // Attach ref here
                    />
                  </Tooltip>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  alignItems: "start",
                }}
              >
                <Typography sx={{ mr: 1, mt: 1 }}>CC:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "start",
                  }}
                >
                  {selectedCcEmails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => removeEmail(email, "cc")}
                      sx={{ mr: 1, mb: 0.5 }}
                    />
                  ))}
                  <TextField
                    margin="dense"
                    type="email"
                    value={ccEmail}
                    onChange={(e) => handleEmailInputChange(e, "cc")}
                    onKeyDown={(e) => handleEmailKeyDown(e, "cc")}
                    InputProps={{
                      sx: {
                        padding: 0,
                        "& input": {
                          padding: 0, // Adjust padding for the input field itself
                        },
                      },
                    }}
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none", // Hide the border
                        },
                        "&:hover fieldset": {
                          border: "none", // Hide the border on hover
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                    inputRef={ccEmailRef} // Attach ref here
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  alignItems: "start",
                }}
              >
                <Typography sx={{ mr: 1, mt: 1 }}>BCC:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "start",
                  }}
                >
                  {selectedBccEmails.map((email, index) => (
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => removeEmail(email, "bcc")}
                      sx={{ mr: 1, mb: 0.5 }}
                    />
                  ))}
                  <TextField
                    margin="dense"
                    type="email"
                    value={bccEmail}
                    onChange={(e) => handleEmailInputChange(e, "bcc")}
                    onKeyDown={(e) => handleEmailKeyDown(e, "bcc")}
                    InputProps={{
                      sx: {
                        padding: 0,
                        "& input": {
                          padding: 0, // Adjust padding for the input field itself
                        },
                      },
                    }}
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none", // Hide the border
                        },
                        "&:hover fieldset": {
                          border: "none", // Hide the border on hover
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                    inputRef={bccEmailRef} // Attach ref here
                  />
                </Box>
              </Box>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography sx={{ mr: 1, mt: 1 }}>Subject:</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "start",
                    flexGrow: 1, // Allow the Box to take the remaining space
                  }}
                >
                  <TextField
                    margin="dense"
                    type="text"
                    fullWidth
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    InputProps={{
                      sx: {
                        padding: 0,
                        "& input": {
                          padding: 0, // Adjust padding for the input field itself
                        },
                      },
                    }}
                    sx={{
                      flexGrow: 1, // Allow TextField to take the remaining space
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none", // Hide the border
                        },
                        "&:hover fieldset": {
                          border: "none", // Hide the border on hover
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Divider />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "start",
                    flexGrow: 1, // Allow the Box to take the remaining space
                  }}
                >
                  <TextField
                    margin="dense"
                    type="text"
                    fullWidth
                    placeholder="Body"
                    multiline
                    rows={15}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    InputProps={{
                      sx: {
                        padding: 0,
                        "& input": {
                          padding: 0, // Adjust padding for the input field itself
                        },
                      },
                    }}
                    sx={{
                      flexGrow: 1, // Allow TextField to take the remaining space
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none", // Hide the border
                        },
                        "&:hover fieldset": {
                          border: "none", // Hide the border on hover
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {attachments.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => removeAttachment(file.name)}
                    sx={{ mr: 1, mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            p: 3,
          }}
        >
          <Box>
            <Button
              disabled={
                (selectedToEmails && selectedToEmails.length === 0) || !body
              }
              variant="contained"
              onClick={handleSend}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
          <Box>
            <input
              accept="*"
              style={{ display: "none" }}
              id="attachment-input"
              multiple
              type="file"
              onChange={handleAttachmentChange}
            />
            <label htmlFor="attachment-input">
              <IconButton component="span" color="primary">
                <AttachFileIcon />
              </IconButton>
            </label>
          </Box>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        errorOpen={errorOpen}
        setErrorOpen={setErrorOpen}
        snackbarType={snackbarType}
        snackbarMessage={snackbarMessage}
      />
    </>
  );
};

export default EmailForm;
