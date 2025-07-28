import { Box, Typography } from "@mui/material";
import React from "react";

const ContactDetail = ({ label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{label} :</Typography>
    <Typography sx={{ fontSize: 14, pl: 1 }}>{value}</Typography>
  </Box>
);

export default function Contact({ data }) {
  return (
    <Box sx={{ padding: 1 }}>
      <ContactDetail label="Company Name" value={data.companyName} />
      <ContactDetail label="Email" value={data.email} />
      <ContactDetail label="Mobile" value={data.phoneNumber} />
      <ContactDetail label="Life Cycle Stage" value={data.lifeCycleStage} />
      <ContactDetail label="Created By" value={data.createdBy || data.CreatedBy} />
      <ContactDetail label="Created At" value={data.createdAt} />
    </Box>
  );
}
