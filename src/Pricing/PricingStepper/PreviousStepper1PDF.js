import React, { useRef, useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import html2canvas from "html2canvas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import templateImage1 from "../../Image/Certificate/DataSheet1.png"; // First template image
import templateImage2 from "../../Image/Certificate/DDataSheet2.png"; // Second template image
import LtemplateImage2 from "../../Image/Certificate/LDataSheet2.png"; // Second template image
import TtemplateImage2 from "../../Image/Certificate/TDataSheet-2.png"; // Second template image
import AtemplateImage2 from "../../Image/Certificate/ADataSheet-2.png"; // Second template image
import GLtemplateImage2 from "../../Image/Certificate/GLDataSheet2.png";
import MPCtemplateImage2 from "../../Image/Certificate/MPCDataSheet2.png";
import { Rnd } from "react-rnd";

export default function PDFPreview({
  values,
  setDataSheet,
  openPDF,
  handleNext,
  uploadedImage,
  setUploadedImage,
  product,
  handleBack,
  type,
}) {
  const [imageSettings, setImageSettings] = useState({
    x: 100,
    y: 420,
    width: 400,
    height: 380,
  });

  const certificateRef1 = useRef();
  const certificateRef2 = useRef(); // Reference for the second template

  const isDisabled = Object.values(values).some((value) => !value);

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
      product === "Laptop" || product === "Gaming Laptop"
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
        : product === "All in one pc"
        ? AtemplateImage2
        : product === "Mini PC"
        ? MPCtemplateImage2
        : product === "Gaming Laptop"
        ? GLtemplateImage2
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
        product === "Laptop"
          ? 150
          : product === "Tablet"
          ? 157
          : product === "All in one pc"
          ? 148
          : product === "Mini PC"
          ? 138
          : 145,
        text.length > 100 ? yLong : yDefault,
        8,
        540
      );
    };

    // Draw the image on the PDF
    product !== "Tablet" &&
      product !== "All in one pc" &&
      product !== "Mini PC" &&
      product !== "Gaming Laptop" &&
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
      product !== "All in one pc" &&
      product !== "Mini PC" &&
      product !== "Gaming Laptop" &&
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
    } else if (product === "Gaming Laptop") {
      drawText(values.processor || "Nil", 746, 756);
      drawText(values.memory || "Nil", 706, 716);
      drawText(values.memorySlots || "Nil", 665, 675);
      drawText(values.storage || "Nil", 620, 630);
      drawText(values.graphics || "Nil",578, 588);
      drawText(values.ports || "Nil", 520, 530);
      drawText(values.touchPanel || "Nil", 463, 473);
      drawText(values.camera || "Nil", 422, 432);
      drawText(values.battery || "Nil", 379, 389);
      drawText(values.audio || "Nil", 336, 346); // Repeated processor field
      drawText(values.wifiBt || "Nil", 290, 300);
      drawText(values.dimensions || "Nil", 250, 260);
      drawText(values.weight || "Nil", 205, 215);
      drawText(values.availableOS || "Nil", 165, 175);
      drawText(values.keyboard || "Nil", 120,130);
      drawText(values.warranty || "Nil", 80,909);
    } else if (product === "Tablet") {
      drawText(values.processor || "Nil", 738, 750);
      drawText(values.memory || "Nil", 685, 695);
      drawText(values.storage || "Nil", 635, 645);
      drawText(values.graphics || "Nil", 585, 595);
      drawText(values.ports || "Nil", 535, 545);
      drawText(values.weight || "Nil", 485, 495);
      drawText(values.screen || "Nil", 435, 445);
      drawText(values.battery || "Nil", 385, 395);
      drawText(values.sensor || "Nil", 335, 345);
      drawText(values.camera || "Nil", 285, 295);
      drawText(values.connectivity || "Nil", 235, 245);
      drawText(values.touchPanel || "Nil", 185, 195);
      drawText(values.availableOS || "Nil", 135, 145);
      drawText(values.warranty || "Nil", 85, 95);
    } else if (product === "All in one pc") {
      const cleanedChipSet = values.chipSet?.replace(/\s*-\s*\d+/g, "");
      drawText(values.processor || "Nil", 734, 744);
      drawText(values.modelNumber || "Nil", 694, 704);
      drawText(cleanedChipSet || "Nil", 654, 664);
      drawText(values.memory || "Nil", 615, 625);
      drawText(values.memorySlots || "Nil", 575, 585);
      drawText(values.storage || "Nil", 536, 546);
      drawText(values.graphics || "Nil", 497, 507);
      drawText(values.ports || "Nil", 445, 453);
      drawText(values.lan || "Nil", 390, 400);
      drawText(values.monitor || "Nil", 351, 361);
      drawText(values.camera || "Nil", 312, 322);
      drawText(values.mic || "Nil", 273, 283);
      drawText(values.power || "Nil", 234, 244);
      drawText(values.audio || "Nil", 195, 205); // Repeated processor field
      drawText(values.wifiBt || "Nil", 155, 165);
      drawText(values.availableOS || "Nil", 116, 126);
      drawText(values.warranty || "Nil", 77, 87);
    } else if (product === "Mini PC") {
      drawText(values.processor || "Nil", 723, 733);
      drawText(values.modelNumber || "Nil", 681, 691);
      drawText(values.memory || "Nil", 639, 649);
      drawText(values.memorySlots || "Nil", 598, 608);
      drawText(values.storage || "Nil", 555, 565);
      drawText(values.graphics || "Nil", 513, 523);
      drawText(values.audio || "Nil", 473, 483);
      drawText(values.ports || "Nil", 430, 440);
      drawText(values.lan || "Nil", 380, 390);
      drawText(values.monitor || "Nil", 334, 344);
      drawText(values.power || "Nil", 285, 295);
      drawText(values.wifiBt || "Nil", 245, 255);
      drawText(values.dimensions || "Nil", 203, 213);
      drawText(values.weight || "Nil", 162, 172);
      drawText(values.availableOS || "Nil", 121, 131);
      drawText(values.warranty || "Nil", 80, 90);
    } else {
      const cleanedChipSet = values.chipSet?.replace(/\s*-\s*\d+/g, "");
      drawText(values.processor || "Nil", 765, 772);
      drawText(values.modelNumber || "Nil", 738, 745);
      drawText(cleanedChipSet || "Nil", 711, 719);
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
        x:
          product === "Laptop"
            ? 47
            : product === "Tablet"
            ? 48
            : product === "All in one pc"
            ? 45
            : product === "Mini PC"
            ? 43
            :product === "Gaming Laptop"?43: 32,
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
    } else if (product === "Gaming Laptop") {
      drawField("Processor", 746);
      drawField("Memory", 706);
      drawField("Memory Slots", 665);
      drawField("Storage", 620);
      drawField("Graphics", 578);
      drawField("Ports and ", 524);
      drawField("Connectors", 514);
      drawField("Panel", 463);
      drawField("Camera", 422);
      drawField("Battery", 379);
      drawField("Speakers", 336);
      drawField("Wifi/BT", 290);
      drawField("Dimensions", 250);
      drawField("Weight", 205);
      drawField("Available OS", 165);
      drawField("Keyboard", 120);
      drawField("Warranty", 80);
    } else if (product === "All in one pc") {
      drawField("Processor", 734);
      drawField("Model Number", 694);
      drawField("Chipset", 654);
      drawField("Memory", 615);
      drawField("Memory Slots", 575);
      drawField("Storage", 536);
      drawField("Graphics", 497);
      drawField("Ports and Connectors", 445);
      drawField("LAN", 390);
      drawField("Monitor", 351);
      drawField("Camera", 312);
      drawField("Mic", 273);
      drawField("Power Supply", 234);
      drawField("Speakers", 195);
      drawField("Wifi/BT", 155);
      drawField("Available OS", 116);
      drawField("Warranty", 77);
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
    } else if (product === "Mini PC") {
      drawField("Processor", 723);
      drawField("Model Number", 681);
      drawField("Memory", 639);
      drawField("Memory Slots", 598);
      drawField("Storage", 555);
      drawField("Graphics", 513);
      drawField("Audio", 473);
      drawField("Ports and", 430);
      drawField("Connectors", 420);
      drawField("LAN", 380);
      drawField("Monitor Support", 334);
      drawField("Power Adapter", 285);
      drawField("Wifi/BT", 245);
      drawField("Dimensions", 203);
      drawField("Weight", 162);
      drawField("Available OS", 121);
      drawField("Warranty", 80);
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

    handleNext();
  };

  const generatePDFPreview = async () => {
    const certificateDiv1 = certificateRef1.current;
    const canvas1 = await html2canvas(certificateDiv1);
    const imgData1 = canvas1.toDataURL("image/png");

    const certificateDiv2 = certificateRef2.current;
    const canvas2 = await html2canvas(certificateDiv2);
    const imgData2 = canvas2.toDataURL("image/png");
  };

  useEffect(() => {
    generatePDFPreview();
  }, [values, uploadedImage, imageSettings]);

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        padding: "0px 10px 0px 0px",
      }}
    >
      <div>
        {/* Preview for both templates */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            pointerEvents: openPDF || isDisabled ? "auto" : "none",
            opacity: openPDF || isDisabled ? 1 : 0.5,
          }}
        >
          {/* First Template Preview */}
          <div
            ref={certificateRef1}
            style={{
              position: "relative",
              width: "595px",
              height: "842px",
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
              width: "595px",
              height: "842px",
              border: "2px solid black",
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
          {type === "GEM" && (
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
          </Button>
        </Box>
      </div>
    </div>
  );
}
