import React, { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";
import {
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import companyLogo from "../../Image/HWLogo.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Compliance({
  gemUrl,
  setComplianceLoad,
  gemID,
  complianceTableData,
  type,toggleSection
}) {
  const CRMBaseURL = AuthService();
  const GEMData = JSON.parse(localStorage.getItem("GEMData")) || {};

  const [complianceData, setComplianceData] = useState([]);
  const [additionalRows, setAdditionalRows] = useState([]);
  const [isEditing, setIsEditing] = useState({}); // Track if rows are in editing mode
  const [selectedOptions, setSelectedOptions] = useState({}); // Track selected options for each row
  const [customInput, setCustomInput] = useState({}); // Track custom text input for each row
  const [isDataInLocalStorage, setIsDataInLocalStorage] = useState(false);
  const [holowareValues, setHolowareValues] = useState({
    processorNumber: "",
    chipsetNumber: "",
    graphicsType: "",
    operatingSystem: "",
    ramSize: "",
    totalHDDCapacity: "",
    totalSSDCapacity: "",
    cabinetFormFactor: "",
    monitorTechnology: "",
    onSiteWarranty: "",
  });

 
  const fetchData = async () => {
    setComplianceLoad(true);
    const values = { link: gemUrl };
    console.log("0", values);
    try {
      const res = await CRMBaseURL.post("compliance", values);
      setComplianceData(res.data.Data[1] || []);
    } catch (e) {
      console.log("Error occurred", e);
    } finally {
      setComplianceLoad(false);
    }
  };

  useEffect(() => {
    if (type === "input") {
      fetchData();
    }
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


  };

  useEffect(() => {

    const storedComplianceData = localStorage.getItem(`${gemID}_compliance`);

    if (storedComplianceData) {
      // If data exists, no need to run the logic again
      console.log(
        "Data exists in localStorage. Skipping auto-specification setup."
      );
      return; // Skip the logic if data already exists
    }

    // This will run only if data doesn't exist in localStorage
    groupedData.forEach((group, index) => {
      const requirement = group.rowData[1];
      const options = requirement.split(/, | Or /);
      const hasHigherOption = options.includes("higher");
      // Add "higher" for specific specifications if it doesn't exist
      const specificationName = group.rowData[0].toLowerCase();
      if (specificationName.includes("type of drives used to populate the internal bays") && !hasHigherOption) {
        options.push("higher");
      }

      // Automatically store the specification if there's only one option
      if (options.length === 1 && !hasHigherOption) {
        const specificationName = group.rowData[0];
        storeHolowareSpecification(specificationName, requirement);
      }
    });
  }, []); // Adding gemID as dependency so it updates when gemID changes

  useEffect(() => {

    const storedComplianceData =
        JSON.parse(localStorage.getItem(`${gemID}_compliance`)) || {};

    setIsDataInLocalStorage(Object.keys(storedComplianceData).length > 0);

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
  }, []);

  const handleUpdate = () => {
    localStorage.removeItem(`${gemID}_compliance`);
    setIsDataInLocalStorage(false);
    // GEMData[gemID] = {
    //   ...GEMData[gemID],
    //   complianceData: { ...holowareValues, Compliance: "" },
    // };

    // localStorage.setItem("GEMData", JSON.stringify(GEMData));
    // toggleSection("compliance")

  };

  const parseBidRequirement = (requirement, index) => {
    // Get stored compliance data
    const storedComplianceData =
      JSON.parse(localStorage.getItem(`${gemID}_compliance`)) || {};
    const specificationName = groupedData[index].rowData[0]; // Get the specification name
  
    // Check if data exists in localStorage for this spec
    if (storedComplianceData[specificationName]) {
      // If data exists in localStorage, just render the stored value
      return (
        <span style={{ fontSize: "12px", fontWeight: "400" }}>
          {storedComplianceData[specificationName].holowareSpec || requirement}
        </span>
      );
    }
  
    // Default behavior: handle options like 'higher' or multiple choices
    let options = requirement.split(/, | Or /); // Split options on ", " or " Or "
    const hasHigherOption = options.includes("higher");
  
    // Check if the specification requires the "higher" option by default
    const specificationNameLowerCase = specificationName.toLowerCase();
    if (specificationNameLowerCase.includes("type of drives used to populate the internal bays")) {
      if (!hasHigherOption) {
        options.push("higher"); // Add "higher" if not already present
      }
    }
  
    // If there are multiple options or the "higher" option exists
    if (options.length > 1 || hasHigherOption) {
      return (
        <>
          {isEditing[index] ? (
            <TextField
              variant="outlined"
              size="small"
              value={customInput[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{ fontSize: "12px", width: "100%", fontWeight: "400" }}
              placeholder="Enter exact specification"
            />
          ) : (
            <Select
              value={selectedOptions[index] || ""}
              onChange={(e) => handleSelectionChange(index, e.target.value)}
              displayEmpty
              style={{ fontSize: "12px", width: "100%", fontWeight: "400" }}
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
  
    // If there's only one option (no need for selection dropdown)
    return (
      <span style={{ fontSize: "12px", fontWeight: "400" }}>
        {requirement}
      </span>
    );
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
            {complianceTableData ? (
              group.rowData[1]
            ) : (
              <p
                style={{
                  padding: 1,
                  margin: 0,
                  fontWeight: "400",
                  fontSize: "10px",
                }}
              >
                {selectedOptions[index] === "custom" ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    style={{
                      fontSize: "16px",
                      width: "100%",
                      fontWeight: "400",
                    }} // Ensure uniform font size and weight
                  />
                ) : (
                  parseBidRequirement(group.rowData[1], index)
                )}
              </p>
            )}
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
                // width: "100%", // Ensure the input takes the full width of the cell
                boxSizing: "border-box", // Include padding in the width calculation
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
            <p
              style={{
                padding: 1,
                margin: 0,
                fontWeight: "400",
                fontSize: "10px",
              }}
            >
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
    GEMData[gemID] = {
      ...GEMData[gemID],
      complianceData: { ...holowareValues, Compliance: "Saved" },
    };

    localStorage.setItem("GEMData", JSON.stringify(GEMData));
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 60;
    const logoHeight = 17;
    const logoX = (pageWidth - logoWidth) / 2;

    doc.addImage(companyLogo, "PNG", logoX, 10, logoWidth, logoHeight);

    doc.setFontSize(10);
    doc.text(
      "Holoware - A Unit of Jaikrishna Technology Private Limited",
      10,
      35
    );
    doc.text("Holoware.com | Contact: +91-9884070707", 10, 40);
    doc.text("CIN: U72900TN2014PTC096040 | GSTIN: 33AADCJ1540B1ZK", 10, 45);

    const pdfTableData = groupedData.map((group, index) => [
      group.spec,
      group.rowData[0],
      group.rowData[1],
      selectedOptions[index] === "higher" && customInput[index]
        ? customInput[index]
        : selectedOptions[index] || group.rowData[1],
      "Yes",
    ]);
    console.log("pdf", pdfTableData);

    GEMData[gemID] = { ...GEMData[gemID], complianceTableData: pdfTableData };

    // Save the updated object back to localStorage
    localStorage.setItem("GEMData", JSON.stringify(GEMData));
    // Include additional rows if any were added by the user
    additionalRows.forEach((row) => {
      pdfTableData.push(["", row.rowData[0], row.rowData[1], "", ""]);
    });

    // Construct the data to store in localStorage
    const complianceDataToStore = {};

    groupedData.forEach((group, index) => {
      const specName = group.rowData[0]; // Specification Name
      const holowareSpec =
        selectedOptions[index] === "higher" && customInput[index]
          ? customInput[index]
          : selectedOptions[index] || group.rowData[1]; // Holoware Specifications
      const holowareCompliance = "Yes"; // Since the last column in the table is "Yes" by default

      complianceDataToStore[specName] = {
        holowareSpec: holowareSpec,
        holowareCompliance: holowareCompliance,
      };
    });

    // Add additional rows if any
    additionalRows.forEach((row) => {
      const specName = row.rowData[0];
      const holowareSpec = row.rowData[1];
      complianceDataToStore[specName] = {
        holowareSpec: holowareSpec,
        holowareCompliance: "Yes",
      };
    });

    // Get the gemID to form the key for localStorage
    // const gemID = GEMData[gemID]?.id || gemID; // Assuming gemID is available in GEMData

    // Check if data already exists in localStorage for this gemID
    const existingData =
      JSON.parse(localStorage.getItem(`${gemID}_compliance`)) || {};

    // Merge the existing data with the new data
    const updatedComplianceData = { existingData, ...complianceDataToStore };

    console.log("exist", existingData, "ttt", complianceDataToStore);

    // Store the updated data in localStorage with the key gemID_compliance

    localStorage.setItem(
      `${gemID}_compliance`,
      JSON.stringify(updatedComplianceData)
    );

    // Now, generate the table in the PDF
    doc.autoTable({
      head: [
        [
          "Specification",
          "Specification Name",
          "Bid Requirements",
          "Holoware Specifications",
          "Holoware Compliance",
        ],
      ],
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
    // doc.save("compliance_data.pdf");

    // Store the PDF blob URL if needed
    // setComplianceCertificate(doc.output("bloburl"));
    const blob = doc.output("blob");
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Get base64 part
      GEMData[gemID] = {
        ...GEMData[gemID],
        complianceCertificate: base64String,
      };
      // localStorage.setItem("GEMData", JSON.stringify(GEMData));
    };
    reader.readAsDataURL(blob);
    toggleSection("compliance")
  };

 
  return (
    <>
      {type === "selection" ? (
        <>
          <embed
            src={`data:application/pdf;base64,${GEMData[gemID]?.complianceCertificate}`}
            width="100%"
            height="770px"
            style={{ border: "none" }}
          />
        </>
      ) : (
        <div style={{ width: "100%", padding: "10px 15px 30px 15px" }}>
          <div id="complianceTable">
            <table
              border={1}
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "10px 0px", width: "15%" }}>
                    Specification
                  </th>
                  <th style={{ width: "20%" }}>Specification Name</th>
                  <th style={{ width: "50%" }}>Bid Requirements</th>
                  <th style={{ width: "25%" }}>Holoware Specifications</th>
                  <th style={{ width: "2%" }}>Holoware Compliance</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "end", gap: 10 }}>
            <Button
              onClick={removeRow}
              variant="outlined"
              size="small"
              style={{
                fontSize: "14px",
                marginTop: "20px",
              }}
            >
              Remove Row
            </Button>
            <Button
              onClick={addRow}
              variant="outlined"
              size="small"
              style={{
                fontSize: "14px",
                marginTop: "20px",
              }}
            >
              Add Row
            </Button>

            {isDataInLocalStorage ? (
              <Button
                onClick={handleUpdate}
                variant="contained"
                size="small"
                style={{ fontSize: "14px", marginTop: "20px" }}
              >
                Update
              </Button>
            ) : (
              <Button
                onClick={downloadPDF}
                variant="contained"
                size="small"
                style={{ fontSize: "14px", marginTop: "20px" }}
              >
                Save
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Compliance;
