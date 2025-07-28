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
import axios from "axios";
import CustomSnackbar from "../SuccessSnackbar/Snackbar";

const LogMeetingForm = ({
  setLogMeetingOpen,
  logMeetingOpen,
  id,
  type,
  fetchData,
}) => {
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const [openInFullIcon, setOpenInFullIcon] = useState(false);
  const [meetingDate, setMeetingDate] = useState(dayjs());
  const [attendees, setAttendees] = useState([]);
  const [outCome, setOutCome] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");



  const CRMBaseURL = AuthService();
  const outComeOption = [
    "Scheduled",
    "Completed",
    "Rescheduled",
    "No show",
    "Cancelled",
  ];
  const quillRef = useRef(); 
  const handleChange = (value) => {
    setEditorContent(value);
  };

  useEffect(() => {
    CRMBaseURL.get('getattendees')
      .then(response => {
        const fetchedData = response.data && Array.isArray(response.data.data) ? response.data.data : [];
        setAttendees(fetchedData);
        setLoading(false);
        
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const Notes = {
      companyID: id,
      isCompany: type === "Company" ? 1 : 0,
      notes: editorContent,
      date: meetingDate.format(),
      Attendees: selectedAttendees.map(att => att.id).join(', '),
      outCome: outCome,
      duration: duration,
      UserId: storedUserData?.id,
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    // Uncomment and implement saving logic
    try {
      const res = await CRMBaseURL.post("insertmeeting", Notes);
      setSnackbarType("success");
      setSnackbarMessage(res && res.data.message);
      setErrorOpen(true);
      setLogMeetingOpen(false);
      setEditorContent("");
      setDuration('')
      setOutCome("")
      setSelectedAttendees([])
      setOpenInFullIcon(false);
      setMeetingDate(dayjs());
      fetchData();
    } catch (e) {
      setSnackbarType("error");
      setSnackbarMessage("Something went wrong ! Please try again");
      setErrorOpen(true);
    }
   
  };

  const handleClose = () => {
    setLogMeetingOpen(false);
    setEditorContent("");
    setDuration('')
    setOutCome("")
    setSelectedAttendees([])
    setOpenInFullIcon(false);
    setMeetingDate(dayjs());
  };

  // Custom toolbar configuration
  const modules = {
    toolbar: {
      container: "#toolbar",
    },
  };

  // Supported formats
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
  const timeDurations = [
    "15 Minutes",
    "30 Minutes",
    "45 Minutes",
    "1 Hour",
    "1 Hour 15 Minutes",
    "1 Hour 30 Minutes",
    "1 Hour 45 Minutes",
    "2 Hours",
    "2 Hours 15 Minutes",
    "2 Hours 30 Minutes",
    "2 Hours 45 Minutes",
    "3 Hours",
    "3 Hours 15 Minutes",
    "3 Hours 30 Minutes",
    "3 Hours 45 Minutes",
    "4 Hours",
    "4 Hours 15 Minutes",
    "4 Hours 30 Minutes",
    "4 Hours 45 Minutes",
    "5 Hours",
    "5 Hours 15 Minutes",
    "5 Hours 30 Minutes",
    "5 Hours 45 Minutes",
    "6 Hours",
    "6 Hours 15 Minutes",
    "6 Hours 30 Minutes",
    "6 Hours 45 Minutes",
    "7 Hours",
    "7 Hours 15 Minutes",
    "7 Hours 30 Minutes",
    "7 Hours 45 Minutes",
    "8 Hours",
  ];

  return (
    <div>
      <Dialog
        open={logMeetingOpen}
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
            Log Meeting
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
                multiple
                sx={{mt:2}}
                disablePortal
                value={selectedAttendees}
                onChange={(e, newValue) => {
                  setSelectedAttendees(newValue);
                }}
                id="combo-box-demo"
                options={attendees}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                loading={loading} // Show loading indicator
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date & Time"
                  fullWidth
                  sx={{ my: 2 }}
                  value={meetingDate}
                  onChange={(newValue) => {
                    if (newValue && newValue.isValid()) {
                      setMeetingDate(newValue);
                    } else {
                      console.error("Invalid date value:", newValue);
                    }
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                disablePortal
                value={outCome}
                onChange={(e, newValue) => {
                  setOutCome(newValue);
                }}
                id="combo-box-demo"
                options={outComeOption}
                sx={{ mb: 2 }}
                renderInput={(params) => (
                  <TextField {...params} label="Out Come" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                disablePortal
                value={duration}
                onChange={(e, newValue) => {
                  setDuration(newValue);
                }}
                id="combo-box-demo"
                options={timeDurations}
                sx={{ mb: 2 }}
                renderInput={(params) => (
                  <TextField {...params} label="Duration" />
                )}
              />
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
        <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={
              !attendees ||
              !duration ||
              !outCome ||
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

export default LogMeetingForm;
