import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Checkbox,
  Typography,
  Tooltip,
  Grid,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import {
  Storefront,
  CalendarToday,
  LocalShipping,
  CreditCard,
  Person,
  Email,
  Phone,
  CheckCircle,
  AttachMoney,
  ConfirmationNumber,
  ArrowBack,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const OrderDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [market, setMarket] = useState(null);
  const [shipping, setShipping] = useState({});
  const [fulfillment, setFulfillment] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const userData = localStorage.getItem("user");

  const [currentIndex, setCurrentIndex] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get("page") || 1;

  const { searchQuery } = location.state || {};
  console.log("searchQuery-Details:", searchQuery);
  let userIds = "";

  if (userData) {
    const data = JSON.parse(userData);
    userIds = data.id;
  }

  const detailsPage = queryParams.get("detail");
  const productId = queryParams.get("productId");

  const handleBackClick = () => {
    const currentPage = queryParams.get("page") || 1;
    const rowsPerPageURL = queryParams.get("rowsPerPage");
    if (detailsPage !== "detail-name") {
      navigate(
        `/Home/orders?page=${currentPage}&rowsPerPage=${rowsPerPageURL}`
      );
    }
    if (detailsPage === "detail-name") {
      navigate(
        `/Home/products/details/${productId}?page=${currentPage}&rowsPerPage=${rowsPerPageURL}&name=orderTab`
      );
    }
  };

  // Fetch Order Details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_IP}fetchOrderDetails/`,
          {
            params: { order_id: id, user_id: userIds },
          }
        );

        console.log("Full Response:", response);
        console.log(
          "Response Data 1111:",
          response.data.data.order_items.ProductDetails
        );

        if (response.data?.data) {
          setMarket(response.data.data.marketplace_name);
          setOrder(response.data.data);
          setShipping(response.data.data.shipping_information);
          const orderFulfill = response.data.data.order_items;
          if (orderFulfill && orderFulfill.length > 0) {
            setFulfillment(orderFulfill[0].Fulfillment);
          }
        } else {
          setOrder({});
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const formatDate = (timestamp) => {
    if (timestamp) {
      return new Date(timestamp).toLocaleDateString();
    }
    return "";
  };

  const renderSkeletonLoader = () => (
    <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: "#f4f6f8" }}>
      <Box sx={{ display: "flex", alignItems: "center", padding: { xs: "10px", md: "20px" } }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={200} sx={{ ml: 2 }} />
      </Box>

      <Grid container spacing={3} style={{ padding: { xs: "10px", md: "20px" } }}>
        {[...Array(3)].map((_, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="80%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card style={{ margin: { xs: "10px", md: "20px" }, padding: "10px" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="80%" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card style={{ margin: { xs: "10px", md: "20px" }, padding: "10px" }}>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {[...Array(5)].map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(3)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(5)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <>
      {loading ? (
        renderSkeletonLoader()
      ) : (
        <Box sx={{ p: { xs: 1, md: 3 }, backgroundColor: "#f4f6f8" }}>
          <div style={{ padding: { xs: "10px", md: "20px" }, fontSize: "14px" }}>
            {/* Back Button Section */}
            <Box
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                padding: { xs: "10px", md: "20px" },
                mb: 2
              }}
            >
              <IconButton 
                sx={{ 
                  marginLeft: { xs: 0, md: "-3%" },
                  mr: 1
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
                Back to Orders
              </Typography>
            </Box>

            {/* Cards Grid */}
            <Grid
              container
              spacing={3}
              sx={{
                paddingLeft: { xs: "10px", md: "22px" },
                paddingRight: { xs: "10px", md: "20px" },
                marginTop: { xs: "5px", md: "10px" },
              }}
            >
              {/* Order Details Card */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                      Order Details
                    </Typography>

                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={1}>
                        <Tooltip title="Channel" arrow>
                          <Storefront sx={{ color: "#000080", fontSize: { xs: "18px", md: "24px" } }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {order?.marketplace_name || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={1}>
                        <Tooltip title="Order Date" arrow>
                          <CalendarToday sx={{ color: "#000080", fontSize: { xs: "18px", md: "24px" } }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {formatDate(order?.order_date) || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={1}>
                        <Tooltip title="Order Status" arrow>
                          <CheckCircle sx={{ color: "#000080", fontSize: { xs: "18px", md: "24px" } }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {order?.order_status || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={1}>
                        <Tooltip title="Order Total" arrow>
                          <AttachMoney sx={{ color: "#000080", fontSize: { xs: "18px", md: "24px" } }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {order?.order_total || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Customer Details Card */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                      Customer Details
                    </Typography>

                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={1}>
                        <Tooltip title="Customer Name" arrow>
                          <Person sx={{ color: "#000080", fontSize: { xs: "18px", md: "24px" } }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {order?.customer_name || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Grid item xs={1}>
                        <Tooltip title="Customer Order ID" arrow>
                          <ConfirmationNumber sx={{ color: "#000080", fontSize: { xs: "18px", md: "24px" } }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {order?.customer_order_id || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                      <Grid item xs={1}>
                        <Tooltip title="Customer Email" arrow>
                          <Email sx={{ color: "#000080", fontSize: { xs: "16px", md: "20px" }, mt: 0.5 }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography
                          sx={{
                            color: "#000080",
                            wordBreak: "break-all",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                          }}
                        >
                          {order?.customer_email_id || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={1}>
                        <Tooltip title="Customer Phone" arrow>
                          <Phone sx={{ color: "#000080", fontSize: { xs: "18px", md: "24px" } }} />
                        </Tooltip>
                      </Grid>
                      <Grid item xs={11}>
                        <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {shipping?.phone || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Fulfillment Details Card */}
              <Grid item xs={12} md={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                      Fulfillment Details
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          Fulfillment Status
                        </Typography>
                        <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {fulfillment?.FulfillmentOption || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          Shipping Method
                        </Typography>
                        <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {fulfillment?.ShipMethod || "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Box>

                    {fulfillment?.ShipDateTime && (
                      <Box sx={{ mb: 1 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                            Ship Date
                          </Typography>
                          <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                            {new Date(fulfillment?.ShipDateTime).toLocaleString() || "Not Applicable"}
                          </Typography>
                        </Grid>
                      </Box>
                    )}

                    {fulfillment?.Carrier && (
                      <Box sx={{ mb: 1 }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                            Carrier
                          </Typography>
                          <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                            {fulfillment?.Carrier || "Not Applicable"}
                          </Typography>
                        </Grid>
                      </Box>
                    )}

                    <Box>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          Fulfillment Channel
                        </Typography>
                        <Typography sx={{ color: "#000080", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          {order?.fulfillment_channel
                            ? order?.fulfillment_channel
                            : "Not Applicable"}
                        </Typography>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Shipping Address Card */}
            <Card sx={{ margin: { xs: "10px", md: "20px" }, padding: "10px" }}>
              <CardContent>
                <Grid container spacing={2} justifyContent="space-between">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                      Shipping Address
                    </Typography>

                    <Typography variant="body2" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                      {order?.marketplace_name === "Walmart" ? (
                        <>
                          {shipping?.postalAddress?.name && (
                            <>
                              {shipping.postalAddress.name}
                              <br />
                            </>
                          )}
                          {shipping?.postalAddress?.address1 && (
                            <>
                              {shipping.postalAddress.address1}
                              <br />
                            </>
                          )}
                          {shipping?.postalAddress?.address2 && (
                            <>
                              {shipping.postalAddress.address2}
                              <br />
                            </>
                          )}
                          {shipping?.postalAddress?.city &&
                            shipping?.postalAddress?.state &&
                            shipping?.postalAddress?.postalCode && (
                              <>
                                {shipping.postalAddress.city},{" "}
                                {shipping.postalAddress.state}{" "}
                                {shipping.postalAddress.postalCode}
                                <br />
                              </>
                            )}
                          {shipping?.postalAddress?.country && (
                            <>
                              {shipping.postalAddress.country}
                              <br />
                            </>
                          )}
                          {shipping?.phone && <>{shipping.phone}</>}
                        </>
                      ) : order?.marketplace_name === "Amazon" ? (
                        <>
                          {order?.shipping_information?.City && (
                            <>
                              {order.shipping_information.City}
                              <br />
                            </>
                          )}
                          {order?.shipping_information?.StateOrRegion && (
                            <>
                              {order.shipping_information.StateOrRegion}
                              <br />
                            </>
                          )}
                          {order?.shipping_information?.PostalCode && (
                            <>
                              {order.shipping_information.PostalCode}
                              <br />
                            </>
                          )}
                          {order?.shipping_information?.CountryCode && (
                            <>
                              {order.shipping_information.CountryCode}
                              <br />
                            </>
                          )}
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No shipping details available.
                        </Typography>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid
                      container
                      alignItems="center"
                      spacing={1}
                      justifyContent={{ xs: "flex-start", md: "flex-end" }}
                      sx={{ mt: { xs: 2, md: 0 } }}
                    >
                      <Grid item>
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                          Has Regulated Items
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Checkbox
                          checked={order?.has_regulated_items}
                          readOnly
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Order Items Table */}
            <Card sx={{ margin: { xs: "10px", md: "20px" }, padding: "10px" }}>
              <CardContent>
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    marginTop: "20px",
                    overflowX: 'auto'
                  }}
                >
                  <Table sx={{ minWidth: isMobile ? 600 : 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          SKU
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          Quantity
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          Unit Price
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          Subtotal
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {order?.order_items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                            {item.ProductDetails?.Title || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                            {item.ProductDetails?.SKU || "N/A"}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                            {item.ProductDetails?.QuantityOrdered || 0}
                          </TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                            {item.ProductDetails?.unit_price
                              ? `$${
                                  item.ProductDetails.unit_price % 1 >= 0.5
                                    ? item.ProductDetails.unit_price.toFixed(0)
                                    : item.ProductDetails.unit_price
                                }`
                              : "N/A"}
                          </TableCell>

                          <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                            {item?.Pricing?.ItemPrice?.Amount !== undefined &&
                            item?.Pricing?.ItemPrice?.Amount !== null
                              ? `$${Number(
                                  item.Pricing.ItemPrice.Amount
                                ).toFixed(2)}`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Summary Rows */}
                      <TableRow>
                        <TableCell colSpan={4} align="right" sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          <strong>Tax:</strong>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          {order?.order_items
                            ? `$${order.order_items
                                .reduce(
                                  (total, item) =>
                                    total +
                                    (item.Pricing?.ItemTax?.Amount || 0),
                                  0
                                )
                                .toFixed(2)}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right" sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          <strong>Shipping:</strong>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          {order?.shipping_price !== undefined &&
                          order?.shipping_price !== null
                            ? `$${Number(order.shipping_price).toFixed(2)}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right" sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          <strong>Shipping Tax:</strong>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>$0.00</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell colSpan={4} align="right" sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          <strong>Total:</strong>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          {order?.order_items
                            ? `$${(
                                order.order_items.reduce(
                                  (total, item) =>
                                    total +
                                    (item?.Pricing?.ItemPrice?.Amount || 0) +
                                    (item?.Pricing?.ItemTax?.Amount || 0),
                                  0
                                ) + (order?.shipping_price || 0)
                              ).toFixed(2)}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right" sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          <strong>Merchant Shipment Cost:</strong>
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                          {order?.merchant_shipment_cost !== undefined &&
                          order?.merchant_shipment_cost !== null
                            ? `$${Number(order.merchant_shipment_cost).toFixed(
                                2
                              )}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </div>
        </Box>
      )}
    </>
  );
};

export default OrderDetail;