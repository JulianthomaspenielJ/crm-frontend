import React, { useEffect, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import Stepper1 from "./Stepper1";
import Stepper2 from "./Stepper2";
import Stepper3 from "./Stepper3";
import Stepper4 from "./Stepper4";
import Stepper5 from "./Stepper5";
import Stepper6 from "./Stepper6";
import AuthService from "../../services/AuthService";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import { isEqual } from "lodash";
import PreviousStepper1 from "./PreviousStepper1";
import PreviousStepper2 from "./PreviousStepper2";

function PricingStepper({
  setOpenPricing,
  fetchDeals,
  id,
  product,
  CustomerName,
  CustomerAddress,
  CustomerMobile,
  CustomerEmail,
  SalesOwnerEmail,
  status,
  modelName,
  pdfPreviewUrl,
  Ticket,
}) {
  const [selectedComponents, setSelectedComponents] = useState([]);
  const initialState = selectedComponents.reduce((obj, key) => {
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
  const initialOptions = selectedComponents.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {});

  const [activeStep, setActiveStep] = useState(
    status === "Negotiation" ? 3 : 0
  );

  const CRMBaseURL = AuthService();

  // State Initialization
  const [pricingID, setPricingID] = useState("");
  const [allPricingData, setAllPricingData] = useState("");
  const [downloadData, setDownloadData] = useState();
  const [pdfPreviewUrlsGEM, setPdfPreviewUrlsGEM] = useState([]);
  const [allQuotation, setAllQuotation] = useState([]);
  const [allProductData, setAllProductData] = useState("");
  const [additionalFields, setAdditionalFields] = useState([]);
  const [findSelectedComponents, setFindSelectedComponents] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [dataSheet, setDataSheet] = useState("");
  const [modelFiled, setModelFiled] = useState([]);
  const [isSkip, setIsSkip] = useState(false);
  const [pricingAmount, setPricingAmount] = useState("");

  const createInitialState = (selectedComponents) => {
    return selectedComponents.reduce((obj, key) => {
      let value = "";

      // Initialize with specific conditions if needed, otherwise default to empty
      if (
        key.toLowerCase() === "keyboard" ||
        key.toLowerCase() === "all in one pc"
      ) {
        value = "";
      } else {
        value = "";
      }
      return {
        ...obj,
        [key.toLowerCase()]: value,
      };
    }, {});
  };

  const [selections, setSelections] = useState(
    createInitialState(selectedComponents)
  );
  const [prices, setPrices] = useState(createInitialState(selectedComponents));
  const [descriptions, setDescriptions] = useState(
    createInitialState(selectedComponents)
  );
  const [idvalue, setIdvalue] = useState(
    createInitialState(selectedComponents)
  );
  const [quantities, setQuantities] = useState(
    createInitialState(selectedComponents)
  );

  const [packagesValue, setPackagesValue] = useState();
  const [logisticsValue, setLogisticsValue] = useState();
  const [PLTotalValue, setPLTotalValue] = useState(0);
  const [productTotalQty, setProductTotalQty] = useState(1);
  const [referenceName, setReferenceName] = useState("");
  const [addressTo, setAddressTo] = useState(CustomerName || "");
  const [warrantyInfo, setWarrantyInfo] = useState("3");
  const [warrantyAmount, setWarrantyAmount] = useState(0);
  const [marginType, setMarginType] = useState("");
  const [bpPercentage, setBpPercentage] = useState("");
  const [tierFinalValue, setTierFinalValue] = useState("");
  const [options, setOptions] = useState(
    createInitialState(selectedComponents)
  );
  const [hddReturns, setHddReturns] = useState("");
  const [discount, setDiscount] = useState("");
  const [marginwithGST, setMarginwithGST] = useState("");
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

  const [marginListType, setMarginListType] = useState([]);
  const [marginTypeData, setMarginTypeData] = useState([]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const steps = [
    "Data Sheet Form",
    "Data Sheet",
    "Product List",
    "Pricing",
    "Term & Conditions",
    "Pricing Quotation",
    "Other Quotations",
    "Final Quotations",
  ];

  const margin = (data) => {
    if (!isEqual(findSelectedComponents, data)) {
      setTierFinalValue("");
      setMarginwithGST("");
      
    }
  };

  const updateState = (prev, selectedComponents, newState) => {
    const updatedState = { ...prev };

    // Add new components
    selectedComponents.forEach((component) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          updatedState,
          component.toLowerCase()
        )
      ) {
        updatedState[component.toLowerCase()] =
          newState[component.toLowerCase()];
      }
    });
    // Remove components not in the selectedComponents array
    Object.keys(updatedState).forEach((key) => {
      if (!selectedComponents.map((comp) => comp.toLowerCase()).includes(key)) {
        delete updatedState[key];
      }
    });

    Object.keys(updatedState).forEach((key) => {
 
      if (!key.startsWith("accessories")) {
        // updatedState[key] = "";
        setAdditionalFields("");
      }
    });

    return updatedState;
  };


  useEffect(()=>{
    if(pdfPreviewUrl&&status==="Negotiation"){
    const data = URL.createObjectURL(pdfPreviewUrl[0])
    setDataSheet(data)
      }
  },[pdfPreviewUrl])



  useEffect(() => {
    const newState = createInitialState(selectedComponents);

    setSelections((prev) => updateState(prev, selectedComponents, newState));
    setPrices((prev) => updateState(prev, selectedComponents, newState));
    setDescriptions((prev) => updateState(prev, selectedComponents, newState));
    setIdvalue((prev) => updateState(prev, selectedComponents, newState));
    setQuantities((prev) => updateState(prev, selectedComponents, newState));
  }, [selectedComponents]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

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

  useEffect(() => {
    setReferenceName(previewData?.modelNumber);
  }, [previewData]);

  useEffect(() => {
    setReferenceName(modelName);
  }, [modelName]);

  const handleFinish = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (allQuotation.length === 0) {
      alert("Please upload at least one PDF file");
      return;
    }

    try {
      const response = await CRMBaseURL.post("productsdata", allPricingData);
      setPricingID(response.data?.data);
    } catch (err) {
      console.error("Error occurred while submitting", err);
    }

    const base64Promises = allQuotation.map((url) =>
      convertBlobUrlToBase64(url)
    );
    const base64Strings = await Promise.all(base64Promises);

    const values = {
      quotations: base64Strings,
      id: id,
      pricingAmount: pricingAmount,
      pricingID: parseInt(pricingID),
      quotationUpdaterID: storedUserData
        ? parseInt(storedUserData.id, 10)
        : null,
      quotationUpdaterName: storedUserData ? storedUserData.userName : null,
    };
    try {
      const res = await CRMBaseURL.post("updatequotation", values);
      alert("PDF uploaded successfully");
    } catch (err) {
      console.error("Error uploading PDF:", err);
      alert("Failed to upload PDF");
    }
    setOpenPricing(false);
    fetchDeals();
  };

  // Import content components based on the active step
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <PreviousStepper1
            setActiveStep={setActiveStep}
            setSelectedComponents={setSelectedComponents}
            allProductData={allProductData}
            setAllProductData={setAllProductData}
            margin={margin}
            handleNext={handleNext}
            handleBack={handleBack}
            DealID={id}
            previewData={previewData}
            setPreviewData={setPreviewData}
            dataSheet={dataSheet}
            setDataSheet={setDataSheet}
            allQuotation={allQuotation}
            setAllQuotation={setAllQuotation}
            product={product}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            holowareValues={""}
          />
        );
      case 1:
        return (
          <PreviousStepper2
            setActiveStep={setActiveStep}
            setSelectedComponents={setSelectedComponents}
            allProductData={allProductData}
            setAllProductData={setAllProductData}
            margin={margin}
            handleNext={handleNext}
            handleBack={handleBack}
            DealID={id}
            previewData={previewData}
            setPreviewData={setPreviewData}
            dataSheet={dataSheet}
            setDataSheet={setDataSheet}
          />
        );
      case 2:
        return (
          <Stepper1
            setActiveStep={setActiveStep}
            setSelectedComponents={setSelectedComponents}
            allProductData={allProductData}
            setAllProductData={setAllProductData}
            margin={margin}
            handleBack={handleBack}
            DealID={id}
            product={product}
            handleNext={handleNext}
          />
        );
      case 3:
        return (
          <Stepper2
            setActiveStep={setActiveStep}
            selectedComponent={selectedComponents}
            handleBack={handleBack}
            setPricingID={setPricingID}
            selections={selections}
            setSelections={setSelections}
            prices={prices}
            setPrices={setPrices}
            descriptions={descriptions}
            setDescriptions={setDescriptions}
            idvalue={idvalue}
            setIdvalue={setIdvalue}
            quantities={quantities}
            setQuantities={setQuantities}
            initialState={initialState}
            packagesValue={packagesValue}
            setPackagesValue={setPackagesValue}
            logisticsValue={logisticsValue}
            setLogisticsValue={setLogisticsValue}
            PLTotalValue={PLTotalValue}
            setPLTotalValue={setPLTotalValue}
            productTotalQty={productTotalQty}
            setProductTotalQty={setProductTotalQty}
            referenceName={referenceName}
            setReferenceName={setReferenceName}
            addressTo={addressTo}
            setAddressTo={setAddressTo}
            warrantyInfo={warrantyInfo}
            setWarrantyInfo={setWarrantyInfo}
            warrantyAmount={warrantyAmount}
            setWarrantyAmount={setWarrantyAmount}
            marginType={marginType}
            setMarginType={setMarginType}
            bpPercentage={bpPercentage}
            setBpPercentage={setBpPercentage}
            tierFinalValue={tierFinalValue}
            setTierFinalValue={setTierFinalValue}
            options={options}
            setOptions={setOptions}
            hddReturns={hddReturns}
            discount={discount}
            setDiscount={setDiscount}
            setHddReturns={setHddReturns}
            marginwithGST={marginwithGST}
            setMarginwithGST={setMarginwithGST}
            qty={qty}
            setQty={setQty}
            singleProductPrice={singleProductPrice}
            setSingleProductPrice={setSingleProductPrice}
            additionalFields={additionalFields}
            setAdditionalFields={setAdditionalFields}
            setAllPricingData={setAllPricingData}
            marginListType={marginListType}
            setMarginListType={setMarginListType}
            marginTypeData={marginTypeData}
            setMarginTypeData={setMarginTypeData}
            setFindSelectedComponents={setFindSelectedComponents}
            createInitialState={createInitialState}
            DealID={id}
            previewData={previewData}
            modelFiled={modelFiled}
            setModelFiled={setModelFiled}
            CustomerName={CustomerName}
            product={product}
            setPricingAmount={setPricingAmount}
            modelName={modelName}
            status={status}
          />
        );
      case 4:
        return (
          <Stepper3
            setActiveStep={setActiveStep}
            setDownloadData={setDownloadData}
            pricingID={pricingID}
            handleBack={handleBack}
            allPricingData={allPricingData}
            DealID={id}
          />
        );
      case 5:
        return (
          <Stepper4
            downloadData={downloadData}
            handleNext={handleNext}
            allQuotation={allQuotation}
            setAllQuotation={setAllQuotation}
            handleBack={handleBack}
            DealID={id}
            pdfBlobUrl={pdfBlobUrl}
            setPdfBlobUrl={setPdfBlobUrl}
            CustomerAddress={CustomerAddress}
            CustomerMobile={CustomerMobile}
            CustomerEmail={CustomerEmail}
            SalesOwnerEmail={SalesOwnerEmail}
            Ticket={Ticket}
          />
        );
      case 6:
        return (
          <Stepper5
            handleNext={handleNext}
            pdfPreviewUrlsGEM={pdfPreviewUrlsGEM}
            setPdfPreviewUrlsGEM={setPdfPreviewUrlsGEM}
            setAllQuotation={setAllQuotation}
            handleBack={handleBack}
            allPricingData={allPricingData}
            DealID={id}
            dataSheet={dataSheet}
            pdfBlobUrl={pdfBlobUrl}
            status={status}
          />
        );
      case 7:
        return (
          <Stepper6
            allQuotation={allQuotation}
            setAllQuotation={setAllQuotation}
            handleFinish={handleFinish}
            DealID={id}
            TotalPrice={pricingAmount}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ width: "100%", px: 2, height: "100%" }}>
      <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 600 }}>
        <Tooltip title="Skip">
          <IconButton
            onClick={() => {
              setIsSkip(true);
            }}
          >
            <ArrowCircleLeftIcon sx={{ fontSize: 30, color: "#e02b6a" }} />
          </IconButton>
        </Tooltip>
        {steps[activeStep]} Preview
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
          height: "88%",
          width: "100%",
        }}
      >
        {activeStep === steps.length ? (
          <Box>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: "100%", height: "100%" }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {getStepContent(activeStep)}
            </Box>
          </Box>
        )}
      </Box>

      <Dialog
        open={isSkip}
        fullWidth
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to leave this stepper?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsSkip(false);
            }}
            variant="outlined"
          >
            No
          </Button>
          <Button
            onClick={() => {
              setOpenPricing(false);
            }}
            autoFocus
            variant="contained"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PricingStepper;
