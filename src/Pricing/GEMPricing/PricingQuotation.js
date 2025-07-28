import React, {useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  Divider,
  TableHead,
  TableBody,
  TableRow,
} from "@mui/material";
// import { saveAs } from 'file-saver';
import num2words from "num2words";
import html2pdf from "html2pdf.js";
import HWLogo from "../../Image/HWLogo.png";

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

const PricingQuotation = ({
  downloadData,
  pdfBlobUrl,
  setPdfBlobUrl,
  CustomerAddress,
  CustomerMobile,
  CustomerEmail,
  Ticket,
  Email
}) => {
  const amount = downloadData?.marginwithGST || "";
  let amountInWords = num2words(amount, { language: "en" }).replace(/-/g, " ");

  amountInWords =
    amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1);

  const descriptions = downloadData.data
    .map((item) => item.descriptions)
    .join(", ");
  const descriptionLines = descriptions.split(", ");
  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getDateAfter30Days = () => {
    const today = new Date();
    const next30Days = new Date(today);
    next30Days.setDate(today.getDate() + 30); // Add 30 days to today's date

    const day = String(next30Days.getDate()).padStart(2, "0");
    const month = String(next30Days.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = next30Days.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const generatePDF = () => {
    const input = document.getElementById("quotation-content"); // Get the content to be converted to PDF

    // Options for pdf generation
    const options = {
      margin: 2, // Set margins
      filename: "quotation.pdf", // Name of the PDF file
      image: { type: "jpeg", quality: 0.98 }, // Image settings
      html2canvas: { scale: 2 }, // Higher scale for better quality
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // PDF settings
    };

    // Generate PDF from the HTML element and download it
    html2pdf()
      .from(input)
      .set(options)
      .toPdf()
      .get("pdf") // Get the PDF instance
      .then((pdf) => {
        const pdfBlob = pdf.output("blob"); // Convert the PDF to a blob
        const url = URL.createObjectURL(pdfBlob); // Create a URL for the blob
        setPdfBlobUrl(url); // Set the blob URL
        // return pdf.save(); // Save the generated PDF
      })
      .then(() => {
        ("PDF generated and downloaded");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
        alert("An error occurred while generating the PDF.");
      });
  };

  const renderDes = (totalComponentPrice) => {
    let allDescriptions = [];

    // Collect all descriptions
    if (downloadData) {
      Object.keys(downloadData.data).forEach((key) => {
        const component = downloadData.data[key];
        totalComponentPrice += component.price;

        // Assuming component.descriptions is a string, push it to the array
        allDescriptions.push(component.descriptions);
      });
    }

    // Render all descriptions in a single paragraph
    return (
      <div style={{ marginBottom: "10px" }}>{allDescriptions.join(", ")}</div>
    );
  };

  const renderDataFields = () => {
    if (!downloadData || !downloadData.data) return null;

    let totalComponentPrice = 0;

    return (
      <tr>
        <td key="data-cell">1</td>
        <td>
          {/* <p style={{ margin: 0, fontSize: 14 }}>
            <b>{downloadData && downloadData.referenceName}</b>
          </p> */}
          {renderDes(totalComponentPrice)}
        </td>
        <td align="center">{downloadData.productsQuantity} NOS</td>
        <td align="center">₹ {downloadData.marginwithGST}</td>
        <td align="center">₹ {downloadData && downloadData.marginwithGST}</td>
      </tr>
    );
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download = "quotation.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  return (
    <div id="quotation-content">
      <Box sx={{ backgroundColor: "#097dc4" }}>
        <Typography sx={{ color: "#fff", fontSize: 30, padding: 3 }}>
          Holoware Price Estimate
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ margin: "5px 0px 10px 20px", display: "flex", gap: 5 }}>
            <img
              src={HWLogo}
              style={{
                width: "230px",
                height: "80px",
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "20px",
              }}
            />

            <Box
              sx={{
                display: "flex",
                gap: "120px",
                color: "#fff",
                marginRight: "10px",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 12 }}>
                  <b>Holoware Computers Pvt Ltd</b>
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  SN Towers, Kundrathur Main Road, Moondramkattalai <br />
                  State: TamilNadu <br /> Chennai - 600128
                </Typography>
                <Typography sx={{ fontSize: 12 }}>18005725882</Typography>
                <Typography sx={{ fontSize: 12 }}>{Email}</Typography>
                {/* <Typography>Holoware Computers Pvt Ltd</Typography> */}
              </Box>
              <Box>
                <Typography sx={{ lineHeight: 2 }}>QUOTATION FOR</Typography>
                <Typography sx={{ fontSize: 12 }}>
                  <b>{downloadData && downloadData.addressTo}</b> <br />
                  {CustomerEmail} <br />
                  {CustomerMobile} <br /> {CustomerAddress}{" "}
                </Typography>
                {/* <Typography sx={{ lineHeight: 2 }}>India</Typography> */}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ backgroundColor: "#097dc4", padding: 2 }}>
          <Divider sx={{ bgcolor: "#efefe063" }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 5,
            color: "#fff",
            padding: "0px 0px 10px 20px",
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: "20px",
          }}
        >
          <Box>
            <Typography sx={{ lineHeight: 2 }}>Ticket No</Typography>
            <Typography>{Ticket}</Typography>
          </Box>
          <Box>
              <Typography sx={{lineHeight: 2}}>Mode Number</Typography>
              <Typography>{downloadData && downloadData.referenceName}</Typography>
            </Box>
          <Box>
            <Typography sx={{ lineHeight: 2 }}>Quotation Date</Typography>
            <Typography> {getCurrentDate()}</Typography>
          </Box>
          <Box>
            <Typography sx={{ lineHeight: 2 }}>valid Till Datte</Typography>
            <Typography>{getDateAfter30Days()}</Typography>
          </Box>
        </Box>

        <Box sx={{ backgroundColor: "#097dc4", padding: 2 }}>
          <Divider sx={{ bgcolor: "#efefe063" }} />
        </Box>
      </Box>

      <Box sx={{ padding: 2 }}>
        <TableContainer
          sx={{
            border: "2px solid #5ba8d7",
            borderRadius: "10px 10px 0px 0px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#d0eef9" }}>
                <TableCell>Item</TableCell>
                {/* <TableCell>GST Rate</TableCell> */}
                <TableCell>Rate</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ lineHeight: 1 }}>
                <TableCell style={{ whiteSpace: "pre-line" }}>
                  {descriptionLines?.map((description, index) => (
                    <div key={index}>{description}</div>
                  ))}
                </TableCell>
                {/* <TableCell align="left">18%</TableCell> */}
                <TableCell>
                  ₹ {downloadData && downloadData.totalDiscountPrice}
                </TableCell>
                <TableCell>
                  {downloadData && downloadData.productsQuantity}
                </TableCell>
                <TableCell>
                  ₹ {downloadData && downloadData.totalDiscountPrice}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ py: 3 }}>
            <Typography sx={{ color: "#097dc4", fontWeight: 600, py: 0 }}>
              TERMS AND CONDITIONS
            </Typography>
            <Typography
              sx={{ fontSize: 14, lineHeight: 2 }}
              dangerouslySetInnerHTML={{
                __html:
                  downloadData && downloadData.terms.replace(/\*/g, "<br/>*"),
              }}
            ></Typography>
            {/* <Typography sx={{fontSize:14,lineHeight:2}}>Monitor Price are not included</Typography>
        <Typography sx={{fontSize:14,lineHeight:2}}>Price valid for 30 Days</Typography> */}
          </Box>
          <Box sx={{ py: 1 }}>
            {/* <Box sx={{display:'flex',gap:5,py:2,justifyContent:'space-between'}}>
          <Typography>Amount</Typography>
          <Typography><b>₹35,000.00</b></Typography>
        </Box>
        <Box sx={{display:'flex',gap:5,justifyContent:'space-between'}}>
          <Typography>CGST</Typography>
          <Typography><b>₹3,150.00</b></Typography>
        </Box>
        <Box sx={{display:'flex',gap:5,py:2,justifyContent:'space-between'}}>
          <Typography>SGST</Typography>
          <Typography><b>₹3,150.00</b></Typography>
        </Box> */}

            <Box
              sx={{
                display: "flex",
                gap: 5,
                p: 1,
                backgroundColor: "#097dc4",
                color: "#fff",
                marginTop: "80PX",
              }}
            >
              <Typography>Total(INR) = </Typography>
              <Typography>
                ₹ {downloadData && downloadData.totalDiscountPrice} + GST (18%)
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ paddingTop: 5 }}>
          <Box sx={{ borderTop: "1px dashed #c1c1c1" }} />
          <Typography sx={{ fontSize: 11, textAlign: "center", pt: 1 }}>
            This is an electronically generated document, no signature is
            required.
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default PricingQuotation;