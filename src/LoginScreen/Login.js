import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import "./Login.css";
import GoogleIcon from "../Image/googleIcon.png";
import { Divider, Typography } from "@mui/material"; // Import external CSS file
import { useNavigate } from "react-router-dom";
import LoginErrDialog from "../DialogMsg/LoginErrDialog";
import HWLogo from "../Image/HWLogo.png";
import { motion } from "framer-motion";
import Loading from "../Loading/Loading";
import AuthService from "../services/AuthService";

function Login({ setLogined }) {
  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const [loginErrDialog, setLoginErrDialog] = useState(false);
  const [loginErrMsg, setLoginErrMsg] = useState();
  const [loading, setLoading] = useState(false);
  const SignUp = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);

      try {
        const tokenResponse = await CRMBaseURL.get(
          `auth/google/callback?code=${codeResponse.code}`
        );

        if (tokenResponse.data.error) {
          setLoginErrMsg(`Error: ${tokenResponse.data.error}`);
          setLoginErrDialog(true);
        } else {
          setLoginErrMsg(
            "Account created successfully! Now waiting for admin approval"
          );
          setLoginErrDialog(true);
          navigate("/thankyou");
        }
      } catch (error) {
        console.error("Error during authentication", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          // alert(`${error.response.data.error} `);
          setLoginErrMsg(`${error.response.data.error}`);
          setLoginErrDialog(true);
        } else {
          // alert("An error occurred during authentication.");
          setLoginErrMsg("An error occurred during authentication.");
          setLoginErrDialog(true);
        }
      }

      setLoading(false);
    },
    flow: "auth-code",
  });

  const login = () => {
    const userData = {
      name:'Yogeshwari N',
      email: "yogeshwari.n@holoware.co",
      team: "Admin",
      useRole: "Admin",
      mobile: "9876542313",
      createdAt: "2024-09-20 11:01:26",
      createdBy: "Arunkumar Ramdhass (arunkumar.r@holoware.co)",
      IsApproved:1
    };
    const userDataWithTokens = {
      ...userData,

      timestamp: new Date().getTime(),
    };
    localStorage.setItem("userData", JSON.stringify(userDataWithTokens));

    setLogined(true);
    navigate("/dashboard/screen");
  };

  //   const login = useGoogleLogin({
  //     onSuccess: async (codeResponse) => {
  //         setLoading(true);

  //         try {
  //             const tokenResponse = await CRMBaseURL.post(`userlogin`,{ code: codeResponse.code });

  //             if (tokenResponse.data.error) {
  //                 setLoginErrMsg(`Error: ${tokenResponse.data.error}`);
  //                 setLoginErrDialog(true);
  //             } else {
  //                 const accessToken = tokenResponse.data.token;
  //                 const refreshToken = tokenResponse.data.userData.refreshToken;
  //                 const userData = tokenResponse.data.userData;

  //                 const userDataWithTokens = {
  //                     ...userData,
  //                     accessToken,
  //                     refreshToken,
  //                     timestamp: new Date().getTime(),
  //                 };

  //                 localStorage.setItem("userData", JSON.stringify(userDataWithTokens));

  //                 setLogined(true);
  //                 navigate("/dashboard/screen");
  //             }
  //         } catch (error) {
  //             console.error("Error during authentication", error);
  //             setLoginErrMsg("An error occurred during authentication.");
  //             setLoginErrDialog(true);
  //         }
  //         setLoading(false);
  //     },
  //     flow: "auth-code",
  // });

  if (!loading) {
    return (
      <div className="main_login_container">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          sx={{
            paddingX: 10,
            paddingY: 6,
            textAlign: "center",
            borderRadius: 2,
          }}
          className="card_container"
        >
          <div
            sx={{
              paddingX: 10,
              paddingY: 6,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <div>
              <img
                src={HWLogo}
                style={{ width: "250px", height: "50px", paddingBottom: 20 }}
                alt="Holoware logo"
              />
            </div>

            <Typography variant="h6">
              <b>Let's get started</b>
            </Typography>

            <Typography sx={{ paddingTop: 1, paddingBottom: 2 }}>
              SignUp to our company and get start immediately
            </Typography>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="signup_login_container" onClick={SignUp}>
                <img
                  className="google-icon"
                  src={GoogleIcon}
                  alt="Google Icon"
                />
                <span className="login-text">SignUp With Google</span>
              </div>
            </div>

            <Divider>OR</Divider>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="google-login" onClick={login}>
                <img
                  className="google-icon"
                  src={GoogleIcon}
                  alt="Google Icon"
                />
                <span className="login-text">Login With Google</span>
              </div>
            </div>
          </div>
        </motion.div>
        <LoginErrDialog
          loginErrDialog={loginErrDialog}
          loginErrMsg={loginErrMsg}
          setLoginErrDialog={setLoginErrDialog}
          setLoginErrMsg={setLoginErrMsg}
        />
      </div>
    );
  } else {
    return <Loading />;
  }
}

export default Login;
