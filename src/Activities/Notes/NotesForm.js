import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import "./Notes.css";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "../../services/AuthService";
import CustomSnackbar from "../SuccessSnackbar/Snackbar";

const NotesForm = ({ setNotesOpen, notesOpen, id, type, fetchData }) => {
  const [editorContent, setEditorContent] = useState("");
  const [openInFullIcon, setOpenInFullIcon] = useState(false);
  const [errorOpen, setErrorOpen] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");

  const CRMBaseURL = AuthService();

  const handleChange = (value) => {
    setEditorContent(value);
  };

  const handleSave = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const Notes = {
      companyID: id,
      isCompany: type === "Company" ? 1 : 0,
      notes: editorContent,
      UserId: storedUserData?.id,
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    try {
      const res = await CRMBaseURL.post("insertnote", Notes);
      setSnackbarType("success");
      setSnackbarMessage(res && res.data.message);
      setErrorOpen(true);
      setNotesOpen(false);
      setEditorContent("");
      setOpenInFullIcon(false);
      fetchData();
    } catch (e) {
      setSnackbarType("error");
      setSnackbarMessage("Something went wrong ! Please try again");
      setErrorOpen(true);
    }
  };

  const handleClose = () => {
    setNotesOpen(false);
    setEditorContent("");
    setOpenInFullIcon(false);
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
        open={notesOpen}
        fullWidth
        maxWidth={openInFullIcon ? "lg" : "sm"}
        sx={{
          "& .MuiDialog-paper": {
            minHeight: openInFullIcon ? "610px" : "460px", // Minimum height
            maxHeight: openInFullIcon ? "610px" : "460px", // Maximum height (ensures it's fixed)
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
            Notes
          </Typography>
          <Box>
            <IconButton
              color="inherit"
              onClick={() => setOpenInFullIcon(!openInFullIcon)}
              sx={{ color: "#FFF" }} // Apply white color to the icon
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
              sx={{ color: "#FFF" }} // Apply white color to the icon
            >
              <CloseIcon sx={{ color: "#FFF" }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <div className="quill-container">
            <ReactQuill
              placeholder="Write Notes"
              value={editorContent}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              style={{
                height: openInFullIcon ? "450px" : "300px",
                overflowY: "auto", // Set a fixed height for the Quill editor
              }}
            />
            <div id="toolbar" className="quill-toolbar">
              <button class="ql-bold">Bold</button>
              <button class="ql-italic">Italic</button>
              <button class="ql-underline">Underline</button>
              <button class="ql-strike">Strike</button>
              <button class="ql-code">Code</button>
              <button class="ql-list" value="ordered">
                Ordered List
              </button>
              <button class="ql-list" value="bullet">
                Bullet List
              </button>
              <button class="ql-indent" value="-1">
                Decrease Indent
              </button>
              <button class="ql-indent" value="+1">
                Increase Indent
              </button>
              <button class="ql-align" value="">
                Align Left
              </button>
              <button class="ql-align" value="center">
                Align Center
              </button>
              <button class="ql-align" value="right">
                Align Right
              </button>
              <button class="ql-align" value="justify">
                Justify
              </button>
              <button class="ql-image">Image</button>
              <button class="ql-clean">Clear Formatting</button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={editorContent === "" || editorContent === "<p><br></p>"}
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

export default NotesForm;
