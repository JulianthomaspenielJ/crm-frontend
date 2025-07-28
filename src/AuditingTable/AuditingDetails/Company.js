import { Box, Typography } from "@mui/material";
import React from "react";

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
      {label}:
    </Typography>
    <Typography sx={{ fontSize: 14, pl: 1 }}>
      {value || "N/A"} {/* Default value if data is missing */}
    </Typography>
  </Box>
);

export default function Company({ data }) {
  return (
    <div>
      <Box sx={{ padding: 1 }}>
        <DetailRow label="Domain Name" value={data.domainName} />
        <DetailRow label="Company Name" value={data.companyName} />
        <DetailRow label="Email" value={data.email} />
        <DetailRow label="Mobile" value={data.mobile} />
        <DetailRow label="Industry" value={data.industry} />
        <DetailRow label="City" value={data.city} />
        <DetailRow label="Created By" value={data.createdBy || data.CreatedBy} />
        <DetailRow label="Created At" value={data.createdAt} />
      </Box>
    </div>
  );
}
