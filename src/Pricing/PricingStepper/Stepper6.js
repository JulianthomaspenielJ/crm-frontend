import { Box, Button, Typography, IconButton, Grid } from "@mui/material";
import React, { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Stepper6({
  allQuotation,
  setAllQuotation,
  handleFinish,
}) {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfBase64s, setPdfBase64s] = useState([]);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);

  const handleRemoveFile = (index) => {
    if (allQuotation[index]) {
      URL.revokeObjectURL(allQuotation[index]);
    }

    const updatedFiles = pdfFiles.filter((_, i) => i !== index);
    const updatedBase64s = pdfBase64s.filter((_, i) => i !== index);
    const updatedQuotations = allQuotation.filter((_, i) => i !== index);

    setPdfFiles(updatedFiles);
    setPdfBase64s(updatedBase64s);
    setAllQuotation(updatedQuotations);

    if (currentPdfIndex >= updatedQuotations.length) {
      setCurrentPdfIndex(Math.max(updatedQuotations.length - 1, 0));
    }
  };

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prevIndex) =>
      prevIndex < allQuotation.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  return (
    <Box
      sx={{
        marginTop: 2,
        border: "1px solid black",
        paddingX: 5,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#d6d6d6",
          borderRadius: "10px",
        },
      }}
    >
      <Grid item xs={12}>
        {allQuotation.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Button
                onClick={handlePreviousPdf}
                disabled={currentPdfIndex === 0}
                startIcon={<ArrowBackIosIcon />}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>
                  Quotation {currentPdfIndex + 1} of {allQuotation.length}:
                </strong>
                <IconButton
                  sx={{ fontSize: 20, color: "#322E6F", ml: 1 }}
                  onClick={() => handleRemoveFile(currentPdfIndex)}
                >
                  <DeleteIcon />
                </IconButton>
              </Typography>
              <Button
                onClick={handleNextPdf}
                disabled={currentPdfIndex === allQuotation.length - 1}
                endIcon={<ArrowForwardIosIcon />}
              >
                Next
              </Button>
            </Box>
            <embed
              src={allQuotation[currentPdfIndex]}
              type="application/pdf"
              width="100%"
              height="670px"
            />
          </Box>
        )}
      </Grid>
      <div style={{ textAlign: "end", padding: "20px 100px 50px 0px" }}>
        
        <Button
          align="end"
          variant="contained"
          onClick={() => {
            handleFinish();
          }}
        >
          Finish
        </Button>
      </div>
    </Box>
  );
}
