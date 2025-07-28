import { Box, Typography, Divider } from "@mui/material";
import React from "react";
import HolowareLogo from "../../Image/HWLogo.png";
import dayjs from "dayjs";

export default function WarrantyCertificate({ gemID, gemNumber, GEMDate }) {
  const gemData = JSON.parse(localStorage.getItem("GEMData")) || {};
  const formattedDate = dayjs(GEMDate).format("YYYY-MM-DD");
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <img src={HolowareLogo} alt="Holoware Logo" width="35%" />
        <Divider
          sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
        />
      </div>

      <Typography sx={{ fontSize: 16, fontWeight: 600, textAlign: "center" }}>
        <u>Comprehensive Warranty Letter</u>
      </Typography>
      <Typography
        sx={{
          fontSize: 16,
          fontWeight: 600,
          marginTop: "10px",
          marginBottom: "35px",
          textAlign: "center",
        }}
      >
        <u>TO WHOMSOEVER IT MAY CONCERN</u>
      </Typography>

      {/* Tender Info */}
      <Box display="flex" sx={{ padding: "0px 10px 10px 20px" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, paddingRight: "5px" }}>
          Tender/GEM Number:
        </Typography>
        <Typography sx={{ fontSize: 14 }}>{gemNumber}</Typography>
      </Box>
      <Box display="flex" sx={{ padding: "0px 10px 10px 20px" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, paddingRight: "5px" }}>
          Dated:
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          {formattedDate ? formattedDate : ""}
        </Typography>
      </Box>
      <Box display="flex" sx={{ padding: "0px 10px 10px 20px" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, paddingRight: "5px" }}>
          Model Number:
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          {gemData[gemID]?.modelNumber}
        </Typography>
      </Box>

      {/* Warranty Content */}
      <Box my={3} textAlign="justify" pl={2.5}>
        <Typography sx={{ fontSize: 16 }}>
          This is to certify that <b>Holoware</b> provides an onsite
          {""}{" "}
          {gemData[gemID]?.complianceData?.onSiteWarranty === 1
            ? `${gemData[gemID]?.complianceData?.onSiteWarranty} Year `
            : `${gemData[gemID]?.complianceData?.onSiteWarranty} Years`}{" "}
          warranty for model number {gemData[gemID]?.modelNumber}.
        </Typography>
      </Box>

      {/* Signature & Footer */}
      <Box my={3} textAlign="justify" pl={2.5}>
        <Typography sx={{ fontSize: 14 }}>Yours Sincerely,</Typography>
        {/* <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        Udhaya Prakash S
      </Typography> */}
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          For Holoware (A Unit of Jaikrishna Technology Private Limited),
        </Typography>
        <Box my={4}>
          <Typography sx={{ fontSize: 14 }}>Udhaya Prakash S</Typography>
          <Typography sx={{ fontSize: 14 }}>Product Manager (GEM)</Typography>
          <Typography sx={{ fontSize: 14 }}>Chennai - TN- India</Typography>
          <Typography sx={{ fontSize: 14 }}>Tel: 1800-572-5882</Typography>
        </Box>
        <Divider
          sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
        />
        <Box textAlign="center">
          <Typography sx={{ fontSize: 14 }}>
            HOLOWARE - a unit of JaiKrishna Technology Private Limited
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            SN Tower, No.14, Rottu Street, Near Selva Vinayagar Temple,
            Moondramkattalai, Chennai - 600128
          </Typography>
          <Typography sx={{ fontSize: 14 }}>
            Web: www.holoware.co Phone: 1800-572-5882
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
