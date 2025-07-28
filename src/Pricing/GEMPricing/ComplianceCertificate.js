import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import companyLogo from "../../Image/HWLogo.png";


export default function ComplianceCertificate({type,data}) {



  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }


  return <div>
  <Box sx={{ textAlign: "center" }}>
    <img
      src={companyLogo}
      alt="company logo"
      style={{ width: "250px", height: "60px" }}
    />
  </Box>
  <Box>
    <Typography
      sx={{ fontSize: 13, fontWeight: 600, padding: "20px 0px 5px 0px" }}
    >
      Holoware - A Unit of Jaikrishna Technology Private Limited
    </Typography>
    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
      Holoware.com | Contact: +91-9884070707
    </Typography>
    <Typography
      sx={{ fontSize: 13, fontWeight: 600, padding: "5px 0px 15px 0px" }}
    >
      CIN: U72900TN2014PTC096040 | GSTIN: 33AADCJ1540B1ZK
    </Typography>
  </Box>
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ backgroundColor: "#17a185", color: "white" }}>
            Specification
          </TableCell>
          <TableCell sx={{ backgroundColor: "#17a185", color: "white" }}>
            Specification Name
          </TableCell>
          <TableCell
            sx={{
              backgroundColor: "#17a185",
              color: "white",
              width: "250px",
            }}
          >
            Bid Requirements
          </TableCell>
          <TableCell sx={{ backgroundColor: "#17a185", color: "white" }}>
            Holoware Specifications
          </TableCell>
          <TableCell sx={{ backgroundColor: "#17a185", color: "white" }}>
            Holoware Compliance
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            sx={{
              backgroundColor: index % 2 === 0 ? "white" : "#f2f2f2",
            }}
          >
            <TableCell>{row[0]}</TableCell>
            <TableCell>{row[1]}</TableCell>
            <TableCell sx={{ width: "250px" }}>{row[2]}</TableCell>
            <TableCell>{row[3]}</TableCell>
            <TableCell>{row[4]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</div>;
}
