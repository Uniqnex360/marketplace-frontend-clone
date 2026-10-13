import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AccountDeletionPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_RE.test(normalizedEmail)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Mock submission: no API request is made.
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Box className="page-heading deletion-heading">
        <Box className="icon-tile">
          <DeleteOutlineRoundedIcon />
        </Box>

        <Typography variant="h1" component="h1">
          Account deletion request
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 700, mt: 2 }}>
          If you want to delete your MarketLynxe account, submit the email
          address associated with it below.
        </Typography>
      </Box>

      <Paper
        component="section"
        variant="outlined"
        sx={{ p: { xs: 2.5, sm: 4 }, mt: 4 }}
      >
        <Typography variant="h2" component="h2">
          Request account deletion
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Enter the email address registered to your account. Do not enter your
          password.
        </Typography>

        {status === "success" && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your deletion request has been submitted successfully
          </Alert>
        )}

        {status === "error" && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            id="deletion-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (status !== "loading") {
                setStatus("idle");
                setErrorMessage("");
              }
            }}
            placeholder="you@example.com"
            required
            inputProps={{ maxLength: 254 }}
            helperText="Use the email address associated with your MarketLynxe account."
            disabled={status === "loading"}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="error"
            size="large"
            startIcon={
              status === "loading" ? (
                <Box
                  component="span"
                  sx={{
                    width: 18,
                    height: 18,
                    border: "2px solid currentColor",
                    borderRightColor: "transparent",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                    "@keyframes spin": {
                      to: { transform: "rotate(360deg)" },
                    },
                  }}
                />
              ) : (
                <DeleteOutlineRoundedIcon />
              )
            }
            disabled={status === "loading" || !email.trim()}
            sx={{ mt: 2.5 }}
          >
            {status === "loading"
              ? "Submitting request..."
              : "Submit deletion request"}
          </Button>
        </Box>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 3 },
          mt: 2.5,
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <Box className="icon-tile small-icon-tile">
          <LockResetRoundedIcon />
        </Box>

        <Box>
          <Typography variant="h3" component="h2">
            Looking to recover your account?
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            <Link href="mailto:[SUPPORT_EMAIL]">[SUPPORT_EMAIL]</Link>.
          </Typography>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, mt: 2.5 }}>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Read our <Link href="/privacy">Privacy Policy</Link> to learn more
          about personal information and deletion requests.
        </Typography>
      </Paper>
    </Container>
  );
}
