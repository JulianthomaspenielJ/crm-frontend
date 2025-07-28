import {Divider, Typography } from "@mui/material";
import React from "react";
import HolowareImg from "../Image/HWLogo.png";
import "./Thankyou.css";

function Thankyou() {
  return (
    <div className="container">
      <div sx={{ textAlign: "center", px: 10, py: 8 }} className="card_thanks_container">
        <div>
          <img src={HolowareImg} style={{ width: 300, height: 55 }} alt="" />
        </div>
        <Divider sx={{marginX:15,marginY:2}}/>

        <Typography sx={{ py: 2 }}>
          You're welcome! Have a great day!{" "}
        </Typography>
        <Typography sx={{ pb: 2 }}>
          Your account is created successfully to the Holoware CRM.{" "}
        </Typography>
        <Typography sx={{ pb: 2 }}>Wait for a while until the Admin approve your request</Typography>
      </div>
    </div>
    // <div>You're welcome! If you have any other questions in the future, feel free to ask. Have a great day! Logging out now.</div>
  );
}

export default Thankyou;
