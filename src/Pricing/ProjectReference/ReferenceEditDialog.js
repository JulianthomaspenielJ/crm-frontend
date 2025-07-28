import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, DialogContentText, IconButton, TextField } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import AuthService from "../../services/AuthService";
import MarginAmount from "./PricingComponents/MarginAmount";
import SaveIcon from "@mui/icons-material/Save";

const CRMBaseURL = AuthService();
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 13,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    fontWeight: 400,
    color: "#A9B6C5",
  },
  [`&.${tableCellClasses.body}`]: {},
}));

export default function ReferenceEditDialog({
  setReferenceEditDialog,
  referenceEditDialog,
  detailedProductData,
}) {
  const [productData, setProductData] = useState(detailedProductData || {});
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState({});
  const [overallQuantity, setOverallQuantity] = useState(
    detailedProductData?.productsQuantity || ""
  );
  const [overallGST, setOverallGST] = useState(
    detailedProductData?.gstPercentage || ""
  );
  const [warrantyInfo, setWarrantyInfo] = useState(
    detailedProductData?.warrantyInfo || ""
  );
  const [marginValue, setMarginValue] = useState(0);
  const [marginName, setMarginName] = useState("");
  const [packagesValue, setPackagesValue] = useState();
  const [logisticsValue, setLogisticsValue] = useState();
  const [PLDialog, setPLDialog] = useState(false);
  const [PLTotalValue, setPLTotalValue] = useState(0);
  const [marginwithGST, setMarginwithGST] = useState("");
  const [marginType, setMarginType] = useState("");
  const [bpPercentage, setBpPercentage] = useState("");
  const [tierFinalValue, setTierFinalValue] = useState("");
  const [warrantyAmount, setWarrantyAmount] = useState();
  const [hddReturns, setHddReturns] = useState(
    detailedProductData?.hddReturns || ""
  );
  const [marginListType, setMarginListType] = useState([]);
  const [marginTypeData, setMarginTypeData] = useState([]);

  useEffect(() => {
    setProductData(detailedProductData || {});
    setOverallQuantity(detailedProductData?.productsQuantity || "");
    setOverallGST(detailedProductData?.gstPercentage || "");
    setMarginValue(detailedProductData?.marginPercentage || "");
    setWarrantyInfo(detailedProductData?.warrantyInfo || "");
    setMarginName(detailedProductData?.marginName || "");
    setLogisticsValue(detailedProductData?.logisticsValue);
    setPackagesValue(detailedProductData?.packagesValue);
    setPLTotalValue(detailedProductData?.logisticsPackages);
    setMarginwithGST(detailedProductData?.marginwithGST);
    setMarginType(detailedProductData?.marginType);
    setBpPercentage(detailedProductData?.marginTypePercentage);
    setTierFinalValue(detailedProductData?.tierFinalValue);
    setWarrantyAmount(detailedProductData?.WarrantyAmount || "");
    setHddReturns(detailedProductData?.hddReturns || 0);
  }, [detailedProductData]);

  const handleEditClick = (key) => {
    setEditMode((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
    setErrors({});
  };


  const handlePriceChange = (event, key) => {
    const updatedPrice = event.target.value;
    setMarginwithGST("");
    setTierFinalValue("");
    // Check if the price field is empty
    if (updatedPrice.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: "Price is required",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: "",
      }));
    }

    // Update the product data state
    setProductData((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [key]: {
          ...prevState.data[key],
          price: updatedPrice,
        },
      },
    }));
  };

  const handleHddChange = (event) => {
    const value = event.target.value;
    // Allow only numbers and empty value
    if (/^\d*$/.test(value)) {
      setHddReturns(value);
    }
  };


  const handleWarrantyInfo = (event) => {
    const { value } = event.target;
    if (
      value === "" ||
      (/^\d{1,3}$/.test(value) && value >= 1 && value <= 100)
    ) {
      setWarrantyInfo(value);
      setTierFinalValue("");
      setMarginwithGST("");
    }
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key === "e" || key === "E" || key === "+" || key === "-") {
      event.preventDefault();
    }
  };
  const handleOverallQuantityChange = (event) => {
    setOverallQuantity(event.target.value);
    setTierFinalValue("");
    setMarginwithGST("");
  };

  const handlePLSumbit = () => {
    const value =
      parseInt(logisticsValue) +
      parseInt(packagesValue) +
      parseInt(warrantyAmount);
    setPLTotalValue(value);
    setPLDialog(false);
    setTierFinalValue("");
    setMarginwithGST("");
  };

  const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  if (!productData || !productData.data) return null;

  const subTotalPrice = Object.keys(productData.data).reduce((acc, key) => {
    const qty = productData.data[key].qty > 0 ? productData.data[key].qty : 1;
    return acc + parseFloat(productData.data[key].price * qty || 0);
  }, 0);

  const TotalWithPL = parseInt(subTotalPrice) + parseInt(PLTotalValue);
  const subTotalPriceWithQty =
    subTotalPrice * overallQuantity + parseInt(PLTotalValue);

  const marginPercentageAmount = (subTotalPriceWithQty * marginValue) / 100;
  const marginWithTotalAmount =
    parseInt(subTotalPriceWithQty) + parseInt(marginPercentageAmount);

  const totalGST = (marginWithTotalAmount * overallGST) / 100;

  const finalAmount =
    parseInt(tierFinalValue ? tierFinalValue : 0) +
    parseInt(hddReturns ? hddReturns : 0);

  const renderDataFields = () => {
    return (
      <>
        {Object.keys(productData.data).map((key, index) => {
          const component = productData.data[key];
          return (
            <TableRow key={key}>
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell>
                {component.Name} ({component.descriptions}){" "}
                {component.qty ? `* ${component.qty}` : ""}
              </StyledTableCell>
              <StyledTableCell>
                {editMode[key] ? (
                  <div>
                    <TextField
                      type="number"
                      onKeyDown={handleKeyDown}
                      value={
                        component.qty
                          ? component.price * component.qty
                          : component.price
                      }
                      onChange={(event) => handlePriceChange(event, key)}
                    />
                    {errors[key] && (
                      <p style={{ color: "red" }}>{errors[key]}</p>
                    )}
                  </div>
                ) : component.qty ? (
                  component.price * component.qty
                ) : (
                  component.price
                )}
              </StyledTableCell>
              <StyledTableCell>
                {editMode[key] ? (
                  <IconButton
                    onClick={() => handleEditClick(key)}
                    color="primary"
                  >
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => handleEditClick(key)}
                    color="success"
                  >
                    <CreateIcon />
                  </IconButton>
                )}
              </StyledTableCell>
            </TableRow>
          );
        })}

        <TableRow>
          <TableCell colSpan={1}></TableCell>
          <TableCell align="right">
            <b>Others </b> :
          </TableCell>
          <TableCell align="left">
            {PLTotalValue && parseInt(PLTotalValue.toFixed(2))}
            <span
              onClick={() => {
                setPLDialog(true);
              }}
              style={{
                color: "#00E096",
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                border: "1px solid #00E096",
                padding: "2px 5px 2px 5px",
                borderRadius: 5,

                margin: "0px 0px 0px 15px",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: "#00E096",
                  color: "#fff",
                },
              }}
            >
              {PLTotalValue ? "Edit" : "Add"}
            </span>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>

        <TableRow>
          <StyledTableCell colSpan={1}></StyledTableCell>
          <StyledTableCell align="right">
            <b>Sub Total Price: </b>
          </StyledTableCell>
          <StyledTableCell>
            <b>{currencyFormatter.format(TotalWithPL)}</b>
          </StyledTableCell>
          <StyledTableCell></StyledTableCell>
        </TableRow>
        <TableRow>
          <StyledTableCell></StyledTableCell>
          <StyledTableCell align="right">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap={1}
            >
              <b>{`${warrantyInfo > 3 ? "warranty & " : ""}`} Quantity</b>
              <TextField
                sx={{ width: 50, mx: 1 }}
                value={overallQuantity}
                onKeyDown={handleKeyDown}
                onChange={handleOverallQuantityChange}
                variant="standard"
                type="number"
                inputProps={{ min: 1, max: 100 }}
              />
            </Box>
          </StyledTableCell>
          <StyledTableCell>
            <b>
              {currencyFormatter.format(
                parseInt(subTotalPriceWithQty.toFixed(2))
              )}
            </b>
          </StyledTableCell>
          <StyledTableCell></StyledTableCell>
        </TableRow>
        <MarginAmount
          warrantyInfo={warrantyInfo}
          handleKeyDown={handleKeyDown}
          handleWarrantyInfo={handleWarrantyInfo}
          totalPriceWithPLQ={subTotalPriceWithQty}
          marginwithGST={marginwithGST}
          setMarginwithGST={setMarginwithGST}
          marginType={marginType}
          setMarginType={setMarginType}
          bpPercentage={bpPercentage}
          setBpPercentage={setBpPercentage}
          tierFinalValue={tierFinalValue}
          setTierFinalValue={setTierFinalValue}
          type="edit"
          marginListType={marginListType}
          setMarginListType={setMarginListType}
          marginTypeData={marginTypeData}
          setMarginTypeData={setMarginTypeData}
        />

        <TableRow>
          <TableCell colSpan={1}></TableCell>
          <TableCell align="right">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <b>HDD Returns :</b>
              <TextField
                style={{ marginLeft: 8 }}
                value={hddReturns}
                onChange={handleHddChange}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }} // this ensures the numeric keyboard on mobile
              />
            </div>
          </TableCell>
          <TableCell align="left">
            {finalAmount ? finalAmount : "0.00"}
          </TableCell>
          <TableCell></TableCell>
        </TableRow>

        <TableRow>
          <StyledTableCell colSpan={1}></StyledTableCell>
          <StyledTableCell align="right">
            <b>Final Amount: </b>
          </StyledTableCell>
          <StyledTableCell>
            <b>{currencyFormatter.format(finalAmount)}</b>
          </StyledTableCell>
          <StyledTableCell></StyledTableCell>
        </TableRow>
      </>
    );
  };

  const handleUpdate = async () => {
    const selectedIdsAndQuantities = Object.keys(productData.data).map(
      (field) => {
        // Get the quantity for the current field, defaulting to 1 if not present
        const qty =
          productData.qty && productData.qty[field]
            ? productData.qty[field]
            : 1;

        return {
          id: productData.data[field].id,
          descriptions: productData.data[field].descriptions,
          price: parseInt(productData.data[field].price, 10) / qty, // Adjust price calculation if needed
          qty: qty, // Add quantity to the result
          Name: productData.data[field].Name,
        };
      }
    );

    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const finalAmount1  = finalAmount.toString()

    const dataToSubmit = {
      referenceID: productData.referenceID,
      data: selectedIdsAndQuantities,
      warrantyInfo: parseInt(productData.warrantyInfo),
      updatedBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
      addressTo: productData.addressTo,
      productsQuantity: parseInt(overallQuantity),
      referenceName: productData.referenceName,
      gstPercentage: overallGST.toString(),
      marginPercentage: marginValue.toString(),
      gstAmount: totalGST.toFixed(2),
      marginAmount: marginPercentageAmount,
      totalAmountWithmargin: marginWithTotalAmount,
      totalAmountWithGST: marginWithTotalAmount + totalGST,
      totalAmount: parseInt(subTotalPriceWithQty.toFixed(2)),
      logisticsPackages: PLTotalValue,
      logisticsValue: logisticsValue,
      packagesValue: packagesValue,
      marginName: marginName,
      marginType: marginType,
      marginTypePercentage: parseInt(bpPercentage),
      marginwithGST: finalAmount1,
      tierFinalValue: tierFinalValue,
      warrantyAmount: parseInt(warrantyAmount),
      hddReturns: parseInt(hddReturns),
    };

    try {
      const res = await CRMBaseURL.post("updateproduct", dataToSubmit);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Dialog
        open={referenceEditDialog}
        onClose={() => setReferenceEditDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Product Details"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {productData ? (
              <div className="pdf-container">
                <div className="pdf-header">
                  <p>
                    <strong>Reference Name:</strong> {productData.referenceName}
                  </p>
                </div>

                <div className="pdf-section">
                  <TableContainer component={Paper} sx={{ px: 2 }}>
                    <Table sx={{ minWidth: 500 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>#</StyledTableCell>
                          <StyledTableCell>Model</StyledTableCell>
                          <StyledTableCell>Price</StyledTableCell>
                          <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>{renderDataFields()}</TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            ) : (
              <p>No detailed product data available.</p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setReferenceEditDialog(false);
              setEditMode({});
            }}
          >
            Cancel
          </Button>
          {overallQuantity && (
            <Button
              variant="contained"
              onClick={() => {
                handleUpdate();
                setReferenceEditDialog(false);
                setEditMode({});
              }}
            >
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={PLDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Logistics & Packages & Warranty</DialogTitle>
        <DialogContent>
          <TextField
            id="packages"
            fullWidth
            label="Packages"
            type="number"
            margin="normal"
            value={packagesValue}
            onChange={(e) => setPackagesValue(e.target.value)}
          />

          <TextField
            id="logistics"
            label="Logistics"
            fullWidth
            type="number"
            margin="normal"
            value={logisticsValue}
            onChange={(e) => setLogisticsValue(e.target.value)}
          />
          <TextField
            id="warranty"
            label="Warranty Year"
            fullWidth
            type="number"
            margin="normal"
            value={warrantyInfo}
            onKeyDown={handleKeyDown}
            onChange={handleWarrantyInfo}
          />
          <TextField
            id="warrantyAmount"
            label="Warranty Amount"
            fullWidth
            type="number"
            margin="normal"
            value={warrantyAmount}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setWarrantyAmount(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions sx={{ pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setPLDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!packagesValue && !logisticsValue}
            variant="contained"
            onClick={() => {
              handlePLSumbit();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
