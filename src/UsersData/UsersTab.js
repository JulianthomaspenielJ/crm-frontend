import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UserManagement from "./UserManagement/UserManagementList";
import UserList from "./UserList";
import DeletedUser from "./DeletedData/DeletedUser";

export default function UsersTab() {
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const [deals, setDeals] = useState("Approved Users");

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
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          },
          "& .Mui-selected": {
            background:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          },
        }}
      >
        <Tab value="Approved Users" label="Approved Users" />
        <Tab value="Deactivate Users" label="In Active Users" />
        {storedUserData &&
          storedUserData.team === "Admin" &&
          (storedUserData.userRole === "Admin" ||
            storedUserData.userRole === "Super Admin") && (
            <Tab value="Deleted Users" label="Deleted Users" />
          )}
      </Tabs>

      <Box sx={{ paddingTop: 2 }}>
        {deals === "Approved Users" ? (
          <UserManagement />
        ) : deals === "Deactivate Users" ? (
          <UserList />
        ) : deals === "Deleted Users" ? (
          <DeletedUser />
        ) : null}
      </Box>
    </Box>
  );
}
