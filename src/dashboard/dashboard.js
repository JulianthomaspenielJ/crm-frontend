import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import {  Popover, Tooltip, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import HWLogo from "../Image/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import LoginDialog from "../DialogMsg/LoginDialog";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import AuthService from "../services/AuthService";
import MemoryIcon from '@mui/icons-material/Memory';
import CurrencyRupeeSharpIcon from '@mui/icons-material/CurrencyRupeeSharp';
const drawerWidth = 85;

// Define custom theme with specified colors and Poppins font
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
    fontSize: 13,
  },
});

function ResponsiveDrawer(props) {
  const { window } = props;
  const navigate = useNavigate();
  const CRMBaseURL = AuthService();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [productMenu, setProductMenu] = useState(false);
  const [dialogMsg, setDialogMsg] = useState(false);
  const [loginUserData, setLoginUserData] = useState();
  const [activeMenu, setActiveMenu] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    fetchReadDealCount();
    const intervalId = setInterval(() => {
      fetchReadDealCount();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchReadDealCount = async () => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const OwnerID = storedUserData && `${storedUserData.id}`;
    const userID = parseInt(OwnerID);

    try {
      const res = await CRMBaseURL.post("notificationdata", { userID });
      const data = res.data.Data;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));

    if (storedUserData) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - storedUserData.timestamp;

      if (timeDifference > 36000000) {
        localStorage.removeItem("userData");
        navigate("/login");
      } else {
        setLoginUserData(storedUserData);
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Define a mapping between routes and menu indices
    const routeToIndex = {
      "/dashboard/users": 1,
      "/dashboard/customers_table": 3,
      "/dashboard/company_details": 3,
      "/dashboard/contact_table": 3,
      "/dashboard/contact_details": 3,
      "/dashboard/pricing_reference": 4,
      "/dashboard/product-componentsList": 5,
      "/dashboard/product-components": 5,
      "/dashboard/product-margin": 5,
      "/dashboard/auditing_table": 6,
      "/dashboard/deals": 7,
      "/dashboard/deal_details": 7,
      "/dashboard/screen": 8,
      "/dashboard/partners": 9,
      "/dashboard/gem": 10,
      "/dashboard/gem_details": 10,
    };

    const currentPath = location.pathname;
    const index = routeToIndex[currentPath];

    if (index !== undefined) {
      const updatedMenu = Array(7).fill(false);
      updatedMenu[index] = true;
      setActiveMenu(updatedMenu);
      if (index === 5) {
        // Manage product components submenu
        const subIndex = currentPath.includes("product-componentsList")
          ? 1
          : currentPath.includes("product-components")
          ? 2
          : currentPath.includes("product-margin")
          ? 3
          : 0;

        const updatedComMenu = Array(3).fill(false);
        updatedComMenu[subIndex] = true;
        setProductMenu(true);
      } else {
        setProductMenu(false);
      }
    }
  }, [location]);

  const handleClickIn = (index) => {
    const updatedMenu = Array(7).fill(false);
    updatedMenu[index] = true;
    setActiveMenu(updatedMenu);
  };

  const handleClickComIn = (index) => {
    const updatedMenu = Array(3).fill(false);
    updatedMenu[index] = true;
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawerStyles = {
    container: {
      border: "none",
      overflow:"hidden",
      height: "100%",
    },
    toolbar: {
      bgcolor: "#fff",
      borderRight: "1px solid #f8f8f8",
      boxShadow: "0px 10px 10px #ccc",
    },
    img: {
      width: 200,
      height: 40,
    },
    listItem: {
      color: "#737791",
      fontSize: "12px",
    },
    ActivelistItemButton: {
      borderRadius: 10,
      width:"30px",
      height: 50,
      background:
        "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
      color: "#fff",
      "& .MuiListItemIcon-root": {
        color: "#fff",
      },
      "& .MuiListItemText-primary": {
        color: "#fff",
      },
      "&:hover": {
        background:
          "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
      },
    },
    ActivelistItemButtonCom: {
      "& .MuiListItemIcon-root": {
        color: "#1e62ef",
      },
      "& .MuiListItemText-primary": {
        color: "#1e62ef",
      },
      "&:hover": {
        color: "#1e62ef",
      },
    },
    listItemButton: {
      borderRadius: 10,
      width:"30px",
      height: 50,
      color: "#737791",
      mt: 1,
      "&:hover": {
        bgcolor: "#00B5FF",
        color: "#fff",
        "& .MuiListItemIcon-root": {
          color: "#fff",
        },
        "& .MuiListItemText-primary": {
          color: "#fff",
        },
      },
    },
    listItemButtonCom: {
      color: "#737791",
      mt: 1,
      "&:hover": {
        bgcolor: "#fff",
        "& .MuiListItemIcon-root": {
          color: "#1e62ef",
        },
        "& .MuiListItemText-primary": {
          color: "#1e62ef",
        },
      },
    },
    listItemIcon: {
      color: "#737791",
      fontSize: 12,
    },
  };

  const drawer = (
    <div
      style={{
        ...drawerStyles.container,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        color:""
      }}
    >
      <Toolbar sx={drawerStyles.toolbar}>
        <img src={HWLogo} alt="" style={drawerStyles.img} />
      </Toolbar>
      <List sx={{ paddingX: 2, flexGrow: 1 }}>
        <Link to="/dashboard/screen" style={{ textDecoration: "none" }}>
          <Tooltip title="Dashboard" placement="right">
            <ListItem
              sx={drawerStyles.listItem}
              disablePadding
              onClick={() => handleClickIn(8)}
            >
              <ListItemButton
                sx={[
                  drawerStyles.listItemButton,
                  activeMenu[8] && drawerStyles.ActivelistItemButton,
                ]}
              >
                <ListItemIcon sx={drawerStyles.listItemIcon}>
                  <EqualizerIcon fontSize="medium" />
                </ListItemIcon>
                {/* <ListItemText primary="Dashboard" /> */}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </Link>
        {loginUserData && loginUserData.team === "Admin" && (
          <Link to="/dashboard/users" style={{ textDecoration: "none" }}>
            <Tooltip title="Users" placement="right">
              <ListItem
                sx={drawerStyles.listItem}
                disablePadding
                onClick={() => handleClickIn(1)}
              >
                <ListItemButton
                  sx={[
                    drawerStyles.listItemButton,
                    activeMenu[1] && drawerStyles.ActivelistItemButton,
                  ]}
                >
                  <ListItemIcon sx={drawerStyles.listItemIcon}>
                    <PersonIcon fontSize="medium" />
                  </ListItemIcon>
                  {/* <ListItemText primary="Users" /> */}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
        )}
        {loginUserData &&
          (loginUserData.team === "Admin" ||
            loginUserData.team === "Sales" ||
            loginUserData.team === "Marketing") && (
            <Link
              to="/dashboard/customers_table"
              style={{ textDecoration: "none" }}
            >
              <Tooltip title="Customers" placement="right">
                <ListItem
                  sx={drawerStyles.listItem}
                  onClick={() => handleClickIn(3)}
                  disablePadding
                >
                  <ListItemButton
                    sx={[
                      drawerStyles.listItemButton,
                      activeMenu[3] && drawerStyles.ActivelistItemButton,
                    ]}
                  >
                    <ListItemIcon sx={drawerStyles.listItemIcon}>
                      <BusinessIcon fontSize="medium" />
                    </ListItemIcon>
                    {/* <ListItemText primary="Customers" /> */}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Link>
          )}
        {/* {loginUserData &&
          (loginUserData.team === "Admin" ||
            loginUserData.team === "Sales" ||
            loginUserData.team === "Marketing") && (
            <Link
              to="/dashboard/contact_table"
              style={{ textDecoration: "none" }}
            >
              <ListItem
                sx={drawerStyles.listItem}
                disablePadding
                onClick={() => handleClickIn(2)}
              >
                <ListItemButton
                  sx={[
                    drawerStyles.listItemButton,
                    activeMenu[2] && drawerStyles.ActivelistItemButton,
                  ]}
                >
                  <ListItemIcon sx={drawerStyles.listItemIcon}>
                    <GroupAddIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Contacts" />
                </ListItemButton>
              </ListItem>
            </Link>
          )} */}
        {/* {loginUserData &&
          (loginUserData.team === "Admin" ||
            loginUserData.team === "Sales" ||
            loginUserData.team === "Marketing") && (
            <Link to="/dashboard/compliance" style={{ textDecoration: "none" }}>
              <ListItem
                sx={drawerStyles.listItem}
                disablePadding
                onClick={() => handleClickIn(12)}
              >
                <ListItemButton
                  sx={[
                    drawerStyles.listItemButton,
                    activeMenu[12] && drawerStyles.ActivelistItemButton,
                  ]}
                >
                  <ListItemIcon sx={drawerStyles.listItemIcon}>
                    <GroupAddIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Compliance" />
                </ListItemButton>
              </ListItem>
            </Link>
          )} */}
        {loginUserData &&
          (loginUserData.team === "Admin" ||
            loginUserData.team === "Sales" ||
            loginUserData.team === "Pricing" ||
            loginUserData.team === "Marketing") && (
            <Link to="/dashboard/partners" style={{ textDecoration: "none" }}>
              <Tooltip title="GeM Partners" placement="right">
                <ListItem
                  sx={drawerStyles.listItem}
                  disablePadding
                  onClick={() => handleClickIn(9)}
                >
                  <ListItemButton
                    sx={[
                      drawerStyles.listItemButton,
                      activeMenu[9] && drawerStyles.ActivelistItemButton,
                    ]}
                  >
                    <ListItemIcon sx={drawerStyles.listItemIcon}>
                      <HandshakeIcon fontSize="medium" />
                    </ListItemIcon>
                    {/* <ListItemText primary="Partners" /> */}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Link>
          )}

        {loginUserData &&
          (loginUserData.team === "Admin" ||
            loginUserData.team === "Pricing") && (
            <Link
              to="/dashboard/pricing_reference"
              style={{ textDecoration: "none" }}
            >
              <Tooltip title="Pricing" placement="right">
                <ListItem
                  sx={drawerStyles.listItem}
                  onClick={() => handleClickIn(4)}
                  disablePadding
                >
                  <ListItemButton
                    sx={[
                      drawerStyles.listItemButton,
                      activeMenu[4] && drawerStyles.ActivelistItemButton,
                    ]}
                  >
                    <ListItemIcon sx={drawerStyles.listItemIcon}>
                      <CurrencyRupeeSharpIcon fontSize="medium" />
                    </ListItemIcon>
                    {/* <ListItemText primary="Pricing" /> */}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Link>
          )}
        {loginUserData &&
          (loginUserData.team === "Admin" ||
            loginUserData.team === "Pricing" ||
            loginUserData.team === "Sales" ||
            loginUserData.team === "Marketing") && (
            <Link to="/dashboard/deals" style={{ textDecoration: "none" }}>
              <Tooltip title="Deals" placement="right">
                <ListItem
                  sx={drawerStyles.listItem}
                  disablePadding
                  onClick={() => handleClickIn(7)}
                >
                  <ListItemButton
                    sx={[
                      drawerStyles.listItemButton,
                      activeMenu[7] && drawerStyles.ActivelistItemButton,
                    ]}
                  >
                    <ListItemIcon sx={drawerStyles.listItemIcon}>
                      <LocalOfferIcon fontSize="medium" />
                    </ListItemIcon>
                    {/* <ListItemText primary="Deals" /> */}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Link>
          )}

        {loginUserData &&
          (loginUserData.team === "Admin" ||
            loginUserData.team === "Sales" ||
            loginUserData.team === "Pricing" ||
            loginUserData.team === "Marketing") && (
            <Link to="/dashboard/gem" style={{ textDecoration: "none" }}>
              <Tooltip title="GeM" placement="right">
                <ListItem
                  sx={drawerStyles.listItem}
                  disablePadding
                  onClick={() => handleClickIn(10)}
                >
                  <ListItemButton
                    sx={[
                      drawerStyles.listItemButton,
                      activeMenu[10] && drawerStyles.ActivelistItemButton,
                    ]}
                  >
                    <ListItemIcon sx={drawerStyles.listItemIcon}>
                      <LocalGroceryStoreIcon fontSize="medium" />
                    </ListItemIcon>
                    {/* <ListItemText primary="GEM" /> */}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Link>
          )}

        <>
          {loginUserData &&
            (loginUserData.team === "Admin" ||
              loginUserData.team === "Pricing") && (
              <Box>
                 <Tooltip title="Products" placement="right">
                <ListItem
                  aria-describedby={id}
                  sx={drawerStyles.listItem}
                  onClick={(e) => {
                    handleClickIn(5);
                    handleClickComIn();
                    handleClick(e);
                  }}
                  disablePadding
                >
                  <ListItemButton
                    sx={[
                      drawerStyles.listItemButton,
                      activeMenu[5] && drawerStyles.ActivelistItemButton,
                    ]}
                    onClick={() => setProductMenu(!productMenu)}
                  >
                    <ListItemIcon sx={drawerStyles.listItemIcon}>
                      <MemoryIcon fontSize="medium" />
                    </ListItemIcon>
                    {/* <ListItemText primary="Products" /> */}
                    {/* {productMenu ? <ExpandLess /> : <ExpandMore />} */}
                  </ListItemButton>
                </ListItem>
                </Tooltip>
                {/* <Collapse in={productMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Link
                      to="/dashboard/product-componentsList"
                      style={{ textDecoration: "none" }}
                    >
                      <ListItemButton
                        sx={[
                          drawerStyles.listItemButtonCom,
                          productCom[1] &&
                            activeMenu[5] &&
                            drawerStyles.ActivelistItemButtonCom,
                        ]}
                        onClick={() => {
                          handleClickComIn(1);
                          handleClickIn(5);
                        }}
                      >
                        <ListItemIcon sx={drawerStyles.listItemIcon} />
                        <ListItemText primary="Component List" />
                      </ListItemButton>
                    </Link>
                  </List>
                  <List component="div" disablePadding>
                    <Link
                      to="/dashboard/product-components"
                      style={{ textDecoration: "none" }}
                    >
                      <ListItemButton
                        sx={[
                          drawerStyles.listItemButtonCom,
                          productCom[2] &&
                            activeMenu[5] &&
                            drawerStyles.ActivelistItemButtonCom,
                        ]}
                        onClick={() => {
                          handleClickComIn(2);
                          handleClickIn(5);
                        }}
                      >
                        <ListItemIcon sx={drawerStyles.listItemIcon} />
                        <ListItemText primary="Components" />
                      </ListItemButton>
                    </Link>
                  </List>
                  {loginUserData &&
                  loginUserData.userRole === "Executive" &&
                  loginUserData.team === "Pricing" ? null : (
                    <List component="div" disablePadding>
                      <Link
                        to="/dashboard/product-margin"
                        style={{ textDecoration: "none" }}
                      >
                        <ListItemButton
                          sx={[
                            drawerStyles.listItemButtonCom,
                            productCom[3] &&
                              activeMenu[5] &&
                              drawerStyles.ActivelistItemButtonCom,
                          ]}
                          onClick={() => {
                            handleClickComIn(3);
                            handleClickIn(5);
                          }}
                        >
                          <ListItemIcon sx={drawerStyles.listItemIcon} />
                          <ListItemText primary="Margin" />
                        </ListItemButton>
                      </Link>
                    </List>
                  )}
                </Collapse> */}
              </Box>
            )}
          {loginUserData &&
            loginUserData.team === "Admin" &&
            loginUserData.userRole !== "Executive" && (
              <Link
                to={{
                  pathname: "/dashboard/auditing_table",
                  state: { data: loginUserData?.userRole },
                }}
                style={{ textDecoration: "none" }}
              >
                 <Tooltip title="Auditing" placement="right">
                <ListItem
                  sx={drawerStyles.listItem}
                  onClick={() => handleClickIn(6)}
                  disablePadding
                >
                  <ListItemButton
                    sx={[
                      drawerStyles.listItemButton,
                      activeMenu[6] && drawerStyles.ActivelistItemButton,
                    ]}
                  >
                    <ListItemIcon sx={drawerStyles.listItemIcon}>
                      <ContentPasteSearchIcon fontSize="medium" />
                    </ListItemIcon>
                    {/* <ListItemText primary="Auditing" /> */}
                  </ListItemButton>
                </ListItem>
                </Tooltip>
              </Link>
            )}
        </>
      </List>
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#ccc" }}>
          V - 1.8
        </Typography>
      </Box>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header
          mobileOpen={mobileOpen}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          loginUserData={loginUserData}
        />
        <Box
          component="nav"
          sx={{
            width: { md: mobileOpen ? 0 : drawerWidth },
            flexShrink: { md: 0 },
          }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                borderRight: "none",
                width: drawerWidth,
                bgcolor: "#fff",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: mobileOpen ? "none" : "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: mobileOpen ? 0 : drawerWidth,
                borderRight: "none",
                bgcolor: "#fff",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "#F8F8F8",
            width: mobileOpen
              ? "100%"
              : { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
      <LoginDialog dialogMsg={dialogMsg} setDialogMsg={setDialogMsg} />

      <>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          sx={{margin:"0px 0px 10px 15px"}}
        >
          <Box
            sx={{
              backgroundColor: "rgba(97, 97, 97, 0.9)", // Similar to tooltip background color
              color: "#fff", // Tooltip text color is typically white
              padding:"2px 10px",
              borderRadius: "4px", // Optional: gives a rounded corner like tooltip
            }}
          >
            <List component="div" disablePadding>
              <Link
                to="/dashboard/product-componentsList"
                style={{ textDecoration: "none" }}
              >
                <ListItemButton
                // sx={[
                //   drawerStyles.listItemButtonCom,
                //   productCom[1] &&
                //     activeMenu[5] &&
                //     drawerStyles.ActivelistItemButtonCom,
                // ]}
                onClick={() => {
                  setAnchorEl(null);
                  // handleClickComIn(1);
                  // handleClickIn(5);
                }}
                >
                  {/* <ListItemText primary="Component List" color="#fff" /> */}
                  <ListItemText>
                  <Typography sx={{ color: "#fff", fontSize: "11px" }}>
                      Component List
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </Link>
            </List>
            <List component="div" disablePadding>
              <Link
                to="/dashboard/product-components"
                style={{ textDecoration: "none" }}
              >
                <ListItemButton
                // sx={[
                //   drawerStyles.listItemButtonCom,
                //   productCom[2] &&
                //     activeMenu[5] &&
                //     drawerStyles.ActivelistItemButtonCom,
                // ]}
                onClick={() => {
                  // handleClickComIn(2);
                  // handleClickIn(5);
                  setAnchorEl(null);
                }}
                >
                  <ListItemText ><Typography sx={{ color: "#fff", fontSize: "11px" }}>Components</Typography></ListItemText>
                  {/* <ListItemText primary="Components" /> */}
                </ListItemButton>
              </Link>
            </List>
            {loginUserData &&
            loginUserData.userRole === "Executive" &&
            loginUserData.team === "Pricing" ? null : (
              <List component="div" disablePadding>
                <Link
                  to="/dashboard/product-margin"
                  style={{ textDecoration: "none" }}
                >
                  <ListItemButton
                  // sx={[
                  //   drawerStyles.listItemButtonCom,
                  //   productCom[3] &&
                  //     activeMenu[5] &&
                  //     drawerStyles.ActivelistItemButtonCom,
                  // ]}
                  onClick={() => {
                    // handleClickComIn(3);
                    // handleClickIn(5);
                    setAnchorEl(null);
                  }}
                  >
                    {/* <ListItemText primary="Margin" /> */}
                    <ListItemText ><Typography sx={{ color: "#fff", fontSize: "11px" }}>Margin</Typography></ListItemText>
                  </ListItemButton>
                </Link>
              </List>
            )}
          </Box>
        </Popover>
      </>
    </ThemeProvider>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
