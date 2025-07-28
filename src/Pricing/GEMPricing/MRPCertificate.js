import React, { useState,useEffect } from 'react'
import {
    Box,
    Divider,
    Typography,
  } from "@mui/material";
  import HolowareLogo from "../../Image/HWLogo.png";

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
  
    const getTens = (n) => {
      if (n < 20) {
        return ones[n];
      } else {
        return tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + ones[n % 10] : "");
      }
    };
  
    const convert = (n) => {
      if (n === 0) return "zero";
  
      const crore = Math.floor(n / 10000000);
      const lakh = Math.floor((n % 10000000) / 100000);
      const thousand = Math.floor((n % 100000) / 1000);
      const hundred = Math.floor((n % 1000) / 100);
      const remainder = n % 100;
  
      let words = "";
  
      if (crore > 0) {
        words += convert(crore) + " Crore ";
      }
      if (lakh > 0) {
        words += convert(lakh) + " Lakh ";
      }
      if (thousand > 0) {
        words += convert(thousand) + " Thousand ";
      }
      if (hundred > 0) {
        words += convert(hundred) + " Hundred ";
      }
      if (remainder > 0) {
        words += (words !== "" ? "and " : "") + getTens(remainder);
      }
  
      return words.trim();
    };
  
    return convert(num);
  };

export default function MRPCertificate({ gemID, downloadData}) {
  const gemData = JSON.parse(localStorage.getItem("GEMData")) || {};
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    // Check if downloadData is defined before accessing its properties
    if (downloadData && downloadData.marginwithGST) {
      const finalPrice = downloadData.marginwithGST;
      setAmount(finalPrice);
    } 
  }, [downloadData]);

  return (
    <div >
    <div style={{ textAlign: "center" }}>
      <img src={HolowareLogo} alt="Holoware Logo" width="35%" />
      <Divider
        sx={{ borderColor: "#000", borderWidth: "2px", margin: "10px" }}
      />
    </div>

    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 600,
        marginTop: "10px",
        marginBottom: "35px",
        textAlign: "center",
      }}
    >
      TO WHOMSOEVER IT MAY CONCERN
    </Typography>
    <Box my={3} textAlign="justify">
      <Typography sx={{ fontSize: 14 }}>
        This is to confirm that we{" "}
        <b>JaiKrishna Technology Private Limited</b> are OEM of{" "}
        <b>
          <u>HOLOWARE</u>
        </b>{" "}
        brand.
      </Typography>
    </Box>

    <Box my={3} textAlign="justify">
      <Typography sx={{ fontSize: 14 }}>
        We hereby certify that the MRP for the product having model number{" "}
        <b>{gemData[gemID]?.modelNumber}</b> (Product model number to be
        specified in “Model” ﬁeld on GEM during catalog upload) of the
        brand mentioned above is INR <b>{amount}</b> (
        {numberToWords(amount)}) only. This MRP is
        applicable to this model of the product only.
      </Typography>
    </Box>

    {/* Signature & Footer */}
    <Box my={3} textAlign="justify">
      <Typography sx={{ fontSize: 14 }}>Yours Sincerely,</Typography>
      {/* <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        Udhaya Prakash S
      </Typography> */}
      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
        For Holoware (A Unit of Jaikrishna Technology Private Limited),
      </Typography>
      <Box my={4}>
        <Typography sx={{ fontSize: 14 }}>Udhaya Prakash S</Typography>
        <Typography sx={{ fontSize: 14 }}>
          Product Manager (GEM)
        </Typography>
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
  )
}
