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
import Compliance from "./Certificates/Compliance";
import MAFCertificate from "./MAFCertificate";
import MIICertificate from "./MIICertificate";
import WarrantyCertificate from "./WarrantyCertificate";
import GenuineCertificate from "./GenuineCertificate";
import MRPCertificate from "./MRPCertificate";

function GEMPricingStepper({
  setOpenPricing,
  fetchDeals,
  id,
  gemUrl,
  gemNumber,
  CustomerName,
  partnerName,
  partnerAddress,
  partnerEmail,
  partnerMobile,
  product,
  GEMDate,
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

  const [activeStep, setActiveStep] = useState(0);

  const CRMBaseURL = AuthService();
  const [pricingID, setPricingID] = useState("");
  const [allPricingData, setAllPricingData] = useState("");
  const [downloadData, setDownloadData] = useState();
  const [pdfPreviewUrls, setPdfPreviewUrls] = useState([]);
  const [pdfPreviewUrlsGEM, setPdfPreviewUrlsGEM] = useState([]);
  const [allQuotation, setAllQuotation] = useState([]);
  const [allProductData, setAllProductData] = useState("");
  const [additionalFields, setAdditionalFields] = useState([]);
  const [findSelectedComponents, setFindSelectedComponents] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [dataSheet, setDataSheet] = useState("");

  //Certificate Datas

  const [MAFData, setMAFData] = useState("");
  const [MIIData, setMIIData] = useState("");
  const [warrantyData, setWarrantyData] = useState("");
  const [GenuineData, setGenuineData] = useState("");
  const [MRPData, setMRPData] = useState("");
  const [MAFCertificatee, setMAFCertificatee] = useState("");
  const [MIICertificatee, setMIICertificatee] = useState("");
  const [warrantyCertificate, setWarrantyCertificate] = useState("");
  const [GenuineCertificatee, setGenuineCertificatee] = useState("");
  const [MRPCertificatee, setMRPCertificatee] = useState("");
  const [complianceCertificate, setComplianceCertificate] = useState("");
  const [pricingAmount, setPricingAmount] = useState(0);
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

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

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

  const [isSkip, setIsSkip] = useState(false);
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
  const [modelFiled, setModelFiled] = useState([]);
  const [options, setOptions] = useState(
    createInitialState(selectedComponents)
  );
  const [hddReturns, setHddReturns] = useState("");
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
  const [uploadedImage, setUploadedImage] = useState(null);

  const steps = [
    "Compliance",
    "MAF certificate",
    "MII certificate",
    "Data Sheet Form",
    "Data Sheet",
    "Product List",
    "Pricing",
    "Term & Conditions",
    "Pricing Quotation",
    "Warranty Certificate",
    "Genuine Certificate",
    "MRP Certificate",
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


  const handleFinish = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (allQuotation.length === 0) {
      alert("Please upload at least one PDF file");
      return;
    }

    const base64Promises = allQuotation.map((url) =>
      convertBlobUrlToBase64(url)
    );
    const base64Strings = await Promise.all(base64Promises);

    const values = {
      quotations: base64Strings,
      id: id,
      pricingID: parseInt(pricingID),
      quotationUpdaterID: storedUserData
        ? parseInt(storedUserData.id, 10)
        : null,
      quotationUpdaterName: storedUserData ? storedUserData.userName : null,
    };
    const allPricingDatas = {
      ...allPricingData,
      dealID: id,
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


  useEffect(() => {
    setReferenceName(MIIData?.model);
  }, [MIIData]);

  // Import content components based on the active step
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Compliance
            handleNext={handleNext}
            handleBack={handleBack}
            setComplianceCertificate={setComplianceCertificate}
            gemUrl={gemUrl}
            setHolowareValues={setHolowareValues}
          />
        );
      case 1:
        return (
          <MAFCertificate
            handleNext={handleNext}
            handleBack={handleBack}
            gemNumber={gemNumber}
            MAFData={MAFData}
            setMAFData={setMAFData}
            setMAFCertificatee={setMAFCertificatee}
            holowareValues={holowareValues}
            partnerName={partnerName}
            partnerAddress={partnerAddress}
            product={product}
            GEMDate={GEMDate}
            
          />
        );
      case 2:
        return (
          <MIICertificate
            handleNext={handleNext}
            handleBack={handleBack}
            gemNumber={gemNumber}
            MIIData={MIIData}
            setMIIData={setMIIData}
            setMIICertificatee={setMIICertificatee}
            holowareValues={holowareValues}
            CustomerName={CustomerName}
            GEMDate={GEMDate}
          />
        );
      case 3:
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
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            modelNumber={MIIData?.model}
            type="GEM"
            product={product}
            holowareValues={holowareValues}
          />
        );
      case 4:
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
      case 5:
        return (
          <Stepper1
            setActiveStep={setActiveStep}
            setSelectedComponents={setSelectedComponents}
            allProductData={allProductData}
            setAllProductData={setAllProductData}
            margin={margin}
            handleBack={handleBack}
            handleNext={handleNext}
            DealID={id}
            product={product}
          />
        );
      case 6:
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
            setPricingAmount={setPricingAmount}
            product={product}
            type="GEM"
           
          />
        );
      case 7:
        return (
          <Stepper3
            setActiveStep={setActiveStep}
            setDownloadData={setDownloadData}
            pricingID={pricingID}
            handleBack={handleBack}
            allPricingData={allPricingData}
            DealID={id}
            modelNumber={MIIData?.model}
          />
        );
      case 8:
        return (
          <Stepper4
            downloadData={downloadData}
            handleNext={handleNext}
            allQuotation={allQuotation}
            setAllQuotation={setAllQuotation}
            handleBack={handleBack}
            DealID={id}
            setPdfBlobUrl={setPdfBlobUrl}
            CustomerName={partnerName}
            CustomerAddress={partnerAddress}
            CustomerMobile={partnerMobile}
            CustomerEmail={partnerEmail}
          />
        );
      case 9:
        return (
          <WarrantyCertificate
            handleNext={handleNext}
            handleBack={handleBack}
            gemNumber={gemNumber}
            warrantyData={warrantyData}
            setWarrantyData={setWarrantyData}
            setWarrantyCertificate={setWarrantyCertificate}
            modelNumber={MIIData?.model}
            holowareValues={holowareValues}
            GEMDate={GEMDate}
          />
        );
      case 10:
        return (
          <GenuineCertificate
            handleNext={handleNext}
            handleBack={handleBack}
            gemNumber={gemNumber}
            GenuineData={GenuineData}
            setGenuineData={setGenuineData}
            setGenuineCertificatee={setGenuineCertificatee}
            modelNumber={MIIData?.model}
            GEMDate={GEMDate}
          />
        );
      case 11:
        return (
          <MRPCertificate
            handleNext={handleNext}
            handleBack={handleBack}
            gemNumber={gemNumber}
            MRPData={MRPData}
            setMRPData={setMRPData}
            setMRPCertificatee={setMRPCertificatee}
            pricingAmount={pricingAmount}
            modelNumber={MIIData?.model}
            
          />
        );
      case 12:
        return (
          <Stepper5
            handleNext={handleNext}
            pdfPreviewUrlsGEM={pdfPreviewUrlsGEM}
            setPdfPreviewUrlsGEM={setPdfPreviewUrlsGEM}
            setAllQuotation={setAllQuotation}
            handleBack={handleBack}
            allPricingData={allPricingData}
            DealID={id}
            MAFCertificatee={MAFCertificatee}
            MIICertificatee={MIICertificatee}
            warrantyCertificate={warrantyCertificate}
            GenuineCertificatee={GenuineCertificatee}
            MRPCertificatee={MRPCertificatee}
            dataSheet={dataSheet}
            pdfBlobUrl={pdfBlobUrl}
            complianceCertificate={complianceCertificate}
          />
        );
      case 13:
        return (
          <Stepper6
            allQuotation={allQuotation}
            setAllQuotation={setAllQuotation}
            handleFinish={handleFinish}
            DealID={id}
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

export default GEMPricingStepper;
