import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Pagination,
  Tooltip,
  Grid,
  Modal,
  Slide,
  Menu,
  IconButton,
  Collapse,
  CircularProgress,
  ListItemText,
  ListItemIcon,
  FormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterList, Refresh, Visibility } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DottedCircleLoading from "../../Loading/DotLoading";
import AddIcon from "@mui/icons-material/Add";
import FilterInventory from "../Inventory/FilterInventory";
import { useEnhancedCategories } from "../../../utils/UseEnhancedCategories";
import soon from "../../assets/soon.png";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "react-toastify/dist/ReactToastify.css";
import InventoryChannel from "./InventoryCahnnel";
import { useMarketplace } from "../../../utils/MarketplaceProvider";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import ImageIcon from "@mui/icons-material/Image";
import CountrySelector from "../../../utils/countrySelector";

const InventoryList = ({ fetchOrdersFromParent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const location = useLocation();
  const {
    categories,
    loading: marketplaceLoading,
    selectedCountry,       
  setSelectedCountry
  } = useMarketplace();
  const navigate = useNavigate();
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setExpandedCategories({});
  };
  
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedFulfillment, setselectFulfillment] = useState("");
  const [inventoryList, setInventory] = useState([]);
  
  const handleFulfillmentSelect = (category, fulfillment) => {
    const { label, value } = fulfillment;
    setselectFulfillment(value);
    setSelectedCategory({ ...category, fulfillment: label });
    handleMenuClose();
  };
  
  const [currentColumn, setCurrentColumn] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [orderCount, setOrderCount] = useState(0);
  const [customStatus, setCustomStatus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoMarket, setLogoMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "all",
    name: "All Channels",
  });
  
  const enhancedCategories = useEnhancedCategories(categories);
  const [open, setOpen] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    fetchOrderData(selectedCategory.id, page, rowsPerPage);
  };
  
  const toggleExpandCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    navigate(`/Home/orders?page=${newPage}&rowsPerPage=${rowsPerPage}`);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
    navigate(`/Home/orders?page=1&rowsPerPage=${newRowsPerPage}`);
  };

  const prevParams = useRef({
    selectedCategoryId: selectedCategory.id,
    page,
    rowsPerPage,
    sortConfig,
    searchQuery,
  });

  const fetchOrderData = async (marketId, currentPage, currentRowsPerPage, currentSortConfig, currentSearchQuery) => {
    setLoading(true);
    const validRowsPerPage = currentRowsPerPage && currentRowsPerPage > 0 ? currentRowsPerPage : 25;
    const skip = (currentPage - 1) * validRowsPerPage;

    try {
      const userData = localStorage.getItem("user");
      let userIds = "";
      if (userData) {
        const data = JSON.parse(userData);
        userIds = data.id;
      }

      const marketplaceIdToUse = marketId || (localStorage.getItem("selectedCategory")
        ? JSON.parse(localStorage.getItem("selectedCategory")).id
        : "all");

      const response = await axios.post(
        `${process.env.REACT_APP_IP}fetchInventryList/`,
        {
          user_id: userIds,
          skip: skip >= 0 ? skip : 0,
          limit: validRowsPerPage,
          marketplace_id: marketplaceIdToUse,
          search_query: currentSearchQuery,
          sort_by: currentSortConfig.key,
          sort_by_value: currentSortConfig.direction === "asc" ? 1 : -1,
          country:selectedCountry
        }
      );

      if (response.data.data.inventry_list) {
        setInventory(response.data.data.inventry_list);
        setCustomStatus(response.data.data.status);
        setOrderCount(response.data.data.total_count);
        setTotalPages(Math.ceil(response.data.data.total_count / validRowsPerPage));
        setLogoMarket(
          Array.isArray(response.data.data.marketplace_list)
            ? response.data.data.marketplace_list
            : []
        );
      } else {
        setInventory([]);
        setOrderCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]);
      setOrderCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    let initialCategory = { id: "all", name: "All Channels" };
    if (storedCategory) {
      initialCategory = JSON.parse(storedCategory);
      setSelectedCategory(initialCategory);
    }

    if (location.state && location.state.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }

    fetchOrderData(
      initialCategory.id,
      page,
      rowsPerPage,
      sortConfig,
      location.state?.searchQuery || ""
    );

    prevParams.current = {
      selectedCategoryId: initialCategory.id,
      page,
      rowsPerPage,
      sortConfig,
      searchQuery: location.state?.searchQuery || "",
    };
  }, []);

  useEffect(() => {
    const shouldFetch =
      selectedCategory.id !== prevParams.current.selectedCategoryId ||
      page !== prevParams.current.page ||
      rowsPerPage !== prevParams.current.rowsPerPage ||
      JSON.stringify(sortConfig) !== JSON.stringify(prevParams.current.sortConfig) ||
      searchQuery !== prevParams.current.searchQuery;

    if (shouldFetch) {
      fetchOrderData(selectedCategory.id, page, rowsPerPage, sortConfig, searchQuery);

      prevParams.current = {
        selectedCategoryId: selectedCategory.id,
        page,
        rowsPerPage,
        sortConfig,
        searchQuery,
      };
    }
  }, [selectedCategory.id, page, rowsPerPage, sortConfig, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleOpenMenu = (event, column) => {
    setAnchorEl(event.currentTarget);
    setCurrentColumn(column);
  };
  
  const handleMarketplaceSelect = (category) => {
    setSelectedCategory(category);
    const safeCategory={
      id:category.id,
      name:category.name
    }
    localStorage.setItem("selectedCategory", JSON.stringify(safeCategory));
    setPage(1);
  };  
  
  const handleSelectSort = (key, direction) => {
    setSortConfig({ key, direction });
    setPage(1);
    setAnchorEl(null);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProduct = (category) => {
    setSelectedCategory(category);
    setPage(1);
    localStorage.setItem("selectedCategory", JSON.stringify(category));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetChange = () => {
    console.log("Reset triggered");
    setSearchQuery("");
    setSortConfig({ key: "", direction: "asc" });
    setPage(1);
    toast.success("Filters reset successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <Box sx={{ flex: 1, width: "100%", px: { xs: 1, sm: 2 } }}>
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    gap: 2,
    my: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "fixed",
    top: 0,
    right: 0,
    marginTop: { xs: "10px", md: "20px" },
    width: { xs: "100%", md: "108%" },
    backgroundColor: "white",
    zIndex: 100,
    px: { xs: 2, md: 0 },
    pb: 2,
    boxShadow: { xs: "0 2px 4px rgba(0,0,0,0.1)", md: "none" },
  }}
>
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: { xs: 1, md: 2 },
      my: 2,
      marginRight: { xs: 0, md: "4%" },
      justifyContent: { xs: "center", md: "flex-end" },
      alignItems: { xs: "stretch", md: "center" },
      marginTop: { xs: "4%", md: "6%" },
      width: "100%",
    }}
  >
    {/* Country Selector */}
    <Box sx={{ width: { xs: "100%", md: "auto" } }}>
      <CountrySelector
        selectedCountry={selectedCountry}
        onCountryChange={(country) => {
          setSelectedCountry(country);
          setPage(1);
        }}
        minWidth={150}
        sx={{
          width: { xs: "100%", md: 150 }
        }}
      />
    </Box>

    {/* Marketplace Selector */}
    <Box sx={{ width: { xs: "100%", md: "auto" } }}>
      <FormControl size="small" sx={{ width: { xs: "100%", md: 150 } }}>
        <Select
          value={selectedCategory?.id || "all"}
          onChange={(e) => {
            const selected = enhancedCategories.find(
              (cat) => cat.id === e.target.value
            );
            if (selected) {
              handleMarketplaceSelect(selected);
            }
          }}
          displayEmpty
          renderValue={(selected) => {
            const category = enhancedCategories.find(cat => cat.id === selected);
            if (!category) return "All Channels";
            
            if (category.id === "all") {
              return <span>{category.name}</span>;
            }
            
            return (
              <Box display="flex" alignItems="center" gap={1}>
                {category.icon ||
                  (category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      width={18}
                      height={14}
                    />
                  ) : (
                    <ImageIcon fontSize="small" />
                  ))}
                <span>{category.name}</span>
              </Box>
            );
          }}
        >
          {marketplaceLoading ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : (
            enhancedCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  {category.icon ||
                    (category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        width={18}
                        height={14}
                      />
                    ) : category.id !== "all" ? (
                      <ImageIcon fontSize="small" />
                    ) : null)}
                  <span>{category.name}</span>
                </Box>
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Box>

    {/* Search Field */}
    <TextField
      size="small"
      placeholder="Search by Product Title, Sku..."
      value={searchQuery}
      onChange={handleSearchChange}
      sx={{
        width: { xs: "100%", md: 300 },
        "& input": {
          fontSize: "14px",
        },
      }}
    />

    {/* Action Buttons */}
    <Box sx={{ 
      display: "flex", 
      gap: 1, 
      width: { xs: "100%", md: "auto" },
      justifyContent: { xs: "flex-end", md: "flex-start" } 
    }}>
      <Tooltip title="Reset" arrow>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "#000080",
            minWidth: "auto",
            padding: "6px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: { xs: 0, md: "none" },
            width: { xs: "48px", md: "auto" },
            "&:hover": {
              backgroundColor: "darkblue",
            },
          }}
          onClick={handleResetChange} 
        >
          <Refresh sx={{ color: "white", fontSize: { xs: "18px", md: "20px" } }} />
        </Button>
      </Tooltip>
    </Box>

    {/* Inventory Count */}
    <Typography variant="body2" sx={{ 
      textAlign: { xs: "center", md: "left" },
      width: { xs: "100%", md: "auto" },
      mt: { xs: 1, md: 0 }
    }}>
      Total Inventory: {orderCount ? orderCount : "0"}
    </Typography>
  </Box>
