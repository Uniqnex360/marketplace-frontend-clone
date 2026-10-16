import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Box,
  FormControl,
  Select,
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
import { useMarketplace } from "../../../utils/MarketplaceProvider";
import { useNavigate } from "react-router-dom";

const accentColor = "#000080";

function Notificationbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const { selectedCountry, setSelectedCountry } = useMarketplace();

  const open = Boolean(anchorEl);
  const openMobileMenu = Boolean(mobileMenuAnchor);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleProfileClose();
    navigate("/");
  };

  const handleMobileMenu = (event) => setMobileMenuAnchor(event.currentTarget);

  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: accentColor, zIndex: 1201 }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2 },
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {/* Left: Logo and mobile menu */}
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          {isSmall && (
            <IconButton
              color="inherit"
              edge="start"
              aria-label="Open menu"
              onClick={handleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
          )}

          <IconButton
            edge="start"
            color="inherit"
            aria-label="Home"
            onClick={() => navigate("/")}
            sx={{ flexShrink: 0 }}
          >
            <Box
              component="img"
              src={require("../../assets/MarketLynxe.png")}
              alt="Logo"
              sx={{
                height: { xs: 30, sm: 40 },
                width: "auto",
                maxWidth: { xs: 90, sm: 140 },
                backgroundColor: "#fff",
                padding: "2px",
                borderRadius: "2px",
              }}
            />
          </IconButton>
        </Box>

        {/* Right: Welcome, notifications and profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: { xs: 0.5, sm: 1 },
            minWidth: 0,
          }}
        >
          <Typography
            noWrap
            sx={{
              display: { xs: "none", sm: "block" },
              fontFamily:
                "'Nunito Sans', -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
              fontWeight: 500,
              fontSize: { sm: 14, md: 20 },
              maxWidth: { sm: 120, md: "none" },
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Welcome User
          </Typography>

          {!isSmall && (
            <IconButton color="inherit" aria-label="Notifications">
              <Notifications sx={{ fontSize: { sm: 23, md: 26 } }} />
            </IconButton>
          )}

          <IconButton
            color="inherit"
            aria-label="Profile menu"
            onClick={handleProfileClick}
          >
            <Avatar
              sx={{
                bgcolor: "white",
                color: accentColor,
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
              }}
            >
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>

      {/* Profile menu */}
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

      {/* Mobile menu: country selector and notifications */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={openMobileMenu}
        onClose={handleMobileMenuClose}
        slotProps={{
          paper: {
            sx: { width: 220, maxWidth: "calc(100vw - 16px)" },
          },
        }}
      >
        <MenuItem disableRipple>
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <FormControl size="small" fullWidth>
            <Select
              value={selectedCountry}
              onChange={(event) => {
                setSelectedCountry(event.target.value);
                handleMobileMenuClose();
              }}
              inputProps={{ "aria-label": "Select country" }}
            >
              <MenuItem value="US">US</MenuItem>
              <MenuItem value="UK">UK</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem onClick={handleMobileMenuClose}>
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
