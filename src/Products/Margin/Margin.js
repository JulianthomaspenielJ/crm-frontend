import React, { useState } from "react";
import MarginList from "./MarginList";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import MarginTypeList from "./MarginTypeList";

function Margin() {
  const [marginType, setMarginType] = useState("Margin");

  const handleChange = (e) => {
    setMarginType(e.target.value);
  };

  return (
    <>
      <FormControl>
        {/* <FormLabel id="demo-row-radio-buttons-group-label">Margin</FormLabel> */}
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={marginType}
          onChange={handleChange}
        >
          <FormControlLabel value="Margin" control={<Radio />} label="Margin" />
          <FormControlLabel
            value="MarginTypes"
            control={<Radio />}
            label="Margin Types"
          />
        </RadioGroup>
      </FormControl>

      {marginType === "Margin" ? <MarginList /> : <MarginTypeList />}
    </>
  );
}

export default Margin;