</Box>


      {/* Main Content */}
      <Box sx={{ paddingTop: { xs: "220px", md: "180px" } }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <DottedCircleLoading />
          </div>
        ) : inventoryList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            No Data Found
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {inventoryList.map((order, index) => (
                <Card key={order.id} sx={{ mb: 2, p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <img
                        src={order.image_url || soon}
                        alt="Product"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: 5,
                        }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {order.product_title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        SKU: {order.sku || "N/A"}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2">
                          Qty: {order.quantity || 0}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {order.price || "$0.00"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Box>

            {/* Desktop Table View - Using Original Headers */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: "70vh",
                  display: "flex",
                  justifyContent: "center",
                  overflowY: "overlay",
                  overflowX: "overlay",
                  "&::-webkit-scrollbar": {
                    height: "2px",
                    width: "2px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "10px",
                  },
                }}
              >
                <Table sx={{ minWidth: 650, margin: "0 auto" }}>
                  <TableHead
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f6f6f6",
                    }}
                  >
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Image</TableCell>
                      <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Product Title</TableCell>
                      <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                        Quantity
                        <IconButton onClick={(e) => handleOpenMenu(e, "quantity")}>
                          <MoreVertIcon sx={{ fontSize: "14px" }} />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                        Price
                        <IconButton onClick={(e) => handleOpenMenu(e, "price")}>
                          <MoreVertIcon sx={{ fontSize: "14px" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryList.map((order) => {
                      const marketplace = logoMarket.find(
                        (market) => market.name === order.marketplace_name
                      );
                      return (
                        <TableRow key={order.id} hover style={{ cursor: "pointer" }}>
                          <TableCell sx={{ textAlign: "center" }}>
                            <img
                              src={order.image_url || soon}
                              alt="Product"
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 5,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              minWidth: 120,
                              width: 120,
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {order.sku || "N/A"}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", minWidth: 280, width: 280 }}>
                            {order.product_title}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center", paddingLeft: "3px" }}>
                            {order.quantity || 0}
                          </TableCell>
                          <TableCell
                            sx={{
                              paddingLeft: "3px",
                              textAlign: "center",
                              minWidth: 120,
                              width: 120,
                            }}
                          >
                            {order.price || "$0.00"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Box>

      {/* Pagination Controls */}
      <Box sx={{ 
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "flex-end", 
        mt: 2,
        gap: { xs: 2, md: 1 }
      }}>
        <Select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          size="small"
          sx={{ 
            minWidth: 70,
            width: { xs: "100%", md: "auto" }
          }}
        >
          <MenuItem value={25}>25/page</MenuItem>
          <MenuItem value={50}>50/page</MenuItem>
          <MenuItem value={75}>75/page</MenuItem>
        </Select>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="small"
          sx={{
            "& .MuiPagination-ul": {
              justifyContent: { xs: "center", md: "flex-start" },
              flexWrap: "wrap",
            }
          }}
        />
      </Box>

      {/* Sorting Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {currentColumn === "customer_name" && (
          <>
            <MenuItem onClick={() => handleSelectSort("customer_name", "asc")}>
              Sort A-Z
            </MenuItem>
            <MenuItem onClick={() => handleSelectSort("customer_name", "desc")}>
              Sort Z-A
            </MenuItem>
          </>
        )}
        {currentColumn === "price" && ( 
          <>
            <MenuItem onClick={() => handleSelectSort("price", "asc")}>
              Sort Low to High
            </MenuItem>
            <MenuItem onClick={() => handleSelectSort("price", "desc")}>
              Sort High to Low
            </MenuItem>
          </>
        )}
        {currentColumn === "quantity" && (
          <>
            <MenuItem onClick={() => handleSelectSort("quantity", "asc")}>
              Sort Low to High
            </MenuItem>
            <MenuItem onClick={() => handleSelectSort("quantity", "desc")}>
              Sort High to Low
            </MenuItem>
          </>
        )}
        {currentColumn === "order_date" && (
          <>
            <MenuItem onClick={() => handleSelectSort("order_date", "asc")}>
              Oldest
            </MenuItem>
            <MenuItem onClick={() => handleSelectSort("order_date", "desc")}>
              Latest
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default InventoryList;