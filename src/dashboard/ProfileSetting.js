import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  Slide,
  Avatar,
} from "@mui/material";import EditIcon from "@mui/icons-material/Edit";
import AuthService from "../services/AuthService";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CRMBaseURL = AuthService();
function ProfileSetting({ openProfile, setOpenProfile, loginUserData }) {
  const [avatarURL, setAvatarURL] = useState("");
  // const [signatureURL, setSignatureURL] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumberEdit, setMobileNumberEdit] = useState(false);
  
  useEffect(() => {
    if (loginUserData) {
      setAvatarURL(loginUserData.avatarURL || "");
    
      // setSignatureURL(loginUserData.SignatureURL || "");
      setMobileNumber(loginUserData.mobile || "");
    }
  }, [loginUserData]);

  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedImageURL = reader.result;
        setAvatarURL(uploadedImageURL);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async() => {
    const values = {
      name :loginUserData.name,
      email: loginUserData.email,
      mobile: mobileNumber,
      AvatarURL: avatarURL,
    };

    const res = await CRMBaseURL.post("updateuserdetails", values)
    const userNewData= res.data?.data

    if(loginUserData&&res){
      loginUserData.avatarURL = userNewData.AvatarURL;
      loginUserData.mobile = userNewData.mobile;
  
      
       const updatedUserData = JSON.stringify(loginUserData);
      
        localStorage.setItem('userData', updatedUserData);

    }

    setOpenProfile(false);
    setMobileNumberEdit(false);
    // setAvatarURL(loginUserData?.avatarURL);
    // setSignatureURL("");
  };

  return (
    <Dialog
      open={openProfile}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="md"
      fullWidth
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "20px 0px 20px 0px",
          }}
        >
          <div
            style={{
              borderRight: "1px solid black",
              width: "35%",
              marginRight: "3%",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <Typography sx={{ mb: 2 }}>
                <b>PROFILE SETTINGS</b>
              </Typography>
              <div>
                {loginUserData ? (
                  <Avatar src={avatarURL} sx={{ width: 150, height: 150 }} />
                ) : (
                  <Avatar
                    sx={{
                      width: 150,
                      height: 150,
                      bgcolor: "#224193",
                      textAlign: "center",
                      fontSize: 70,
                    }}
                  >
                    {loginUserData && loginUserData.name
                      ? loginUserData.name.charAt(0).toUpperCase()
                      : ""}
                  </Avatar>
                )}
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleProfileUpload}
                />
                <label htmlFor="avatar-upload">
                  <Button component="span">Upload Profile</Button>
                </label>
              </div>
            </div>
          </div>
          <div>
            <div style={{ paddingBottom: "15px" }}>
              <Typography>
                <b>Username</b>
              </Typography>
              <Typography>{loginUserData && loginUserData.name}</Typography>
            </div>
            <div style={{ paddingBottom: "15px" }}>
              <Typography>
                <b>Email</b>
              </Typography>
              <Typography>{loginUserData && loginUserData.email}</Typography>
            </div>
            <div style={{ paddingBottom: "15px" }}>
              <Typography>
                <b>Mobile Number</b>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setMobileNumberEdit(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Typography>

              {mobileNumberEdit ? (
                <TextField
                  variant="outlined"
                  label="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value);
                  }}
                />
              ) : (
                <Typography>{mobileNumber}</Typography>
              )}
            </div>
            <div style={{ paddingBottom: "15px" }}>
              <Typography>
                <b>Team</b>
              </Typography>
              <Typography>
                {loginUserData && loginUserData.team}
              </Typography>
            </div>
            <div style={{ paddingBottom: "15px" }}>
              <Typography>
                <b>Role</b>
              </Typography>
              <Typography>
                {loginUserData && loginUserData.userRole}
              </Typography>
            </div>
            <div style={{ paddingBottom: "15px" }}>
              <Typography>
                <b>Designation</b>
              </Typography>
              <Typography>
                {loginUserData && loginUserData.designation}
              </Typography>
            </div>
            <div style={{ padding: "15px 0px 10px 0px" }}>
              <Button
                variant="outlined"
                sx={{ marginRight: 2 }}
                onClick={() => {
                  setOpenProfile(false);
                  setMobileNumberEdit(false);
                  setAvatarURL(loginUserData?.avatarURL);
                  // setSignatureURL("");
                }}
              >
                Close
              </Button>
              {(mobileNumber !== (loginUserData && loginUserData.mobile) ||
                avatarURL !== (loginUserData && loginUserData.AvatarURL) ) && (
                <Button
                  variant="contained"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileSetting;
