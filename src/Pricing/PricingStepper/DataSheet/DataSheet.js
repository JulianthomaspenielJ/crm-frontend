import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import img from "./DataSheetImg/data.jpg";
import img1 from "./DataSheetImg/datasheet.jpg";

const DataSheet = () => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Capture first image
    const firstImgElement = document.getElementById("firstImage");

    html2canvas(firstImgElement, { useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        if (imgData) {
          doc.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size in mm
          doc.addPage();

          // Capture remaining content
          const content = document.getElementById("pdfContent");

          html2canvas(content, { useCORS: true })
            .then((canvas) => {
              const imgData = canvas.toDataURL("image/png");

              if (imgData) {
                doc.addImage(imgData, "PNG", 0, 0, 210, 297); // A4 size in mm
                doc.save("document.pdf"); // Download the PDF
              } else {
                console.error("Error generating image data for second page.");
              }
            })
            .catch((error) => {
              console.error("Error capturing content for second page:", error);
            });
        } else {
          console.error("Error generating image data for first page.");
        }
      })
      .catch((error) => {
        console.error("Error capturing first image:", error);
      });
  };

  return (
    <div>
      <div id="firstImage" style={{ padding: "20px" }}>
        <img src={img} alt="Sample" style={{ width: "100%", height: "auto" }} />
      </div>

      <div id="pdfContent" style={{ padding: "20px" }}>
        <img
          src={img1}
          alt="Sample"
          style={{ width: "100%", height: "300px", objectFit: "cover" }}
        />
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "10px 0px",
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Processors
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                Intel Core i5 13400 (10 Core, 20MB Cache, Base clock 2.5GHz, Max
                Boost Up to 4.6GHz)
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                {" "}
                Model Number
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                {" "}
                H6 5000 41D15
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Chipset
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                {" "}
                B660{" "}
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Memory
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                8GB DDR4 RAM 3200MHz
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                {" "}
                Memory slots
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                4 x DDR4 DIMM sockets supporting up to 128 GB2
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                storage
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                512GB SATA SSD
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Graphics
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                {" "}
                Integrated
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Audio
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                Realtek 7.1 Surround Sound High Definition Audio CODEC
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                {" "}
                Ports and Connectors
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                1 x USB 3.2 Gen 2x2 port (1 x USB Type-C), 2 x USB 3.2 Gen 2
                ports (2 x Type-A), 1 x USB 3.2 Gen 1 port (1 x Type-A), 2 x USB
                2.0 ports (2 x Type-A), 1 x DisplayPort, 1 x D-Sub port, 1 x
                HDMI port, 1 x Realtek 2.5Gb Ethernet port, 3 x Audio jacks
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                {" "}
                LAN
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                Realtek® 2.5GbE LAN chip (2.5 Gbps/1 Gbps/100 Mbps)
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                {" "}
                PCIe Ports
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                1 x PCI Express x16 slot
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Monitor Support
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                Upto 2 Monitors(Via Integrated)
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Power
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                450W
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                {" "}
                WIFI/BT
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                Optional
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Dimensions
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                H 38.8; W 15.0; L 29.3 in cms
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Weight
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                {" "}
                Upto 8Kgs
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                {" "}
                Available OS
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                Windows 11 Pro
              </td>
            </tr>
            <tr>
              <td style={{ width: "20%", padding: "15px", textAlign: "left" }}>
                Warranty
              </td>
              <td style={{ width: "80%", padding: "15px", textAlign: "left" }}>
                {" "}
                3 Years Onsite Warranty
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            backgroundColor: "#004aac",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 50px 0px 50px",
          }}
        >
          <p style={{ fontSize: 14 }}>www.holoware.co</p>
          <p style={{ fontSize: 14 }}>1900-572-5882</p>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={generatePDF}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default DataSheet;
