import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import companyLogo from "../Image/company_logo.png";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowLeft";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import * as Yup from "yup";
import ActivitesMain from "../Activities/ActivitiesMain";
import CreateDeal from "../Deals/NewDeal/CreateDeal";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteDialog from "../Activities/DeleteDialog/DeleteDialog";

function ContactDetails({ setLoading }) {
  const CRMBaseURL = AuthService();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const location = useLocation();
  const navigate = useNavigate();
  const { ID } = location.state || {};

  const lifecycleStageOptions = [
    // "Subscriber",
    // "Lead",
    "Marketing Qualified Lead",
    "Sales Qualified Lead",
    // "Opportunity",
    // "Customer",
    // "Evangelist",
    // "Others",
  ];

  const leadStatusOptions = [
    "New",
    "Open",
    // "In progress",
    // "Open deal",
    // "Unqualified",
    // "Attempted to contact",
    // "Connected",
    // "Not Connected",
    // "Out of Service",
  ];
  const validationSchema = Yup.object({
    name: Yup.string().required("Name must be required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .required("Mobile number must be required")
      .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    lifeCycleStage: Yup.string()
      .required("Please select Lifecycle stage")
      .oneOf(lifecycleStageOptions, "Invalid lifecycle stage"),
    leadStatus: Yup.string()
      .required("Please Select Lead status")
      .oneOf(leadStatusOptions, "Invalid lead status"),
    contactLevelType: Yup.string().required(
      "Contact level type must be required"
    ),
  });
  const contactLevelTypeOptions = ["Gold", "Silver", "Bronze"];

  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [error, setError] = useState("");
  const [ActivityData, setActivityData] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const fetchContact = async () => {
    const res = await CRMBaseURL.post("getcontactdata", { ID });

    setFormData(res.data?.data);
    setContactDetails(res.data?.data);
    setActivityData(res?.data);
  };

  useEffect(() => {
    if (ID) {
      fetchContact();
    } else {
      navigate("/dashboard/customers_table");
    }
  }, [navigate, ID]);

  const handleEditClick = (fieldName) => {
    setIsEditing(true);
    setEditField(fieldName);
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSave = async (fieldName) => {
    

    try {
      await validationSchema.validateAt(fieldName, formData);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    const fields = [
      "jobTitle",
      "lifeCycleStage",
      "leadStatus",
      "phoneNumber",
      "name",
      "contactLevelType",
      "email",
    ];

    const values = {
      id: contactDetails.id,
      editedBy: storedUserData
        ? `${storedUserData.userName} (${storedUserData.email})`
        : undefined,
      ...fields.reduce((acc, field) => {
        acc[field] =
          fieldName === field ? formData[field] : contactDetails[field];
        return acc;
      }, {}),
    };

  
    try {
      const response = await CRMBaseURL.post("editcontactdata", values);
     
    } catch (e) {
      console.log(e);
    }

   
    setEditField(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditField(null);
  };

  if (!contactDetails) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ mt: 4 }}
      ></Typography>
    );
  }

  const renderField = (label, value, name, options) => (
    <Box
      sx={{
        pb: 3,
        position: "relative",
        "&:hover .editButton": {
          display: "flex",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#00000082" }}>
          {label}
        </Typography>
        {storedUserData &&
          ((storedUserData.team === "Admin" &&
            storedUserData.userRole !== "Executive") ||
            ((storedUserData.team === "Sales" ||
              storedUserData.team === "Marketing") &&
              storedUserData.userRole !== "Executive")) &&
          !isEditing &&
          name !== "LastContacted" && (
            <IconButton
              color="primary"
              onClick={() => handleEditClick(name)}
              sx={{
                ml: 1,
                display: "none",
                position: "absolute",
                right: 0,
                top: 0,
              }}
              className="editButton"
            >
              <EditIcon />
            </IconButton>
          )}
      </Box>
      {isEditing && editField === name ? (
        <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
          {options ? (
            <Autocomplete
              options={options}
              value={value}
              fullWidth
              error={!!error}
              helperText={error}
              onChange={(event, newValue) => handleFieldChange(name, newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  size="small"
                  fullWidth
                />
              )}
            />
          ) : (
            <TextField
              variant="standard"
              size="small"
              fullWidth
              name={name}
              value={value}
              error={!!error}
              helperText={error}
              onChange={(e) => handleFieldChange(name, e.target.value)}
            />
          )}
          <IconButton
            color="primary"
            onClick={() => handleSave(name)}
            sx={{ ml: 1 }}
          >
            <SaveIcon />
          </IconButton>
          <IconButton color="secondary" onClick={handleCancel} sx={{ ml: 1 }}>
            <CancelIcon />
          </IconButton>
        </Box>
      ) : (
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{value}</Typography>
      )}
    </Box>
  );

  return (
    <div>
      <Grid container spacing={2} sx={{ height: "90vh" }}>
        <Grid item xs={12} md={3} sx={{ height: "100%" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              height: "100%",
              px: 2,
              pt: 2,
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pb: 3,
              }}
            >
              <Link
                to="/dashboard/customers_table"
                style={{ textDecoration: "none" }}
              >
                <Typography
                  sx={{
                    color: "#e02b6a",
                    fontWeight: 500,
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
                  <span style={{ marginLeft: 4 }}>Contacts</span>
                </Typography>
              </Link>
              {storedUserData &&
                (storedUserData.team === "Admin" ||
                  storedUserData.team === "Sales" ||
                  storedUserData.team === "Marketing") &&
                (storedUserData.userRole === "Admin" ||
                  storedUserData.userRole === "Super Admin" ||
                  storedUserData.userRole === "Manager") && (
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => {
                        setOpenDialog(true);
                      }}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                )}
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <img
                src={companyLogo}
                alt="Company Logo"
                style={{ width: 60, height: 60 }}
              />
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {contactDetails.name}
                </Typography>
                <a
                  href={`https://${contactDetails.companyName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, fontWeight: 500, color: "#3aa2ef" }}
                >
                  <Typography>{contactDetails.companyName}</Typography>
                </a>
                <Typography sx={{ pt: 0.5, fontSize: 12 }}>
                  {contactDetails.email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ py: 2 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                About this Contact
              </Typography>
            </Box>
            <Box
              sx={{
                height: "75%",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {renderField("Name", formData.name, "name")}
              {renderField("Email", formData.email, "email")}
              {renderField("Job Title", formData.jobTitle, "jobTitle")}
              {renderField("Phone Number", formData.phoneNumber, "phoneNumber")}
              {/* {renderField(
                "Last Contacted",
                formData.LastContacted?.String || "",
                "LastContacted"
              )} */}
              {renderField(
                "Lifecycle Stage",
                formData.lifeCycleStage,
                "lifeCycleStage",
                lifecycleStageOptions
              )}
              {renderField(
                "Lead Status",
                formData.leadStatus,
                "leadStatus",
                leadStatusOptions
              )}
              {renderField(
                "Contact Level Type",
                formData.contactLevelType,
                "contactLevelType",
                contactLevelTypeOptions
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9} sx={{ height: "100%" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              height: "100%",
              px: 2,
              pt: 2,
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              <Grid item xs={12} md={8} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%" }}>
                  <ActivitesMain
                    Id={ID}
                    ActivityData={ActivityData}
                    type="Contact"
                    fetchData={fetchContact}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ borderLeft: "1px solid #e0e0e0", height: "100%" }}
              >
                <Box sx={{ height: "100%" }}>
                  <CreateDeal
                    Id={ID}
                    ActivityData={ActivityData}
                    type="Contact"
                    fetchData={fetchContact}
                    setLoading={setLoading}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <DeleteDialog
        id={ID}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        type="Contact"
      />
    </div>
  );
}

export default ContactDetails;
