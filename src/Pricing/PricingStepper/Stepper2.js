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
  Box,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AuthService from "../../services/AuthService";
import { styled } from "@mui/material/styles";
import MarginAmount from "../../Pricing/ProjectReference/PricingComponents/MarginAmount";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: "#884DFF",
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 13,
  },
}));

function Stepper2({
  setActiveStep,
  selectedComponent,
  handleBack,
  selections,
  setSelections,
  prices,
  setPrices,
  descriptions,
  setDescriptions,
  idvalue,
  setIdvalue,
  quantities,
  setQuantities,
  initialState,
  packagesValue,
  setPackagesValue,
  logisticsValue,
  setLogisticsValue,
  PLTotalValue,
  setPLTotalValue,
  productTotalQty,
  setProductTotalQty,
  referenceName,
  setReferenceName,
  addressTo,
  setAddressTo,
  warrantyInfo,
  setWarrantyInfo,
  warrantyAmount,
  setWarrantyAmount,
  marginType,
  setMarginType,
  bpPercentage,
  setBpPercentage,
  tierFinalValue,
  setTierFinalValue,
  options,
  setOptions,
  hddReturns,
  discount,
  setDiscount,
  setHddReturns,
  marginwithGST,
  setMarginwithGST,
  qty,
  setQty,
  singleProductPrice,
  setSingleProductPrice,
  additionalFields,
  setAdditionalFields,
  setAllPricingData,
  marginListType,
  setMarginListType,
  marginTypeData,
  setMarginTypeData,
  setFindSelectedComponents,
  createInitialState,
  DealID,
  modelFiled,
  setModelFiled,
  setPricingAmount,
  product,
  modelName,
  status,
}) {
  const [components, setComponents] = useState([]);

  const [marginName, setMarginName] = useState("");
  const [marginTierPercentage, setMarginTierPercentage] = useState("");

  const [openDialog, setOpenDialog] = useState("");

  if (initialState.hasOwnProperty("keyboard")) {
    initialState["keyboardMouse"] = initialState["keyboard"];
  }

  if (initialState.hasOwnProperty("all in one pc")) {
    initialState["allinonepc"] = initialState["all in one pc"];
    delete initialState["all in one pc"];
  }

  const [selectedVariants, setSelectedVariants] = useState([]);
  const [currentField, setCurrentField] = useState("");
  const [PLDialog, setPLDialog] = useState(false);
  const [laptopDialog, setLaptopDialog] = useState(false);
  const [variantDisabled, setVariantDisabled] = useState(true);
  const [referenceNameList, setReferenceNameList] = useState();

  const [adpValue, setAdpValue] = useState("");
  const [bagValue, setBagValue] = useState("");
  const [laptopWarranty, setLoptopWarranty] = useState(3);
  const [laptopWarrantyAmount, setLaptopWarrantyAmount] = useState("");
  const [laptopAdditionalAmount, setLaptopAdditionalAmount] = useState();

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

    setTierFinalValue("");
    setMarginwithGST("");
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
  const handleDiscountChange = (event) => {
    const value = event.target.value;
    // Allow only numbers and empty value
    if (/^\d*$/.test(value)) {
      setDiscount(value);
    }
  };

  const handleLaptopWarrantyInfo = (event) => {
    const { value } = event.target;
    if (
      value === "" ||
      (/^\d{1,3}$/.test(value) && value >= 1 && value <= 100)
    ) {
      setLoptopWarranty(value);
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
    fetchRefernceName(referenceName);
  }, []);

  useEffect(() => {
    fetchRefernceName(modelName);
  }, [modelName]);

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
    setTierFinalValue("");
    setMarginwithGST("");
  };

  const handleAdditonalDataSumbit = () => {
    const adp = adpValue || 0;
    const bag = bagValue || 0;
    const warranty = laptopWarrantyAmount || 0;
    const total = parseInt(adp) + parseInt(bag) + parseInt(warranty);

    setLaptopAdditionalAmount(total);

    setLaptopDialog(false);
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

    // if (currentField === "margin") {
    //   setMarginValue(variantDetails.variantPrice);
    //   setMarginName(variantDetails.variantDescription);

    // } else {

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
    setTierFinalValue("");
    setMarginwithGST("");

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
      (additionalFields &&
        additionalFields.filter((f) => f.startsWith(field)).length + 1) ||
      1
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

  useEffect(() => {
    if (referenceName) {
      handleReference(referenceName);
    }
  }, []);
  useEffect(() => {
    if ((modelName && referenceNameList) || referenceName) {
      handleReference(modelName || referenceName);
    }
  }, [modelName, referenceNameList, referenceName]);

  const handleReference = async (value) => {
    const isValueInList =
      referenceNameList && referenceNameList.includes(value);
    setReferenceName(value);
    if (isValueInList) {
      // setRefErr("Reference name already exists");
      const data = {
        referenceName: value,
      };
      try {
        const res = await CRMBaseURL.post("productsreference", data);
        const variants = res.data?.components;
        const pricingData = res.data?.info;

        setHddReturns(pricingData?.hddReturns || hddReturns);
        setMarginwithGST(
          parseInt(pricingData?.marginWithGST) -
            parseInt(pricingData?.hddReturns) || marginwithGST
        );
        setLogisticsValue(pricingData?.logisticsValue || logisticsValue);
        setPackagesValue(pricingData?.packagesValue || packagesValue);
        setPLTotalValue(pricingData?.logisticsPackages || PLTotalValue);
        setMarginType(pricingData?.marginType || marginType);
        setBpPercentage(pricingData?.marginTypePercentage || bpPercentage);
        setReferenceName(pricingData?.referenceName || referenceName);
        setTierFinalValue(pricingData?.tierFinalValue || tierFinalValue);
        setAdpValue(pricingData?.adpAmount || adpValue);
        setBagValue(pricingData?.bagAmount || bagValue);
        setMarginName(pricingData?.marginName || marginName);
        setMarginTierPercentage(
          pricingData?.marginPercentage || marginTierPercentage
        );
        setLaptopAdditionalAmount(
          pricingData?.additionalAmount || laptopAdditionalAmount
        );
        setLaptopWarrantyAmount(
          pricingData?.laptopWarrantyAmount || laptopWarrantyAmount
        );
        setDiscount(pricingData?.discountAmount || discount);
        setLoptopWarranty(pricingData?.laptopWarranty || laptopWarranty);

        const prices = {};
        const descriptions = {};
        const types = {};
        const uniqueTypes = new Set();
        const quantities = {};
        const id = {};
        variants.forEach((variant) => {
          prices[variant.varientType] = variant.varientPrice;
          descriptions[variant.varientType] = variant.varientDescription;
          types[variant.varientType] = variant.varientName; // Assuming you want to store the name as well
          uniqueTypes.add(variant.varientType);
          quantities[variant.varientType] = 1;
          id[variant.varientType] = variant.id;
        });
        const field = Array.from(uniqueTypes);
        setPrices(prices);
        setDescriptions(descriptions);
        setSelections(types);
        setModelFiled(field);
        setQuantities(quantities);
        setIdvalue(id);
      } catch (e) {
        console.log(e);
      }
    } else {
      setPrices(initialState);
      setDescriptions(initialState);
      setSelections(initialState);
      setModelFiled("");
      setQuantities(initialState);
      setTierFinalValue("");
      setMarginwithGST("");
      setIdvalue(initialState);
      setPLTotalValue(0);
    }
  };

  const finalAmount =
    marginwithGST &&
    parseInt(marginwithGST ? marginwithGST : 0) +
      parseInt(hddReturns ? hddReturns : 0) +
      parseInt(laptopAdditionalAmount ? laptopAdditionalAmount : 0);

  const DiscountPrice = finalAmount - parseInt(discount ? discount : 0);

  const handleSubmit = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const selectedIdsAndQuantities = Object.keys(idvalue).map((field) => {
      const data = qty[field] ? qty[field] : 1;
      const idVal = idvalue[field];
      return {
        id: parseInt(idVal),
        descriptions: descriptions[field],
        price: prices[field] / data,
        qty: data,
        Name: selections[field],
      };
    });
    const finalAmount1 = finalAmount.toString();
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    const dataToSubmit = {
      data: selectedIdsAndQuantities,
      warrantyInfo: parseInt(warrantyInfo),
      warrantyAmount: parseInt(warrantyAmount),
      laptopWarranty: parseInt(laptopWarranty),
      laptopWarrantyAmount: parseInt(laptopWarrantyAmount),
      createdBy:
        storedUserData &&
        `${storedUserData.userName} (${storedUserData.email})`,
      addressTo: addressTo,
      productsQuantity: parseInt(productTotalQty),
      referenceName: referenceName,
      logisticsPackages: PLTotalValue,
      gstPercentage: "",
      marginPercentage: marginTierPercentage.toString(),
      marginName: marginName,
      marginAmount:
        marginPercentageAmount && Math.round(marginPercentageAmount),
      logisticsValue: logisticsValue,
      packagesValue: packagesValue,
      bagAmount: parseInt(bagValue),
      adpAmount: parseInt(adpValue),
      additionalAmount: parseInt(laptopAdditionalAmount),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: parseInt(totalPriceWithPLQ.toFixed(2)),
      totalAmountWithGST: finalPrice,
      totalAmountWithmargin:
        marginWithTotalAmount && Math.round(marginWithTotalAmount),
      marginType: marginType,
      marginTypePercentage: bpPercentage,
      marginwithGST: finalAmount1,
      tierFinalValue: tierFinalValue,
      hddReturns: parseInt(hddReturns),
      dealID: parseInt(DealID),
      discountAmount: discount,
      totalDiscountPrice: DiscountPrice,
      isDeal: {
        Int64: 1,
        Valid: true,
      },
    };
    // type === "GEM" && setPricingAmount(tierFinalValue);
    setPricingAmount(tierFinalValue);
    setAllPricingData(dataToSubmit);
    console.log("data", dataToSubmit);
  };

  const allDataFilled = modelFiled
    ? modelFiled.every((field) => {
        return selections[field]
          ? selections[field]
          : "" && prices[field]
          ? prices[field]
          : "" && descriptions[field]
          ? descriptions[field]
          : "" && idvalue[field]
          ? idvalue[field]
          : "";
      })
    : Object.keys(initialState).every((field) => {
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

  const totalProductPrice = Object.keys(selections).reduce((total, field) => {
    const price = prices[field] !== undefined ? prices[field] : 0;
    return total + quantities[field] * price;
  }, 0);

  const totalPriceWithPLQ =
    totalProductPrice &&
    totalProductPrice * productTotalQty +
      parseInt(PLTotalValue ? PLTotalValue : 0);

  const marginPercentageAmount =
    totalPriceWithPLQ * (marginTierPercentage / 100);

  const marginWithTotalAmount = marginPercentageAmount
    ? totalPriceWithPLQ + marginPercentageAmount
    : 0;

  const gstAmount = marginWithTotalAmount * (0.18 / 100);

  const finalPrice = parseInt(gstAmount) + parseInt(marginWithTotalAmount);

  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box
          sx={{
            width: "100%",
            padding: "0px 20px 20px 0px",
            height: "99%",
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "4px", // Adjust the width of the scrollbar
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#d6d6d6",
              borderRadius: "10px",
              marginLeft: 10,
            },
          }}
        >
          <Box sx={{ pt: 2 }}>
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

              <Grid item xs={3}>
                <TextField
                  id="address_to"
                  label="Customer Name"
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
                  label="Reference Number"
                  fullWidth
                  value={referenceName}
                  onChange={(e) => {
                    handleReference(e.target.value);
                  }}
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
          </Box>

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
                    : Object.keys(createInitialState(selectedComponent)).map(
                        (field, index) => {
                          return renderFields(field, index);
                        }
                      )}
                  {additionalFields &&
                    additionalFields
                      .filter((f) => f.startsWith("accessories"))
                      .map((field, index) =>
                        renderFields(
                          field,
                          Object.keys(createInitialState(selectedComponent))
                            .length + index,
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
                      <b>Sub Total</b>:
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
                    type="add1"
                    marginListType={marginListType}
                    setMarginListType={setMarginListType}
                    marginTypeData={marginTypeData}
                    setMarginTypeData={setMarginTypeData}
                    setMarginName={setMarginName}
                    setMarginTierPercentage={setMarginTierPercentage}
                  />
                  {product === "Laptop" && (
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
                          <b>Additional Amount :</b>
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        {laptopAdditionalAmount &&
                          parseInt(laptopAdditionalAmount.toFixed(2))}
                        <span
                          onClick={() => {
                            setLaptopDialog(true);
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
                          {laptopAdditionalAmount ? "Edit" : "Add"}
                        </span>
                      </TableCell>
                    </TableRow>
                  )}

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
                        <b>Add Discount:</b>
                        <TextField
                          style={{ marginLeft: 8 }}
                          value={discount}
                          onChange={handleDiscountChange}
                          inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-99]",
                          }} // this ensures the numeric keyboard on mobile
                        />
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      {DiscountPrice ? DiscountPrice : finalAmount}
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
              {status !== "Negotiation" && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    handleBack();
                    setFindSelectedComponents(selectedComponent);
                  }}
                >
                  Back
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={
                  !(
                    allDataFilled &&
                    referenceName &&
                    productTotalQty &&
                    addressTo &&
                    finalAmount > 0
                  )
                }
              >
                Next
              </Button>
            </DialogActions>
          </div>
        </Box>
      </Box>
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
            {product !== "Laptop" && (
              <>
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
              </>
            )}
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
      <>
        <Dialog open={laptopDialog} maxWidth="xs" fullWidth>
          <DialogTitle>Additional Amount </DialogTitle>
          <DialogContent>
            <TextField
              id="adp"
              fullWidth
              label="ADP"
              type="number"
              margin="normal"
              value={adpValue}
              onChange={(e) => setAdpValue(e.target.value)}
            />

            <TextField
              id="bag"
              label="Bag"
              fullWidth
              type="number"
              margin="normal"
              value={bagValue}
              onChange={(e) => setBagValue(e.target.value)}
            />
            <TextField
              id="warranty"
              label="Warranty Year"
              fullWidth
              type="number"
              margin="normal"
              value={laptopWarranty}
              onKeyDown={handleKeyDown}
              onChange={handleLaptopWarrantyInfo}
            />
            <TextField
              id="warrantyAmount"
              label="Warranty Amount"
              fullWidth
              type="number"
              margin="normal"
              value={laptopWarrantyAmount}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setLaptopWarrantyAmount(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions sx={{ pb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setLaptopDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              // disabled={!packagesValue && !logisticsValue}
              variant="contained"
              onClick={() => {
                handleAdditonalDataSumbit();
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

export default Stepper2;
