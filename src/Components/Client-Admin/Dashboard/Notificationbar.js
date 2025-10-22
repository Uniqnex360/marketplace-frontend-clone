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
  useMediaQuery,
} from "@mui/material";
import {
  Notifications,
  AccountCircle,
  ExitToApp,
  CreditCard,
  HelpOutline,
  Menu as MenuIcon,
  Language,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMarketplace } from "../../../utils/MarketplaceProvider";
import { useNavigate } from "react-router-dom";

const accentColor = "#000080";

function Notificationbar() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Responsive breakpoint
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const open = Boolean(anchorEl);
  const openMobileMenu = Boolean(mobileMenuAnchor);

  const { selectedCountry, setSelectedCountry } = useMarketplace();

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleMobileMenu = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: accentColor, zIndex: 1201 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT: Logo + (Optional) Drawer Trigger */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isSmall && (
            <IconButton color="inherit" edge="start" onClick={handleMobileMenu}>
              <MenuIcon />
            </IconButton>
          )}
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img
              src={require("../../assets/MarketLynxe.png")}
              alt="Logo"
              style={{
                height: isSmall ? "32px" : "40px",
                width: "auto",
                backgroundColor: "#fff",
                padding: "2px",
                borderRadius: "2px",
              }}
            />
          </IconButton>
        </Box>

        {/* CENTER: Title */}
        {!isSmall && (
          <Typography
            variant={isMedium ? "subtitle1" : "h6"}
            sx={{ flexGrow: 1, textAlign: "center", fontWeight: 600 }}
          >
            MarketPlace Management
          </Typography>
        )}

        {/* RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Country Selector */}
          {!isSmall && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl
                size="small"
                sx={{
                  minWidth: 130,
                  pr: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "& fieldset": { borderColor: "#cacaca" },
                    "&:hover fieldset": { borderColor: accentColor },
                    "&.Mui-focused fieldset": { borderColor: accentColor },
                  },
                }}
              >
                <InputLabel shrink={selectedCountry !== ""}></InputLabel>
                <Select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "country select" }}
                >
                  <MenuItem value="US">United States</MenuItem>
                  <MenuItem value="UK">United Kingdom</MenuItem>
                </Select>
              </FormControl>
            </LocalizationProvider>
          )}

          {/* Notification Icon */}
          {!isSmall && (
            <IconButton color="inherit">
              <Notifications sx={{ fontSize: 26 }} />
            </IconButton>
          )}

          {/* Profile */}
          <IconButton color="inherit" onClick={handleProfileClick}>
            <Avatar sx={{ bgcolor: "white", color: accentColor }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* --- Profile Menu --- */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleProfileClose}>
        <MenuItem disabled>
          <ListItemText
            primary="Hello, MarketPlace User01"
            secondary="marketplace@user1gmail.com"
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileClose}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={handleProfileClose}>
          <ListItemIcon>
            <CreditCard />
          </ListItemIcon>
          <ListItemText primary="Billing" />
        </MenuItem>
        <MenuItem onClick={handleProfileClose}>
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

      {/* --- Mobile Menu (Hamburger) --- */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={openMobileMenu}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              displayEmpty
            >
              <MenuItem value="US">US</MenuItem>
              <MenuItem value="UK">UK</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Notifications />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

export default Notificationbar;