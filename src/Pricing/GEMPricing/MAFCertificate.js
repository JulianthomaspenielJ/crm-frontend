import { Box, Divider, Typography } from "@mui/material";
import HolowareLogo from "../../Image/HWLogo.png";
import React from "react";
import dayjs from "dayjs";

export default function MAFCertificate({
  partnerName,
  partnerAddress,
  GEMDate,
  gemNumber,
  product,
  Warranty,
}) {
  const formattedDate = dayjs(GEMDate).format("YYYY-MM-DD");
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <img src={HolowareLogo} alt="Holoware Logo" width="35%" mr={2} />
        <Divider
          sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px 0px" }}
        />
      </div>
      <div>
        <Typography
          sx={{
            fontSize: 14,
            color: "#000",
            fontWeight: 600,
            padding: "10px 10px 10px 0px",
          }}
        >
          Sub: OEM Authorization Letter
        </Typography>
        <Box display="flex">
          <Typography
            sx={{
              fontSize: 14,
              color: "#000",
              fontWeight: 600,
              paddingRight: "5px",
            }}
          >
            Tender/GEM Number:
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: "#000", padding: "0px 20px 10px 0px" }}
          >
            {gemNumber}
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: "#000",
              fontWeight: 600,
              // paddingLeft: "20px",
              paddingRight: "5px",
            }}
          >
            Dated : {formattedDate ? formattedDate : ""}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: 14,
            color: "#000",
            lineHeight: 2,
            // paddingLeft: 2,
          }}
        >
          This is to certify that the <b>{partnerName} , </b>
          {partnerAddress} is representing us, i.e. , Jaikrishna Technology
          Private Limited for the{" "}
          <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
            Supply of {product}
          </span>{" "}
          for the above referred{" "}
          <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
            Tender/GEM Number:
          </span>{" "}
          {gemNumber || ""}{" "}
          <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
            {"  "} Dated:
          </span>{" "}
          {formattedDate ? formattedDate : ""}
        </Typography>

        <Box my={3} textAlign="justify">
          <Typography
            sx={{
              fontSize: 14,
              color: "#000",
              // paddingLeft: 2,
              lineHeight: 2,
            }}
          >
            Where as Jaikrishna Technology Private Limited, who are official
            producers of{" "}
            <span style={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
              The Supply of Desktops, Workstations, All In One PCs, Laptops &
              Tablets
            </span>{" "}
            and having production facilities at SN Tower, No.14, Rottu Street,
            Near Selva Vinayagar Temple, Moondramkattalai, Chennai - 600128 Tel:
            1800-572-5882 do hereby authorize the <b>{partnerName}</b>,{" "}
            {partnerAddress} (hereinafter, the “Bidder”) to submit a bid of the
            following Products produced by us, for the Supply and Technical
            Support Requirements during execution period and after sales,
            service up to{" "}
            <b>
              minimum{" "}
              {Warranty === 1 ? `${Warranty} year` : `${Warranty} years`}{" "}
            </b>{" "}
            from the date of completion of work.
          </Typography>
        </Box>
        <Box my={3} textAlign="justify">
          <Typography
            sx={{
              fontSize: 14,
              color: "#000",
              // paddingLeft: 2,
              lineHeight: 2,
            }}
          >
            We assure you that in the event of not being able to fulfil its
            obligation as our Service Provider in respect of our standard
            Warranty Terms we would continue to meet our Warranty Terms as
            prescribed in the terms.
          </Typography>
        </Box>
        <Box my={3} textAlign="justify">
          <Typography
            sx={{
              fontSize: 14,
              color: "#000",
              // paddingLeft: 2,
              lineHeight: 2,
            }}
          >
            We confirm the technical compliance submitted by the has been duly
            endorsed by us with stamp and signature.
          </Typography>
        </Box>
        <Box my={3} textAlign="justify">
          <Typography
            sx={{
              fontSize: 14,
              color: "#000",
              // paddingLeft: 2,
              lineHeight: 2,
            }}
          >
            Yours Sincerely,
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#000",
              fontWeight: 600,
              // paddingLeft: 2,
            }}
          >
            For Holoware (A Unit of Jaikrishna Technology Private Limited),
          </Typography>
          <Box my={4}>
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                // paddingLeft: 2,
                lineHeight: 2,
              }}
            >
              Udhaya Prakash S
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                // paddingLeft: 2,
                lineHeight: 2,
              }}
            >
              Product Manager (GEM)
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                // paddingLeft: 2,
                lineHeight: 2,
              }}
            >
              Chennai - TN- India
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                // paddingLeft: 2,
                lineHeight: 2,
              }}
            >
              Tel: 1800-572-5882
            </Typography>
          </Box>
          <Divider
            sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
          />
          <Box my={4} sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                // paddingLeft: 2,
                lineHeight: 2,
              }}
            >
              HOLOWARE - a unit of JaiKrishna Technology Private Limited
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                // paddingLeft: 2,
                lineHeight: 2,
              }}
            >
              SN Tower, No.14, Rottu Street, Near Selva Vinayagar Temple,
              Moondramkattalai, Chennai - 600128
            </Typography>{" "}
            <Typography
              sx={{
                fontSize: 14,
                color: "#000",
                // paddingLeft: 2,
                lineHeight: 2,
              }}
            >
              Web: www.holoware.co Phone: 1800-572-5882
            </Typography>{" "}
          </Box>
        </Box>
      </div>
    </div>
  );
}
