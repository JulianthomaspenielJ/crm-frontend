import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableBody,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import userNotFound from "../Image/useeNotfound.webp";
import Company from "./AuditingDetails/Company";
import Deals from "./AuditingDetails/Deals";
import Contact from "./AuditingDetails/Contact";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 13,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    // color: "#A9B6C5",
    fontWeight: 400,
    color: "#A9B6C5",
  },
  [`&.${tableCellClasses.body}`]: {},
}));

function AuditingDtsDialog({
  auditingDtsOpen,
  setAuditingDtsOpen,
  auditingData,
  setAuditingData,
  filterName,
}) {
  const renderDataFields = (data) => {
    if (!data || !data.data) return null;

    let totalComponentPrice = 0;

    return (
      <TableRow>
        <StyledTableCell key="data-cell">
          {data &&
            Object.keys(data.data).map((key, index) => {
              const component = data.data[key];
              const TotalUnitPrice = data.totalProductsQty * component.price;
              totalComponentPrice += component.price;

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
          <b>{data.gstPercentage}%</b>
        </StyledTableCell>
        <StyledTableCell align="center">
          {data.productsQuantity} NOS
        </StyledTableCell>
        <StyledTableCell align="center">
          <b>{currencyFormatter.format(data.marginwithGST)}</b>
        </StyledTableCell>
      </TableRow>
    );
  };

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return (
    <>
      <Dialog
        maxWidth={filterName === "Products" ? "lg" : "sm"}
        fullWidth
        open={auditingDtsOpen}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          sx={{
            backgroundImage:
              "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff" }}>
            Auditing Details
          </Typography>
        </DialogTitle>
        {filterName ? (
          auditingData &&
          auditingData.map((data, index) => (
            <Box key={index}>
              <Box sx={{ padding: "10px 0px 0px 30px" }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, pb: 2 }}>
                  {data.actionDescription}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  - By {data.actionBy}
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  - At {data.actionAt}
                </Typography>
              </Box>
              <DialogContent>
                <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
                  Details
                </Typography>
                {filterName === "Users" && (
                  <Box sx={{ padding: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Name :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Email :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Role :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.role}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Mobile :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.mobile}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Designation :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.designation}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedBy :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdBy || data.CreatedBy}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedAt :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdAt || data.CreatedAt}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {filterName === "Components" && (
                  <Box sx={{ padding: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Variant Name :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.variantName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Description :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.variantDescription}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Brand :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.brand}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Price :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.variantPrice}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedBy :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdBy || data.CreatedBy}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedAt :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdAt || data.CreatedAt}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {filterName === "Components list" && (
                  <Box sx={{ padding: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Component Name :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.componentName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Product Type :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.productType}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Description :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedBy :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdBy || data.CreatedBy}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedAt :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdAt || data.CreatedAt}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {filterName === "Products Main list" && (
                  <Box sx={{ padding: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Product Name :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.product}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedBy :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdBy || data.CreatedBy}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedAt :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdAt || data.CreatedAt}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {filterName === "Products list" && (
                  <Box sx={{ padding: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Product Name :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.productName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Description :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedBy :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdBy || data.CreatedBy}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedAt :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdAt || data.CreatedAt}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {filterName === "Products" && (
                  <Box sx={{ padding: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Reference Name :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.referenceName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        Warranty Info :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.warrantyInfo} years
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pt: 1,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        To Address :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.addressTo}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedBy :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdBy || data.CreatedBy}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pt: 1,
                        pb: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        CreatedAt :
                      </Typography>
                      <Typography sx={{ fontSize: 14, pl: 1 }}>
                        {data.createdAt || data.CreatedAt}
                      </Typography>
                    </Box>

                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 500 }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Model</StyledTableCell>
                            <StyledTableCell align="center">
                              HSN/SAC
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              GST Rate
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
                          {renderDataFields(data)}

                          <TableRow>
                            <StyledTableCell colSpan={3}></StyledTableCell>
                            <StyledTableCell align="right">
                              <b>Price : </b>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <b>
                                {currencyFormatter.format(
                                  data.marginwithGST
                                )}
                              </b>
                            </StyledTableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {filterName === "Companies" && <Company data={data} />}
                {filterName === "Contacts" && <Contact data={data} />}
                {filterName === "Deals" && <Deals data={data} />}
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setAuditingDtsOpen(false);
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </Box>
          ))
        ) : (
          <>
            <div style={{ padding: "50px 0px 50px 0px", textAlign: "center" }}>
              <img
                src={userNotFound}
                style={{ width: 200, height: 200 }}
                alt="No data available"
              />
              <Typography>No data available</Typography>

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                size="small"
                onClick={() => {
                  setAuditingDtsOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
}

export default AuditingDtsDialog;
