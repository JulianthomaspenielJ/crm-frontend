import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import html2canvas from "html2canvas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import templateImage1 from "../../Image/Certificate/DataSheet1.png"; // First template image
import templateImage2 from "../../Image/Certificate/DDataSheet2.png"; // Second template image
import LtemplateImage2 from "../../Image/Certificate/LDataSheet2.png"; // Second template image
import TtemplateImage2 from "../../Image/Certificate/TDataSheet-2.png"; // Second template image
import { Rnd } from "react-rnd";
import Loading from "../../Loading/Loading";

export default function DataSheetData({
  openPDF,
  uploadedImage,
  setUploadedImage,
  type,
  gemID,
  dataSheet,
  setDataSheet,
}) {
  const [imageSettings, setImageSettings] = useState({
    x: 80,
    y: 350,
    width: 450,
    height: 420,
  });
  const gemData = JSON.parse(localStorage.getItem("GEMData")) || {};

  const [values, setValues] = useState(gemData[gemID]?.DataSheet);
  const [product, setProduct] = useState(gemData[gemID]?.DataSheet?.product);

  const certificateRef1 = useRef();
  const certificateRef2 = useRef(); // Reference for the second template

  const isDisabled = values && Object.values(values)?.some((value) => !value);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (type === "selection") {
      if (values) {
        generatePDF();
      }
    }
  }, [type]);

  // useEffect(() => {
  // if(values){

  //     generatePDF();
  // }

  // }, []);

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create();

    // First page (Template 1)
    const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 size for first page
    const { width: width1, height: height1 } = page1.getSize();
    const pngImageBytes1 = await fetch(templateImage1).then((res) =>
      res.arrayBuffer()
    );
    const pngImage1 = await pdfDoc.embedPng(pngImageBytes1);
    page1.drawImage(pngImage1, {
      x: 0,
      y: 0,
      width: width1,
      height: height1,
    });

    // Draw uploaded image on page 1 only
    if (uploadedImage) {
      const uploadedImageBytes = await fetch(
        `data:image/png;base64,${uploadedImage}`
      ).then((res) => res.arrayBuffer());
      const uploadedImg = await pdfDoc.embedPng(uploadedImageBytes);

      const aspectRatio = uploadedImg.width / uploadedImg.height;
      let adjustedWidth = imageSettings.width;
      let adjustedHeight = imageSettings.height;
      if (imageSettings.width / imageSettings.height > aspectRatio) {
        adjustedWidth = imageSettings.height * aspectRatio;
      } else {
        adjustedHeight = imageSettings.width / aspectRatio;
      }

      page1.drawImage(uploadedImg, {
        x: imageSettings.x,
        y: height1 - imageSettings.y - adjustedHeight,
        width: adjustedWidth,
        height: adjustedHeight,
      });
    }
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    {
      product === "Laptop"
        ? page1.drawText(`Gizmos Series`, {
            x: 30,
            y: 545,
            size: 18,
            color: rgb(1, 1, 1),
          })
        : product === "Tablet"
        ? page1.drawText(``, {
            x: 30,
            y: 545,
            size: 18,
            color: rgb(1, 1, 1),
          })
        : page1.drawText(`Tejas`, {
            x: 30,
            y: 545,
            size: 18,
            color: rgb(1, 1, 1),
          });
    }

    page1.drawText(
      product
        ? product === "Laptop"
          ? `Executive ${product.toUpperCase()}`
          : product.toUpperCase()
        : "",
      {
        x: 30,
        y: 515,
        size: 22,
        color: rgb(1, 1, 1),
        font: boldFont,
      }
    );

    page1.drawText("India's Best", {
      x: 410,
      y: 710,
      size: 22,

      color: rgb(1, 1, 1), // Ensure the color is set correctly
      font: boldFont,
    });
    page1.drawText(`${product || ""}`, {
      x: 410,
      y: 680,
      size: 22,
      color: rgb(1, 1, 1), // Ensure the color is set correctly
      font: boldFont,
    });
    page1.drawText("www.holoware.co", {
      x: 410,
      y: 660,
      size: 12,
      color: rgb(1, 1, 1), // Ensure the color is set correctly
      font: boldFont,
    });

    page1.drawText("1800-572-5882", {
      x: 410,
      y: 645,
      size: 12,
      color: rgb(1, 1, 1), // Ensure the color is set correctly
      font: boldFont,
    });

    const page2 = pdfDoc.addPage([595.28, 841.89]);
    const { width: width2, height: height2 } = page2.getSize();
    const pngImageBytes2 = await fetch(
      product == "Laptop"
        ? LtemplateImage2
        : product === "Tablet"
        ? TtemplateImage2
        : templateImage2
    ).then((res) => res.arrayBuffer());
    const pngImage2 = await pdfDoc.embedPng(pngImageBytes2);
    page2.drawImage(pngImage2, {
      x: 0,
      y: 0,
      width: width2,
      height: height2,
    });

    const drawWrappedText = (text, x, y, size, maxWidth) => {
      const fontSize = size || 10;
      const maxCharsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
      const lines = [];
      let currentLine = "";

      text.split(" ").forEach((word) => {
        if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      let currentY = y;
      lines.forEach((line) => {
        page2.drawText(line, {
          x,
          y: currentY,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
        currentY -= fontSize + 2; // Move to the next line (adjust as needed)
      });
    };
    const drawText = (text, yDefault, yLong) => {
      drawWrappedText(
        text,
        product === "Laptop" ? 150 : product === "Tablet" ? 157 : 145,
        text.length > 100 ? yLong : yDefault,
        8,
        540
      );
    };

    // Draw the image on the PDF
    product !== "Tablet" &&
      page2.drawText(`${product ? product.toUpperCase() : ""}`, {
        x: 400,
        y: 818,
        width: 80,
        height: 80,
        size: 14,
        font: boldFont,
        color: rgb(1, 1, 1),
      });
    product !== "Tablet" &&
      page2.drawText(
        `PRODUCT DATA SHEET | H6 HOLOWARE ${
          product ? product.toUpperCase() : ""
        }`,
        {
          x: 20,
          y: 818,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0), // Ensure the color is set correctly
        }
      );

    if (product === "Laptop") {
      drawText(values.processor || "Nil", 773, 783);
      drawText(values.memory || "Nil", 735, 745);
      drawText(values.memorySlots || "Nil", 697, 707);
      drawText(values.storage || "Nil", 659, 669);
      drawText(values.graphics || "Nil", 620, 630);
      drawText(values.ports || "Nil", 570, 580);
      drawText(values.screen || "Nil", 518, 528);
      drawText(values.camera || "Nil", 480, 490);
      drawText(values.battery || "Nil", 442, 452);
      drawText(values.audio || "Nil", 402, 412); // Repeated processor field
      drawText(values.wifiBt || "Nil", 364, 374);
      drawText(values.dimensions || "Nil", 326, 336);
      drawText(values.weight || "Nil", 288, 298);
      drawText(values.powerAdapter || "Nil", 250, 260);
      drawText(values.availableOS || "Nil", 212, 222);
      drawText(values.warranty || "Nil", 174, 184);
    } else if (product === "Tablet") {
      drawText(values.processor || "Nil", 738, 750);
      drawText(values.memory || "Nil", 685, 695);
      drawText(values.storage || "Nil", 635, 645);
      drawText(values.graphics || "Nil", 585, 595);
      drawText(values.ports || "Nil", 535, 545);
      drawText(values.weight || "Nil", 485, 495);
      drawText(values.display || "Nil", 435, 445);
      drawText(values.battery || "Nil", 385, 395);
      drawText(values.sensor || "Nil", 335, 345);
      drawText(values.camera || "Nil", 285, 295);
      drawText(values.connectivity || "Nil", 235, 245);
      drawText(values.touchPanel || "Nil", 185, 195);
      drawText(values.availableOS || "Nil", 135, 145);
      drawText(values.warranty || "Nil", 85, 95);
    } else {
      drawText(values.processor || "Nil", 765, 772);
      drawText(values.modelNumber || "Nil", 738, 745);
      drawText(values.chipSet || "Nil", 711, 719);
      drawText(values.memory || "Nil", 684, 691);
      drawText(values.memorySlots || "Nil", 657, 664);
      drawText(values.storage || "Nil", 630, 637);
      drawText(values.storageSupport || "Nil", 603, 610);
      drawText(values.storageInterface || "Nil", 576, 583);
      drawText(values.graphics || "Nil", 550, 557);
      drawText(values.graphicsSupport || "Nil", 524, 531);
      drawText(values.monitor || "Nil", 498, 505);
      drawText(values.audio || "Nil", 471, 479); // Repeated processor field
      drawText(values.lan || "Nil", 444, 451);

      drawText(values.ports || "Nil", 400, 413);
      drawText(values.pci || "Nil", 360, 367);
      drawText(values.wifiBt || "Nil", 330, 337);
      drawText(values.WLANSupport || "Nil", 298, 305);
      drawText(values.dimensions || "Nil", 272, 279);

      drawText(values.cabinetColor || "Nil", 245, 253);
      drawText(values.cabinetLitres || "Nil", 218, 225);

      drawText(values.power || "Nil", 191, 199);
      drawText(values.availableOS || "Nil", 164, 171);

      drawText(values.security || "Nil", 137, 144);

      drawText(values.warranty || "Nil", 110, 117);
    }

    function drawField(label, yLabel) {
      page2.drawText(label, {
        x: product === "Laptop" ? 47 : product === "Tablet" ? 48 : 32,
        y: yLabel,
        size: 10,
        color: rgb(0, 0, 0),
      });
    }

    if (product === "Laptop") {
      drawField("Processor", 773);
      drawField("Memory", 735);
      drawField("Memory Slots", 697);
      drawField("Storage", 659);
      drawField("Graphics", 620);
      drawField("Ports and Connectors", 570);
      drawField("Screen", 518);
      drawField("Camera", 480);
      drawField("Battery", 442);
      drawField("Speakers", 402);
      drawField("Wifi/BT", 364);
      drawField("Dimensions", 326);
      drawField("Weight", 288);
      drawField("Power Adapter", 250);
      drawField("Available OS", 212);
      drawField("Warranty", 174);
    } else if (product === "Tablet") {
      drawField("Processor", 738);
      drawField("Memory", 685);
      drawField("Storage", 635);
      drawField("Graphics", 585);
      drawField("Ports and Connectors", 535);
      drawField("Weight", 485);
      drawField("Display", 435);
      drawField("Battery", 385);
      drawField("Sensor", 335);
      drawField("Camera", 285);
      drawField("Connectivity", 235);
      drawField("Touch Panel", 185);
      drawField("OS", 135);
      drawField("Warranty", 85);
    } else {
      drawField("Processor", 765);
      drawField("Model Number", 738);
      drawField("Chipset", 711);
      drawField("Memory", 684);
      drawField("Memory Slots", 657);
      drawField("Storage", 630);
      drawField("Storage Support", 603);
      drawField("Storage Interface", 576);
      drawField("Graphics", 550);
      drawField("Graphics Support", 524);
      drawField("Monitor Support", 498);
      drawField("Audio", 471);
      drawField("LAN", 444);

      drawField("Ports and Connectors", 400);
      drawField("Expansion Slots", 360);
      drawField("Wifi/BT", 330);
      drawField("WLAN Support", 298);
      drawField("Dimensions", 272);
      drawField("Cabinet Color", 245);
      drawField("Cabinet Litres", 218);

      drawField("Power Supply", 191);
      drawField("Available OS", 164);
      drawField("Security", 137);
      drawField("Warranty", 110);
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    const pdfBlobUrl = URL.createObjectURL(blob);
    setDataSheet(pdfBlobUrl); // Store the Blob URL in state to preview it

    const base64String = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;

      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      reader.readAsDataURL(blob);
    });

    // handleNext();
  };

  return (
    <div
      style={
        {
          // height: "100%",
          // overflowY: "auto",
          // display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          // overflowX: "hidden",
          // padding: "0px 10px 0px 0px",
        }
      }
    >
      <div>
        <div
          style={{
            // display: "flex",
            gap: "20px",
            pointerEvents: openPDF || isDisabled ? "auto" : "none",
            opacity: openPDF || isDisabled ? 1 : 0.5,
          }}
        >
          <div
            ref={certificateRef1}
            hidden={type === "selection"}
            style={{
              position: "relative",
              // width: "595px",
              // height: "842px",
              border: "2px solid black",
            }}
          >
            <img
              src={templateImage1}
              alt="Certificate Template 1"
              style={{ width: "100%", height: "100%" }}
            />
            {uploadedImage ? (
              <Rnd
                size={{
                  width: imageSettings.width,
                  height: imageSettings.height,
                }}
                position={{ x: imageSettings.x, y: imageSettings.y }}
                onDragStop={(e, data) => {
                  setImageSettings((prev) => ({
                    ...prev,
                    x: data.x,
                    y: data.y,
                  }));
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setImageSettings((prev) => ({
                    ...prev,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                  }));
                }}
                bounds="parent"
                minWidth={50}
                minHeight={50}
                maxWidth={500}
                maxHeight={500}
                dragHandleClassName="handle"
                style={{ border: "2px dashed red" }}
              >
                <img
                  src={`data:image/png;base64,${uploadedImage}`}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Rnd>
            ) : (
              <Rnd
                size={{
                  width: 400,
                  height: 230,
                }}
                position={{ x: 100, y: 450 }}
                style={{ textAlign: "center" }} // Border style for uploaded image
              >
                {/* <Button component="label" sx={{ marginTop: 12 }}>
                  + Add Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button> */}
              </Rnd>
            )}
          </div>

          {/* Second Template Preview */}
          <div
            ref={certificateRef2}
            hidden
            style={{
              position: "relative",
              // width: "595px",
              // height: "842px",
              border: "2px solid black",
              marginTop: "10px",
            }}
          >
            <img
              src={product == "Laptop" ? LtemplateImage2 : templateImage2}
              alt="Certificate Template 2"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* File upload and Generate PDF button */}
        <Box mt={2} textAlign="end">
          {/* {type === "GEM" && (
            <Button
              type="button"
              variant="outlined"
              style={{ marginRight: "10px" }}
              onClick={handleBack}
            >
              Back
            </Button>
          )}

          <Button variant="contained" onClick={generatePDF} disabled={!openPDF}>
            Next
          </Button> */}
        </Box>
      </div>

      {type === "selection" && dataSheet && values ? (
        <iframe
          src={dataSheet}
          width="100%"
          height="768px"
          style={{ border: "none" }}
        />
      ) : (
        type === "selection" && (
          <div>
            <Loading />{" "}
          </div>
        )
      )}
    </div>
  );
}
