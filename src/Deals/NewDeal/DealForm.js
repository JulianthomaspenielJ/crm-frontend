import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Box
} from "@mui/material";
import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "../../services/AuthService";

const priorityOptions = ["Low", "Normal", "High"];
const productTypeOptions = [
  "Tower Desktop",
  "WorkStation",
  "All in one pc",
  "Server",
  "Laptop",
  "Tablet",
  "Mini PC",
  "Gaming Laptop",
];

const productDescriptions = {
  "Tower Desktop": "Processor/ MotherBoard/ RAM/ Storage/ Display/ Accessories/ Graphics Card/ OS/ Warranty",
  "WorkStation": "Processor/ MotherBoard/ RAM/ Storage/ Display/ Accessories/ Graphics Card/ OS/ Warranty",
  "All in one pc": "Processor/ MotherBoard/ RAM/ Storage/ OS/ Screen Size/ Warranty",
  "Server": "Processor/ MotherBoard/ RAM/ Storage/ Display/ Accessories/ Graphics Card/ OS/ Warranty",
  "Laptop": "Processor/ RAM / Storage/ Screen Size/ OS/ Warranty/ Others",
  "Tablet": "Processor/ RAM / Storage/ Screen size/ OS/ Warranty",
  "Mini PC": "Processor/ RAM/ Storage/ OS/ Monitor Size/ Accessories/ Warranty",
  "Gaming Laptop": "Processor/ RAM / Storage/ Screen Size/ OS/ Warranty/ Graphics Card/ Others",
};

function DealForm({ setDealOpen, dealOpen, Id, type, fetchData }) {
  const CRMBaseURL = AuthService();

  const [ownerList, setOwnerList] = useState([]);
  const [dealOwner, setDealOwner] = useState(null);
  // const [pricing, setPricing] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dealStartDate, setDealStartDate] = useState("");
  const [approximateClosingDate, setApproximateClosingDate] = useState("");
  const [priority, setPriority] = useState("");
  const [productType, setProductType] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const userName = storedUserData?.name;
  const userID = storedUserData?.id;
  const role = storedUserData?.userRole;

  // Fetch owners list from API
  const fetchComponents = async () => {
    try {
      const owner = await CRMBaseURL.get("userslist");
      const list = owner.data.data;
      setOwnerList(list);
    } catch (err) {
      console.error("Error fetching components", err);
    }
  };

  // Set today's date for deal start date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  };

  const handleUpdate = async () => {
    if (!dealStartDate || !approximateClosingDate) {
      alert("Please fill in all date fields.");
      return;
    }

    const values = {
      companyID: Id,
      isCompany: type === "Company" ? 1 : 0,
      UserId: userID,
      createdBy: `${storedUserData?.userName} (${storedUserData?.email})`,
      fromEmail: storedUserData?.email,
      team: storedUserData?.team,
      dealOwnerId: dealOwner?.id || userID,
     // dealOwnerName: dealOwner?.name || userName, 
      // pricing,
      dealOwnerName: dealOwner?.name || userName,
      //pricing,
      quantity,
      dealStartDate,
      approximateClosingDate,
      priority,
      productType,
      productDescription,
    };
    try {
      const res = await CRMBaseURL.post("adddeal", values);
      fetchComponents();
    } catch (e) {
      console.log(e);
    }
    setDealOpen(false);
    fetchData()
  };

  const handleClose = () => {
    setDealOpen(false);
  };

  useEffect(() => {
    fetchComponents();
    setDealStartDate(getTodayDate()); // Set today's date on component mount
  }, []);

  return (
    <Dialog open={dealOpen} fullWidth>
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
          Create a New Deal
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{ color: "#FFF" }}
        >
          <CloseIcon sx={{ color: "#FFF" }} />
        </IconButton>
      </DialogTitle>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            fullWidth
            disablePortal
            options={productTypeOptions}
            renderInput={(params) => (
              <TextField required {...params} label="Product Type" />
            )}
            value={productType}
            onChange={(e, newValue) => setProductType(newValue)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>

        </Grid>
        <Grid item xs={6}>
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 500, color:"#787878" }}>
            <b>Note</b>:{" "}
            {productType
              ? productDescriptions[productType] || ''
              : "Processor/ MotherBoard/ RAM/ Storage/ Display/ Accessories/ Graphics Card/ OS/ Warranty"}
          </Typography>
        </Box>
      </Grid>
        {/* <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pricing"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
          />
        </Grid>  */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Grid>

        {/* Conditionally show or disable Deal Owner field */}
        {role === "Manager" || role === "Admin" || role === "Super Admin" ? (
          <Grid item xs={12} sm={6}>
            <Autocomplete
              fullWidth
              disablePortal
              options={ownerList}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField required {...params} label="Deal Owner" />
              )}
              value={dealOwner}
              onChange={(e, newValue) => setDealOwner(newValue)}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Deal Owner"
              value={userName}
              disabled // Disabled for non-Managers
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            required
            label="Deal Start Date"
            InputLabelProps={{ shrink: true }}
            value={dealStartDate}
            onChange={(e) => setDealStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            type="date"
            label="Approximate Closing Date"
            InputLabelProps={{ shrink: true }}
            value={approximateClosingDate}
            onChange={(e) => setApproximateClosingDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            fullWidth
            disablePortal
            options={priorityOptions}
            renderInput={(params) => <TextField required {...params} label="Priority" />}
            value={priority}
            onChange={(e, newValue) => setPriority(newValue)}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent="flex-end" sx={{ p: 3 }}>
        <Button
          variant="contained"
          sx={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            color: "#FFF",
          }}
          onClick={handleUpdate}
        >
          Make a Deal
        </Button>
      </Grid>
    </Dialog>
  );
}

export default DealForm;
