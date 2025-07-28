import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PropTypes from "prop-types";
import AddContact from "./AddContact";
import { Box, Button } from "@mui/material";
import DeleteDialog from "../Activities/DeleteDialog/DeleteDialog";

const IconButton = ({ onClick, children, style }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </button>
  );
};

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

IconButton.defaultProps = {
  style: {},
};

export default function ContactsList({
  ContactData,
  companyID,
  fetchCompanyData,
}) {
  const [expandedContact, setExpandedContact] = useState(null);
  const [openContactForm, setOpenContactForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [contactID, setContactID] = useState(false);

  const toggleDetails = (id) => {
    setExpandedContact(expandedContact === id ? null : id); // toggle between showing and hiding
  };

  const handleOpenForm = () => {
    setOpenContactForm(true);
  };

  const handleDeleteDialog = (id) => {
    setContactID(id)
    setOpenDialog(true);
    
  };

  return (
    <Box
      sx={{
        width: "99.5%",
        position: "relative",
        fontWeight: 500,
        fontSize: 16,
        color: "#e02b6a",
        height: "100%",
        overflow: { xs: "auto", sm: "initial" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography
          sx={{
            color: "#4f87e2",
            fontWeight: 500,
            pl: 2,
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
            },
            display: "flex",
          }}
        >
          <KeyboardArrowLeftIcon sx={{ color: "#e02b6a" }} />
          <Box
            sx={{
              fontWeight: 500,
              fontSize: 16,
              color: "#e02b6a",
              "&:hover": {
                textDecoration: "underline",
                textDecorationColor: "#e02b6a",
              },
            }}
          >
            Contacts
          </Box>
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            color: "#FFF",
          }}
          onClick={handleOpenForm}
        >
          CREATE
        </Button>
      </Box>

      {Array.isArray(ContactData) && ContactData.length ? (
        ContactData.map((data) => (
          <Box
            key={data.id}
            sx={{ mt: 1, border: "2px solid #f1efef", ml: 2, p: 2 }}
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
                {data.name}
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
                    Email:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#00000082",
                      pl: 1,
                    }}
                  >
                    {data.email}
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
                    Mobile No:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#00000082",
                      pl: 1,
                    }}
                  >
                    {data.phoneNumber}
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
                    Designation:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#00000082",
                      pl: 1,
                    }}
                  >
                    {data.designation || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "end" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handleDeleteDialog(data.id);
                      console.log("contac",data)
                    }}
                  >
                    Delete
                  </Button>
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

      <AddContact
        contactOpen={openContactForm}
        setContactOpen={setOpenContactForm}
        companyID={companyID}
        fetchCompanyData={fetchCompanyData}
      />

      <DeleteDialog
        id={contactID}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        type="CompanyDetails"
      />
    </Box>
  );
}
