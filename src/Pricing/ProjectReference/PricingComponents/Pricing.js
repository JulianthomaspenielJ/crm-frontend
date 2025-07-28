import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
  Autocomplete,
  Typography,
  Tooltip,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableBody,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AuthService from "../../../services/AuthService";
import { styled } from "@mui/material/styles";
import MarginAmount from "./MarginAmount";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    // color: "#A9B6C5",
    // color:"#0095FF"
    color: "#884DFF",
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 13,
  },
}));

function PricingScreen({
  openPricing,
  setOpenPricing,
  selectedComponent,
  fetch,
}) {
  const [components, setComponents] = useState([]);
  const initialOptions = selectedComponent.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {});

  const [options, setOptions] = useState(initialOptions);
  const [marginName, setMarginName] = useState("");

  const [openDialog, setOpenDialog] = useState("");
  const [packagesValue, setPackagesValue] = useState();
  const [logisticsValue, setLogisticsValue] = useState();
  const [PLDialog, setPLDialog] = useState(false);
  const [PLTotalValue, setPLTotalValue] = useState(0);
  const [productTotalQty, setProductTotalQty] = useState(1);
  const [referenceName, setReferenceName] = useState();
  const [addressTo, setAddressTo] = useState();
  const [warrantyInfo, setWarrantyInfo] = useState("3");
  const [warrantyAmount, setWarrantyAmount] = useState(0);
  const [marginType, setMarginType] = useState("");
  const [bpPercentage, setBpPercentage] = useState("");
  const [tierFinalValue, setTierFinalValue] = useState("");

  const initialState = selectedComponent.reduce((obj, key) => {
    let value = "";
    if (key.toLowerCase() === "keyboard") {
      value = key["keyboardMouse"] || "";
    } else if (key.toLowerCase() === "all in one pc") {
      value = key["allinonepc"] || "";
    }
    return {
      ...obj,
      [key.toLowerCase()]: value,
    };
  }, {});

  if (initialState.hasOwnProperty("keyboard")) {
    initialState["keyboardMouse"] = initialState["keyboard"];
  }

  if (initialState.hasOwnProperty("all in one pc")) {
    initialState["allinonepc"] = initialState["all in one pc"];
    delete initialState["all in one pc"];
  }

  const [selections, setSelections] = useState(initialState);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [currentField, setCurrentField] = useState("");
  const [prices, setPrices] = useState(initialState);
  const [descriptions, setDescriptions] = useState(initialState);
  const [idvalue, setIdvalue] = useState(initialState);
  const [quantities, setQuantities] = useState(initialState);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [variantDisabled, setVariantDisabled] = useState(true);
  const [gstRate, setGstRate] = useState("18");
  const [referenceNameList, setReferenceNameList] = useState();
  const [marginwithGST, setMarginwithGST] = useState("");
  const [marginListType, setMarginListType] = useState([]);
  const [marginTypeData, setMarginTypeData] = useState([]);
  const [marginTierPercentage,setMarginTierPercentage]=useState("")
  const [qty, setQty] = useState({
    processor: 1,
    ram: 1,
    hdd: 1,
    ssd: 1,
  });
  const [singleProductPrice, setSingleProductPrice] = useState({
    processor: "",
    ram: "",
    hdd: "",
    ssd: "",
  });
  const [modelFiled, setModelFiled] = useState([]);
  const [hddReturns, setHddReturns] = useState("");
  const handleQtyChange = (currentField, value) => {
    setQty((prevQty) => ({
      ...prevQty,
      [currentField]: value,
    }));

    setPrices((prevPrices) => {
      const price = parseInt(singleProductPrice[currentField], 10) || 0;
      const quantity = parseInt(value, 10) || 0;

      return {
        ...prevPrices,
        // [newField]: price * quantity,
        [currentField]: price * quantity,
      };
    });
  };

  const handleWarrantyInfo = (event) => {
    const { value } = event.target;
    if (
      value === "" ||
      (/^\d{1,3}$/.test(value) && value >= 1 && value <= 100)
    ) {
      setWarrantyInfo(value);
    }
  };
  const handleHddChange = (event) => {
    const value = event.target.value;
    // Allow only numbers and empty value
    if (/^\d*$/.test(value)) {
      setHddReturns(value);
    }
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (key === "e" || key === "E" || key === "+" || key === "-") {
      event.preventDefault();
    }
  };

  const CRMBaseURL = AuthService();

  const fetchComponents = async () => {
    try {
      const response = await CRMBaseURL.get("getcomponentlist");
      const userData = response.data.components;
      setComponents(userData);

      const initialOptions = selectedComponent.reduce((options, category) => {
        options[category.toLowerCase().replace(/ /g, "")] = userData
          .filter((component) => component.componentName === category)
          .map((component) => component.description);
        return options;
      }, []);

      setOptions(initialOptions, userData);
    } catch (err) {
      console.error("Error occurred", err);
    }
  };

  const fetchRefernceName = async () => {
    try {
      const response = await CRMBaseURL.get("/getproduct");
      const data = response.data.data;
      const referenceList = data && data.map((d) => d.referenceName);
      setReferenceNameList(referenceList);
    } catch (err) {
      console.log("Error occurred", err);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    fetchRefernceName();
  }, []);

  const handleOpenDialog = (field) => {
    const newField = field ? field.toLowerCase().replace(/ /g, "") : "";

    const updatedField = newField === "keyboard" ? "keyboardMouse" : newField;

    setCurrentField(field);
    setOpenDialog(updatedField);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
    // setSelectedVariants([]);
    setVariantDisabled(true);
  };

  const handlePLSumbit = () => {
    const value =
      parseInt(logisticsValue) +
      parseInt(packagesValue) +
      parseInt(warrantyAmount);

    setPLTotalValue(value);
    setPLDialog(false);
  };

  const handleSelect = async (event, value) => {
    const baseField = currentField.split("_")[0];

    const selectedComponent = components.find(
      (component) =>
        component.componentName.toLowerCase().replace(/\s+/g, "") ===
          baseField.toLowerCase().replace(/\s+/g, "") &&
        component.description === value
    );

    if (selectedComponent) {
      const { id, price } = selectedComponent;

      try {
        const response = await CRMBaseURL.post("pricing", { id });
        setSelectedVariants(response.data.component || []);
        setVariantDisabled(false);
        setIdvalue({ ...idvalue, [currentField]: id });
        setPrices({ ...prices, [currentField]: price });

        // if (currentField === "margin") {
        //   setMarginValue(price); // Set the margin value here
        //   setSelectedMargin(price);
        // }
      } catch (err) {
        console.error("Error occurred", err);
      }
    }
    setQuantities({ ...quantities, [currentField]: 1 });
  };

  const handleVariantSelect = (event, value) => {
    const variantDetails = selectedVariants.find(
      (v) => v.variantName === value
    );
    setDescriptions({
      ...descriptions,
      [currentField]: variantDetails.variantDescription,
    });
    setSelections({
      ...selections,
      [currentField]: variantDetails.variantName,
    });
    setSingleProductPrice({
      ...singleProductPrice,
      [currentField]: variantDetails.variantPrice,
    });

    setIdvalue({ ...idvalue, [currentField]: variantDetails.id });

    const newField = `${currentField}_${
      additionalFields &&
      additionalFields.filter((f) => f === currentField).length + 1
    }`;



    if (qty[currentField]) {
      setPrices((prevPrices) => {
        const price = parseInt(variantDetails.variantPrice, 10) || 0;
        const quantity = parseInt(qty[currentField], 10) || 0;

        return {
          ...prevPrices,
          [newField]: price * quantity,
          [currentField]: price * quantity,
        };
      });
    } else {
      setPrices({
        ...prices,
        [currentField]: variantDetails.variantPrice,
        [newField]: variantDetails.variantPrice,
      });
    }

    handleCloseDialog();
  };

  const renderFields = (field, index, isRemovable = false) => (
    <TableRow key={index}>
      <StyledTableCell>{index + 1}</StyledTableCell>

      <StyledTableCell>
        {isRemovable && (
          <Tooltip title={`Delete ${field}`}>
            <IconButton onClick={() => handleRemoveField(field)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        <span>{field.toUpperCase()}</span>
        {field === "processor" ||
        field === "ram" ||
        field === "hdd" ||
        field === "ssd" ? (
          <>
            <FormControl
              variant="standard"
              sx={{ mt: -1, ml: 1, minWidth: 60 }} // Adjusted minWidth for better appearance
            >
              <Select
                labelId={`select-quantity-label-${field}`} // Added labelId for accessibility
                id={`select-quantity-${field}`} // Added dynamic id based on the field
                disabled={!descriptions[field]}
                value={qty[field]}
                onChange={(e) => handleQtyChange(field, Number(e.target.value))}
              >
                {[...Array(10)].map((_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        ) : null}
      </StyledTableCell>

      <StyledTableCell>
        <Typography variant="body1">
          {descriptions[field] &&
            selections[field] &&
            `${selections[field]}  ( ${descriptions[field]} )`}
        </Typography>
      </StyledTableCell>
      <StyledTableCell>
        <Typography onClick={() => handleOpenDialog(field)}>
          <Tooltip title={`Add ${field}`}>
            <Typography
              sx={{
                color: "#00E096",
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                border: "1px solid #00E096",
                borderRadius: 2,
                cursor: "pointer",
                width: 50,
                textAlign: "center",
                py: "3px",
                "&:hover": {
                  backgroundColor: "#00E096",

                  color: "#fff",
                },
              }}
            >
              ADD
            </Typography>
          </Tooltip>
        </Typography>
      </StyledTableCell>
    </TableRow>
  );

  const handleAddField = (field) => {
    const newField = `${field}_${
      additionalFields &&
      additionalFields.filter((f) => f.startsWith(field)).length + 1
    }`;
    setAdditionalFields([...additionalFields, newField]);
    setQuantities({ ...quantities, [newField]: 1 });
    setPrices({ ...prices, [newField]: null });
  };

  const handleRemoveField = (field) => {
    const updatedFields =
      additionalFields && additionalFields.filter((f) => f !== field);
    const { [field]: _, ...updatedQuantities } = quantities;
    const { [field]: __, ...updatedPrices } = prices;
    const { [field]: ___, ...updatedSelections } = selections;
    const { [field]: ____, ...updatedDescriptions } = descriptions;
    setAdditionalFields(updatedFields);
    setQuantities(updatedQuantities);
    setPrices(updatedPrices);
    setSelections(updatedSelections);
    setDescriptions(updatedDescriptions);
  };

  const handleReference = async (e) => {
    const value = e.target.value;
    const isValueInList =
      referenceNameList && referenceNameList.includes(value);
    setReferenceName(value);
    if (isValueInList) {
    
      const data = {
        referenceName: value,
      };
      try {
        const res = await CRMBaseURL.post("productsreference", data);
        const variants = res.data?.components;

        const prices = {};
        const descriptions = {};
        const types = {};
        const uniqueTypes = new Set();
        const quantities = {};

        variants.forEach((variant) => {
          prices[variant.varientType] = variant.varientPrice;
          descriptions[variant.varientType] = variant.varientDescription;
          types[variant.varientType] = variant.varientName; // Assuming you want to store the name as well
          uniqueTypes.add(variant.varientType);
          quantities[variant.varientType] = 1;
        });
        const field = Array.from(uniqueTypes);
        setPrices(prices);
        setDescriptions(descriptions);
        setSelections(types);
        setModelFiled(field);
        setQuantities(quantities);
      } catch (e) {
        console.log(e);
      }
    } else {
      setPrices(initialState);
      setDescriptions(initialState);
      setSelections(initialState);
      setModelFiled("");
      setQuantities(initialState);
    }
  };

  const finalAmount =
    parseInt(marginwithGST ? marginwithGST : 0) +
    parseInt(hddReturns ? hddReturns : 0);

  const handleSubmit = async () => {
    // const selectedIdsAndQuantities = {};

    // Object.keys(idvalue).forEach((key) => {
    //   if (idvalue[key]) {
    //     const baseField = key.split('_')[0];
    //     const formattedField = baseField.charAt(0).toLowerCase() + baseField.slice(1) + 'Id';

    //     if (!selectedIdsAndQuantities[formattedField]) {
    //       selectedIdsAndQuantities[formattedField] = [];
    //     }

    //     selectedIdsAndQuantities[formattedField].push({
    //       id: idvalue[key],
    //       quantity: quantities[key]
    //     });
    //   }
    // });

    const selectedIdsAndQuantities = Object.keys(idvalue).map((field) => {
      const data = qty[field] ? qty[field] : 1; // Calculate `data` outside the object literal

      return {
        id: idvalue[field],
        descriptions: descriptions[field],
        price: prices[field] / data,
        qty: data, // Use the calculated `data` here
        Name: selections[field],
      };
    });
    const finalAmount1 = finalAmount.toString();
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    const dataToSubmit = {
      data: selectedIdsAndQuantities,
      warrantyInfo: parseInt(warrantyInfo),
      warrantyAmount: parseInt(warrantyAmount),
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
      addressTo: addressTo,
      productsQuantity: parseInt(productTotalQty),
      referenceName: referenceName,
      logisticsPackages: PLTotalValue,
      gstPercentage: gstRate.toString(),
      marginPercentage: marginTierPercentage.toString(),
      marginName: marginName,
      marginAmount: marginPercentageAmount,
      logisticsValue: logisticsValue,
      packagesValue: packagesValue,
      gstAmount: gstAmount.toFixed(2),
      totalAmount: parseInt(totalPriceWithPLQ.toFixed(2)),
      totalAmountWithGST: finalPrice,
      totalAmountWithmargin: marginWithTotalAmount,
      marginType: marginType,
      marginTypePercentage: bpPercentage,
      marginwithGST: finalAmount1,
      tierFinalValue: tierFinalValue,
      hddReturns: parseInt(hddReturns),
    };

    try {
      const response = await CRMBaseURL.post("productsdata", dataToSubmit);
      console.log("res",response)
    } catch (err) {
      console.error("Error occurred while submitting", err);
    }

    fetch();
    setSelections("");
    setDescriptions("");
    setAddressTo("");
    setReferenceName("");
    setProductTotalQty(1);
    setWarrantyInfo(3);
    setGstRate(18);
    setAdditionalFields([]);
    setPrices("");
    setIdvalue("");
    setOpenPricing(false);
    setMarginType("");
    setLogisticsValue("");
    setPackagesValue("");
    setTierFinalValue("");
    setMarginwithGST("");
    setPLTotalValue("");
    setWarrantyAmount(0);
    setQty({ processor: 1, ram: 1, hdd: 1, ssd: 1 });
    setHddReturns("");
    setModelFiled("");
    setQuantities("");
  };

  const handlecancel = () => {
    setSelections("");
    setDescriptions("");
    setAddressTo("");
    setReferenceName("");
    setProductTotalQty(1);
    setWarrantyInfo(3);
    setGstRate(18);
    setPrices("");
    setIdvalue("");
    setAdditionalFields([]);
    setOpenPricing(false);
    setMarginType("");
    setLogisticsValue("");
    setPackagesValue("");
    setTierFinalValue("");
    setMarginwithGST("");
    setQty({ processor: 1, ram: 1, hdd: 1, ssd: 1 });
    setHddReturns("");
    setPLTotalValue("");
    setModelFiled("");
    setQuantities("");
  };

  const allDataFilled = Object.keys(initialState).every((field) => {
    return selections[field]
      ? selections[field]
      : "" && prices[field]
      ? prices[field]
      : "" && descriptions[field]
      ? descriptions[field]
      : "" && idvalue[field]
      ? idvalue[field]
      : "";
  });

  const totalProductPrice = Object.keys(quantities).reduce((total, field) => {
    const price = prices[field] !== undefined ? prices[field] : 0;

    return total + quantities[field] * price;
  }, 0);

  const totalPriceWithPLQ =
    totalProductPrice &&
    totalProductPrice * productTotalQty +
      parseInt(PLTotalValue ? PLTotalValue : 0);

  const marginPercentageAmount = totalPriceWithPLQ * (marginTierPercentage / 100);

  const marginWithTotalAmount = marginPercentageAmount
    ? totalPriceWithPLQ + marginPercentageAmount
    : 0;

  const gstAmount = marginWithTotalAmount * (gstRate / 100);

  const finalPrice = parseInt(gstAmount) + parseInt(marginWithTotalAmount);

  return (
    <>
      <Dialog open={openPricing} maxWidth="lg" fullWidth>
        <DialogContent>
          <DialogTitle>
            <Typography
              sx={{ fontSize: 16, fontWeight: 700, textAlign: "center" }}
            >
              {"PRICING DETAILS"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: 14, fontWeight: 700, pb: 1 }}>
                  Address From
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                  Jaikrishna Technology Pvt. Ltd.
                </Typography>
                <Typography>
                  SN Tower, NO.14,Rottu Street,Neer Selva Vinayagar
                  Temple,Moondramkattalai,Chennai-600128
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    textAlign: "end",
                    paddingTop: 3,
                  }}
                >
                  {"HSN/SAC - 84715000"}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  id="address_to"
                  label="Address To"
                  multiline
                  rows={3}
                  fullWidth
                  value={addressTo}
                  onChange={(e) => setAddressTo(e.target.value)}
                  margin="normal"
                  //  focused
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="reference"
                  label="Reference Name"
                  fullWidth
                  value={referenceName}
                  onChange={handleReference}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  id="qty"
                  label="Product qty"
                  fullWidth
                  onKeyDown={handleKeyDown}
                  value={productTotalQty}
                  onChange={(e) => setProductTotalQty(e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogTitle>

          <div>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>Components</StyledTableCell>
                    <StyledTableCell>Product Name ( Variant )</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Array.isArray(modelFiled) && modelFiled.length > 0
                    ? modelFiled.map((field, index) => {
                        return renderFields(field, index);
                      })
                    : Object.keys(initialState).map((field, index) => {
                        return renderFields(field, index);
                      })}

                  {additionalFields &&
                    additionalFields
                      .filter((f) => f.startsWith("accessories"))
                      .map((field, index) =>
                        renderFields(
                          field,
                          Object.keys(initialState).length + index,
                          true
                        )
                      )}

                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell align="right">
                      <b> Others</b> :
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
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell align="right">
                      <b>
                        Sub Total{`${warrantyInfo > 3 ? " & warranty" : ""}`}
                      </b>{" "}
                      :
                    </TableCell>
                    <TableCell align="left">
                      {parseInt(totalPriceWithPLQ.toFixed(2))}
                    </TableCell>
                  </TableRow>

                  <MarginAmount
                    totalPriceWithPLQ={totalPriceWithPLQ}
                    marginwithGST={marginwithGST}
                    setMarginwithGST={setMarginwithGST}
                    marginType={marginType}
                    setMarginType={setMarginType}
                    bpPercentage={bpPercentage}
                    setBpPercentage={setBpPercentage}
                    tierFinalValue={tierFinalValue}
                    setTierFinalValue={setTierFinalValue}
                    type="add"
                    marginListType={marginListType}
                    setMarginListType={setMarginListType}
                    marginTypeData={marginTypeData}
                    setMarginTypeData={setMarginTypeData}
                    setMarginName={setMarginName}
                    setMarginTierPercentage={setMarginTierPercentage}
                  />

                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
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
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell align="right">
                      <b>Final Price</b> :
                    </TableCell>
                    <TableCell align="left">
                      {finalAmount ? finalAmount.toFixed(2) : "0.00"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {Object.keys(initialState).some(
              (field) => field === "accessories"
            ) && (
              <Grid item xs={12} sx={{ paddingTop: 2 }} align="end">
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddField("accessories")}
                >
                  Add accessories
                </Button>
              </Grid>
            )}
            {Object.keys(options).map((field, index) => (
              <Dialog
                key={index}
                open={
                  openDialog &&
                  (openDialog === field || openDialog.split("_")[0] === field)
                }
                maxWidth="xs"
                fullWidth
                onClose={handleCloseDialog}
              >
                <DialogTitle>Select {field}</DialogTitle>
                <DialogContent>
                  <Autocomplete
                    sx={{ mt: 2 }}
                    options={options[field]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`Select ${field}`}
                        variant="outlined"
                      />
                    )}
                    onChange={handleSelect}
                  />
                  <Tooltip
                    title={
                      variantDisabled
                        ? `Please select first ${field}`
                        : selectedVariants.length === 0
                        ? "variant not found"
                        : null
                    }
                  >
                    <Autocomplete
                      sx={{ mt: 2 }}
                      options={
                        selectedVariants
                          ? selectedVariants.map((v) => v.variantName)
                          : []
                      }
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`Select Variant`}
                          variant="outlined"
                        />
                      )}
                      onChange={handleVariantSelect}
                      disabled={
                        variantDisabled || selectedVariants.length === 0
                      }
                    />
                  </Tooltip>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                </DialogActions>
              </Dialog>
            ))}

            <br />
            <DialogActions>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  handlecancel();
                }}
              >
                Cancel
              </Button>
              {allDataFilled &&
                referenceName &&
                productTotalQty &&
                addressTo &&
                finalAmount > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
            </DialogActions>
          </div>
        </DialogContent>
      </Dialog>
      <>
        <Dialog open={PLDialog} maxWidth="xs" fullWidth>
          <DialogTitle>Logistics & Packages & Warranty </DialogTitle>
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
    </>
  );
}

export default PricingScreen;
