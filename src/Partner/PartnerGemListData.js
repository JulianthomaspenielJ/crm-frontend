import { Box, Button, Typography, IconButton } from "@mui/material";
import React, { useState } from "react";
import GEMForm from "../GEM/GEMForm";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";

export default function PartnerGemListData({
  ID,
  GEMData,
  fetchPartnerData,
  PartnerID,
  PartnerName,
}) {
  const navigate = useNavigate();
  const [expandedContact, setExpandedContact] = React.useState(null);
  const [openContactsForm, setOpenContactsForm] = useState(false);
  const toggleDetails = (id) => {
    setExpandedContact(expandedContact === id ? null : id);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 2,
        }}
      >
        <Box sx={{ display: "flex", pl: 2 }}>
          <KeyboardArrowLeftIcon sx={{ color: "#e02b6a" }} />
          <Typography
            sx={{
              color: "#e02b6a",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
              display: "flex",
            }}
          >
            GEM
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            color: "#FFF",
          }}
          onClick={() => {
            setOpenContactsForm(true);
          }}
        >
          Create
        </Button>
      </Box>

      <Box>
        {" "}
        {Array.isArray(GEMData) && GEMData.length ? (
          GEMData.map((data) => (
            <Box
              key={data.id}
              sx={{ mt: 2, border: "2px solid #f1efef", ml: 2, p: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#367cee",
                    fontSize: 14,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => {
                    navigate("/dashboard/gem_details", {
                      state: { gemID:data.id, type: "My Gem" },
                    });
                  }}
                >
                  {data.productName || data.gemNumber}
                </Typography>
                <IconButton onClick={() => toggleDetails(data.id)}>
                  {expandedContact === data.id ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
              </Box>

              {/* Show additional details if expanded */}
              {expandedContact === data.id && (
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pt: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: "#000" }}
                    >
                      GEM NO :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#00000082",
                        pl: 1,
                      }}
                    >
                      {data.gemNumber}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pt: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: "#000" }}
                    >
                      Due Date:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#00000082",
                        pl: 1,
                      }}
                    >
                      {data.dueDate}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pt: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: "#000" }}
                    >
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
                      {data.status || "N/A"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pt: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 600, color: "#000" }}
                    >
                      Quantity:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#00000082",
                        pl: 1,
                      }}
                    >
                      {data.quantity || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              )}
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
              No contacts found.
            </Typography>
          </Box>
        )}
      </Box>
      <GEMForm
        openContactsForm={openContactsForm}
        setOpenContactsForm={setOpenContactsForm}
        fetchContactData={fetchPartnerData}
        PartnerID={PartnerID}
        PartnerName={PartnerName}
      />
    </div>
  );
}
