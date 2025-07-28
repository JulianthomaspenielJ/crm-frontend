import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import Compliance from "./Compliance";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CircularProgress from "@mui/material/CircularProgress";
import DataSheet from "./DataSheet";
import ProductList from "./ProductList";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

function TextfieldData({ gemUrl, gemID, product, activePage, setActivePage }) {
  const [openSections, setOpenSections] = useState({
    compliance: false,
    dataSheet: false,
    additionalData: false,
    duplicateDataSheet: false,
    productList: false,
  });
  const gemData = JSON.parse(localStorage.getItem("GEMData")) || {};
  const [complianceTableData, setComplianceTableData] = useState();
  const [modelNumber, setModelNumber] = useState(gemData[gemID]?.modelNumber);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorPopupMsg, setErrorPopupMsg] = useState("");

  const [complianceLoad, setComplianceLoad] = useState(false);

  const handleModel = (e) => {
    const value = e.target.value;

   (gemData[gemID] = {
      ...gemData[gemID], // Preserve any existing data for this gemID
      modelNumber: value, // Add or update pricingData
    });
    localStorage.setItem("GEMData", JSON.stringify(gemData));
    setModelNumber(value);
  };

  const handleNext = () => {
    if (!gemData[gemID]?.modelNumber) {
      setErrorPopupMsg("Model Number is must be Required.");
      setErrorPopup(true);
    } else if (gemData[gemID]?.complianceData?.Compliance !== "Saved") {
      setErrorPopupMsg(
        "Unable to save Compliance Certificate data. Please check and try again."
      );
      setErrorPopup(true);
    } else if (gemData[gemID]?.DataSheet?.DataSheet !== "Saved") {
      setErrorPopupMsg(
        "Unable to save DataSheet Certificate data. Please check and try again."
      );
      setErrorPopup(true);
    } else if (!gemData[gemID]?.ProductList?.selectedComponents) {
      setErrorPopupMsg(
        "Unable to save Product data. Please check and try again."
      );
      setErrorPopup(true);
    } else {
      setActivePage(activePage + 1);
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prevSections) => ({
      compliance: section === "compliance" ? !prevSections.compliance : false,
      productList:
        section === "productList" ? !prevSections.productList : false,
      dataSheet: section === "dataSheet" ? !prevSections.dataSheet : false,
      additionalData:
        section === "additionalData" ? !prevSections.additionalData : false,
      duplicateDataSheet:
        section === "duplicateDataSheet"
          ? !prevSections.duplicateDataSheet
          : false,
    }));
  };
  return (
    <>
      <Grid container spacing={3}>
        {/* Compliance Certificate */}
        <Grid item xs={6}>
          <Box>
            <TextField
              sx={{ width: "400px" }}
              id="outlined-basic"
              label="ModelNumber"
              variant="outlined"
              value={modelNumber}
              onChange={handleModel}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              padding: "0px 10px",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => toggleSection("compliance")}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingY: 2 }}>
                Compliance Certificate
              </Typography>
              <IconButton>
                {complianceLoad ? (
                  <CircularProgress size={25} />
                ) : openSections.compliance ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </IconButton>
            </Box>
            {openSections.compliance && (
              <Compliance
                gemUrl={gemUrl}
                complianceLoad={complianceLoad}
                setComplianceLoad={setComplianceLoad}
                gemID={gemID}
                complianceTableData={complianceTableData}
                setComplianceTableData={setComplianceTableData}
                type={"input"}
                toggleSection={toggleSection}
              />
            )}
          </Box>
        </Grid>

        {/* Data Sheet Certificate */}

        {/* Additional Data */}

        {/* Duplicate Data Sheet */}
        <Grid item xs={12}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              padding: "0px 10px",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => toggleSection("dataSheet")}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingY: 2 }}>
                Data Sheet Certificate
              </Typography>
              <IconButton>
                {openSections.dataSheet ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </IconButton>
            </Box>
            {openSections.dataSheet && (
              <DataSheet
                gemID={gemID}
                product={product}
                toggleSection={toggleSection}
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              padding: "0px 10px",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => toggleSection("productList")}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingY: 2 }}>
                Select Products List
              </Typography>
              <IconButton>
                {openSections.productList ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </IconButton>
            </Box>
            {openSections.productList && (
              <ProductList
                gemID={gemID}
                product={product}
                toggleSection={toggleSection}
              />
            )}
          </Box>
        </Grid>

        {/* <Grid item xs={6}>
          <Box
            sx={{
              border: "1px solid #e0e0e0",
              padding: "0px 10px",
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onClick={() => toggleSection("additionalData")}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingY: 2 }}>
                Other Additional Data Field
              </Typography>
              <IconButton>
                {openSections.additionalData ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </IconButton>
            </Box>
            {openSections.additionalData && <PDFGenerator />}
          </Box>
        </Grid> */}
      </Grid>

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
          }}
          onClick={() => {
            handleNext();
          }}
        >
          Next
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
    </>
  );
}

export default TextfieldData;
