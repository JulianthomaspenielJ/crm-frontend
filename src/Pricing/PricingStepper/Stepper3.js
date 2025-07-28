import { Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import AuthService from "../../services/AuthService";

export default function Stepper3({
  setActiveStep,
  setDownloadData,
  pricingID,
  handleBack,
  allPricingData
}) {
  const CRMBaseURL = AuthService();
  const [description, setDescription] = useState(
    "*In the given price Wired Keyboard & Wired Mouse prices are included."
  );
  const [terms, setTerms] = useState(
    "* Billing through Authorized partners. * Delivered in 6-7 weeks. * 3 Years Onsite Warranty. * Price valid for 30 days only."
  );

  const [detailedProductData, setDetailedProductData] = useState();

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleTermsChange = (event) => {
    setTerms(event.target.value);
  };
  const fetchData = async () => {
    try {
      const response = await CRMBaseURL.post("postproduct", {
        id: parseInt(pricingID),
      });
      const detailedData = response.data.Data[0];
      setDetailedProductData({
        ...detailedData,
        referenceID: parseInt(pricingID),
      });
    } catch (err) {
      console.error("Error fetching components", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pricingID]);

  const handleSubmit = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const data = {
      ...allPricingData,
      description,
      terms,
      date: formattedDate,
    };
    setDownloadData(data);
    setDescription("");
    setTerms("");
  };
  return (
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
        <Button onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Button
          disabled={!terms || !description}
          variant="contained"
          onClick={() => {
            handleSubmit();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
