import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Grid,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import "./ReferenceDtsDialog.css";
import DownloadPDF from "../Downloadpdf/Downloadpdf";
import CloseIcon from "@mui/icons-material/Close";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 13,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    fontWeight: 400,
    color: "#A9B6C5",
  },
}));

export default function ReferenceDtsDialog({
  setReferenceDtsDialog,
  referenceDtsDialog,
  detailedProductData,
}) {
  const [downloadData, setDownloadData] = useState();
  const [downloadPageOpen, setDownloadPageOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [description, setDescription] = useState(
    "*In the given price Wired Keyboard & Wired Mouse prices are included."
  );
  const [terms, setTerms] = useState(
    "* Billing through Authorized partners. * Delivered in 6-7 weeks. * 3 Years Onsite Warranty. * Price valid for 30 days only."
  );

  useEffect(() => {
    if (anchorEl) {
      // Reset to default values when opening the popover
      setDescription(
        "*In the given price Wired Keyboard & Wired Mouse prices are included."
      );
      setTerms(
        "* Billing through Authorized partners. * Delivered in 6-7 weeks. * 3 Years Onsite Warranty. * Price valid for 30 days only."
      );
    }
  }, [anchorEl]);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleTermsChange = (event) => {
    setTerms(event.target.value);
  };

  const handleSubmit = () => {
    // Handle form submission logic here

    handleClose();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const data = {
      ...detailedProductData,
      description,
      terms,
      date: formattedDate,
    };
    setDownloadData(data);
    setDescription("");
    setTerms("");
    setReferenceDtsDialog(false);
    setDownloadPageOpen(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const renderDataFields = () => {
    if (!detailedProductData || !detailedProductData.data) return null;

    return (
      <TableRow>
        <StyledTableCell key="data-cell">
          {detailedProductData &&
            Object.keys(detailedProductData.data).map((key, index) => {
              const component = detailedProductData.data[key];

              return (
                <div key={key} style={{ marginBottom: "10px" }}>
                  <Typography>
                    {index + 1} . {component.Name} ({component.descriptions}),
                  </Typography>
                </div>
              );
            })}
        </StyledTableCell>
        <StyledTableCell align="center">84715000</StyledTableCell>
        <StyledTableCell align="center">
          {detailedProductData.productsQuantity} NOS
        </StyledTableCell>
        <StyledTableCell align="center">
          <b>{currencyFormatter.format(detailedProductData.marginwithGST)}</b>
        </StyledTableCell>
      </TableRow>
    );
  };

  return (
    <>
      <Dialog
        open={referenceDtsDialog}
        onClose={() => setReferenceDtsDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>
            Product Details
          </Typography>
          <IconButton
            onClick={() => {
              setReferenceDtsDialog(false);
            }}
          >
            <CloseIcon sx={{ color: "#fff" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {detailedProductData ? (
              <div className="pdf-container">
                <div className="pdf-header">
                  <p>
                    <strong>Reference Name:</strong>{" "}
                    {detailedProductData.referenceName}
                  </p>
                </div>
                <Grid container sx={{ pb: 3 }} spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, pb: 1 }}>
                      Address From :
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      Jaikrishna Technology Pvt. Ltd.
                    </Typography>
                    <Typography>
                      SN Tower, NO.14,Rottu Street,Neer Selva Vinayagar
                      Temple,Moondramkattalai,Chennai-600128
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, pb: 1 }}>
                      Address To :
                    </Typography>
                    <Typography>{detailedProductData.addressTo}</Typography>
                  </Grid>
                  <Grid item xs={11}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        textAlign: "end",
                        paddingTop: 1,
                      }}
                    >
                      {`Warranty Info - ${detailedProductData.warrantyInfo} years`}
                    </Typography>
                  </Grid>
                </Grid>

                <div className="pdf-section">
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Model</StyledTableCell>
                          <StyledTableCell align="center">
                            HSN/SAC
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Quantity
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Total Amount
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {renderDataFields()}

                        <TableRow>
                          <StyledTableCell colSpan={2}></StyledTableCell>
                          <StyledTableCell align="right">
                            <b>Price : </b>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <b>
                              {currencyFormatter.format(
                                detailedProductData.marginwithGST
                              )}
                            </b>
                          </StyledTableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            ) : (
              <p>No detailed product data available.</p>
            )}
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setReferenceDtsDialog(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            aria-describedby={id}
            onClick={handleClick}
          >
            Download
          </Button>
        </DialogActions> */}
      </Dialog>
      <Popover
        sx={{ padding: "20px 40px" }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <div style={{ padding: "20px 40px" }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, pb: 2 }}>
            Descriptions , Terms & Conditions
          </Typography>
          <div style={{ marginBottom: "10px", width: "400px" }}>
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
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              padding: "20px 5px 30px 0px",
              gap: 10,
            }}
          >
            <Button
              onClick={() => {
                handleClose();
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              disabled={!terms || !description}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Popover>

      <DownloadPDF
        downloadPageOpen={downloadPageOpen}
        setDownloadPageOpen={setDownloadPageOpen}
        downloadData={downloadData}
      />
    </>
  );
}
