import {
  TableCell,
  TableRow,
  TextField,
  Typography,
  Box,
  Autocomplete,
  Grid,
  Popover,
  Tooltip,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AuthService from "../../../services/AuthService";

function MarginAmount({
  totalPriceWithPLQ,
  setMarginwithGST,
  marginType,
  setMarginType,
  bpPercentage,
  setBpPercentage,
  tierFinalValue,
  setTierFinalValue,
  type,
  marginListType,
  setMarginListType,
  marginTypeData,
  setMarginTypeData,
  setMarginName,setMarginTierPercentage
}) {
  const CRMBaseURL = AuthService();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (type === "edit") {
      handleChangeMarginType(null, marginType);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = () => {
    setMarginwithGST(tierFinalValue);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const fetchMarginTypeList = async () => {
    try {
      const res = await CRMBaseURL.get("getmargintabledata");
      setMarginListType(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching margin types:", err);
    }
  };

  useEffect(() => {
    fetchMarginTypeList();
  }, []);

  useEffect(() => {
    if (marginType) {
      handleChangeMarginType(null, marginType);
      if (type === "add") {
        setTierFinalValue("");
        setMarginwithGST("");
      }
    }
  }, [totalPriceWithPLQ]);

  const handleTierPercentageChange = (event) => {
    const value = event.target.value;
    setTierFinalValue(value);
    const data = marginTypeData.find(
      (data) => data.totalvalue && data.totalvalue.toFixed(2) === value
    );
     setMarginName(data?.tier);
     setMarginTierPercentage (data?.tierPercentage)
  };

  const handleChangeMarginType = async (e, value) => {
    setMarginTypeData([]);
    setMarginType(value);

    const matchedMargin = marginListType.find(
      (data) => data.marginType === value
    );

    const id = matchedMargin ? matchedMargin.id : null;

    try {
      const res = await CRMBaseURL.post("getmarginvaluesdata", { id });
      setBpPercentage(matchedMargin ? matchedMargin.bpPercentage : "");

      const data = res.data?.data;

      // Include T3 in the tier map for sorting
      const tierMap = { T1: 0, T2: 1, T3: 2, SRP: 3, MRP: 4 };
      const sortedData =
        data && data.sort((a, b) => tierMap[a.tier] - tierMap[b.tier]);
      let previousTotal1 = totalPriceWithPLQ;
      const totalMarginType =
        previousTotal1 * (matchedMargin.bpPercentage / 100) + previousTotal1;

      let previousTotal = totalMarginType;
      const results = [];

      sortedData &&
        sortedData.forEach((item) => {
          if (item.tier === "T1" && matchedMargin) {
            item.totalvalue =
              previousTotal * (item.tierPercentage / 100) + previousTotal;
          } else if (
            item.tier === "T2" &&
            results.find((result) => result.tier === "T1")
          ) {
            // Calculate T2 total value based on T1's total value
            const T1Total = results.find(
              (result) => result.tier === "T1"
            ).totalvalue;
            item.totalvalue = T1Total * (item.tierPercentage / 100) + T1Total;
          } else if (
            item.tier === "T3" &&
            results.find((result) => result.tier === "T2")
          ) {
            // Calculate T3 total value based on T2's total value
            const T2Total = results.find(
              (result) => result.tier === "T2"
            ).totalvalue;
            item.totalvalue = T2Total * (item.tierPercentage / 100) + T2Total;
          } else if (
            item.tier === "SRP" &&
            (results.find((result) => result.tier === "T3") || // Use T3 if available
              results.find((result) => result.tier === "T2")) // Fall back to T2
          ) {
            // Calculate SRP total value based on T3's or T2's total value
            const T3Total = results.find(
              (result) => result.tier === "T3"
            )?.totalvalue;

            const T2Total = results.find(
              (result) => result.tier === "T2"
            )?.totalvalue;

            // Use T3Total if it exists; otherwise, fall back to T2Total
            const baseTotal = T3Total !== undefined ? T3Total : T2Total;
            item.totalvalue =
              baseTotal * (item.tierPercentage / 100) + baseTotal;
          } else if (
            item.tier === "MRP" &&
            results.find((result) => result.tier === "SRP")
          ) {
            const GSTwithMRP = parseInt(item.tierPercentage + 18);
            // Calculate MRP total value based on SRP's total value
            const SRPTotal = results.find(
              (result) => result.tier === "SRP"
            ).totalvalue;
            item.totalvalue =
              SRPTotal * (parseInt(GSTwithMRP) / 100) + SRPTotal;
          }

          // Only add to results if totalvalue is defined
          if (item.totalvalue !== undefined) {
            results.push(item);
          }
        });

      setMarginTypeData(results || []);
    } catch (err) {
      console.error("Error fetching margin values:", err);
    }
  };

  return (
    <>
      <TableRow>
        {(type === "add" || type === "add1") && (
          <TableCell colSpan={1}></TableCell>
        )}

        <TableCell></TableCell>
        <TableCell align="right">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            gap={1}
          >
            <b>Margin + GST %</b>
          </Box>
        </TableCell>
        <TableCell align="left">
          {tierFinalValue ? tierFinalValue : "0.00"}
          <span
            aria-describedby={id}
            onClick={handleClick}
            style={{
              color: "#00E096",
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              border: "1px solid #00E096",
              padding: "2px 5px",
              borderRadius: 5,
              margin: "0 0 0 15px",
              cursor: "pointer",
            }}
          >
            {tierFinalValue ? "Edit" : "Add"}
          </span>
        </TableCell>
        {type === "edit" && <TableCell> </TableCell>}
      </TableRow>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <div style={{ width: "450px" }}>
          <Typography sx={{ pl: 2, pt: 2, fontSize: 16, fontWeight: 500 }}>
            Margin Amount
          </Typography>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <Tooltip
                title={
                  totalPriceWithPLQ
                    ? ""
                    : "First add the cost of products, logistics and packages"
                }
              >
                <Autocomplete
                  id="marginType1"
                  disabled={!totalPriceWithPLQ}
                  options={marginListType.map((data) => data.marginType)}
                  value={marginType}
                  onChange={handleChangeMarginType}
                  fullWidth
                  sx={{ my: 2 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Margin Type"
                      variant="outlined"
                    />
                  )}
                />
              </Tooltip>
              <Box sx={{ display: "flex", gap: 5, py: 1 }}>
                <Typography>SubTotal : {totalPriceWithPLQ}</Typography>
                <Typography>
                  {marginType &&
                    `${marginType ? marginType : ""} : ${
                      bpPercentage ? bpPercentage : ""
                    } %  `}
                </Typography>
              </Box>
              {marginTypeData.length > 0 && (
                <Box>
                  <Typography sx={{ pt: 2 }}>
                    <b>{`Select ${marginType} Type`}</b>
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-labelledby="radio-buttons-group-label"
                      name="radio-buttons-group"
                      value={tierFinalValue} // Controlled value
                      onChange={handleTierPercentageChange} // Pass the event
                    >
                      {marginTypeData.map((data) => (
                        <FormControlLabel
                          key={data.tierPercentage}
                          value={data.totalvalue && data.totalvalue.toFixed(2)} // Unique value for each option
                          control={<Radio />}
                          label={`${data.tier} ${data.tierPercentage} % ${
                            data.tier === "MRP" ? "+ GST 18 % " : ""
                          }  -  ${
                            data.totalvalue && data.totalvalue.toFixed(2)
                          }`}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}
              {tierFinalValue && (
                <Typography sx={{ fontSize: 14, fontWeight: 600, p: 2 }}>
                  Final Total : {tierFinalValue}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", p: 2, justifyContent: "end", gap: 2 }}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={!tierFinalValue || !marginType}
              variant="contained"
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </Button>
          </Box>
        </div>
      </Popover>
    </>
  );
}

export default MarginAmount;
