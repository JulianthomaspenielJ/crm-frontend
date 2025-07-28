import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ApproveDealList from "../ApproveDealList/ApproveList";
import Quotation from "../QuatationDealList/QuotationDealList";
import AllDeals from "./AllDeals";
import QuotationUploadedScreen from "../UploadedQuotation/QuotationUploadedScreen";

export default function DealsTab() {
  const [deals, setDeals] = useState("All Deals");
  const [loading, setLoading] = useState(false);

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
        <Tab value="All Deals" label="My Deals" />
      </Tabs>

      <Box sx={{ paddingTop: 2 }}>
        {deals === "All Deals" ? (
          <AllDeals setLoading={setLoading} />
        ) : deals === "Awaiting Approval" ? (
          <ApproveDealList />
        ) : deals === "Quotation Required" ? (
          <Quotation />
        ) : deals === "Uploaded Quotation" ? (
          <QuotationUploadedScreen />
        ) : null}
      </Box>
    </Box>
  );
}
