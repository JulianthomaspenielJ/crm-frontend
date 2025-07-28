import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CompanyTable from "./CompanyTable";
import ContactTable from "../Contacts/ContactTable";

export default function CustomersTab() {
  const [data, setData] = useState("Company");

  const handleChange = (event, newValue) => {
    setData(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={data}
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
        <Tab value="Company" label="Companies" />
        <Tab value="Contact" label="Contacts" />
      </Tabs>

      <Box sx={{ paddingTop: 2 }}>
        {data === "Company" ? (
          <CompanyTable />
        ) : data === "Contact" ? (
          <ContactTable />
        ) : null}
      </Box>
    </Box>
  );
}
