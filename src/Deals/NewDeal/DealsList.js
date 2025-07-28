import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import AuthService from "../../services/AuthService";
import DealViewDialog from "./DealViewDialog";

function DealsList({ ActivityData, fetchData,setLoading }) {
  const CRMBaseURL = AuthService();

  const options = [
    "Quotation Required",
    "Quotation Sent",
    "Appointment Scheduled",
    "Demo Scheduled",
    "Negotiation",
    "Closed Won",
    "Closed Loss",
    "Invalid",
  ];

  const [dealsData, setDealsData] = useState(ActivityData?.deals || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [editedFinalOutcome, setEditedFinalOutcome] = useState("");
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [statusToUpdate, setStatusToUpdate] = useState("");

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (ActivityData?.deals) {
      setDealsData(ActivityData.deals);
    }
  }, [ActivityData]);

  const handleClickListItem = (event, id) => {
    setSelectedDealId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (status) => {
    if (
      status === "Closed Loss" ||
      status === "Invalid" ||
      status === "Negotiation"
    ) {
      setStatusToUpdate(status); // Set the selected status
      setReasonDialogOpen(true); // Open the reason dialog
    } else {
      updateDealStatus(status, null); // For other statuses, update directly
    }
    setAnchorEl(null);
  };

  const updateDealStatus = async (status, reason) => {
    const updatedDeals = dealsData.map((deal) =>
      deal.id === selectedDealId ? { ...deal, status } : deal
    );

    const updatedDealData = updatedDeals.find(
      (deal) => deal.id === selectedDealId
    );
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    const values = {
      id: updatedDealData.id,
      status: status, // Use the dynamically set status here
      editedBy: storedUserData ? `${storedUserData.userName}` : undefined,
      reason: reason || "",
    };

    setDealsData(updatedDeals);

    const res = await CRMBaseURL.post("updatedealstatus", values);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReasonDialogClose = () => {
    setReasonDialogOpen(false);
    setReason("");
  };

  const handleReasonSubmit = () => {
    updateDealStatus(statusToUpdate, reason); // Use the selected status from state
    setReasonDialogOpen(false);
    setReason("");
  };

  const handleOpenDetails = async (deal) => {
    if (deal) {
      try {
        const res = await CRMBaseURL.post("dealdetaileddata", { id: deal.id });
        const data = res.data?.data;
        setCurrentDeal(data);
        setDialogOpen(true);
      } catch (error) {
        console.error("Error fetching deal details", error);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditOutcome = async () => {
    const updatedDeals = dealsData.map((deal) =>
      deal.id === currentDeal.id
        ? { ...deal, finalOutCome: editedFinalOutcome }
        : deal
    );

    setDealsData(updatedDeals);
    setCurrentDeal({ ...currentDeal, finalOutCome: editedFinalOutcome });

    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const values = {
      id: currentDeal.id,
      finalOutCome: editedFinalOutcome,
      editedBy: storedUserData
        ? `${storedUserData.userName} (${storedUserData.email})`
        : undefined,
    };

    try {
      const res = await CRMBaseURL.post("updatefinaloutcome", values);
    } catch (error) {
      console.error("Error updating final outcome", error);
    }
  };
  return (
    <div
      style={{
        height: "87%",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {dealsData.length ? (
        dealsData.map((data) => (
          <Box
            key={data.id}
            sx={{ mt: 1, border: "2px solid #f1efef", ml: 2, p: 2 }}
          >
            {/* Deal Details */}
            <Typography
              onClick={() => handleOpenDetails(data)}
              sx={{
                color: "#367cee",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {data.ticketID}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: 1,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Product Type:
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#00000082",
                  pl: 1,
                }}
              >
                {data.productType}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: 1,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Deal Owner:
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#00000082",
                  pl: 1,
                }}
              >
                {data.dealOwnerName}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: 1,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Start Date:
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,

                  color: "#00000082",
                  pl: 1,
                }}
              >
                {data.dealStartDate}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: 1,
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Product:
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#00000082",
                  pl: 1,
                }}
              >
                {data.productType}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: 1,
              }}
            ></Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                Status:
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#00000082",
                  pl: 1,
                }}
              >
                <div>
                  <Box
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    aria-expanded={open ? "true" : undefined}
                    onClick={(event) => handleClickListItem(event, data.id)}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {data.status || options[0]}{" "}
                    </Typography>
                    {data.status !== "Waiting for Approval" && (
                      <IconButton sx={{ fontSize: 20, color: "#322E6F" }}>
                        {open && selectedDealId === data.id ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </IconButton>
                    )}
                  </Box>

                  <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    open={open && selectedDealId === data.id}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "lock-button",
                      role: "listbox",
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem
                        key={option}
                        selected={option === data.status}
                        onClick={() => handleMenuItemClick(option)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={{ mt: 1, bgcolor: "#f4f4f4", ml: 2, p: 2 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#00000082",
              pl: 1,
            }}
          >
            No deals found.
          </Typography>
        </Box>
      )}

      <Dialog open={reasonDialogOpen} onClose={handleReasonDialogClose}>
        <DialogTitle>Provide a Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReasonDialogClose}>Cancel</Button>
          <Button onClick={handleReasonSubmit} disabled={!reason}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <DealViewDialog
        open={dialogOpen}
        deal={currentDeal}
        onClose={handleCloseDialog}
        onEditOutcome={handleEditOutcome}
        editedFinalOutcome={editedFinalOutcome}
        setEditedFinalOutcome={setEditedFinalOutcome}
        setLoading={setLoading}
      />
    </div>
  );
}

export default DealsList;
