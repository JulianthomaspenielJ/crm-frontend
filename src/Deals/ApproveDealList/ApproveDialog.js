import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Autocomplete,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box,
} from "@mui/material";
import AuthService from "../../services/AuthService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ApproveDialog({
  approveDialog,
  setApproveDialog,
  approveID,
  fetchDealsData,
  notificationID,
}) {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [userList, setUserList] = useState("");
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [dealsData, setDetailsData] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [approvalType, setApprovalType] = useState("approve");
  const [reason, setReason] = useState("");
  const [isReasonFocused, setIsReasonFocused] = useState(false); // New state to manage focus
  const [isReasonError, setIsReasonError] = useState(false); // New state to manage error

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

  const FetchDeals = async () => {
    const Values = {
      id: approveID,
      notificationID: notificationID,
    };
    try {
      const res = await CRMBaseURL.post("dealdetaileddata", Values);
      const data = res.data?.data;
      setDetailsData(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (approveID) {
      FetchDeals();
    }
  }, [approveID]);

  const handleApprove = async (type) => {
    if (type === "approve") {
      const values = {
        id: approveID,
        quotationUpdaterName: inputValue,
        quotationUpdaterID: selectedUserID,
        dealApproverID: storedUserData ? parseInt(storedUserData.id, 10) : null,
        dealApprover:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
      };

      try {
        var response = await CRMBaseURL.post("approvedeal", values);
        console.log(response)
      } catch (e) {
        console.log(e);
      } finally {
        fetchDealsData();
      }
    } else if (type === "deny") {
      const values = {
        id: approveID,
        reason: reason,
        deletedBy:
          storedUserData &&
          `${storedUserData.userName} (${storedUserData.email})`,
      };
      try {
        const res = await CRMBaseURL.post("denydeal", values);
        if (response.data.message === "Deal Denied Successfully") {
          fetchDealsData();
        }
      } catch (e) {
        console.log(e);
      }finally{
        fetchDealsData();
      }
    }
    setApproveDialog(false);
    setInputValue("");
    setReason("");
    setIsReasonError(false);
  };

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

  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={approveDialog}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            color: "#FFF",
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          }}
        >
          {"Deal Details"}
        </DialogTitle>
        <DialogContent>
          {dealsData ? (
            <Box
              sx={{
                padding: "15px",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <Box sx={{ mr: 2, pb: 1 }}>
                {/* Left side: Deal Details */}
                {[
                  { label: "Product Type", value: dealsData.productType },
                  {
                    label: "Product Description",
                    value: dealsData.productDescription,
                  },
                  { label: "Quantity", value: dealsData.quantity },
                  { label: "Priority", value: dealsData.priority },
                ].map(({ label, value }) => (
                  <Box sx={{ pb: 2 }} key={label}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, pb: 0.5 }}>
                      {label}:
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>{value}</Typography>
                  </Box>
                ))}

                <Box sx={{ pb: 2 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, pb: 0.5 }}>
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
              </Box>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setApproveDialog(false);
              setInputValue("");
              setReason("");
              setIsReasonError(false);
              fetchDealsData();
            }}
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
                  (approvalType === "deny" && reason && reason.length > 30)) &&
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              color: "#FFF",
            }}
            onClick={() => {
              handleApprove(approvalType);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
