import {
  Box,
  Divider,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import HolowareLogo from "../../Image/HWLogo.png";
import Madeinindialogo from "../../Image/madeinindia.png";
import dayjs from "dayjs";

function MIICertificate({
  gemNumber,
  CustomerName,
  GEMDate,
  holowareValues,
  gemID,
}) {
  const [selectedData, setSelectedData] = useState({
    chipsetNumber: "",
    graphicsType: "",
    operatingSystem: "",
    processorDescription: "",
    processorNumber: "",
    ramSize: "",
    totalHddCapacity: "",
    totalSsdCapacity: "",
    warrantyYear: "",
    os: "",
  });

  const formattedDate = dayjs(GEMDate).format("YYYY-MM-DD");

  useEffect(() => {
    const storedComplianceData = localStorage.getItem(`${gemID}_compliance`);
    if (storedComplianceData) {
      const parsedData = JSON.parse(storedComplianceData); // Parse the data from localStorage

      // Extract only the required fields
      const filteredData = {
        chipsetNumber: parsedData["Chipset Number"]?.holowareSpec || "",
        graphicsType: parsedData["Graphics Type"]?.holowareSpec || "",
        operatingSystem:
          parsedData["Operating System (Factory Pre-Loaded)"]?.holowareSpec ||
          "",
        processorDescription:
          parsedData["Processor Description"]?.holowareSpec || "",
        processorNumber: parsedData["Processor Number"]?.holowareSpec || "",
        ramSize: parsedData["RAM Size (GB)"]?.holowareSpec || "",
        totalHddCapacity:
          parsedData["Total HDD Capacity (GB)"]?.holowareSpec || "",
        totalSsdCapacity:
          parsedData["Total SSD Capacity (GB)"]?.holowareSpec || "",
        warrantyYear:
          parsedData["On Site OEM Warranty (Year)"]?.holowareSpec || "",
        os:
          parsedData["Operating System (Factory Pre-Loaded)"]?.holowareSpec ||
          "",
      };
      setSelectedData(filteredData);
    }
  }, []);

  return (
    <div>
      <Box textAlign="center">
        <img src={HolowareLogo} alt="Holoware Logo" width="35%" />
        <Divider sx={{ borderColor: "#000", borderWidth: "2px" }} />
      </Box>

      <Box mt={2} textAlign="left">
        <Typography sx={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
          REGISTERED ADDRESS:- SN Tower, No.14, Rottu Street, Near Selva
          Vinayagar Temple, Moondramkattalai, Chennai - 600128
        </Typography>
      </Box>

      <Box textAlign="left">
        <Typography
          sx={{
            fontSize: 14,
            color: "#000",
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          <b>E-mail: info@holoware.co</b>
        </Typography>
      </Box>

      <Box textAlign="left">
        <Typography
          sx={{
            fontSize: 14,
            color: "#000",
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          <b>GSTIN- 33AAECJ8741L1Z9</b>
        </Typography>
      </Box>

      <Box textAlign="center">
        <img
          src={Madeinindialogo}
          alt="Holoware Logo"
          style={{ width: "250px" }}
        />
      </Box>

      <Box textAlign="center" mt={2}>
        <Typography sx={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
          DECLARATION CERTIFICATE FOR LOCAL CONTENT
        </Typography>
      </Box>

      <Box mt={5} display="flex" justifyContent="space-between">
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          <b>IN RESPECT Tender/GEM No:</b> {gemNumber || "{ gemNumber }"}{" "}
          <span style={{ padding: "50px" }}>
            <b>Dated: </b>
            {formattedDate ? formattedDate : ""}
          </span>
        </Typography>
      </Box>

      <Box>
        <Typography sx={{ fontSize: 14, color: "#000", paddingTop: "15px" }}>
          <b>Issued to :</b> {CustomerName}
        </Typography>
      </Box>

      <Box my={5}>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          I, the undersigned, Mr. Udhaya Prakash S do hereby declare, in my
          capacity as {"provided"} of Jaikrishna Technology Private Limited the
          following:
        </Typography>
      </Box>

      <Box my={5}>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          (a) The facts contained herein are within my own personal knowledge.
        </Typography>
      </Box>

      <Box my={5}>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          (b) I have read and understood the requirement of local content (LC)
          and the same is specified as percentage calculated in accordance with
          the definition provided at clause 2 of revised Public Procurement
          (preference to Make in India) Order 2017.
        </Typography>
      </Box>

      <Box my={5}>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          “Local content” as per above order means the amount of value added in
          India which shall be the total value of items procured (excluding net
          domestic indirect taxes) minus the value of imported content in the
          item (including all customs duties) as a proportion of the total value
          in percent.”
        </Typography>
      </Box>

      <Box my={5}>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          (c) I have satisfied myself that the goods/services/works to be
          delivered in terms of the above specified bid comply with the local
          content requirements as specified in the tender for ‘Class- I Local
          Supplier’ / ‘Class-II Local Supplier’, and as above.
        </Typography>
      </Box>

      <Box mt={25} mb={3}>
        <Typography sx={{ fontSize: 14, color: "#000", paddingBottom: 2 }}>
          (d) Public Procurement (preference to Make in India) Order 2017
        </Typography>
      </Box>

      {/* Table content */}
      <TableContainer>
        <Table aria-label="simple table" sx={{ border: "2px solid black" }}>
          <TableCell sx={{ borderRadius: "0px" }}>1.</TableCell>
          <TableCell
            className="table"
            sx={{
              borderRadius: "0px",
              border: "1px solid black",
            }}
          >
            <Typography sx={{ fontSize: 14, color: "#000" }}>
              <p>Select one of the following only.</p>
              <p>
                1) Class-I Local Supplier{" "}
                {/* {formik.values.percentage ? (
                  formik.values.percentage > 50 ? (
                    <b>✓</b>
                  ) : (
                    <i>-Nil-</i>
                  )
                ) : null} */}
              </p>
              <p>
                2) Class-II Local Supplier{" "}
                {/* {formik.values.percentage ? (
                  formik.values.percentage < 50 ? (
                    <b>✓</b>
                  ) : (
                    <i>-Nil-</i>
                  )
                ) : null} */}
              </p>
              <p>
                (Note: Class-II local supplier means a supplier or service
                provider, whose goods, services or works offered for
                procurement, has content more than 20% but less than 50%, as
                defined under this order. If local content is more than or equal
                to 50% then it is a class-I local supplier.)
              </p>
            </Typography>
          </TableCell>
        </Table>
      </TableContainer>

      <Box mt={100}>
        <Typography sx={{ fontSize: 14, color: "#000", paddingBottom: 2 }}>
          (e) The local content calculated using the definition given above are
          as under:
        </Typography>
      </Box>

      {/* Table content */}
      <TableContainer
        sx={{
          border: "1px solid black",
          borderRadius: "0px",
          marginTop: 2,
        }}
      >
        <Table sx={{ border: "1px solid black", borderRadius: "0px" }}>
          <TableRow sx={{ border: "1px solid black", borderRadius: "0px" }}>
            <TableCell sx={{ border: "1px solid black", borderRadius: "0px" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}></Typography>
            </TableCell>
            <TableCell sx={{ border: "1px solid black" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
                Local content calculated as above%(100%)
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "1px solid black" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
                Location of value addition (Location shall be the specified name
                of city or district, etc.Location as name of country will be
                considered as ambiguous and such bids shall be rejected)
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ border: "1px solid black" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
                {/* <b>
                  {" "}
                  {formik.values.processorNumber}| {formik.values.ram} RAM |{" "}
                  {(formik.values.hdd > 0 || formik.values.ssd > 0) && (
                    <div>
                      {formik.values.hdd > 0 && (
                        <span>{formik.values.hdd} GB HDD | </span>
                      )}
                      {formik.values.ssd > 0 && (
                        <span>{formik.values.ssd} GB SSD | </span>
                      )}
                    </div>
                  )}
                  {formik.values.powerSupply} |{" "}
                  {formik.values.graphicsDescription} | {formik.values.os} |{" "}
                  {formik.values.warrantyYear} Onsite Warranty
                </b> */}
                {selectedData.processorNumber} | {selectedData.chipsetNumber} |{" "}
                {selectedData.ramSize} RAM |{" "}
                <div>
                  {selectedData.totalHddCapacity != "" && (
                    <span>{selectedData.totalHddCapacity} GB HDD | </span>
                  )}
                  {selectedData.totalSsdCapacity != "" && (
                    <span>{selectedData.totalSsdCapacity} GB SSD | </span>
                  )}
                </div>
                {selectedData.graphicsType} | {selectedData.os} |{" "}
                {selectedData.warrantyYear} Onsite{" "}
                {selectedData.warrantyYear > 1 ? "Years" : "Year"} Warranty
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "1px solid black" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
                {/* {formik.values.percentage ? formik.values.percentage : null}% */}{" "}
                51 %
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "1px solid black" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
                Chennai
              </Typography>
            </TableCell>
            {/* <TableCell sx={{ border: "1px solid black" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
              </Typography>
            </TableCell> */}
            {/* <TableCell sx={{ border: "1px solid black" }}>
              <Typography sx={{ fontSize: 14, color: "#000" }}>
                Chennai
              </Typography>
            </TableCell> */}
          </TableRow>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          Yours Sincerely,
        </Typography>
      </Box>

      <Box>
        <Typography sx={{ fontSize: 14, color: "#000", fontWeight: 600 }}>
          For Holoware (A Unit of Jaikrishna Technology Private Limited),
        </Typography>
      </Box>

      {/* <Box>
      <img src={"UdhayaSign"} alt="User Sign" width="30%" my={2} />
    </Box> */}

      <Box>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          Udhaya Prakash S
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          Product Manager (GEM)
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          Chennai - TN- India
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          Tel: 1800-572-5882
        </Typography>
      </Box>

      <Box mt={5} textAlign="center">
        <Divider sx={{ borderColor: "#000", borderWidth: "2px" }} />
        <Typography sx={{ fontSize: 14, color: "#000", mt: 2 }}>
          HOLOWARE - a unit of JaiKrishna Technology Private Limited
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#000" }}>
          SN Tower, No.14, Rottu Street, Near Selva Vinayagar Temple,
          Moondramkattalai, Chennai - 600128
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#000", mb: 2 }}>
          Web: www.holoware.co Phone: 1800-572-5882
        </Typography>
      </Box>
    </div>
  );
}

export default MIICertificate;
