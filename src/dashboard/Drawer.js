import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HWLogo from "../Image/HWLogo.png";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PaymentsIcon from "@mui/icons-material/Payments";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

const drawer = (
  <div style={{ border: "none" }}>
    <Toolbar sx={{ bgcolor: "#fff", borderRight: "2px solid #e5e5e5de" }}>
      <img src={HWLogo} alt="" style={{ width: 200, height: 40 }} />
    </Toolbar>
    <Divider />
    <List>
      <Link to="/dashboard/users" style={{ textDecoration: "none" }}>
        <ListItem sx={{ color: "#fff", fontSize: 14 }} disablePadding>
          <ListItemButton
            sx={{ color: "#fff", "&:hover": { bgcolor: "secondary.main" } }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <PersonAddIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText>Users</ListItemText>
          </ListItemButton>
        </ListItem>
      </Link>
      <ListItem sx={{ color: "#fff", fontSize: 14 }} disablePadding>
        <ListItemButton
          sx={{ color: "#fff", "&:hover": { bgcolor: "secondary.main" } }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <GroupAddIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>GeM Partners</ListItemText>
        </ListItemButton>
      </ListItem>
      <ListItem sx={{ color: "#fff", fontSize: 14 }} disablePadding>
        <ListItemButton
          sx={{ color: "#fff", "&:hover": { bgcolor: "secondary.main" } }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <ListAltIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Certificate</ListItemText>
        </ListItemButton>
      </ListItem>
      <ListItem sx={{ color: "#fff", fontSize: 14 }} disablePadding>
        <ListItemButton
          sx={{ color: "#fff", "&:hover": { bgcolor: "secondary.main" } }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <PaymentsIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Pricing</ListItemText>
        </ListItemButton>
      </ListItem>
      <ListItem sx={{ color: "#fff", fontSize: 14 }} disablePadding>
        <ListItemButton
          sx={{ color: "#fff", "&:hover": { bgcolor: "secondary.main" } }}
        >
          <ListItemIcon sx={{ color: "#fff" }}>
            <ViewInArIcon fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Products</ListItemText>
        </ListItemButton>
      </ListItem>
    </List>
  </div>
);

function Drawer({
  drawerWidth,
  container,
  mobileOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
}) {
  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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
            bgcolor: "primary.main", 
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",

            bgcolor: "primary.main",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Drawer;
