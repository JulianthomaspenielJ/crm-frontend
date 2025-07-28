import {
  Box,
  Grid,
  Typography,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowLeft";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import ActivitesMain from "../Activities/ActivitiesMain";
import PartnerContactView from "./PartnerContactView";
import PartnerGemListData from "./PartnerGemListData";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
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
  if (name) {
    const nameParts = name.split(" ");
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${nameParts[0][0]}${nameParts[1]?.[0] || ""}`,
    };
  }
}

const PartnerDetailsDrawer = () => {
  const location = useLocation();
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const { ID } = location.state || {};

  const [partnerDetails, setPartnerDetails] = useState("");
  const [formData, setFormData] = useState({});
  const [ActivityData, setActivityData] = useState("");
  const [contactData, setContactData] = useState([]);
  const [GEMData, setGEMData] = useState("");
  const [PartnerName, setPartnerName] = useState("");

  const fetchPartnerData = async () => {
    const res = await CRMBaseURL.post("partnerdata", { ID });

    setPartnerName(res.data?.data?.partner || "N/A");
    setPartnerDetails(res.data?.data);
    setFormData(res.data?.data);
    setActivityData(res.data);
    setContactData(res.data?.data?.contacts);
    setGEMData(res.data?.data?.gem);
  };

  useEffect(() => {
    if (ID) {
      fetchPartnerData();
    } else {
      navigate("/dashboard/partners");
    }
  }, [ID, navigate]);



  const renderField = (label, value, name, options) => {
    const nonEditableFields = [
      "domainName",
      "companyOwner",
      "gstNumber",
      "panNumber",
      "msmeNumber",
      "cin",
    ];

    // const isEditable = !nonEditableFields.includes(name);

    return (
      <Box
        sx={{
          pb: 3,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: "#00000082" }}
          >
            {label}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{value}</Typography>
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
              <Link to="/dashboard/partners" style={{ textDecoration: "none" }}>
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
                  <span>Partners</span>
                </Typography>
              </Link>
              {/* <Tooltip
                title="Delete"
                // onClick={() => {
                //   setOpenDialog(true);
                // }}
              >
                <IconButton>
                  <DeleteIcon color="error" />
                </IconButton>
              </Tooltip> */}
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box>
                {partnerDetails?.partner && (
                  <Avatar {...stringAvatar(partnerDetails.partner)} />
                )}
              </Box>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                  {partnerDetails.partner}
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
              {renderField("Partner Name", formData.partner, "partnerName")}
              {renderField("Address", formData.address, "address")}
              {renderField("Area Covered", formData.areaCovered, "areaCovered")}
              {renderField("Turn Over", formData.turnOver || "N/A", "turnOver")}
              {renderField("Auth Code", formData.authCode, "authCode")}
              {renderField("Email", formData.email, "email")}
              {renderField("Due Date", formData.dueDate, "dueDate")}
              {renderField(
                "Last Activity",
                formData.lastActivityData,
                "lastActivityData"
              )}
              {renderField(
                "Partner Created By",
                formData.partnerCreatedBy,
                "partnerCreatedBy"
              )}
              {renderField("Phone Number", formData.phoneNumber, "phoneNumber")}
              {renderField(
                "Registered Date",
                formData.registeredDate,
                "registeredDate"
              )}
              {renderField(
                "Respective Sales Person",
                formData.respectiveSalesPerson,
                "respectiveSalesPerson"
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={9} sx={{ height: "100%" }}>
          <Box
            sx={{
              bgcolor: "#fff",
              height: "100%",
              padding: "10px 10px 20px 20px",
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              <Grid item xs={12} md={8} sx={{ height: "100%" }}>
                <Box sx={{ height: "100%" }}>
                  <ActivitesMain
                    Id={ID}
                    ActivityData={ActivityData || ""}
                    type="Company"
                    fetchData={fetchPartnerData}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  borderLeft: "1px solid #e0e0e0",
                  width: "100%",
                  height: "97%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Box>
                  <>
                    <PartnerContactView ID={ID} ContactData={contactData} fetchPartnerData={fetchPartnerData} PartnerID={ID}/>
                  </>
                </Box>


                <PartnerGemListData ID={ID} GEMData={GEMData} fetchPartnerData={fetchPartnerData} PartnerID={ID} PartnerName={PartnerName}/>
                
                {/* <Box>
                  <CssVarsProvider>
                    <PartnerGemList ID={ID} GEMData={GEMData} />
                  </CssVarsProvider>
                </Box> */}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default PartnerDetailsDrawer;
