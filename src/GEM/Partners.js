import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PartnerList from "../Partner/PartnerList";
import PartnerContactList from "../Partner/PartnerContactList";

export default function Partners() {
  const [value, setValue] = useState("Partners");

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (storedUserData) {
      // Set the initial tab value based on the user team
      const initialValue =
        storedUserData.team === "Pricing" ? "GEM" : "Partners";
      setValue(initialValue);
    }
  }, []); // Empty dependency array ensures this runs once after the initial render

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
      >
        {(storedUserData?.team === "Sales" ||
          storedUserData?.team === "Marketing" ||
          storedUserData?.team === "Admin") && (
          <Tab value="Partners" label="Partners" />
        )}
        {(storedUserData?.team === "Sales" ||
          storedUserData?.team === "Marketing" ||
          storedUserData?.team === "Admin") && (
          <Tab value="Dealers" label="Contacts" />
        )}
      </Tabs>

      <Box>
        {value === "Partners" && <PartnerList />}
        {value === "Dealers" && <PartnerContactList />}
      </Box>
    </Box>
  );
}
