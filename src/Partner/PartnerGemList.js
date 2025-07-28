import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PropTypes from "prop-types";
import GEMForm from "../GEM/GEMForm";

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
function PartnerGemList({ GEMData }) {
  const [expandedContact, setExpandedContact] = React.useState(null); // state to manage expanded contact
  const [openContactsForm, setOpenContactsForm] = useState(false);

  const toggleDetails = (id) => {
    setExpandedContact(expandedContact === id ? null : id); // toggle between showing and hiding
  };

  return (
    <>
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
          {/* <Link to="/dashboard/customers_table" style={{ textDecoration: "none" }}> */}
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
              GEM
            </Box>
          </Typography>
          {/* </Link> */}
          <Button
            variant="contained"
            sx={{
              backgroundImage:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              color: "#FFF",
            }}
          >
            CREATE
          </Button>
        </Box>

        {Array.isArray(GEMData) && GEMData.length ? (
          GEMData.map((data) => (
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
        // fetchContactData={fetchContactData}
      />
    </>
  );
}

export default PartnerGemList;
