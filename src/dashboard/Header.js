import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AuthService from "../services/AuthService";
import ProfileSetting from "./ProfileSetting";
import { useNavigate } from "react-router-dom";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";

function Header({
  mobileOpen,
  drawerWidth,
  handleDrawerToggle,
  loginUserData,
}) {
  const [notifications, setNotifications] = useState([]);
  const [gemCount, setGemCount] = useState(0);
  const [anchorElNotification, setAnchorElNotification] = useState(null); // For notification menu
  const [anchorElLogout, setAnchorElLogout] = useState(null); // For logout menu
  const [profileDialog, setProfileDialog] = useState(false);
  const [latestNotifications, setLatestNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [gemNotificationData, setGemNotificationData] = useState([]);

  const CRMBaseURL = AuthService();
  const navigate = useNavigate();
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const FetchNotification = async () => {
    const values = {
      userID: parseInt(storedUserData && `${storedUserData.id}`, 10),
    };

    try {
      const res = await CRMBaseURL.post("notificationdata", values);

      const notificationData = res.data?.Data || [];
      const gemNotification = res.data?.gem || [];

      setNotifications(notificationData);
      setGemNotificationData(gemNotification);

      const unread = notificationData.filter((n) => n.isRead === 0).length;
      const gemUnread = gemNotification.filter((n) => n.isRead === 0).length;

      setUnreadCount(unread);
      setGemCount(gemUnread);

      // Collect all new unread notifications
      const newNotifications = [
        ...notificationData.filter((n) => n.isRead === 0),
        ...gemNotification.filter((n) => n.isRead === 0),
      ];

      if (newNotifications.length > 0) {
        setLatestNotifications(newNotifications);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleMarkAsRead = async () => {
    const values = {
      userID: parseInt(storedUserData && `${storedUserData.id}`, 10),
    };
    try {
      const response = await CRMBaseURL.post("markasread", values);

      FetchNotification();
      setLatestNotifications([]);
    } catch (e) {
      console.log("Error", e);
    }
  };
  const DealNavigation = (DealID, NotificationID) => {
    navigate("/dashboard/deal_details", {
      state: { ID: DealID, notificationID: NotificationID },
    });
  };

  const GemNavigation = (gemID, notificationID) => {
    navigate("/dashboard/gem_details", {
      state: { gemID: gemID, type: "My Gem", notificationID: notificationID },
    });
  };

  useEffect(() => {
    FetchNotification();
    const interval = setInterval(() => {
      FetchNotification();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAlertClose = (index) => {
    // Remove the specific notification from the list based on index
    setLatestNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  // Handle opening and closing for the notification menu
  const handleNotificationMenuOpen = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorElNotification(null);
  };

  // Handle opening and closing for the logout menu
  const handleLogoutMenuOpen = (event) => {
    setAnchorElLogout(event.currentTarget);
  };

  const handleLogoutMenuClose = () => {
    setAnchorElLogout(null);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
    setAnchorElLogout(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: mobileOpen ? "100%" : { md: `calc(100% - ${drawerWidth}px)` },
          ml: mobileOpen ? 0 : { md: `${drawerWidth}px` },
          bgcolor: "#fff",
          boxShadow: "0px 10px 10px #ccc",
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "#1d2935" }}
          >
            Holoware CRM
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification Icon */}
          <Toolbar>
            <IconButton onClick={handleNotificationMenuOpen}>
              <Badge
                badgeContent={unreadCount + gemCount} // Sum of both unread counts
                color="secondary"
              >
                <NotificationsIcon sx={{ color: "#FFCF00" }} />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorElNotification}
              open={Boolean(anchorElNotification)}
              onClose={handleNotificationMenuClose}
              PaperProps={{
                sx: {
                  maxHeight: 400,
                  width: "300px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #ddd",
                },
              }}
            >
              <Box sx={{ padding: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  <Button
                    color="primary"
                    Tooltip="Mark all as read"
                    onClick={handleMarkAsRead}
                    variant="outlined"
                    sx={{ fontSize: 10 }}
                  >
                    Read All
                  </Button>
                </Box>
                        
                {/* Regular Notifications */}
                {notifications.length > 0 && (
                  <>
                    <Divider sx={{ marginY: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Deal Notifications
                    </Typography>
                  </>
                )}
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <MenuItem
                      key={index}
                      sx={{
                        padding: "10px",
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        display: "block", // Ensures each MenuItem takes the full width
                      }}
                    >
                      <ListItemText
                        primary={notification.message}
                        secondary={`Deal ID: ${notification.dealID} ${notification.id}`}
                        onClick={() =>
                          DealNavigation(notification.dealID, notification.id)
                        }
                        primaryTypographyProps={{
                          noWrap: true, // Prevents wrapping of primary text
                          sx: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "200px", // Adjust this width as needed
                          },
                        }}
                        secondaryTypographyProps={{
                          noWrap: true, // Prevents wrapping of secondary text
                          sx: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "200px", // Adjust this width as needed
                          },
                        }}
                      />
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <Typography>No deals notifications available</Typography>
                  </MenuItem>
                )}

                {/* Divider between regular and Gem Notifications */}
                {gemNotificationData.length > 0 && (
                  <>
                    <Divider sx={{ marginY: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Gem Notifications
                    </Typography>
                  </>
                )}

                {/* Gem Notifications */}
                {gemNotificationData.length > 0 ? (
                  gemNotificationData.map((gemNotification, index) => (
                    <MenuItem
                      key={index}
                      sx={{
                        padding: "10px",
                        borderRadius: "4px",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                        display: "block",
                      }}
                    >
                      <ListItemText
                        primary={gemNotification.message}
                        secondary={`Gem ID: ${gemNotification.gemID} ${gemNotification.id}`}
                        onClick={() =>
                          GemNavigation(
                            gemNotification.gemID,
                            gemNotification.id
                          )
                        }
                        primaryTypographyProps={{
                          noWrap: true,
                          sx: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "200px",
                          },
                        }}
                        secondaryTypographyProps={{
                          noWrap: true,
                          sx: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "200px",
                          },
                        }}
                      />
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <Typography>No gem notifications available</Typography>
                  </MenuItem>
                )}
              </Box>
            </Menu>
          </Toolbar>

          {/* Profile and Logout buttons remain unchanged */}
          <Tooltip
            title={
              <React.Fragment>
                <Typography color="inherit" sx={{ fontSize: 12 }}>
                  Username : {loginUserData && loginUserData.name}
                </Typography>
                <Typography color="inherit" sx={{ fontSize: 12 }}>
                  Email ID : {loginUserData && loginUserData.email}
                </Typography>
                <Typography color="inherit" sx={{ fontSize: 12 }}>
                  Role : {loginUserData && loginUserData.userRole}
                </Typography>
              </React.Fragment>
            }
          >
            <IconButton
              color="inherit"
              sx={{ marginRight: 2 }}
              onClick={() => {
                setProfileDialog(true);
              }}
            >
              {loginUserData && loginUserData.avatarURL ? (
                <Avatar
                  src={loginUserData.avatarURL}
                  sx={{ width: 25, height: 25 }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 25,
                    fontSize: 15,
                    height: 25,
                    bgcolor: "#007ee1",
                    textAlign: "center",
                  }}
                >
                  {loginUserData && loginUserData.name
                    ? loginUserData.name.charAt(0).toUpperCase()
                    : ""}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          {/* Logout Icon */}
          <Tooltip title="Logout">
            <IconButton
              color="inherit"
              sx={{ marginRight: 5 }}
              onClick={handleLogoutMenuOpen}
            >
              <ExitToAppIcon sx={{ color: "#db2b2a" }} />
            </IconButton>
          </Tooltip>

          {/* Logout Menu */}
          <Menu
            anchorEl={anchorElLogout}
            open={Boolean(anchorElLogout)}
            onClose={handleLogoutMenuClose}
          >
            <MenuItem onClick={handleLogoutMenuClose}>Cancel</MenuItem>
            <MenuItem onClick={handleConfirmLogout}>Confirm Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <ProfileSetting
        openProfile={profileDialog}
        setOpenProfile={setProfileDialog}
        loginUserData={loginUserData}
      />

      {/* {latestNotifications.length > 0 && (
        <Snackbar
          open={true}
          // anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <div>
            {latestNotifications.map((notification, index) => {
              const isDanger =
                notification.message.toLowerCase().includes("rejected") ||
                notification.message.toLowerCase().includes("loss");

              return (
                <Alert
                  key={index}
                  onClose={() => handleAlertClose(index)}
                  severity={isDanger ? "error" : "info"}
                  variant="standard"
                  sx={{ width: "60%", marginBottom: "10px" }}
                >
                  <AlertTitle>{isDanger ? "Alert" : "Info"}</AlertTitle>
                  {notification.message}
                </Alert>
              );
            })}
          </div>
        </Snackbar>
      )} */}
    </>
  );
}

export default Header;
