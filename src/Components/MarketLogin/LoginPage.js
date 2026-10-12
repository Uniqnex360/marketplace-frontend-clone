import { useEffect, useState } from "react";

import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import ForgotPassword from "./ForgotPassword";
import Register from "./Register";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DottedCircleLoading from "../Loading/DotLoading";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegisterPage, setShowRegisterPage] = useState(false);

  const navigate = useNavigate();

  // login to ensure user id from localhost
  useEffect(() => {
    const user = localStorage.getItem("user");
    const userId = localStorage.getItem("user_id");

    if (user && userId) {
      navigate("/Home/", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email");
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const baseUrl = process.env.REACT_APP_IP;
    console.log("BASEURL", baseUrl);

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}loginUser/`,
        { email, password },
      );

      if (response.data && response.data.data) {
        const userData = response.data.data;

        if (!userData.valid) {
          toast.error("Invalid credentials!");
        } else {
          // localStorage.setItem("user", JSON.stringify(userData));
          // toast.success("Login successful!");
          // switch (userData.role_name) {
          //   case "Manager":
          //     navigate("/Home/");
          //     break;
          //   default:
          //     navigate("/");
          //     break;
          // }

          localStorage.setItem("user", JSON.stringify(userData));

          // Save user id separately
          localStorage.setItem("user_id", userData.id);

          toast.success("Login successful!");

          switch (userData.role_name) {
            case "Manager":
              navigate("/Home/");
              break;

            default:
              navigate("/");
              break;
          }
        }
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server Error! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleMouseDownPassword = (event) => event.preventDefault();

  const toggleForgotPassword = () => setShowForgotPassword(!showForgotPassword);

  const toggleRegisterPage = () => setShowRegisterPage(!showRegisterPage);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      minHeight="100vh"
      width="100%"
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: "#fcdbf91c",
      }}
    >
      {/* Left side - Background & Text */}
      <Box
        flex={{ xs: "0 0 auto", md: "4 1 0%" }}
        sx={{
          backgroundColor: "#000080",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2.5, sm: 4, md: 5, lg: 7 },
          py: { xs: 4, sm: 5, md: 6 },
          color: "#fff",
          textAlign: "center",
          minHeight: { xs: "auto", md: "100vh" },
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: {
              xs: "1.45rem",
              sm: "1.8rem",
              md: "2rem",
              lg: "2.25rem",
            },
            fontWeight: "bold",
            mb: { xs: 1.5, sm: 2.5, md: 3 },
            lineHeight: 1.3,
            maxWidth: "100%",
            overflowWrap: "anywhere",
          }}
        >
          Marketplace Management
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: { xs: "100%", sm: "520px", md: "650px" },
            lineHeight: { xs: 1.65, sm: 1.75 },
            fontSize: {
              xs: "0.85rem",
              sm: "0.95rem",
              md: "1rem",
              lg: "1.05rem",
            },
            overflowWrap: "break-word",
          }}
        >
          Our marketplace platform empowers vendors to manage products across
          multiple channels from one central hub. Leverage effortless product
          listing, real-time inventory sync, and centralized order management.
          Gain valuable insights with sales and profit reports, enabling smarter
          decisions and accurate sales forecasting.
        </Typography>
      </Box>

      {/* Right side - Login Form / Forgot Password / Register */}
      <Box
        flex={{ xs: "1 1 auto", md: "3 1 0%" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#fcdbf91c",
          px: { xs: 2, sm: 3, md: 3, lg: 4 },
          py: { xs: 4, sm: 5, md: 4 },
          width: "100%",
          minWidth: 0,
          minHeight: { xs: "auto", md: "100vh" },
          boxSizing: "border-box",
        }}
      >
        {showForgotPassword ? (
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "400px", md: "430px" },
              minWidth: 0,
            }}
          >
            <ForgotPassword onClose={toggleForgotPassword} />
          </Box>
        ) : showRegisterPage ? (
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "450px", md: "500px" },
              minWidth: 0,
            }}
          >
            <Register />
          </Box>
        ) : (
          <Box
            component={Paper}
            elevation={3}
            sx={{
              p: { xs: 2.5, sm: 3.5, md: 4 },
              width: "100%",
              maxWidth: { xs: "100%", sm: "380px", md: "400px" },
              minWidth: 0,
              mx: "auto",
              borderRadius: { xs: 2, sm: 3 },
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            gap={{ xs: 1.5, sm: 2 }}
          >
            <Typography
              variant="h5"
              color="textPrimary"
              gutterBottom
              sx={{
                fontSize: {
                  xs: "1.3rem",
                  sm: "1.5rem",
                  md: "1.6rem",
                },
                fontWeight: 600,
                textAlign: "center",
                mb: { xs: 1, sm: 1.5 },
              }}
            >
              Sign In
            </Typography>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              fullWidth
              variant="outlined"
              error={!!emailError}
              helperText={emailError}
              autoComplete="email"
              size="medium"
              sx={{
                mb: { xs: 1, sm: 1.5 },
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                },
                "& .MuiFormHelperText-root": {
                  mx: 0,
                  fontSize: "0.75rem",
                  overflowWrap: "anywhere",
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              error={!!passwordError}
              helperText={passwordError}
              autoComplete="current-password"
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: { xs: 0.5, sm: 1 },
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                },
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                },
                "& .MuiFormHelperText-root": {
                  mx: 0,
                  fontSize: "0.75rem",
                  overflowWrap: "anywhere",
                },
              }}
            />

            <Typography
              variant="body2"
              color="primary"
              role="button"
              tabIndex={0}
              onClick={toggleForgotPassword}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleForgotPassword();
                }
              }}
              sx={{
                cursor: "pointer",
                alignSelf: "flex-end",
                mt: { xs: 0.5, sm: 1 },
                mb: { xs: 0.5, sm: 1 },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                textAlign: "right",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password?
            </Typography>

            <Button
              variant="contained"
              onClick={handleLogin}
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "#000080",
                color: "#fff",
                position: "relative",
                "&:hover": {
                  backgroundColor: "#000066",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#7777a8",
                  color: "#fff",
                },
                py: { xs: 1.25, sm: 1.5 },
                minHeight: { xs: "44px", sm: "48px" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 600,
                borderRadius: 1.5,
                textTransform: "none",
              }}
            >
              Login
            </Button>

            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  py: 1,
                }}
              >
                <DottedCircleLoading />
              </Box>
            )}

            <Button
              variant="text"
              color="secondary"
              onClick={toggleRegisterPage}
              fullWidth
              sx={{
                textTransform: "none",
                color: "#121212",
                mt: { xs: 0.5, sm: 1 },
                px: { xs: 0.5, sm: 1 },
                py: 1,
                minHeight: "44px",
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "0.95rem" },
                whiteSpace: "normal",
                lineHeight: 1.5,
                textAlign: "center",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 128, 0.06)",
                },
              }}
            >
              Don't have an account? SignUp
            </Button>
          </Box>
        )}
      </Box>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          width: "min(100vw - 32px, 400px)",
          maxWidth: "100%",
        }}
      />
    </Box>
  );
};

export default LoginPage;
