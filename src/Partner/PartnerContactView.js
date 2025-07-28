import { Box, Button, Typography, IconButton } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PartnerContactForm from "./PartnerContactForm";

export default function PartnerContactView({
  ID,
  ContactData,
  fetchPartnerData,
  PartnerID,
}) {
  const [expandedContact, setExpandedContact] = React.useState(null);
  const [openContactsForm, setOpenContactsForm] = useState(false);
  const toggleDetails = (id) => {
    setExpandedContact(expandedContact === id ? null : id); // toggle between showing and hiding
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
            Contacts
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
        {Array.isArray(ContactData) && ContactData.length ? (
          ContactData.map((data) => (
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
                >
                  {data.name || data.name}
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
                      Name :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#00000082",
                        pl: 1,
                      }}
                    >
                      {data.name || "N/A"}
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
                      Email:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#00000082",
                        pl: 1,
                      }}
                    >
                      {data.email || "N/A"}
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
                      Phone:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#00000082",
                        pl: 1,
                      }}
                    >
                      {data.phone || "N/A"}
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

      <PartnerContactForm openContactsForm={openContactsForm} setOpenContactsForm={setOpenContactsForm} fetchContactData={fetchPartnerData} PartnerID={PartnerID}/>
  
    </div>
  );
}
