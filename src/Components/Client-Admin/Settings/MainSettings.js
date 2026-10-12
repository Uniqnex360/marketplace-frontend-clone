// src/components/SuperAdmin/Dashboard/MainSettings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import BusinessFormulas from '../Dashboard/BusinessFormulas';

const MainSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [categories, setCategories] = useState([]);
  const userData = localStorage.getItem("user");
  let userIds = "";

  if (userData) {
    const data = JSON.parse(userData);
    userIds = data.id;
  }
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(`${process.env.REACT_APP_IP}obtainManufactureUnitList/?user_id=${userIds}`);
        console.log('9090', categoryResponse)
        setCategories(categoryResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        p: { xs: 1, sm: 2 },
        mt: { xs: 2, md: 3 },
        mb: { xs: 2, md: 3 }
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: { xs: "calc(100vh - 120px)", md: "calc(100vh - 160px)" },
          width: "100%",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            p: { xs: 1, sm: 2, md: 3 },
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: { xs: 0, sm: 1 },
          }}
        >
          <BusinessFormulas />
        </Box>
      </Box>
    </Container>
  );
};

export default MainSettings;