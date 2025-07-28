import { Button } from "@mui/material";
import React from "react";

const PdfViewer = ({ dataSheet, handleNext, handleBack, previewData }) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {dataSheet && (
        <div style={{ padding: "15px 0px" }}>
          <iframe src={dataSheet} width="100%" height="680px" />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            handleBack();
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleNext();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PdfViewer;

