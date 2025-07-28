import React, { useState, useRef } from "react";
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

const TaskForm = ({ setTaskOpen, taskOpen, id, type, fetchData }) => {
  const [editorContent, setEditorContent] = useState("");
  const [openInFullIcon, setOpenInFullIcon] = useState(false);
  const [taskDate, setTaskDate] = useState(dayjs());
  const [task, setTask] = useState("");
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const CRMBaseURL = AuthService();
  const data = ["Call", "Email", "Meeting", "To-Do"];
  const quillRef = useRef(); // Ref for the ReactQuill component

  const handleChange = (value) => {
    setEditorContent(value);
  };

  const handleSave = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const Task = {
      companyID: id,
      isCompany: type === "Company" ? 1 : 0,
      notes: editorContent,
      date: taskDate.format(),
      task: task,
      UserId: storedUserData?.id,
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    try {
      const res = await CRMBaseURL.post("inserttask", Task);
      setSnackbarType("success");
      setSnackbarMessage(res && res.data.message);
      setErrorOpen(true);
      setTaskOpen(false);
      setEditorContent("");
      setTask("");
      setOpenInFullIcon(false);
      setTaskDate(dayjs());
      fetchData();
    } catch (e) {
      setSnackbarType("error");
      setSnackbarMessage("Something went wrong ! Please try again");
      setErrorOpen(true);
    }
   
  };

  const handleClose = () => {
    setTaskOpen(false);
    setTask("");
    setEditorContent("");
    setOpenInFullIcon(false);
    setTaskDate(dayjs());
  };

  // Custom toolbar configuration
  const modules = {
    toolbar: {
      container: "#toolbar", // Use custom toolbar container ID
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

  return (
    <div>
      <Dialog
        open={taskOpen}
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
            Task
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
                value={task}
                onChange={(e, newValue) => {
                  setTask(newValue);
                }}
                id="combo-box-demo"
                options={data}
                sx={{ my: 2 }}
                renderInput={(params) => <TextField {...params} label="Task" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date & Time"
                  fullWidth
                  sx={{ my: 2 }}
                  value={taskDate}
                  onChange={(newValue) => {
                    if (newValue && newValue.isValid()) {
                      setTaskDate(newValue);
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
                height: openInFullIcon ? "450px" : "300px",
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
            color="primary"
            disabled={
              !task || editorContent === "" || editorContent === "<p><br></p>"
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

export default TaskForm;
