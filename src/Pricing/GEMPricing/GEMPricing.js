import { Box} from "@mui/material";
import React, {  useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import TextfieldData from "./TextfieldData";
import SelectCertificate from "./SelectCertificate";
import Pricing from "./Pricing";

const steps = [
  { label: "Enter Details", Icon: CheckCircleIcon, color: "blue" },
  { label: "Pricing", Icon: AttachMoneyIcon, color: "green" },
  { label: "Certificate Selection", Icon: DescriptionIcon, color: "purple" },
];

function GEMPricing({
  setOpenPricing,
  fetchDeals,
  gemID,
  gemUrl,
  gemNumber,
  CustomerName,
  partnerName,
  partnerAddress,
  partnerEmail,
  partnerMobile,
  product,
  GEMDate,
  Ticket,
  Email,
}) {
  const [activePage, setActivePage] = useState(0);
  const storedItems = JSON.parse(localStorage.getItem("GEMData")) || {};
  return (  
    <div style={{ width: "100%", height: "100%", padding: 2 }}>
      <Box sx={{ width: "100%", paddingBottom: 3 }}>
        <Stepper activeStep={activePage} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <step.Icon
                    sx={{ color: activePage === index ? step.color : "gray" }}
                  />
                )}
              >
                <span
                  style={{
                    color: activePage === index ? step.color : "inherit",
                  }}
                >
                  {step.label}
                </span>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {activePage === 0 ? (
        <TextfieldData
          gemUrl={gemUrl}
          gemID={gemID}
          product={product}
          setActivePage={setActivePage}
          activePage={activePage}
        />
      ) : activePage === 1 ? (
        <Pricing
          gemID={gemID}
          CustomerName={CustomerName}
          setActivePage={setActivePage}
          activePage={activePage}
          modelNumber={storedItems[gemID]?.modelNumber}
        />
      ) : activePage === 2 ? (
        <SelectCertificate
          gemID={gemID}
          partnerName={partnerName}
          partnerAddress={partnerAddress}
          partnerEmail={partnerEmail}
          partnerMobile={partnerMobile}
          gemNumber={gemNumber}
          GEMDate={GEMDate}
          product={product}
          fetchDeals={fetchDeals}
          setOpenPricing={setOpenPricing}
          Ticket={Ticket}
          Email={Email}
          CustomerName={CustomerName}
        />
      ) : null}
    </div>
  );
}

export default GEMPricing;
