import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Autocomplete,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AuthService from "../services/AuthService";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useSpring, animated } from "@react-spring/web";
import { styled } from "@mui/material/styles";
import userNotFound from "../Image/useeNotfound.webp";
import {
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: "#884DFF",
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontWeight: 500,
    fontSize: 13,
  },
}));

function DashBoardScreen() {
  const CRMBaseURL = AuthService();
  const [companyData, setCompanyData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [quotationData, setQuotationData] = useState([]);
  const [deals, SetDeals] = useState([]);
  const [dealStatus, setDealStatus] = useState([]);
  const [usersList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [permissionState, setPermissionState] = useState(Notification.permission); 
  const [pieData, setPieData] = useState([
    { id: 0, value: 1, label: "Won", color: "#7ed257" },
    { id: 1, value: 1, label: "Loss", color: "#ff522f" },
    { id: 2, value: 1, label: "On Progress", color: "#2355e6" },
  ]);
  const storedUserData = JSON.parse(localStorage.getItem("userData"));


  // const firebaseConfig = {
  //   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  //   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  //   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  //   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: process.env.REACT_APP_FIREBASE_APP_ID,
  //   vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY, 
  // };

  // Initialize Firebase app and messaging
  // const app = initializeApp(firebaseConfig);
  // const messaging = getMessaging(app);

  // // Request notification permission from the user
  // function requestNotificationPermission() {
  //   if (Notification.permission === "default") {
  //     Notification.requestPermission().then((permission) => {
  //       setPermissionState(permission); // Update state with permission result
  //       if (permission === "granted") {
  //        
  //         getTokenAndSendToBackend();
  //       } else {
  //     
  //       }
  //       setOpen(false); 
  //     });
  //   } else if (Notification.permission === "granted") {
  //     
  //     getTokenAndSendToBackend(); // If permission already granted, get token
  //   } else if (Notification.permission === "denied") {
  //    
  //   }
  //   setOpen(false); 
  // }

  // Function to get Firebase FCM token and send it to the server
  // const getTokenAndSendToBackend = async () => {
  //   try {
  //     const currentToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
  //     if (currentToken) {
  //    
  //       await sendTokenToBackend(currentToken);
  //     } else {
  //       
  //     }
  //   } catch (err) {
  //     console.error('Error retrieving token:', err);
  //   }
  // };

  // Send FCM token to the backend
  // async function sendTokenToBackend(token) {
  //   const data = {
  //     token: token,
  //     userID: ID,
  //   };
  // 
  //   try {
  //     const result = await CRMBaseURL.post("save-token", data);
  //    
  //   } catch (e) {
  //     console.error("Error sending token:", e);
  //   }
  // }

  useEffect(() => {
    // If permission is not granted or denied, ask for permission
    if (Notification.permission === "default" && !open) {
      setOpen(true);
    }
  }, [permissionState]);
  
  const monthMap = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  const [tabsData, setTabsData] = useState("My");

  const handleChange = (event, newValue) => {
    setTabsData(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect to show the dialog on initial render if permission is not set
  // useEffect(() => {
  //   if (Notification.permission === "default") {
  //     handleOpen(); // Open the dialog on first load if permission not already granted/denied
  //   }
  // }, []);

  useEffect(() => {
    fetchData(tabsData); // Pass the tabsData directly to fetchData
  
  }, [tabsData]); // Ensure tabsData is a dependency

  const fetchData = async (selectedTab) => {

    const values = {
      year: "2024",
      status: "WON",
      userID: selectedTab === "My" ? storedUserData?.id : 0,
    };

    try {
      const res = await CRMBaseURL.post("dashboard", values);
      const companyCount =
        Array.isArray(res.data.companyCount) &&
        res.data.companyCount.map((item) => item.Contacts);
      const contactCount =
        Array.isArray(res.data.contactCount) &&
        res.data.contactCount.map((item) => item.Contacts);

      const quotationCount = Array.isArray(res.data.quotation)
        ? res.data.quotation.map((item) => item.Quotation)
        : [];

      const dealsData = Array.isArray(res.data.dealCounts)
        ? res.data.dealCounts.map((item) => ({
            month: monthMap[item.Month],
            Won: item.WonCount,
            Lose: item.LoseCount,
          }))
        : [];

      const progressData = [
        {
          id: 0,
          value: parseInt(res.data.progress.Win.String),
          label: "Won",
          color: "#7ed257",
        },
        {
          id: 1,
          value: parseInt(res.data.progress.Loss.String),
          label: "Loss",
          color: "#ff522f",
        },
        {
          id: 2,
          value: parseInt(res.data.progress.OnProgress.String),
          label: "On Progress",
          color: "#2355e6",
        },
      ];
      setDealStatus(res.data.dealStatus);
      setCompanyData(companyCount);
      setContactData(contactCount);
      setQuotationData(quotationCount);
      SetDeals(dealsData);
      setPieData(progressData);

      const user = await CRMBaseURL.get("usernamelistdashboard");
      setUserList(user.data.data);
    } catch (e) {
      console.log(e);
    }
  };


  const handleUserChange = async (event, value) => {
    if (value) {
      const selectedUser = usersList.find((user) => user.name === value);

      try {
        const res = await CRMBaseURL.post("dashboard", {
          year: "2024",
          status: "WON",
          userID: selectedUser.id,
        });
        const companyCount =
          Array.isArray(res.data.companyCount) &&
          res.data.companyCount.map((item) => item.Contacts);
        const contactCount =
          Array.isArray(res.data.contactCount) &&
          res.data.contactCount.map((item) => item.Contacts);
        const quotationCount = Array.isArray(res.data.quotation)
          ? res.data.quotation.map((item) => item.Quotation)
          : [];

        const dealsData = Array.isArray(res.data.dealCounts)
          ? res.data.dealCounts.map((item) => ({
              month: monthMap[item.Month],
              Won: item.WonCount,
              Lose: item.LoseCount,
            }))
          : [];

        const progressData = [
          {
            id: 0,
            value: parseInt(res.data.progress.Win.String),
            label: "Won",
            color: "#7ed257",
          },
          {
            id: 1,
            value: parseInt(res.data.progress.Loss.String),
            label: "Loss",
            color: "#ff522f",
          },
          {
            id: 2,
            value: parseInt(res.data.progress.OnProgress.String),
            label: "On Progress",
            color: "#2355e6",
          },
        ];
        setDealStatus(res.data.dealStatus);
        setCompanyData(companyCount);
        setContactData(contactCount);
        setQuotationData(quotationCount);
        SetDeals(dealsData);
        setPieData(progressData);
      } catch (e) {
        console.log("error", e);
      }
    }
  };
  const valueFormatter = (value) => `${value}`;

  const chartSetting = {
    yAxis: [
      {
        label: "Deals",
      },
    ],
    width: 600,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
      },
    },
  };

  const chartSetting1 = {
    xAxis: [
      {
        label: "Quotation Data",
      },
    ],
    width: 500,
    height: 330,
  };

  const valueFormatter1 = (value) => `${value}mm`;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dataset = months.map((month, index) => ({
    month,
    seoul: quotationData[index],
  }));

  const [pieSpring, pieApi] = useSpring(() => ({ opacity: 0 }));
  const [lineSpring, lineApi] = useSpring(() => ({ opacity: 0 }));
  const [quotationSpring, quotationApi] = useSpring(() => ({ opacity: 0 }));
  const [barSpring, barApi] = useSpring(() => ({ opacity: 0 }));

  useEffect(() => {
    pieApi.start({ opacity: 1, config: { duration: 300 } });
    setTimeout(
      () => lineApi.start({ opacity: 1, config: { duration: 300 } }),
      300
    );
    setTimeout(
      () => quotationApi.start({ opacity: 1, config: { duration: 300 } }),
      600
    );
    setTimeout(
      () => barApi.start({ opacity: 1, config: { duration: 300 } }),
      900
    );
  }, [pieApi, lineApi, quotationApi, barApi]);

  return (
    <Box sx={{ paddingX: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <animated.div style={pieSpring}>
             <Typography gutterBottom sx={{ fontSize: 20, fontWeight: 500 }}>
              Dashboard
            </Typography>
            {/* <Button variant="contained" onClick={handleOpen}>
              Enable Notifications
            </Button>  */}

            {/* Dialog that asks the user for notification permission */}
            {/* <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Enable Notifications</DialogTitle>
              <DialogContent>
                {permissionState === "denied" ? (
                  <Typography color="error">
                    You have denied notifications. Please enable them in your browser settings if you want to receive notifications from this CRM.
                  </Typography>
                ) : (
                  <Typography>
                    Would you like to receive notifications from this CRM?
                  </Typography>
                )}
              </DialogContent>
              <DialogActions>
                {permissionState !== "denied" && (
                  <Button onClick={requestNotificationPermission} color="primary">
                    Yes, enable
                  </Button>
                )}
                <Button onClick={handleClose} color="secondary">
                  No, thanks
                </Button>
              </DialogActions>
            </Dialog> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <Tabs
                value={tabsData}
                onChange={handleChange}
                TabIndicatorProps={{
                  sx: {
                    background:
                      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                  },
                }}
                sx={{
                  "& .MuiTab-root": {
                    background:
                      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                  "& .Mui-selected": {
                    background:
                      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                }}
              >
                <Tab label="My" value="My" />
                <Tab label="Holoware" value="Holoware" />
              </Tabs>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={usersList.map((user) => user.name)} 
                sx={{ width: 300 }}
                onChange={handleUserChange}
                renderInput={(params) => (
                  <TextField {...params} label="Select user Dashboard" />
                )}
              />
            </Box>
          </animated.div>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <animated.div style={pieSpring}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: {
                      xs: "10px 0px",
                      sm: "10px 0px",
                      md: "20px 0px",
                    },
                    marginBottom: 2,
                    borderRadius: 5,

                    width: "100%",
                    maxWidth: "100%", 
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      paddingBottom: 2,
                      fontSize: { xs: 14, sm: 16 },
                      fontWeight: 500,
                    }}
                    gutterBottom
                  >
                    Deal Progress
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",

                      paddingRight: window.innerWidth < 600 ? 18 : 5,
                    }}
                  >
                    <PieChart
                      series={[
                        {
                          data: pieData,
                          colorAccessor: "color",
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                          faded: {
                            innerRadius: 50,
                            additionalRadius: -30,
                            color: "gray",
                          },
                          innerRadius: 50, 
                          outerRadius: 100,
                        },
                      ]}
                      width={window.innerWidth < 600 ? 300 : 450} 
                      height={window.innerWidth < 600 ? 1000 : 200}
                    />
                  </Box>
                </Paper>
              </Box>
            </animated.div>
          </Grid>

          <Grid item xs={12} sm={8}>
            <animated.div style={lineSpring}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: {
                      xs: "10px 0px",
                      sm: "10px 0px",
                      md: "20px 0px",
                    },
                    marginBottom: 2,
                    borderRadius: 5,

                    width: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      paddingBottom: 2,
                      fontSize: { xs: 14, sm: 16 }, 
                      fontWeight: 500,
                    }}
                    gutterBottom
                  >
                    Company & Contact Count
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <LineChart
                      xAxis={[
                        {
                          data: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                          ],
                          scaleType: "band",
                          id: "x-axis-id",
                        },
                      ]}
                      series={[
                        {
                          data: companyData,
                          label: "Company Count",
                          color: "#42a2fe",
                        },
                        {
                          data: contactData,
                          label: "Contact Count",
                          color: "#fb9c0c",
                        },
                      ]}
                      width={window.innerWidth < 600 ? 500 : 750} // Responsive width
                      height={window.innerWidth < 600 ? 1000 : 200}
                      margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                      grid={{ vertical: true, horizontal: true }}
                    />
                  </Box>
                </Paper>
              </Box>
            </animated.div>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <animated.div style={quotationSpring}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: {
                      xs: "0px 0px 10px 0px",
                      sm: "0px 0px 10px 0px",
                      md: "0px 0px 10px 0px",
                    },
                    borderRadius: 5,

                    width: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      paddingTop: 2,
                      fontSize: { xs: 14, sm: 16 }, 
                      fontWeight: 500,
                    }}
                    gutterBottom
                  >
                    Quotation Data
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <BarChart
                      dataset={dataset}
                      yAxis={[{ scaleType: "band", dataKey: "month" }]}
                      margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                      series={[
                        {
                          sx: { borderRadius: 10 },
                          dataKey: "seoul",
                          label: "Quotation Data",
                          valueFormatter1,
                          color: "#efb01d",
                        },
                      ]}
                      layout="horizontal"
                      {...chartSetting1}
                    />
                  </Box>
                </Paper>
              </Box>
            </animated.div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <animated.div style={barSpring}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    padding: {
                      xs: "10px 0px",
                      sm: "10px 0px",
                      md: "20px 0px",
                    },
                    marginBottom: 2,
                    borderRadius: 5,
                    width: "100%",
                    maxWidth: "100%", 
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      paddingBottom: 2,
                      fontSize: { xs: 14, sm: 16 }, 
                      fontWeight: 500,
                    }}
                    gutterBottom
                  >
                    Deals
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",

                      paddingRight: window.innerWidth < 600 ? 18 : 5,
                    }}
                  >
                    <BarChart
                      dataset={deals}
                      xAxis={[{ scaleType: "band", dataKey: "month" }]}
                      series={[
                        {
                          dataKey: "Won",
                          label: "Won",
                          valueFormatter,
                          sx: { borderRadius: 2 },
                          color: "#7ed257",
                        },
                        {
                          dataKey: "Lose",
                          label: "Lose",
                          valueFormatter,
                          sx: { borderRadius: 2 },
                          color: "#ff522f",
                        },
                      ]}
                      {...chartSetting}
                      borderRadius={20}
                      height={300}
                    />
                  </Box>
                </Paper>
              </Box>
            </animated.div>
          </Grid>
        </Grid>
      </Grid>
      <Box className="top_header" sx={{ marginTop: 10 }}>
        <h3 style={{ marginRight: "44%", color: "#fff" }}>Recent Deals</h3>
      </Box>
      <Box>
        <TableContainer className="table_container">
          <Table sx={{ minWidth: 500 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Deal Owner</StyledTableCell>
                <StyledTableCell>Deal Approver</StyledTableCell>
                <StyledTableCell>Quotation Updater</StyledTableCell>
                <StyledTableCell>Product</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Quantity</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dealStatus && dealStatus.length > 0 ? (
                dealStatus.map((deal, index) => (
                  <TableRow key={deal.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{deal.name}</TableCell>
                    <TableCell>{deal.ownerName}</TableCell>
                    <TableCell>{deal.approverName}</TableCell>
                    <TableCell>{deal.quotationUpdaterName}</TableCell>
                    <TableCell>{deal.ProductType}</TableCell>
                    <TableCell>{deal.Price}</TableCell>
                    <TableCell>{deal.quantity}</TableCell>
                    <TableCell>{deal.Status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={8} align="center">
                    <img
                      src={userNotFound}
                      alt="User Not Found"
                      style={{ width: "200px", height: "180px" }}
                    />
                    <Typography variant="body1">
                      No Deals at this moment
                    </Typography>
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default DashBoardScreen;


//https://chatgpt.com/share/6704cf25-3380-800f-a9ab-6afbf8ab2432    ---NOTIFICATION ALERT FLOW IN CRM