import React, { useState, useEffect, useRef } from 'react';
import { 
  Tabs, 
  Tab, 
  TextField, 
  MenuItem, 
  Button,
  Chip, 
  Tooltip, 
  Paper,
  TableCell, 
  IconButton,
  TableHead, 
  TableBody, 
  TableRow, 
  Table, 
  TableContainer,
  Select, 
  Typography, 
  Box, 
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Close";
import { ContentCopy as CopyIcon, Info as InfoIcon } from "@mui/icons-material";
import { useParams, Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import ProductAttributes from './ProductAttributes';
import DetailVarient from './DetailVarient';
import ProductOrdersDetailTab from './ProductOrdersDetailTab';
import { Snackbar, Alert } from '@mui/material'; 

const ProductDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabIndex, setTabIndex] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [ordersData, setOrdersData] = useState([]);
  const { id } = useParams();
  const [product, setProduct] = useState([]); 
  const [attributes, setAttributes] = useState([]); 
  const [MarketplaceImage, setMarketplaceImage] = useState([]); 
  const [loading, setLoading] = useState(false);

  const [startDateHelium, setStartDateHelium] = useState(dayjs().subtract(7, 'day'));
  const [endDateHelium, setEndDateHelium] = useState(dayjs());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get('page') || 0;
  const rowsPerPageURL = queryParams.get('rowsPerPage');
  
  let lastParamsRef = useRef("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { searchQuery } = location.state || {};
  const userData = localStorage.getItem("user");
  let userIds = "";

  if (userData) {
    const data = JSON.parse(userData);
    userIds = data.id;
  }
 
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [inventory, setInventory] = useState([
    {
      id: 1,
      priority: 1,
      warehouseName: "Superltd",
      onHand: 40,
      available: 40,
      reserved: 0,
      binLocation: "",
    },
  ]);

  const [thumbnailImages, setThumbnailImages] = useState([]);

  const handleThumbnailImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newThumbnail = URL.createObjectURL(file);
      setThumbnailImages([...thumbnailImages, newThumbnail]);
    }
  };

  useEffect(() => {
    const nameTab = queryParams.get('name');
    if (nameTab === 'orderTab') {
      setTabIndex(4);
    }
  }, [location.search]);

  const handleRemoveThumbnailImage = (index) => {
    const updatedImages = thumbnailImages.filter((_, idx) => idx !== index);
    setThumbnailImages(updatedImages);
  };

  const setProductDescription = (newDescription) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      product_description: newDescription
    }));
  };

  const handleFeatureChange = (event, index) => {
    const updatedFeatures = [...product.features];
    updatedFeatures[index] = event.target.value;
    setProduct({ ...product, features: updatedFeatures });
  };

  useEffect(() => {
    const currentParams = JSON.stringify({
      id
    });

    if (lastParamsRef.current !== currentParams) {
      lastParamsRef.current = currentParams;
      fetchProductDetails();
    }
  }, [id]);
  
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("user");
      let userIds = "";

      if (userData) {
        const data = JSON.parse(userData);
        userIds = data.id;
      }

      const response = await axios.get(`${process.env.REACT_APP_IP}fetchProductDetails/`, {
        params: {
          product_id: id,
          user_id: userIds
        }
      });

      if (response.data?.data) {
        setProduct(response.data.data);
        setAttributes(response.data?.data?.attributes);
        setMarketplaceImage(response.data.data);
      } else {
        setProduct({});
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    const update_obj = {
      vendor_discount: product.vendor_discount ? product.vendor_discount : 0,
      vendor_funding: product.vendor_funding ? product.vendor_funding : 0,
    };

    const payload = {
      user_id: userIds,
      product_id: id,
      update_obj: update_obj,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_IP}updateProductDetails/`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage('Product details updated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(response.data.message || 'Failed to update product details.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error sending update request:', error);
      setSnackbarMessage('Error updating product details. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  if (!product) {
    return <p>No product details found.</p>;
  }

  const handleWarehouseChange = (event) => {
    setSelectedWarehouse(event.target.value);
  };

  const handleStartDateChange = (newDate) => {
    setStartDateHelium(newDate);
  };

  const handleEndDateChange = (newDate) => {
    setEndDateHelium(newDate);
  };

  const handleOnHandChange = (index, value) => {
    let updatedInventory = [...inventory];
    updatedInventory[index].onHand = value;
    updatedInventory[index].available = value - updatedInventory[index].reserved;
    setInventory(updatedInventory);
  };

  const handleBinLocationChange = (index, value) => {
    let updatedInventory = [...inventory];
    updatedInventory[index].binLocation = value;
    setInventory(updatedInventory);
  };

  const handleRemoveRow = (index) => {
    let updatedInventory = [...inventory];
    updatedInventory.splice(index, 1);
    setInventory(updatedInventory);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentOrders = ordersData.slice(startIndex, endIndex);

  const handleBackClick = () => {
    navigate(`/Home/products?page=${currentPage}&&rowsPerPage=${rowsPerPageURL}`);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  return (
    <Box sx={{ 
      maxWidth: '100%', 
      margin: 'auto', 
      padding: { xs: 2, sm: 3, md: '45px' },
      marginTop: { xs: 2, md: 0 }
    }}>
      {/* Back and Title Section */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        padding: { xs: "10px", md: "20px" },
        marginLeft: { xs: 0, md: '-43px' }
      }}>
        <IconButton 
          sx={{ 
            marginLeft: { xs: 0, md: "-3%" },
            marginRight: { xs: 1, md: 0 }
          }} 
          onClick={handleBackClick}
        >
          <ArrowBack />
        </IconButton>
        <Typography 
          sx={{ 
            fontSize: { xs: "16px", md: "18px" },
            marginTop: { xs: "0", md: "7px" }
          }}
        >
          Back to Products
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ 
        mb: 2, 
        marginTop: { xs: '1%', md: '2%' }, 
        color: '#000080',
        fontSize: { xs: '1.5rem', md: '2rem' }
      }}>
        Edit Product
      </Typography>

      {/* Tabs - Scrollable on mobile */}
      <Box sx={{ 
        width: '100%', 
        overflow: 'auto',
        mb: 2
      }}>
        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          sx={{
            minWidth: { xs: '600px', sm: 'auto' },
            '& .MuiTab-root': {
              color: '#000080',
              fontWeight: 700,
              fontSize: { xs: '14px', md: '16px' },
              textTransform: 'capitalize',
              minWidth: { xs: '120px', md: 'auto' },
              px: { xs: 1, md: 2 }
            },
            '& .Mui-selected': {
              color: '#000080',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#000080',
            },
          }}
        >
          <Tab label="Product Info" />
          <Tab label="Description" />
          <Tab label="Images" />
          <Tab label="Listings" />
          <Tab label="Orders" />
          <Tab label="Attributes" />
          <Tab label="Variants" />
        </Tabs>
      </Box>

      {/* Save buttons */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: { xs: 'center', md: 'flex-end' }, 
        mt: 2,
        gap: 1
      }}>
        <Button 
          sx={{ 
            backgroundColor: '#000080', 
            color: "#fff", 
            textTransform: 'capitalize',
            fontSize: { xs: '0.8rem', md: '0.9rem' },
            px: { xs: 2, md: 3 }
          }} 
          variant="contained" 
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      {/* Content Based on Selected Tab */}
      {tabIndex === 0 && (
        <Paper sx={{ padding: { xs: 2, md: 3 }, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.product_title || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SKU"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.sku || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.category || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Brand"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.brand_name || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manufacturer"
                fullWidth
                size="small"
                disabled
                sx={{ mb: 2 }}
                value={product.manufacturer_name || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Model Number"
                fullWidth
                size="small"
                disabled
                sx={{ mb: 2 }}
                value={product.model_number || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price ($)"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                type="number"
                value={product.price || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="MSRP ($)"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                type="number"
                value={product.msrp || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Currency"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.currency || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                fullWidth
                size="small"
                disabled
                sx={{ mb: 2 }}
                value={product.quantity || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vendor Funding"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={product.vendor_funding ?? "0"}
                placeholder="0"
                onChange={(e) => setProduct({ ...product, vendor_funding: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vendor Discount"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                value={product.vendor_discount ?? "0"}
                placeholder="0"
                onChange={(e) => setProduct({ ...product, vendor_discount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amazon Product Cost"
                fullWidth
                size="small"
                disabled
                sx={{ mb: 2 }}
                value={product.product_cost || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amazon Fee"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.referral_fee || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amazon Shipping Cost"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.a_shipping_cost || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amazon Total COGS"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.total_cogs || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Walmart Product Cost"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.w_product_cost || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Walmart Fee"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.walmart_fee || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Walmart Shipping Cost"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.w_shiping_cost || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Walmart Total COGS"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.w_total_cogs || "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pack Size"
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                disabled
                value={product.pack_size || "0"}
              />
            </Grid>

            {/* Date Pickers - Stack on mobile */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 1 },
                  width: '100%'
                }}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    views={["year", "month", "day"]}
                    disableFuture
                    maxDate={endDate}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          width: { xs: '100%', sm: '300px' },
                          '& .MuiInputBase-root': { 
                            height: { xs: 40, sm: 30 }, 
                            fontSize: { xs: '14px', sm: '12px' } 
                          },
                        }}
                      />
                    )}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    views={["year", "month", "day"]}
                    minDate={startDate}
                    shouldDisableDate={(date) => date.isBefore(startDate, 'day')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        sx={{
                          width: { xs: '100%', sm: '300px' },
                          '& .MuiInputBase-root': { 
                            height: { xs: 40, sm: 30 }, 
                            fontSize: { xs: '14px', sm: '12px' } 
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ padding: { xs: 2, md: 3 }, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                size="small"
                sx={{ fontSize: 14 }}
                value={product.product_description || ""}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Grid>

            {product.features && product.features.length > 0 ? (
              product.features.map((feature, index) => (
                <Grid item xs={12} key={index}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    {`Feature ${index + 1}`}
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ height: 40 }}
                    value={feature}
                    onChange={(e) => handleFeatureChange(e, index)}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No features available</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {tabIndex === 2 && (
        <Paper sx={{ padding: { xs: 2, md: 3 }, mt: 2 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            Upload Image
          </Typography>

          {/* Main Image Upload */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              Main Image
            </Typography>
            {product.image_url ? (
              <Box sx={{ mb: 2 }}>
                <img
                  src={product.image_url}
                  alt="Main Image"
                  style={{ 
                    width: '100%', 
                    maxHeight: 300, 
                    objectFit: 'contain', 
                    border: '1px solid #ddd', 
                    borderRadius: 4 
                  }}
                />
              </Box>
            ) : (
              <Box>
                <TextField
                  type="file"
                  fullWidth
                  onChange={handleImageUpload}
                  sx={{ mb: 2 }}
                  inputProps={{ accept: 'image/*' }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                  Upload the main product image. Recommended dimensions: 1000x1000 px.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Thumbnail Images Upload */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontSize: { xs: '0.9rem', md: '1rem' } }}>
              Thumbnail Images
            </Typography>
            {product.image_urls && product.image_urls.length > 0 ? (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                {product.image_urls.map((imageUrl, index) => (
                  <Box key={index} sx={{ position: 'relative', borderRadius: 4 }}>
                    <img
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ 
                        width: isMobile ? 80 : 100, 
                        height: isMobile ? 80 : 100, 
                        objectFit: 'contain' 
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        color: '#f44336',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        width: { xs: 24, md: 32 },
                        height: { xs: 24, md: 32 }
                      }}
                      onClick={() => handleRemoveThumbnailImage(index)}
                    >
                      <DeleteIcon sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                No thumbnails uploaded. Please upload thumbnail images.
              </Typography>
            )}
          </Box>
        </Paper>
      )}

      {tabIndex === 3 && (
        <Paper sx={{ padding: { xs: 2, md: 3 }, mt: 2 }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2, 
              overflowX: "auto",
              maxWidth: '100%'
            }}
          >
            <Table sx={{ minWidth: isMobile ? 400 : 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    textAlign: "center",
                    fontSize: { xs: '0.8rem', md: '0.9rem' }
                  }}>
                    Channel
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    textAlign: "center",
                    fontSize: { xs: '0.8rem', md: '0.9rem' }
                  }}>
                    Listing Status
                  </TableCell>
                  <TableCell sx={{ 
                    fontWeight: "bold", 
                    textAlign: "center",
                    fontSize: { xs: '0.8rem', md: '0.9rem' }
                  }}>
                    Quantity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product && (
                  <TableRow key={product.id}>
                    <TableCell align="center">
                      <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" alignItems="center">
                        {product.marketplace_image_url && product.marketplace_image_url.length > 0 ? (
                          product.marketplace_image_url.map((imageUrl, imgIndex) => (
                            <Box
                              key={imgIndex}
                              sx={{
                                width: { xs: '25px', md: '30px' },
                                height: { xs: '25px', md: '30px' },
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                              }}
                            >
                              <img
                                src={imageUrl}
                                alt={`${product.product_title} - Marketplace Image ${imgIndex + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            </Box>
                          ))
                        ) : (
                          <Typography variant="caption" color="textSecondary" sx={{ textAlign: 'center', width: '100%' }}>
                            N/A
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label="Active"
                        color="success"
                        sx={{ 
                          fontWeight: "bold",
                          fontSize: { xs: '0.7rem', md: '0.8rem' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={product.quantity} 
                        color={product.quantity > 10 ? "primary" : "error"}
                        sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabIndex === 4 && (
        <ProductOrdersDetailTab />
      )}

      {tabIndex === 5 && (
        <ProductAttributes productAttribute={attributes} />
      )}

      {tabIndex === 6 && (
        <DetailVarient />
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;