import { Box, Typography } from "@mui/material";
import React from "react";

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{label}:</Typography>
    <Typography sx={{ fontSize: 14, pl: 1 }}>
      {value || "N/A"} {/* Default value if data is missing */}
    </Typography>
  </Box>
);

export default function Deals({ data }) {
  return (
    <div>
      <Box sx={{ padding: 1 }}>
        <DetailRow label="Product Type" value={data.productType} />
        <Box sx={{ alignItems: "center", pt: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            Description :
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            {data.productDescription}
          </Typography>
        </Box>

        <DetailRow label="Company Name" value={data.companyName} />
        <DetailRow label="Deal Approver" value={data.dealApprover} />
        <DetailRow label="Deal Owner Name" value={data.dealOwnerName} />
        <Box sx={{ alignItems: "center", pt: 1 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            Quotation UpdaterName :
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            {data.quotationUpdaterName}
          </Typography>
        </Box>
        <DetailRow
          label="Created By"
          value={data.createdBy || data.CreatedBy}
        />
        <DetailRow label="Created At" value={data.createdAt} />
      </Box>
    </div>
  );
}
