import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  ListItemText,
  List,
  Avatar,
  ListItem,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Box,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Notifications,
  AccountCircle,
  ExitToApp,
  CreditCard,
  HelpOutline,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useMarketplace } from "../../../utils/MarketplaceProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const accentColor = " #000080  "; // Change as needed

function Notificationbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const {
    categories,
    loading: marketplaceLoading,
    selectedCountry,
    setSelectedCountry,
  } = useMarketplace();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: accentColor, zIndex: 1201 }}
    >
      <Toolbar>
        {/* <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton> */}

        <IconButton edge="start" color="inherit" aria-label="menu">
          <img
            src={require("../../assets/MarketLynxe.png")}
            alt="Logo"
            style={{
              height: "40px",
              width: "auto",
              backgroundColor: "#fff",
              padding: "2px",
              borderRadius: "2px",
            }}
          />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          MarketPlace Management
        </Typography>

        {/* Right-aligned Box */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "67px",
            justifyContent: "flex-end",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Preset Dropdown */}
            <Box sx={{ paddingTop: "5px" }}>
             <FormControl 
  size="small" 
  sx={{ 
    minWidth: 130, 
    pr: "9px",
    "& .MuiInputLabel-root": {
      color: "rgba(0, 0, 0, 0.6)", // Label color (default gray)
      "&.Mui-focused": {
        color: "#000080", // Label color when focused
      },
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white", // White background
      "& fieldset": {
        borderColor: "#cacaca", // Border color
      },
      "&:hover fieldset": {
        borderColor: "#000080", // Border on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#000080", // Border when focused
      },
    },
    "& .MuiSelect-select": {
      color: "rgba(0, 0, 0, 0.87)", // Text color
      backgroundColor: "white", // Ensure background is white
      paddingTop: "8.5px", // Adjust vertical padding
      paddingBottom: "8.5px",
    },
    "& .MuiSvgIcon-root": {
      color: "rgba(0, 0, 0, 0.54)", // Dropdown arrow color
    },
  }}
>
  <InputLabel shrink={selectedCountry !== ""}></InputLabel>
  <Select
    value={selectedCountry}
    // label="Country"
    onChange={(e) => setSelectedCountry(e.target.value)}
    displayEmpty
  >
    <MenuItem value="">All Countries</MenuItem>
    <MenuItem value="US">United States</MenuItem>
    <MenuItem value="UK">United Kingdom</MenuItem>
  </Select>
</FormControl>
            </Box>
          </LocalizationProvider>

          {/* Notification Icon */}
          <ListItem sx={{ display: "flex", alignItems: "center", padding: 0 }}>
            <Notifications sx={{ fontSize: 28, color: "#fff" }} />
          </ListItem>

          {/* Profile Section */}
          <List
            sx={{
              width: "100%",
              textAlign: "right",
              marginTop: "13px",
              marginBottom: 2,
            }}
          >
            <ListItem
              button
              onClick={handleProfileClick}
              sx={{
                flexDirection: "column",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <Avatar sx={{ bgcolor: "white", color: "blue" }}>
                <AccountCircle sx={{ fontSize: 28 }} />
              </Avatar>
              {/* <ListItemText primary="User" sx={{ color: "#fff", fontSize: "14px", marginTop: "4px" }} /> */}
            </ListItem>
          </List>
        </Box>
      </Toolbar>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: 1 }}
      >
        <MenuItem disabled>
          <ListItemText
            primary="Hello, MarketPlace User01"
            secondary="marketplace@user1gmail.com"
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CreditCard />
          </ListItemIcon>
          <ListItemText primary="Billing" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HelpOutline />
          </ListItemIcon>
          <ListItemText primary="Get Help" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Notificationbar;
