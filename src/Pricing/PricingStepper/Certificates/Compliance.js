import React, { useState, useEffect } from "react";
import AuthService from "../../../services/AuthService";
import axios from "axios";
import { Button, Select, MenuItem, TextField } from "@mui/material";
import companyLogo from "../../../Image/HWLogo.png";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import "jspdf-autotable";


function Compliance({ handleNext, setComplianceCertificate, gemUrl, setHolowareValues }) {
  const CRMBaseURL = AuthService();
  const [complianceData, setComplianceData] = useState([]); 
  const [additionalRows, setAdditionalRows] = useState([]);
  const [isEditing, setIsEditing] = useState({}); // Track if rows are in editing mode
  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected options for each row
  const [customInput, setCustomInput] = useState({}); // Track custom text input for each row
  const [holowareSpecifications, setHolowareSpecifications] = useState({});
  // const [complianceCertificate, setComplianceCertificate] = useState(null);
  
  // Fetch compliance data from the backend
  const fetchData = async () => {
    const values = { link: gemUrl};
    try {
      const res = await CRMBaseURL.post("compliance", values);
      setComplianceData(res.data.Data[1] || []);
    } catch (e) {
      console.log("Error occurred", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const specifications = [
    "Processor",
    "Motherboard",
    "Graphics",
    "Operating System",
    "Memory",
    "Storage",
    "Cabinet",
    "Monitor",
    "Input Devices",
    "Warranty",
  ];

  const storeHolowareSpecification = (specificationName, value) => {
    specificationName = specificationName.toLowerCase(); // Normalize for comparison
    setHolowareValues((prev) => {
      const updatedValues = { ...prev };
      if (specificationName.includes("processor number")) {
        updatedValues.processorNumber = value;
      } else if (specificationName.includes("chipset number")) {
        updatedValues.chipsetNumber = value;
      } else if (specificationName.includes("graphics type")) {
        updatedValues.graphicsType = value;
      } else if (specificationName.includes("operating system")) {
        updatedValues.operatingSystem = value;
      } else if (specificationName.includes("ram size")) {
        updatedValues.ramSize = value;
      } else if (specificationName.includes("hdd capacity")) {
        updatedValues.totalHDDCapacity = value;
      } else if (specificationName.includes("ssd capacity")) {
        updatedValues.totalSSDCapacity = value;
      } else if (specificationName.includes("cabinet form factor")) {
        updatedValues.cabinetFormFactor = value;
      } else if (specificationName.includes("monitor technology")) {
        updatedValues.monitorTechnology = value;
      } else if (specificationName.includes("warranty")) {
        updatedValues.onSiteWarranty = value;
      }
      return updatedValues;
    });
  };
  
  
  const groupedData = [];
  let currentSpec = "";

  for (let i = 0; i < complianceData.length; i++) {
    const item = complianceData[i];
    if (specifications.includes(item)) {
      currentSpec = item;
    } else {
      groupedData.push({
        spec: currentSpec,
        rowData: [item, complianceData[i + 1] || ""],
      });
      i++;
    }
  }

  const handleSelectionChange = (index, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [index]: value,
    }));
  
    if (value === "higher") {
      setIsEditing((prev) => ({
        ...prev,
        [index]: true,
      }));
    } else {
      setIsEditing((prev) => ({
        ...prev,
        [index]: false,
      }));
      setCustomInput((prev) => ({
        ...prev,
        [index]: "",
      }));
    }
  
    const specificationName = groupedData[index].rowData[0]; // Second column (Specification Name)
    storeHolowareSpecification(specificationName, value); // Call the function to store the value
  };  

  const handleInputChange = (index, value) => {
    setCustomInput((prev) => ({
      ...prev,
      [index]: value,
    }));
  
    const specificationName = groupedData[index].rowData[0]; // Get the corresponding specification name
    storeHolowareSpecification(specificationName, value); // Store the custom value in holowareValues
  };

  const handleOptionChange = (index, option) => {
    // Set the selected option for each row by index
    setSelectedOptions((prev) => ({
      ...prev,
      [index]: option,
    }));
    
    // Update Holoware Specifications based on option change
    setHolowareSpecifications((prev) => ({
      ...prev,
      [index]: option === "higher" && customInput[index] ? customInput[index] : option,
    }));
  };
  
  
  useEffect(() => {
    groupedData.forEach((group, index) => {
      const requirement = group.rowData[1];
      const options = requirement.split(/, | Or /);
      const hasHigherOption = options.includes("higher");
  
      // Automatically store the specification if there's only one option
      if (options.length === 1 && !hasHigherOption) {
        const specificationName = group.rowData[0]; 
        storeHolowareSpecification(specificationName, requirement); 
      }
    });
  }, [groupedData]);
  
  const parseBidRequirement = (requirement, index) => {
    const options = requirement.split(/, | Or /); // Split options on ", " or " Or "
    const hasHigherOption = options.includes("higher");
  
    if (options.length > 1 || hasHigherOption) {
      return (
        <>
          {isEditing[index] ? (
            <TextField
              variant="outlined"
              size="small"
              value={customInput[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{ fontSize: "14px", width: "100%", fontWeight: "400" }}
              placeholder="Enter exact specification"
            />
          ) : (
            <Select 
              value={selectedOptions[index] || ""}
              onChange={(e) => handleSelectionChange(index, e.target.value)}
              displayEmpty
              style={{ fontSize: "14px", width: "100%", fontWeight: "400" }}
            >
              {options.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          )}
        </>
      );
    }
  
    if (options.length === 1 && !hasHigherOption) {
      // Render the single option directly as text
      return (
        <span style={{ fontSize: "14px", fontWeight: "400" }}>
          {requirement}
        </span>
      );
    }
  };  
  
  // Construct table rows dynamically based on grouped data
  const tableRows = [];
  let previousSpec = "";

groupedData.forEach((group, index) => {
  if (group.spec !== previousSpec) {
    tableRows.push(
      <tr key={index}>
        <td rowSpan={1}>{group.spec}</td>
        <td>{group.rowData ? group.rowData[0] : ""}</td>
        <td>{group.rowData ? group.rowData[1] : ""}</td>
        <td>
          <p style={{ padding: 1, margin: 0, fontWeight: "400", fontSize: "10px" }}>
            {selectedOptions[index] === "custom" ? (
              <TextField
                variant="outlined"
                size="small"
                style={{ fontSize: "16px", width: "100%", fontWeight: "400" }} // Ensure uniform font size and weight
              />
            ) : (
              parseBidRequirement(group.rowData[1], index)
            )}
          </p>
        </td>
        <td>
        <input
          type="text"
          defaultValue="Yes"
          style={{
            border: "none",
            fontWeight: "400",
            padding: "2px", // Add a bit of padding to avoid clipping
            margin: 0,
            fontSize: "14px",
            width: "100%", // Ensure the input takes the full width of the cell
            boxSizing: "border-box" // Include padding in the width calculation
          }}
          className="no-border"
        />

        </td>
      </tr>
    );
    previousSpec = group.spec;
  } else {
    tableRows.push(
      <tr key={index}>
        <td></td>
        <td>{group.rowData ? group.rowData[0] : ""}</td>
        <td>{group.rowData ? group.rowData[1] : ""}</td>
        <td>
          <p style={{ padding: 1, margin: 0, fontWeight: "400", fontSize: "10px" }}>
            {selectedOptions[index] === "custom" ? (
              <TextField
                variant="outlined"
                size="small"
                style={{ fontSize: "14px", width: "100%", fontWeight: "400" }} // Ensure uniform font size and weight
              />
            ) : (
              parseBidRequirement(group.rowData[1], index)
            )}
          </p>
        </td>
        <td>
          <input
            type="text"
            defaultValue="Yes"
            style={{
              border: "none",
              fontWeight: "400", // Uniform font weight
              padding: 0,
              margin: 0,
              fontSize: "14px", // Uniform font size
            }}
            className="no-border"
          />
        </td>
      </tr>
    );
  }
});

  // Handle adding/removing additional rows
  const addRow = () => {
    setAdditionalRows([...additionalRows, { spec: "", rowData: ["", ""] }]);
  };

  const removeRow = () => {
    setAdditionalRows(additionalRows.slice(0, -1)); // Remove the last row
  };

  additionalRows.forEach((row, index) => {
    tableRows.push(
      <tr key={`additional-${index}`}>
        <td>
          <input type="text" className="no-border" />
        </td>
        <td>
          <input type="text" className="no-border" />
        </td>
        <td>
          <input type="text" className="no-border" />
        </td>
        <td>
          <input type="text" className="no-border" />
        </td>
        <td>
          <input type="text" className="no-border" />
        </td>
      </tr>
    );
  });

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
  
    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 60;
    const logoHeight = 17;
    const logoX = (pageWidth - logoWidth) / 2;
  
    // Add Holoware logo at the center
    doc.addImage(companyLogo, "PNG", logoX, 10, logoWidth, logoHeight);
  
    // Add company information below the logo
    doc.setFontSize(10);
    doc.text("Holoware - A Unit of Jaikrishna Technology Private Limited", 10, 35);
    doc.text("Holoware.com | Contact: +91-9884070707", 10, 40);
    doc.text("CIN: U72900TN2014PTC096040 | GSTIN: 33AADCJ1540B1ZK", 10, 45);
  
    // Generate table data for PDF, using custom input in place of "higher"
    const pdfTableData = groupedData.map((group, index) => [
      group.spec,
      group.rowData[0],
      group.rowData[1],
      selectedOptions[index] === "higher" && customInput[index]
        ? customInput[index]
        : selectedOptions[index] || group.rowData[1],
      "Yes"
    ]);
  
    // Include additional rows if any were added by the user
    additionalRows.forEach((row) => {
      pdfTableData.push(["", row.rowData[0], row.rowData[1], "", ""]);
    });
  
    // Generate the table in the PDF
    doc.autoTable({
      head: [["Specification", "Specification Name", "Bid Requirements", "Holoware Specifications", "Holoware Compliance"]],
      body: pdfTableData,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Holoware color theme
      },
    });
  
    // Save the document
    doc.save("compliance_data.pdf");
  
    handleNext(); // go to the next step in your process
    setComplianceCertificate(doc.output("bloburl")); // store the PDF blob URL if needed
  };

  return (
    <div>
      <h1>Compliance</h1>
      <div id="complianceTable" style={{ border: "2px solid black" }}>
        <div
          style={{
            border: "2px solid black",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={companyLogo}
            style={{ width: "30%", padding: "5px 0px" }}
            alt="company logo"
          />
        </div>
        <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px 0px" }}>Specification</th>
              <th>Specification Name</th>
              <th>Bid Requirements</th>
              <th>Holoware Specifications</th>
              <th>Holoware Compliance</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
        <div style={{ padding: "5px" }}>
          <p style={{ margin: 0, color: "#000", fontSize: "10px" }}>
            Holoware - A Unit of Jaikrishna Technology Private Limited{" "}
          </p>
          <p style={{ margin: 0, color: "#000", fontSize: "10px" }}>
            Holoware.com | Contact: +91-9884070707
          </p>
          <p style={{ margin: 0, color: "#000", fontSize: "10px" }}>
            CIN: U72900TN2014PTC096040 | GSTIN: 33AADCJ1540B1ZK
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          onClick={addRow}
          variant="outlined"
          size="small"
          style={{ 
            fontSize: "16px" ,
            marginTop:"20px"
          }}
        >
          Add Row
        </Button>
        <Button
          onClick={removeRow}
          variant="outlined"
          size="small"
          style={{ 
            fontSize: "16px" ,
            marginTop:"20px"
          }}
        >
          Remove Row
        </Button>
        <Button
          onClick={downloadPDF}
          variant="outlined"
          size="small"
          style={{ 
            fontSize: "16px" ,
            marginTop:"20px"
          }}
        >
          Save & Next
        </Button>
      </div>
    </div>
  );
}

export default Compliance;
