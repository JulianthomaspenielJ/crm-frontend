import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Downloadpdf.css"; // Import the CSS file
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";


const numberToWords = (num) => {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
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

    let words = '';

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
      words += (words !== '' ? "and " : '') + getTens(remainder);
    }

    return words.trim();
  };

  return convert(num);
};

const DownloadPDF = ({
  downloadPageOpen,
  setDownloadPageOpen,
  downloadData,
}) => {
  // Function to handle PDF download
  const downloadPDF = () => {
    const input = document.getElementById("quotation-content");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Check if content fits within a single page
      if (heightLeft > pageHeight) {
        let position = 0;

        while (position < heightLeft) {
          position += pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight);
        }
      }

      pdf.save("quotation.pdf");
    });
    setDownloadPageOpen(false)
  };

  //const amount = downloadData.marginwithGST || 0;

  const renderDes=(totalComponentPrice)=>{
    let allDescriptions = [];

// Collect all descriptions
if (downloadData) {
  Object.keys(downloadData.data).forEach((key, index) => {
    const component = downloadData.data[key];
    totalComponentPrice += component.price;

    // Assuming component.descriptions is a string, push it to the array
    allDescriptions.push(component.descriptions);
  });
}
// Render all descriptions in a single paragraph
return (
  <div style={{ marginBottom: "10px" }}>
    {allDescriptions.join(", ")}
  </div>
);
  }

  const renderDataFields = () => {
    if (!downloadData || !downloadData.data) return null;

    let totalComponentPrice = 0;

    return (
      <tr >
        <td key="data-cell">1</td>
        <td>
          <p style={{ margin: 0, fontSize: 14 }}>
            <b>{downloadData && downloadData.referenceName}</b>
          </p>
          {renderDes(totalComponentPrice)}
        </td>
        <td align="center">{downloadData.productsQuantity} NOS</td>
        {/* <td align="center"> 18%</td> */}

        <td align="center"> ₹ {downloadData.marginwithGST}</td>

        <td align="center">₹ {downloadData && downloadData.marginwithGST}</td>
      </tr>
    );
  };

  return (
    <Dialog
      open={downloadPageOpen}
      maxWidth="md"
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Preview"}</DialogTitle>
      <DialogContent>
        <div style={{ border: "1px solid black", paddingBottom: "30px" }}>
          <div className="quotation-container">
            <div id="quotation-content" className="quotation-content">
              <div className="header">
                <div className="header-info">
                  <p style={{ margin: "0px" }}>
                    <b>Holoware Computers Pvt Ltd</b>
                  </p>
                  <p style={{ margin: "0px" }}>
                    No.2, Ground Floor, Kundrathur Main Road, Moondramkattalai,
                    Chennai - 600128 Phone no.: 18005725882 Email:
                    sales1@holoware.co GSTIN: 33AAGCH1442L1ZP, State: 33-Tamil
                    Nadu
                  </p>
                </div>
              </div>

              <div>
                <p className="quotation-title">
                  <b>Quotation</b>
                </p>
              </div>

              <div className="estimate-section">
                <div style={{ textAlign: "left" }}>
                  <p style={{ margin: "0px" }}>Estimate For</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0px" }}>Estimate For</p>
                </div>
              </div>

              <div className="estimate-info">
                <div style={{ textAlign: "left" }}>
                  <p style={{ margin: "0px" }}>
                    <b>{downloadData && downloadData.addressTo}</b>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0px" }}>
                    <b>HSN/SAC : 84715000</b>
                  </p>
                  <p style={{ margin: "0px" }}>Date : {downloadData&&downloadData.date}</p>
                  {/* <p style={{ margin: "0px" }}>Sales Person: Sabari</p> */}
                </div>
              </div>

              <div>
                <table className="table-container">
                  <thead style={{ backgroundColor: "#097aa8", color: "#fff" }}>
                    <tr>
                      <th>#</th>
                      <th style={{width:"350px"}}>Item name</th>
                      <th>Quantity</th>
                      {/* <th>GST</th> */}
                      <th>Price/Unit</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderDataFields()}

                    <tr>
                      <td></td>
                      <td>
                        <b>Total</b>
                      </td>
                      <td>
                        <b>{downloadData && downloadData.productsQuantity}</b>
                      </td>
                      {/* <td><b>18%</b></td> */}
                      <td></td>
                      <td>
                        <b> ₹ {downloadData && downloadData.marginwithGST}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="amounts">
                <div>
                  {/* <table className="tax-table">
              <thead style={{ backgroundColor: "#097aa8", color: "#fff" }}>
                <tr>
                  <th>Tax type</th>
                  <th>Taxable amount</th>
                  <th>Rate</th>
                  <th>Tax amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SGST</td>
                  <td>₹ 44786</td>
                  <td>9 %</td>
                  <td>₹ 4031</td>
                </tr>
                <tr>
                  <td>CGST</td>
                  <td>₹ 44786</td>
                  <td>9 %</td>
                  <td>₹ 4031</td>
                </tr>
              </tbody>
            </table> */}

                  <div>
                    <p className="section-title">
                      <b> Estimate Amount In Words</b>
                    </p>
                    <p>{numberToWords(downloadData && downloadData.marginwithGST)} Rupees </p>

                  </div>

                  <div>
                    <p className="section-title">
                      <b>Description</b>
                    </p>
                    <p>
                     {downloadData&&downloadData.description}
                    </p>
                    {/* <p>*Delivered in 2-3 Weeks</p>
                    <p>*MS Office Home & Student Price included</p> */}
                  </div>

                  <div>
                    <p className="section-title">
                      <b> Terms and Conditions</b>
                    </p>
                    <p>   {downloadData&&downloadData.terms}</p>
                    {/* <p>
                      * In the above quoted price Monitor Wired Keyboard & Wired
                      Mouse prices are included.
                    </p>
                    <p>* CPU Cooler price included.</p>
                    <p>* Delivered in 6-7 weeks.</p>
                    <p>* 3 Years Onsite Warranty.</p>
                    <p>
                      * RC need to be signed for the price validity of 1 Year
                      for the quoted product.
                    </p> */}
                  </div>
                </div>

                {/* <div>
            <table className="total-table">
              <thead style={{ backgroundColor: "#097aa8", color: "#fff" }}>
                <tr>
                  <th colSpan="2">Amounts</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sub Total</td>
                  <td style={{ textAlign: "end" }}>₹ 44786</td>
                </tr>
                <tr>
                  <td>Tax (18%)</td>
                  <td style={{ textAlign: "end" }}>₹ 8061</td>
                </tr>
                <tr>
                  <td>Round off</td>
                  <td style={{ textAlign: "end" }}>₹ 0</td>
                </tr>
                <tr>
                  <td colSpan={2} style={{padding:"0px"}}>
                    <hr style={{color:"#686868de"}}/>
                  </td>
                </tr>

                <tr>
                  <td>
                    <b>Total</b>
                  </td>
                  <td style={{ textAlign: "end" }}>
                    <b>₹ 52847</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} style={{padding:"0px"}}>
                    <hr style={{color:"#686868de"}} />
                  </td>
                </tr> 
              </tbody>
            </table>
          </div> */}
              </div>
            </div>
          </div>
        </div>

        <DialogActions>
          <Button
            onClick={() => {
              setDownloadPageOpen(false);
            }}
            variant="outlined"
            sx={{ my: 2 }}
          >
            cancel
          </Button>

          <Button onClick={downloadPDF} variant="contained" sx={{ my: 2 }}>
            Download PDF
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadPDF;
