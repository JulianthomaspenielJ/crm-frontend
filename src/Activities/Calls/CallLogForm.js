import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  TextField,
  Grid,
  Autocomplete,
} from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "../../services/AuthService";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CustomSnackbar from "../SuccessSnackbar/Snackbar";

const LogCallForm = ({ setLogCallOpen, logCallOpen, id, type, fetchData }) => {
  const [editorContent, setEditorContent] = useState("");
  const [openInFullIcon, setOpenInFullIcon] = useState(false);
  const [callDate, setCallDate] = useState(dayjs());
  const [callTo, setCallTo] = useState([]);
  const [callOutcome, setCallOutcome] = useState("");
  const [callDirection, setCallDirection] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const CRMBaseURL = AuthService();
  const modules = {
    toolbar: {
      container: "#toolbar", 
    },
  };

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "link",
    "image",
    "align",
    "clean",
  ];
  const callOutcomeOptions = [
    "Busy",
    "Connected",
    "Left live message",
    "Left voice Mail",
    "No answer",
    "Wrong number",
  ];
  const callDirectionOptions = ["Inbound", "Outbound"];
  const quillRef = useRef(); 

  const handleChange = (value) => {
    setEditorContent(value);
  };

  useEffect(() => {
    CRMBaseURL.get('getattendees')
      .then(response => {
        const fetchedData = response.data && Array.isArray(response.data.data) ? response.data.data : [];
        setCallTo(fetchedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
        setCallTo([]);
      });
  }, []);
  
  const handleSave = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const CallDetails = {
      companyID: id,
      isCompany: type === "Company" ? 1 : 0,
      callFrom: storedUserData?.email,
      callTo: selectedCall ? selectedCall.id : "", 
      callAt: callDate.format(),
      callOutcome: callOutcome,
      callDirection: callDirection,
      notes: editorContent,
      UserId: storedUserData?.id,
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    try {
      const res = await CRMBaseURL.post("insertcalls", CallDetails);
      setSnackbarType("success");
      setSnackbarMessage(res && res.data.message);
      setErrorOpen(true);
      setLogCallOpen(false);
      setEditorContent("");
      setCallTo([]);
      setCallOutcome("");
      setCallDirection("");
      setOpenInFullIcon(false);
      setCallDate(dayjs());
      fetchData();
    } catch (e) {
      setSnackbarType("error");
      setSnackbarMessage("Something went wrong ! Please try again");
      setErrorOpen(true);
    }
   
  };
  

  const handleClose = () => {
    setLogCallOpen(false);
    setEditorContent("");
    setCallTo("");
    setCallOutcome("");
    setCallDirection("");
    setOpenInFullIcon(false);
    setCallDate(dayjs());
  };

  return (
    <div>
      <Dialog
        open={logCallOpen}
        fullWidth
        maxWidth={openInFullIcon ? "lg" : "sm"}
        sx={{
          "& .MuiDialog-paper": {
            minHeight: openInFullIcon ? "750px" : "550px",
            maxHeight: openInFullIcon ? "750px" : "550px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Log Call
          </Typography>
          <Box>
            <IconButton
              color="inherit"
              onClick={() => setOpenInFullIcon(!openInFullIcon)}
              sx={{ color: "#FFF" }}
            >
              {openInFullIcon ? (
                <CloseFullscreenIcon sx={{ color: "#FFF" }} />
              ) : (
                <OpenInFullIcon sx={{ color: "#FFF" }} />
              )}
            </IconButton>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              sx={{ color: "#FFF" }}
            >
              <CloseIcon sx={{ color: "#FFF" }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                disablePortal
                sx={{mt:2}}
                value={selectedCall}
                onChange={(e, newValue) => {
                  setSelectedCall(newValue);
                }}
                id="combo-box-demo"
                options={callTo} 
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Attendees"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                disablePortal
                value={callOutcome}
                onChange={(e, newValue) => setCallOutcome(newValue)}
                id="call-outcome"
                options={callOutcomeOptions}
                sx={{ my: 2 }}
                renderInput={(params) => (
                  <TextField {...params} label="Call Outcome" />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                disablePortal
                value={callDirection}
                onChange={(e, newValue) => setCallDirection(newValue)}
                id="call-direction"
                options={callDirectionOptions}
                sx={{ mb: 2 }}
                renderInput={(params) => (
                  <TextField {...params} label="Call Direction" />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Call Date & Time"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={callDate}
                  onChange={(newValue) => {
                    if (newValue && newValue.isValid()) {
                      setCallDate(newValue);
                    } else {
                      console.error("Invalid date value:", newValue);
                    }
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <div className="quill-container">
            <ReactQuill
              ref={quillRef}
              placeholder="Write Notes"
              value={editorContent}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              style={{
                height: openInFullIcon ? "400px" : "200px",
                overflowY: "auto",
              }}
            />
            <div id="toolbar" className="quill-toolbar">
              <button className="ql-bold">Bold</button>
              <button className="ql-italic">Italic</button>
              <button className="ql-underline">Underline</button>
              <button className="ql-strike">Strike</button>
              <button className="ql-code">Code</button>

              <button className="ql-list" value="ordered">
                Ordered List
              </button>
              <button className="ql-list" value="bullet">
                Bullet List
              </button>
              <button className="ql-indent" value="-1">
                Decrease Indent
              </button>
              <button className="ql-indent" value="+1">
                Increase Indent
              </button>

              <button className="ql-align" value="">
                Align Left
              </button>
              <button className="ql-align" value="center">
                Align Center
              </button>
              <button className="ql-align" value="right">
                Align Right
              </button>
              <button className="ql-align" value="justify">
                Justify
              </button>

              <button className="ql-image">Image</button>

              <button className="ql-clean">Clear Formatting</button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              !callOutcome ||
              !callTo ||
              !callDirection ||
              editorContent === "" ||
              editorContent === "<p><br></p>"
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        errorOpen={errorOpen}
        setErrorOpen={setErrorOpen}
        snackbarType={snackbarType}
        snackbarMessage={snackbarMessage}
      />
    </div>
  );
};

export default LogCallForm;
