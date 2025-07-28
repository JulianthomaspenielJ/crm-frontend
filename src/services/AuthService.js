import axios from "axios";

const fixBaseURL = () => {
  const baseURL = process.env.REACT_APP_CRM_BASE_URL
  
  const getBaseURL = axios.create({
    baseURL: baseURL,
  });

  return getBaseURL;
};

const AuthService = () => {
  const CRMBaseURL = fixBaseURL();
  return CRMBaseURL;
};

export default AuthService;
