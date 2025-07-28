import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Button,
  Modal,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MAFCertificate from "./MAFCertificate";
import MIICertificate from "./MIICertificate";
import WarrantyCertificate from "./WarrantyCertificate";
import GenuineCertificate from "./GenuineCertificate";
import MRPCertificate from "./MRPCertificate";
import html2pdf from "html2pdf.js";
import CloseIcon from "@mui/icons-material/Close";
import DataSheetData from "./DataSheetData";
import PricingQuotation from "./PricingQuotation";
import Compliance from "./ComplianceCertificate";
import AuthService from "../../services/AuthService";
import companyLogo from "../../Image/HWLogo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from 'react-router-dom';

const documents = [
  { type: "Compliance", title: "Compliance Certificate" },
  { type: "DataSheet", title: "Data Sheet" },
  { type: "PricingQuotation", title: "Pricing Quotation" },
  { type: "MAF", title: "MAF Certificate" },
  { type: "MII", title: "MII Certificate" },
  { type: "Warranty", title: "Warranty Certificate" },
  { type: "Genuine", title: "Genuine Certificate" },
  { type: "MRP", title: "MRP Certificate" },
];

const certificateComponents = {
  DataSheet: DataSheetData,
  PricingQuotation: PricingQuotation,
  MAF: MAFCertificate,
  MII: MIICertificate,
  Warranty: WarrantyCertificate,
  Genuine: GenuineCertificate,
  MRP: MRPCertificate,
  Compliance: Compliance,
};

