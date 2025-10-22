import { useState } from "react";
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

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email");
        isValid =false;
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
    console.log('BASEURL', baseUrl);

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}loginUser/`,
        { email, password }
      );

      if (response.data && response.data.data) {
        const userData = response.data.data;

        if (!userData.valid) {
          toast.error("Invalid credentials!");
        } else {
          localStorage.setItem("user", JSON.stringify(userData));
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
    <Box display="flex" height="100vh" width="100vw" overflow="hidden">
      {/* Left side - Background & Text */}
      <Box
        flex={{ xs: 1, sm: 3, md: 4 }} // Responsive flex: mobile=1, tablet=3, desktop=4
        sx={{
          backgroundColor: "#000080",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 2, sm: 3, md: 4 },
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant={["h5", "h4", "h4"]} // Smaller on mobile
          sx={{
            fontWeight: "bold",
            marginBottom: { xs: 2, sm: 3 },
          }}
        >
          Marketplace Management
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: { xs: "90%", sm: "80%" },
            lineHeight: 1.6,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          Our marketplace platform empowers vendors to manage products across multiple channels from one central hub. Leverage effortless product listing, real-time inventory sync, and centralized order management. Gain valuable insights with sales and profit reports, enabling smarter decisions and accurate sales forecasting.
        </Typography>
      </Box>

      {/* Right side - Login Form / Forgot Password / Register */}
      <Box
        flex={{ xs: 1, sm: 2, md: 3 }} // Responsive flex
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#fcdbf91c",
          px: { xs: 1, sm: 2 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {showForgotPassword ? (
          <ForgotPassword onClose={toggleForgotPassword} />
        ) : showRegisterPage ? (
          <Register />
        ) : (
          <Box
            component={Paper}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              width: "100%",
              maxWidth: { xs: "90%", sm: "330px" },
              mx: "auto",
              borderRadius: { xs: 2, sm: 3 },
            }}
            gap={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography
              variant={["h6", "h5", "h5"]}
              color="textPrimary"
              gutterBottom
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
              sx={{ mb: 2 }}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Typography
              variant="body2"
              color="primary"
              style={{
                cursor: "pointer",
                alignSelf: "flex-end",
                marginTop: "5px",
              }}
              onClick={toggleForgotPassword}
            >
              Forgot Password?
            </Typography>

            <Button
              variant="contained"
              onClick={handleLogin}
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: '#000080',
                color: '#fff',
                position: 'relative',
                '&:hover': {
                  backgroundColor: '#000066',
                },
                py: 1.5,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              Login
            </Button>

            {loading && <DottedCircleLoading />}

            <Button
              variant="text"
              color="secondary"
              onClick={toggleRegisterPage}
              fullWidth
              sx={{
                textTransform: "none",
                color: "#121212",
                mt: 2,
                fontSize: { xs: "0.9rem", sm: "1rem" },
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
      />
    </Box>
  );
};

export default LoginPage;