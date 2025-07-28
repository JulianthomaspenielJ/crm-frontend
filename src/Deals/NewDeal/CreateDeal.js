import { Button, Typography, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import DealForm from "./DealForm";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Link } from "react-router-dom";
import DealsList from "./DealsList";

function CreateDeal({ Id, ActivityData, type, fetchData, setLoading }) {
  const [dealFormOpen, setDealFormOpen] = useState(false);

  const handleOpenDealForm = () => {
    setDealFormOpen(true);
  };

  return (
    <div style={{ height: "100%" }}>
      <Box sx={{ height: "100%",   marginTop:"40px",}}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my:2
          }}
        >
          <Link to="/dashboard/deals" style={{ textDecoration: "none" }}>
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
              <span>
                <KeyboardArrowRightIcon sx={{color: "#e02b6a",}}/>
              </span>
              <Box
                sx={{
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#e02b6a",
                  "&:hover": {
                    textDecoration: "underline", // Adds underline on hover
                    textDecorationColor: "#e02b6a", // Keeps underline color same as text
                  },
                }}
              >
                Deals
              </Box>
            </Typography>
          </Link>
          <Button
            variant="contained"
            sx={{
              backgroundImage:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              color: "#FFF",
            }}
            onClick={handleOpenDealForm}
          >
            Create
          </Button>
        </Box>
        <DealsList 
          ActivityData={ActivityData} 
          fetchData={fetchData} 
          setLoading={setLoading}
        />
      </Box>
      <DealForm
        dealOpen={dealFormOpen}
        setDealOpen={setDealFormOpen}
        Id={Id}
        type={type}
        fetchData={fetchData}
      />
    </div>
  );
}

export default CreateDeal;