const SelectCertificate = ({
  gemID,
  partnerName,
  partnerAddress,
  partnerEmail,
  partnerMobile,
  GEMDate,
  gemNumber,
  product,
  fetchDeals,
  setOpenPricing,
  Ticket,
  Email,
  CustomerName
}) => {
  const GEMData = JSON.parse(localStorage.getItem("GEMData")) || {};
  const CRMBaseURL = AuthService();
  const [dataSheet, setDataSheet] = useState("");
  const certificateRefs = useRef({});
  const [checkedItems, setCheckedItems] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [description, setDescription] = useState(
    "*In the given price Wired Keyboard & Wired Mouse prices are included."
  );
  const [terms, setTerms] = useState(
    "* Billing through Authorized partners. * Delivered in 6-7 weeks. * 3 Years Onsite Warranty. * Price valid for 30 days only."
  );

  const [downloadCompliance, setDownloadCompliance] = useState("download");
  const [loading, setLoading] = useState(false);
  const [pricingID, setPricingID] = useState("");
  const [gemUrl, setGemUrl] = useState("");
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorPopupMsg, setErrorPopupMsg] = useState("");

  const navigate = useNavigate();
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const downloadData = {
    ...GEMData[gemID]?.Pricing,
    description,
    terms,
    date: formattedDate,
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleTermsChange = (event) => {
    setTerms(event.target.value);
  };

  const handleSingleDownload = (doc) => {
    if (!doc || !doc.type || !doc.title) {
      console.error("Document type or title is undefined.");
      return;
    }

    if (doc.type === "Compliance") {
      generatePDF(GEMData[gemID]?.complianceTableData);
    } else if (doc.type === "DataSheet") {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = dataSheet;
        link.download = "DataSheet.pdf";

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      }, 500);
    } else {
      const element = certificateRefs.current[doc.type];
      const options = {
        margin: [0.2, 0.4, 0.2, 0.4],
        filename: `${doc.title.replace(" ", "_")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
      };

      if (element) {
        setTimeout(() => {
          html2pdf().set(options).from(element).save();
        }, 500);
      } else {
        console.error("Certificate element is undefined.");
      }
    }
  };

  useEffect(() => {
    fetchProductImage();
  }, []);

  const fetchProductImage = async () => {
    try {
      const res = await CRMBaseURL.post("getproduct", { product });
      setUploadedImage(res.data.Image);
    } catch (e) {
      console.log(e);
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 60;
    const logoHeight = 17;
    const logoX = (pageWidth - logoWidth) / 2;

    // Add Holoware logo at the center
    doc.addImage(companyLogo, "PNG", logoX, 10, logoWidth, logoHeight);

    doc.setFontSize(10);
    doc.text(
      "Holoware - A Unit of Jaikrishna Technology Private Limited",
      15,
      40
    );
    doc.text("Holoware.com | Contact: +91-9884070707", 15, 45);
    doc.text("CIN: U72900TN2014PTC096040 | GSTIN: 33AADCJ1540B1ZK", 15, 50);

    // Generate the table with autoTable, which supports multi-page tables
    autoTable(doc, {
      startY: 55, // Start below the header info
      head: [
        [
          "Specification",
          "Specification Name",
          "Bid Requirements",
          "Holoware Specifications",
          "Holoware Compliance",
        ],
      ],
      body: data?.map((row) => [row[0], row[1], row[2], row[3], row[4]]),
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: { fillColor: [22, 160, 133] }, // Set header color to green
      alternateRowStyles: { fillColor: [242, 242, 242] }, // Set alternating row color
    });

    doc.save("data-table.pdf");
  };

  const convertBlobUrlToBase64 = async (blobUrl) => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFinish = async (allQuotation) => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (allQuotation.length === 0) {
      alert("Please upload at least one PDF file");
      return;
    }
    if (!allQuotation || !Array.isArray(allQuotation)) {
      console.error("allQuotation is undefined or not an array:", allQuotation);
      return;
    }

    const base64Promises = allQuotation.map((url) =>
      convertBlobUrlToBase64(url)
    );
    const base64Strings = await Promise.all(base64Promises);

    const values = {
      quotations: base64Strings,
      id: gemID,
      pricingID: parseInt(pricingID),
      gemFinalURL: gemUrl,
      quotationUpdaterID: storedUserData
        ? parseInt(storedUserData.id, 10)
        : null,
      quotationUpdaterName: storedUserData ? storedUserData.userName : null,
    };
    try {
      const res = await CRMBaseURL.post("uploadpricinggem", values);
      setPricingID(res.data?.data);
      localStorage.removeItem(`${gemID}_compliance`);
      const gemData = JSON.parse(localStorage.getItem("GEMData")) || {};
      const gemIDStr = String(gemID);

      if (gemData[gemIDStr]) {
        delete gemData[gemIDStr]; 
      }

      localStorage.setItem("GEMData", JSON.stringify(gemData));
      // alert("PDF uploaded successfully");
      navigate("/dashboard/gem");
    } catch (err) {
      console.error("Error uploading PDF:", err);
      alert("Failed to upload PDF");
    }
    const allPricingDatas = {
      ...GEMData[gemID]?.Pricing,
      dealID: gemID,
      isDeal: {
        int64: 2,
        valid: true,
      },
    };
    try {
      const response = await CRMBaseURL.post("productsdata", allPricingDatas);
    } catch (err) {
      console.error("Error occurred while submitting", err);
    }

    setOpenPricing(false);
    fetchDeals();
  };

  const handleToggle = (value) => {
    const currentIndex = checkedItems.indexOf(value);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheckedItems(newChecked);
  };

  const generateCompliancePDFBlob = async (data) => {
    const doc = new jsPDF("p", "mm", "a4");

    // Add logo and header
    const pageWidth = doc.internal.pageSize.width;
    const logoWidth = 60;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(companyLogo, "PNG", logoX, 10, logoWidth, 17);
    doc.setFontSize(10);
    doc.text(
      "Holoware - A Unit of Jaikrishna Technology Private Limited",
      15,
      40
    );
    doc.text("Holoware.com | Contact: +91-9884070707", 15, 45);
    doc.text("CIN: U72900TN2014PTC096040 | GSTIN: 33AADCJ1540B1ZK", 15, 50);

    // Add table
    autoTable(doc, {
      startY: 55,
      head: [
        [
          "Specification",
          "Specification Name",
          "Bid Requirements",
          "Holoware Specifications",
          "Holoware Compliance",
        ],
      ],
      body: data?.map((row) => [row[0], row[1], row[2], row[3], row[4]]),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [242, 242, 242] },
    });

    return doc.output("blob");

    // return new Promise((resolve) => {
    //   doc.output("blob", (blob) => resolve(blob));
    // });
  };

  const handleDownload = async () => {
    if (checkedItems?.length === 0) {
      setErrorPopupMsg("Certificates are not selected.");
      setErrorPopup(true);
    } else {
      setLoading(true);
      const selectedBlobs = [];
      for (const doc of checkedItems) {
        if (doc.type === "Compliance") {
          const complianceData = GEMData[gemID]?.complianceTableData;

          if (complianceData) {
            const complianceBlob = await generateCompliancePDFBlob(
              complianceData
            );
            selectedBlobs.push({
              title: doc.title,
              type: doc.type,
              blob: complianceBlob,
            });
          }
        } else if (doc.type === "DataSheet") {
          // Assuming `dataSheet` holds the DataSheet PDF blob

          const response = await fetch(dataSheet);

          const blob = await response.blob();

          selectedBlobs.push({
            title: doc.title,
            type: doc.type,
            blob: blob,
          });
        } else {
          const element = certificateRefs.current[doc.type];
          if (element) {
            const options = {
              margin: [0.2, 0.4, 0.2, 0.4],
              filename: `${doc.title.replace(" ", "_")}.pdf`,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
            };

            const blob = await html2pdf()
              .set(options)
              .from(element)
              .outputPdf("blob");
            selectedBlobs.push({ title: doc.title, type: doc.type, blob });
          }
        }
      }

      const fileURLsArray = [];

      selectedBlobs.forEach((file) => {
        const fileURL = URL.createObjectURL(file.blob);

        fileURLsArray.push(fileURL);

        // Example: You could create an anchor element to allow users to download/view the file
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = file.title + ".pdf"; // Suggesting a filename
        link.textContent = `Download ${file.title}`;
        document.body.appendChild(link); // Append the link to the DOM
      });
      handleFinish(fileURLsArray);

      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: "10px 60px 20px 50px" }}>
      <Box sx={{ pl: 2 }}>
        <TextField
          id="outlined-basic"
          value={gemUrl}
          onChange={(e) => {
            setGemUrl(e.target.value);
          }}
          label="GEM URL"
          variant="outlined"
        />
      </Box>
      <List>
        {documents?.map((doc, index) => {
          const CertificateComponent = certificateComponents[doc.type];
          return (
            <React.Fragment key={index}>
              <ListItem
                dense
                sx={{
                  border: "1px solid #e0e0e0",
                  margin: 2,
                  padding: "10px 20px",
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedItems.indexOf(doc) !== -1}
                    tabIndex={-1}
                    disableRipple
                    onChange={() => handleToggle(doc)}
                  />
                </ListItemIcon>
                <ListItemText primary={doc.title} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  {doc.type === "PricingQuotation" && (
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => setOpenEditModal(doc.type)}
                        color="secondary"
                      >
                        <EditIcon sx={{ color: "#357a38" }} />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Preview">
                    <IconButton
                      onClick={() => {
                        setDownloadCompliance("");
                        setOpenPreviewModal(doc.type);
                      }}
                      color="primary"
                    >
                      <RemoveRedEyeIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton
                      onClick={() => handleSingleDownload(doc)}
                      color="error"
                    >
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
              <div style={{ display: "none" }}>
                <div ref={(el) => (certificateRefs.current[doc.type] = el)}>
                  {CertificateComponent && (
                    <CertificateComponent
                      {...(doc.type === "PricingQuotation" && {
                        downloadData: downloadData,
                        CustomerName: partnerName,
                        CustomerAddress: partnerAddress,
                        CustomerMobile: partnerMobile,
                        CustomerEmail: partnerEmail,
                        Ticket: Ticket,
                        Email: Email,
                      })}
                      {...(doc.type === "DataSheet" && {
                        type: "selection",
                        gemID: gemID,
                        dataSheet: dataSheet,
                        setDataSheet: setDataSheet,
                        uploadedImage: uploadedImage,
                        setUploadedImage: setUploadedImage,
                      })}
                      {...(doc.type === "MAF" && {
                        partnerName: partnerName,
                        partnerAddress: partnerAddress,
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                        product: product,
                        Warranty:
                          GEMData[gemID]?.complianceData?.onSiteWarranty,
                      })}
                      {...(doc.type === "MII" && {
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                        holowareValues: GEMData[gemID]?.complianceData,
                        CustomerName: CustomerName,
                      })}
                      {...(doc.type === "Warranty" && {
                        gemID: gemID,
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                      })}
                      {...(doc.type === "Genuine" && {
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                      })}
                      {...(doc.type === "MRP" && {
                        gemID: gemID,
                      })}
                      {...(doc.type === "Compliance" && {
                        type: downloadCompliance,
                        gemID: gemID,
                        data: GEMData[gemID]?.complianceTableData,
                      })}
                    />
                  )}
                </div>
              </div>
              <Modal
                open={openPreviewModal === doc.type}
                onClose={() => setOpenPreviewModal(null)}
              >
                <Box
                  p={8}
                  style={{
                    position: "relative",
                    maxWidth: "45%",
                    maxHeight: "100vh",
                    height: "100vh",
                    overflowY: "auto",
                    margin: "auto",
                    backgroundColor: "white",
                    borderRadius: 8,
                  }}
                >
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                    onClick={() => setOpenPreviewModal(null)}
                  >
                    <CloseIcon />
                  </IconButton>

                  {CertificateComponent && (
                    <CertificateComponent
                      {...(doc.type === "PricingQuotation" && {
                        downloadData: downloadData,
                        CustomerName: partnerName,
                        CustomerAddress: partnerAddress,
                        CustomerMobile: partnerMobile,
                        CustomerEmail: partnerEmail,
                        Ticket: Ticket,
                        Email: Email,
                      })}
                      {...(doc.type === "DataSheet" && {
                        type: "selection",
                        gemID: gemID,
                        dataSheet: dataSheet,
                        setDataSheet: setDataSheet,
                        uploadedImage: uploadedImage,
                        setUploadedImage: setUploadedImage,
                      })}
                      {...(doc.type === "MAF" && {
                        partnerName: partnerName,
                        partnerAddress: partnerAddress,
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                        product: product,
                        Warranty:
                          GEMData[gemID]?.complianceData?.onSiteWarranty,
                      })}
                      {...(doc.type === "MII" && {
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                        holowareValues: GEMData[gemID]?.complianceData,
                        CustomerName: CustomerName,
                        gemID: gemID,
                      })}
                      {...(doc.type === "Warranty" && {
                        gemID: gemID,
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                      })}
                      {...(doc.type === "Genuine" && {
                        gemNumber: gemNumber,
                        GEMDate: GEMDate,
                      })}
                      {...(doc.type === "MRP" && {
                        downloadData: downloadData,
                        gemID: gemID,
                      })}
                      {...(doc.type === "Compliance" && {
                        type: downloadCompliance,
                        gemID: gemID,
                        data: GEMData[gemID]?.complianceTableData,
                      })}
                    />
                  )}
                </Box>
              </Modal>
            </React.Fragment>
          );
        })}
      </List>

      <Box sx={{ display: "flex", alignItems: "end", justifyContent: "end" }}>
        <Button
          sx={{
            mt: 2,
            color: "#fff",
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            "&:hover": {
              backgroundImage:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              color: "#fff",
            },
            paddingX: loading ? 4 : 2,
          }}
          onClick={handleDownload}
          disabled={loading} // Optional: Disables button during loading
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} /> // Loading icon with white color and custom size
          ) : (
            "Submit"
          )}
        </Button>
      </Box>

      <Dialog
        open={errorPopup}
        fullWidth
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon sx={{ color: "red" }} />
            Data Warnings
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {errorPopupMsg}
          </DialogContentText>

          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                setErrorPopup(false);
              }}
              sx={{
                mt: 1,
                color: "#fff",
                backgroundImage:
                  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                "&:hover": {
                  backgroundImage:
                    "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                  color: "#fff",
                },
              }}
            >
              ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openEditModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            color: "#fff",
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          }}
        >
          {"Descriptions , Terms & Conditions"}
        </DialogTitle>
        <DialogContent>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              <TextField
                multiline
                rows={4}
                fullWidth
                onChange={handleDescriptionChange}
                value={description}
                id="description"
                placeholder="Description"
                variant="outlined"
              />
            </div>
            <div style={{ width: "400px" }}>
              <TextField
                multiline
                rows={4}
                value={terms}
                onChange={handleTermsChange}
                fullWidth
                id="terms-conditions"
                placeholder="Terms and Conditions"
                variant="outlined"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditModal(false);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              color: "#fff",
              backgroundImage:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            }}
            onClick={() => {
              setOpenEditModal(false);
            }}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SelectCertificate;
