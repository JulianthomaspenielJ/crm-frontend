import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField, Typography } from "@mui/material";
import AuthService from "../../services/AuthService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CRMBaseURL = AuthService();
export default function PricingDeleteDialog({
  openDeleteDialog,
  setOpenDeleteDialog,
  detailedProductData,
}) {
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isTouched, setIsTouched] = useState(false); // Track if field has been touched

  // Function to handle the input change
  const handleReasonChange = (event) => {
    setIsTouched(false);
    const value = event.target.value;
    setReason(value);

    // Check if the length is valid to enable or disable the submit button
    if (value.length >= 30) {
      setError("");
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };

  // Function to handle validation on blur
  const handleReasonBlur = () => {
    setIsTouched(true);

    if (!reason) {
      setError("Reason is required.");
    } else if (reason.length < 30) {
      setError("Reason must be at least 30 characters.");
    } else {
      setError("");
    }
  };

  // Function to handle dialog close
  const handleClose = () => {
    setOpenDeleteDialog(false);
    setReason(""); // Reset reason on close
    setError(""); // Reset error on close
    setIsSubmitDisabled(true); // Disable submit on close
    setIsTouched(false); // Reset touched state on close
  };

  const handleSubmit = async () => {
    const data = {
      id: detailedProductData?.referenceID,
      reason: reason,
      deletedBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
    };
    try{
      const res = await CRMBaseURL.post("removeproduct", data)
      console.log(res)
    }catch(e){
      console.log(e)
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={openDeleteDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            color:"#FFF",
            marginBottom:2,
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          }}
        >
          {"Confirmation"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are You sure you want to delete this Pricing data?
          </Typography>
          <TextField
            sx={{ marginY: 2 }}
            multiline
            rows={4}
            fullWidth
            placeholder="Write Reason (at least 30 characters)"
            value={reason}
            onChange={handleReasonChange}
            onBlur={handleReasonBlur} // Validate on blur
            error={Boolean(error) && isTouched} // Show error only if field is touched
            helperText={isTouched ? error : ""} // Display error message if touched
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundImage:
                !isSubmitDisabled &&
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            }}
            onClick={() => {
              handleSubmit();
              handleClose();
            }}
            disabled={isSubmitDisabled}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
