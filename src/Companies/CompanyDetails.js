import {
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
  Autocomplete,
  Tooltip,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import ContactsList from "./ContactsList";

function stringToColor(string) {
  let hash = 80;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  const initials = name
    ? name
        .split(" ")
        .map((word) => word[0])
        .filter((char) => char) // Filters out empty characters
        .slice(0, 2) // Limits to the first two initials
        .join("")
    : "?"; // Fallback if name is undefined or empty

  return {
    sx: {
      bgcolor: stringToColor(name || "default"), // Fallback color for undefined names
    },
    children: initials,
  };
}


function CompanyDetails({ setLoading }) {
  const location = useLocation();
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const { ID } = location.state || {};
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState(null);
  const [companyDetails, setCompanyDetails] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [ActivityData, setActivityData] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [companyID, setCompanyID] = useState(0)
  const numberOfEmployeesOptions = [
    "1 to 10",
    "10 to 50",
    "50 to 100",
    "100 to 500",
    "500 above",
  ];

  // Validation schema using Yup
  const validationSchema = Yup.object({
    industry: Yup.string().required("Industry must be required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    city: Yup.string().required("City must be required"),
    state: Yup.string().required("State must be required"),
    postalCode: Yup.string()
      .matches(/^[1-9][0-9]{5}$/, "Invalid postal code")
      .required("Postal code must be required"),
    timeZone: Yup.string().required("Time zone must be required"),
    socialUrl: Yup.string()
      .url("Invalid URL")
      .required("Social URL must be required"),
    mobile: Yup.string()
      .required("Mobile number must be required")
      .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    country: Yup.string().required("Country must be required"),
  });

  const fetchCompanyData = async () => {
    const res = await CRMBaseURL.post("getcompanydata", { ID });
    const CompanyID = res.data.data.id;
    setCompanyID(CompanyID);
    setCompanyDetails(res.data?.data);
    setFormData(res.data?.data);
    setActivityData(res.data);
    setContactData(res.data.contacts);
  };

  useEffect(() => {
    if (ID) {
      fetchCompanyData();
    } else {
      navigate("/dashboard/customers_table");
    }
  }, [ID, navigate]);

  const handleEditClick = (fieldName) => {
    setIsEditing(true);
    setEditField(fieldName);
    setError(""); // Reset error when starting a new edit
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSave = async (fieldName) => {
    

    // Validate the field using Yup
    try {
      await validationSchema.validateAt(fieldName, formData);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    const fields = [
      "industry",
      "city",
      "state",
      "postalCode",
      "country",
      "timeZone",
      "numberOfEmployees",
      "numberOfBranches",
      "annualRevenue",
      "socialUrl",
      "description",
      "mobile",
      "email",
    ];

    const values = {
      id: companyDetails.id,
      editedBy: storedUserData
        ? `${storedUserData.userName} (${storedUserData.email})`
        : undefined,
      ...fields.reduce((acc, field) => {
        acc[field] =
          fieldName === field ? formData[field] : companyDetails[field];
        return acc;
      }, {}),
    };
  
    try {
      const response = await CRMBaseURL.post("editcompanydata", values);
     
      setEditField(null);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditField(null);
    setFormData(companyDetails); // Reset formData to original companyDetails
    setError(""); // Reset error on cancel
  };

  if (!companyDetails) {
    return (
      <Typography
        variant="h6"
        color="error"
        align="center"
        sx={{ mt: 4 }}
      ></Typography>
    );
  }

  const renderField = (label, value, name, options) => {
    const nonEditableFields = [
      "domainName",
      "companyOwner",
      "gstNumber",
      "panNumber",
      "msmeNumber",
      "cin",
    ];

    const isEditable = !nonEditableFields.includes(name);

    return (
      <Box
        sx={{
          pb: 3,
          position: "relative",
          "&:hover .editButton": {
            display: isEditable ? "flex" : "none",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: "#00000082" }}
          >
            {label}
          </Typography>

          {storedUserData &&
            ((storedUserData.team === "Admin" &&
              storedUserData.userRole !== "Executive") ||
              ((storedUserData.team === "Sales" ||
                storedUserData.team === "Marketing") &&
                storedUserData.userRole !== "Executive")) &&
            isEditable &&
            !isEditing && (
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
                onChange={(event, newValue) =>
                  handleFieldChange(name, newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                    fullWidth
                    name={name}
                    error={!!error}
                    helperText={error}
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
                onChange={(e) => handleFieldChange(name, e.target.value)}
                error={!!error}
                helperText={error}
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
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            {value}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ height: "90vh" }}>
        <Grid item xs={12} sm={3} sx={{ height: "100%" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              height: "100%",
              px: 4,
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
                  <span>
                    <KeyboardArrowRightIcon />
                  </span>
                  <span>Companies</span>
                </Typography>
              </Link>
              <Tooltip
                title="Delete"
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <IconButton>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {companyDetails?.companyName ? (
                <Avatar {...stringAvatar(companyDetails.companyName)} />
              ) : (
                <Avatar>?</Avatar>
              )}

              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {companyDetails.companyName}
                </Typography>
               
              </Box>
            </Box>
           
            <Box
              sx={{
                padding: "25px 0px 0px 15px",
                height: "85%",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {renderField(
                "Company Domain Name",
                formData.domainName,
                "domainName"
              )}
              {renderField("Email", formData.email, "email")}
              {renderField("Phone Number", formData.mobile, "mobile")}
              {renderField("Industry", formData.industry, "industry")}
              {renderField(
                "Company Owner",
                formData.companyOwner,
                "companyOwner"
              )}
              {renderField("GST Number", formData.gstNumber, "gstNumber")}
              {renderField("PAN Number", formData.panNumber, "panNumber")}
              {renderField("City", formData.city, "city")}
              {renderField("State / Region", formData.state, "state")}
              {renderField("Postal Code", formData.postalCode, "postalCode")}
              {renderField(
                "Country / Time Zone",
                `${formData.country} / ${formData.timeZone}`,
                "timeZone"
              )}
              {renderField(
                "Number of Employees",
                formData.numberOfEmployees,
                "numberOfEmployees",
                numberOfEmployeesOptions
              )}
              {renderField(
                "Number of Branches",
                formData.numberOfBranches,
                "numberOfBranches"
              )}
              {renderField(
                "Annual Revenue",
                formData.annualRevenue,
                "annualRevenue"
              )}
              {renderField("Social Link", formData.socialUrl, "socialUrl")}
              {renderField("MSME Number", formData.msmeNumber, "msmeNumber")}
              {renderField("CIN Number", formData.cin, "cin")}
              {renderField("Description", formData.description, "description")}
            </Box>
          </Box>
        </Grid>   
        <Grid item xs={12} sm={9} sx={{ height: "100%" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              height: "100%",
             padding:'10px 10px 20px 20px'
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              <Grid item xs={12} md={8} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%" }}>
                  <ActivitesMain
                    Id={ID}
                    ActivityData={ActivityData}
                    type="Company"
                    fetchData={fetchCompanyData}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ borderLeft: "1px solid #e0e0e0",width:"100%", height: "97%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },}}
              >
                <Box>
                 
                    <ContactsList ID={ID} ContactData={contactData} companyID={companyID} fetchCompanyData={fetchCompanyData} />
                
                </Box>
                <Box >
                  <CreateDeal
                    Id={ID}
                    ActivityData={ActivityData}
                    type="Company"
                    fetchData={fetchCompanyData}
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
        type="Company"
      />
    </div>
  );
}

export default CompanyDetails;
