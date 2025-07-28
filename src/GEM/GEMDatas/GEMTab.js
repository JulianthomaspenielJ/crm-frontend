import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import GEMList from "../GEMList";
import GEMApprovalList from "./GEMApprovalList";
import GEMQuotationUpload from "./GEMQuotationUpload";
import GEMUpdatedQuotation from "./GEMUpdatedQuotation";

export default function GEMTab() {
  const [deals, setDeals] = useState("All GEM");

  const handleChange = (event, newValue) => {
    setDeals(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={deals}
        onChange={handleChange}
        aria-label="gradient tabs example"
        TabIndicatorProps={{
          sx: {
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          },
        }}
        sx={{
          "& .MuiTab-root": {
            // Apply gradient to tab text
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          },
          "& .Mui-selected": {
            // Apply gradient to selected tab text
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          },
        }}
      >
        <Tab value="All GEM" label="My GEM" />
        {/* {storedUserData &&
          (storedUserData.team === "Admin" ||
            (storedUserData.team === "Pricing" &&
              storedUserData.userRole === "Manager")) && (
            <Tab value="Awaiting Approval" label="Awaiting Approval" />
            
          )}
          <Tab value="Quotation Required" label="Quotation Required" />
          <Tab value="Uploaded Quotation" label="Uploaded Quotation" /> */}
      </Tabs>

      <Box sx={{ paddingTop: 2 }}>
        {deals === "All GEM" ? (
          <GEMList />
        ) : deals === "Awaiting Approval" ? (
            <GEMApprovalList />
        ) : deals === "Quotation Required" ? (
            <GEMQuotationUpload/>
        ) : deals === "Uploaded Quotation" ? (
            <GEMUpdatedQuotation/>
        ):null}
      </Box>
    </Box>
  );
}
