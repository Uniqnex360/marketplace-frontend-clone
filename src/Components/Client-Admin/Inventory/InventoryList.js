import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
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
  Menu,
  IconButton,
  CircularProgress,
  FormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Refresh, FilterList } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DottedCircleLoading from "../../Loading/DotLoading";
import { useEnhancedCategories } from "../../../utils/UseEnhancedCategories";
import soon from "../../assets/soon.png";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMarketplace } from "../../../utils/MarketplaceProvider";
import ImageIcon from "@mui/icons-material/Image";
import CountrySelector from "../../../utils/countrySelector";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const InventoryList = ({ fetchOrdersFromParent }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const location = useLocation();
  const navigate = useNavigate();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    categories,
    loading: marketplaceLoading,
    selectedCountry,
    setSelectedCountry,
  } = useMarketplace();

  const [inventoryList, setInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "all",
    name: "All Channels",
  });
  const [currentColumn, setCurrentColumn] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [orderCount, setOrderCount] = useState(0);
  const [customStatus, setCustomStatus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [logoMarket, setLogoMarket] = useState([]);
  const [loading, setLoading] = useState(true);

  const enhancedCategories = useEnhancedCategories(categories);

  const queryParams = new URLSearchParams(window.location.search);
  const initialPage = parseInt(queryParams.get("page"), 10) || 1;
  const [page, setPage] = useState(initialPage);

  const prevParams = useRef({
    selectedCategoryId: "all",
    page: initialPage,
    rowsPerPage: 25,
    sortConfig: { key: "", direction: "asc" },
    searchQuery: "",
    selectedCountry,
  });

  const fetchOrderData = async (
    marketId,
    currentPage,
    currentRowsPerPage,
    currentSortConfig,
    currentSearchQuery,
  ) => {
    setLoading(true);

    const validRowsPerPage =
      currentRowsPerPage && currentRowsPerPage > 0 ? currentRowsPerPage : 25;

    const skip = (currentPage - 1) * validRowsPerPage;

    try {
      const userData = localStorage.getItem("user");
      let userIds = "";

      if (userData) {
        const data = JSON.parse(userData);
        userIds = data.id;
      }

      const marketplaceIdToUse =
        marketId ||
        (localStorage.getItem("selectedCategory")
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
          country: selectedCountry,
        },
      );

      const data = response.data?.data;

      if (data?.inventry_list) {
        setInventory(data.inventry_list);
        setCustomStatus(data.status || []);
        setOrderCount(data.total_count || 0);
        setTotalPages(
          Math.max(1, Math.ceil((data.total_count || 0) / validRowsPerPage)),
        );
        setLogoMarket(
          Array.isArray(data.marketplace_list) ? data.marketplace_list : [],
        );
      } else {
        setInventory([]);
        setCustomStatus([]);
        setOrderCount(0);
        setTotalPages(1);
        setLogoMarket([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]);
      setCustomStatus([]);
      setOrderCount(0);
      setTotalPages(1);
      setLogoMarket([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    let initialCategory = { id: "all", name: "All Channels" };

    if (storedCategory) {
      try {
        initialCategory = JSON.parse(storedCategory);
        setSelectedCategory(initialCategory);
      } catch (error) {
        console.error("Error reading selected marketplace:", error);
      }
    }

    const initialSearchQuery = location.state?.searchQuery || "";

    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }

    fetchOrderData(
      initialCategory.id,
      page,
      rowsPerPage,
      sortConfig,
      initialSearchQuery,
    );

    prevParams.current = {
      selectedCategoryId: initialCategory.id,
      page,
      rowsPerPage,
      sortConfig,
      searchQuery: initialSearchQuery,
      selectedCountry,
    };
  }, []);

  useEffect(() => {
    const shouldFetch =
      selectedCategory.id !== prevParams.current.selectedCategoryId ||
      page !== prevParams.current.page ||
      rowsPerPage !== prevParams.current.rowsPerPage ||
      JSON.stringify(sortConfig) !==
        JSON.stringify(prevParams.current.sortConfig) ||
      searchQuery !== prevParams.current.searchQuery ||
      JSON.stringify(selectedCountry) !==
        JSON.stringify(prevParams.current.selectedCountry);

    if (shouldFetch) {
      fetchOrderData(
        selectedCategory.id,
        page,
        rowsPerPage,
        sortConfig,
        searchQuery,
      );

      prevParams.current = {
        selectedCategoryId: selectedCategory.id,
        page,
        rowsPerPage,
        sortConfig,
        searchQuery,
        selectedCountry,
      };
    }
  }, [
    selectedCategory.id,
    page,
    rowsPerPage,
    sortConfig,
    searchQuery,
    selectedCountry,
  ]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleMarketplaceSelect = (category) => {
    setSelectedCategory(category);

    const safeCategory = {
      id: category.id,
      name: category.name,
    };

    localStorage.setItem("selectedCategory", JSON.stringify(safeCategory));

    setPage(1);
  };

  const handleSelectSort = (key, direction) => {
    setSortConfig({ key, direction });
    setPage(1);
    setAnchorEl(null);
  };

  const handleOpenMenu = (event, column) => {
    setAnchorEl(event.currentTarget);
    setCurrentColumn(column);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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

  const handleResetChange = () => {
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
    <Box
      sx={{
        flex: 1,
        width: "100%",
        minWidth: 0,
        px: { xs: 1, sm: 2 },
        pt: { xs: 1, md: 2 },
        boxSizing: "border-box",
      }}
    >
      {/* Filter dropdown */}
      <Box
        sx={{
          width: "100%",
          mt: { xs: 3, md: 3 },
          mb: 2,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFiltersOpen((prev) => !prev)}
          >
            Filters
            {filtersOpen ? (
              <ExpandLessIcon sx={{ ml: 1 }} />
            ) : (
              <ExpandMoreIcon sx={{ ml: 1 }} />
            )}
          </Button>

          <Typography variant="body2" fontWeight={600}>
            Total Inventory: {orderCount}
          </Typography>
        </Box>

        <Collapse in={filtersOpen}>
          <Box
            sx={{
              mt: 1.5,
              p: { xs: 1.5, md: 2 },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                gap: 1.5,
                width: "100%",
              }}
            >
              <Box sx={{ width: { xs: "100%", md: 165 } }}>
                <CountrySelector
                  selectedCountry={selectedCountry}
                  onCountryChange={(country) => {
                    setSelectedCountry(country);
                    setPage(1);
                  }}
                  minWidth={150}
                  sx={{ width: "100%" }}
                />
              </Box>

              <FormControl size="small" sx={{ width: { xs: "100%", md: 180 } }}>
                <Select
                  value={selectedCategory?.id || "all"}
                  onChange={(event) => {
                    const selected = enhancedCategories.find(
                      (category) => category.id === event.target.value,
                    );

                    if (selected) handleMarketplaceSelect(selected);
                  }}
                >
                  {enhancedCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                fullWidth
                placeholder="Search by Product Title, SKU..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              />

              <Button
                variant="contained"
                onClick={handleResetChange}
                startIcon={<Refresh />}
                sx={{
                  minHeight: 40,
                  backgroundColor: "#000080",
                  "&:hover": { backgroundColor: "darkblue" },
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Main inventory content */}
      <Box sx={{ width: "100%", minWidth: 0 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <DottedCircleLoading />
          </Box>
        ) : inventoryList.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3 }}>No Data Found</Box>
        ) : (
          <>
            {/* Mobile card view */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              {inventoryList.map((order, index) => (
                <Card
                  key={order.id || index}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    overflow: "hidden",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Box
                        component="img"
                        src={order.image_url || soon}
                        alt="Product"
                        sx={{
                          display: "block",
                          width: "100%",
                          maxWidth: 70,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    </Grid>

                    <Grid item xs={9} sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          overflowWrap: "anywhere",
                        }}
                      >
                        {order.product_title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, overflowWrap: "anywhere" }}
                      >
                        SKU: {order.sku || "N/A"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
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

            {/* Desktop table view */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <TableContainer
                component={Paper}
                sx={{
                  width: "100%",
                  maxHeight: "70vh",
                  overflow: "auto",
                  "&::-webkit-scrollbar": {
                    height: "5px",
                    width: "5px",
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
                  },
                }}
              >
                <Table sx={{ minWidth: 650 }}>
                  <TableHead
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#f6f6f6",
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Image
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        SKU
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Product Title
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Quantity
                        <IconButton
                          size="small"
                          onClick={(event) => handleOpenMenu(event, "quantity")}
                        >
                          <MoreVertIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </TableCell>

                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Price
                        <IconButton
                          size="small"
                          onClick={(event) => handleOpenMenu(event, "price")}
                        >
                          <MoreVertIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {inventoryList.map((order, index) => (
                      <TableRow key={order.id || index} hover>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Box
                            component="img"
                            src={order.image_url || soon}
                            alt="Product"
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            textAlign: "center",
                            minWidth: 120,
                            width: 120,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {order.sku || "N/A"}
                        </TableCell>

                        <TableCell
                          sx={{
                            textAlign: "center",
                            minWidth: 280,
                            width: 280,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {order.product_title}
                        </TableCell>

                        <TableCell
                          sx={{
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.quantity || 0}
                        </TableCell>

                        <TableCell
                          sx={{
                            textAlign: "center",
                            minWidth: 120,
                            width: 120,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order.price || "$0.00"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Box>

      {/* Pagination controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "flex-end",
          mt: 2,
          mb: 2,
          gap: { xs: 2, md: 1 },
        }}
      >
        <Select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          size="small"
          sx={{
            minWidth: 90,
            width: { xs: "100%", md: "auto" },
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
              justifyContent: {
                xs: "center",
                md: "flex-start",
              },
              flexWrap: "wrap",
            },
          }}
        />
      </Box>

      {/* Sorting menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
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
      </Menu>
    </Box>
  );
};

export default InventoryList;
