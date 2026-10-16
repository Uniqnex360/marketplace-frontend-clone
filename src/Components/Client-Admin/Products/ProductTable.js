import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  useMediaQuery,
  Select,
  MenuItem,
  TextField,
  Tooltip,
  IconButton,
  Menu,
  FormControl,
  Collapse,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Refresh,
  Download,
} from "@mui/icons-material";
import PublishIcon from "@mui/icons-material/Publish";
import FilterListIcon from "@mui/icons-material/FilterList";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DottedCircleLoading from "../../Loading/DotLoading";
import FiltersUi from "./FiltersUi";
import soon from "../../assets/soon.png";
import ProductImport from "../Products/ProductImport";
import { useMarketplace } from "../../../utils/MarketplaceProvider";
import { useEnhancedCategories } from "../../../utils/UseEnhancedCategories";
import CountrySelector from "../../../utils/countrySelector";
import { formatCurrency } from "../../../utils/currencyFormatter";

const ProductTable = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const isMobile = useMediaQuery("(max-width:768px)");

  const [filterResetKey, setFilterResetKey] = useState(0);

  const {
    categories,
    loading: marketplaceLoading,
    selectedCountry,
    setSelectedCountry,
  } = useMarketplace();

  const enhancedCategories = useEnhancedCategories(categories);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const [updatedList, setUpdatedList] = useState([]);
  const [UpdatedBrandId, setUpdatedBrandList] = useState([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [setCategoryFilterList, setsetCategoryFilterList] = useState([]);
  const [brandFilterList, setBrandFilterList] = useState([]);

  const [currentColumn, setCurrentColumn] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  const [rowsPerPage, setRowsPerPage] = useState(
    parseInt(searchParams.get("rowsPerPage"), 10) || 50,
  );

  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [productCount, setProductCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const initialPage = parseInt(searchParams.get("page"), 10) || 1;
  const [page, setPage] = useState(initialPage);

  const lastParamsRef = useRef("");
  const requestInProgressRef = useRef(false);
  const searchTimerRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      const storedCategory = localStorage.getItem("selectedCategory");
      return storedCategory
        ? JSON.parse(storedCategory)
        : { id: "all", name: "All Channels" };
    } catch {
      return { id: "all", name: "All Channels" };
    }
  });

  // --------------------------------------------------
  // Marketplace and URL handling
  // --------------------------------------------------

  const handleMarketplaceSelect = useCallback((category) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", JSON.stringify(category));
    setPage(1);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (!params.has("page")) {
      params.set("page", "1");
      navigate(`${location.pathname}?${params.toString()}`, {
        replace: true,
      });
    }

    const urlRowsPerPage = parseInt(params.get("rowsPerPage"), 10) || 50;

    setRowsPerPage(urlRowsPerPage);

    const urlPage = parseInt(params.get("page"), 10) || 1;
    setPage(urlPage);
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
      setSearchQuery(location.state.searchQuery);
      setPage(1);
    }
  }, [location.state]);

  // --------------------------------------------------
  // Product fetching
  // --------------------------------------------------

  const fetchProducts = useCallback(async () => {
    // Prevent overlapping requests.
    if (requestInProgressRef.current) return;

    requestInProgressRef.current = true;
    setLoading(true);
    setIsFetching(true);

    try {
      const userData = localStorage.getItem("user");
      let userIds = "";

      if (userData) {
        const data = JSON.parse(userData);
        userIds = data.id;
      }

      const validRowsPerPage = rowsPerPage > 0 ? rowsPerPage : 50;

      const skip = Math.max(0, (page - 1) * validRowsPerPage);

      const response = await axios.post(
        `${process.env.REACT_APP_IP_V2}clickhouse/getProductList_clickhouse/`,
        {
          country: selectedCountry,
          user_id: userIds,
          marketplace: selectedCategory?.id === "all" ? "all" : "",
          marketplace_id:
            selectedCategory?.id && selectedCategory.id !== "all"
              ? selectedCategory.id
              : "",
          category_name: updatedList,
          brand_id_list: UpdatedBrandId,
          search_query: searchQuery,
          sort_by: sortConfig.key,
          sort_by_value: sortConfig.direction === "asc" ? 1 : -1,
          skip,
          limit: validRowsPerPage,
        },
      );

      const responseData = response.data?.data;
      const productList = responseData?.product_list;

      if (Array.isArray(productList)) {
        const products = productList.map((product) => ({
          productId: product.id,
          image: product.image_url || soon,
          title: product.product_title || "N/A",
          sku: product.sku || "N/A",
          category: product.category || "N/A",
          marketplacelogo: product.marketplace_image_url || {
            image_url: soon,
            name: "N/A",
          },
          quantity: product.quantity || 0,
          price: product.price
            ? formatCurrency(product.price, selectedCountry)
            : formatCurrency("0.00", selectedCountry),
        }));

        setProductData(products);

        const count = Number(responseData.total_count) || 0;
        setProductCount(count);
        setTotalPages(Math.max(1, Math.ceil(count / validRowsPerPage)));
      } else {
        setProductData([]);
        setProductCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      requestInProgressRef.current = false;
      setLoading(false);
      setIsFetching(false);
    }
  }, [
    updatedList,
    UpdatedBrandId,
    selectedCountry,
    page,
    rowsPerPage,
    sortConfig,
    selectedCategory,
    searchQuery,
  ]);

  useEffect(() => {
    const currentParams = JSON.stringify({
      updatedList,
      UpdatedBrandId,
      selectedCountry,
      page,
      rowsPerPage,
      sortConfig,
      selectedCategory,
      searchQuery,
    });

    if (lastParamsRef.current !== currentParams) {
      lastParamsRef.current = currentParams;
      fetchProducts();
    }
  }, [
    updatedList,
    UpdatedBrandId,
    selectedCountry,
    page,
    rowsPerPage,
    sortConfig,
    selectedCategory,
    searchQuery,
    fetchProducts,
  ]);

  // --------------------------------------------------
  // Filter handlers
  // --------------------------------------------------

  const handleAddFilterClick = () => {
    setFilterVisible((previous) => !previous);
  };

  const handleImportClick = () => {
    setImportOpen(true);
  };

  const handleImportClose = () => {
    setImportOpen(false);
  };

  const handleOpenMenu = (event, column) => {
    setAnchorEl(event.currentTarget);
    setCurrentColumn(column);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectSort = (key, direction) => {
    setSortConfig({ key, direction });
    setPage(1);
    setAnchorEl(null);
  };

  const handleResetChange = () => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    setSearchTerm("");
    setSearchQuery("");
    setSortConfig({ key: "", direction: "asc" });

    setUpdatedBrandList([]);
    setUpdatedList([]);
    setsetCategoryFilterList([]);
    setBrandFilterList([]);
    setSelectedCategoryNames([]);

    // Reset selections maintained inside FiltersUi.
    setFilterResetKey((previous) => previous + 1);

    setFilterVisible(false);

    localStorage.removeItem("marketplace");

    const resetCategory = {
      id: "all",
      name: "All Channels",
    };

    setSelectedCategory(resetCategory);
    localStorage.setItem("selectedCategory", JSON.stringify(resetCategory));

    setPage(1);
    navigate("/Home/products?page=1&rowsPerPage=50");

    toast.success("Filters reset successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleProduct = (category) => {
    localStorage.setItem("marketplace", JSON.stringify(category));
    setSelectedCategory(category);
    setPage(1);
  };

  const handleCategoryList = (catList) => {
    setsetCategoryFilterList(catList);
  };

  const handleBrandList = (brandList) => {
    setBrandFilterList(brandList);
  };

  const handleBrandChange = (val) => {
    const productList = val?.updatedList;

    if (!Array.isArray(productList)) {
      console.error("Expected an array for product types:", productList);
      return;
    }

    setUpdatedList(productList.map((item) => item.name));
    setPage(1);
  };

  const handleFilterBrand = (val) => {
    const productList = val?.updatedList;

    if (!Array.isArray(productList)) {
      console.error("Expected an array for brand filters:", productList);
      return;
    }

    setUpdatedBrandList(productList.map((item) => item.id));
    setPage(1);
  };

  const handleCategoryFiltered = (filteredCategories) => {
    setSelectedCategoryNames(filteredCategories);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
      setPage(1);
    }, 500);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = Number(event.target.value);

    setRowsPerPage(newRowsPerPage);
    setPage(1);

    navigate(`/Home/products?page=1&rowsPerPage=${newRowsPerPage}`);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);

    navigate(`/Home/products?page=${newPage}&rowsPerPage=${rowsPerPage}`);
  };

  // --------------------------------------------------
  // Reusable UI
  // --------------------------------------------------

  const productDetailsUrl = (productId) =>
    `/Home/products/details/${productId}?page=${page}&rowsPerPage=${rowsPerPage}`;

  const iconButtonSx = {
    backgroundColor: "#000080",
    color: "#fff",
    borderRadius: 1,
    minWidth: 34,
    width: 34,
    height: 34,
    p: 0,
    "&:hover": {
      backgroundColor: "darkblue",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        flexDirection: "column",
        mt: { xs: 2, md: 2 },
        px: { xs: 1, md: 0 },
        pt: {xs:5}
      }}
    >
      {/* Unified responsive filter section */}
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          backgroundColor: "#fff",
          mb: 2,
        }}
      >
        {/* Filter toggle, Reset and product count */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
            p: { xs: 1, md: 0 },
            border: { xs: "1px solid #e0e0e0", md: "none" },
            borderRadius: { xs: 2, md: 0 },
            backgroundColor: "#fff",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleAddFilterClick}
            aria-expanded={filterVisible}
            sx={{
              minHeight: 36,
              textTransform: "none",
              color: "#000080",
              borderColor: "#cacaca",
              flexShrink: 0,
            }}
          >
            Filters
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              ml: "auto",
              minWidth: 0,
            }}
          >
            <Tooltip title="Reset" arrow>
              <Button
                variant="contained"
                aria-label="Reset filters"
                onClick={handleResetChange}
                sx={iconButtonSx}
              >
                <Refresh fontSize="small" />
              </Button>
            </Tooltip>

            <Typography
              variant="body2"
              sx={{
                whiteSpace: "nowrap",
                fontSize: { xs: 11, sm: 13, md: 14 },
                fontWeight: 600,
              }}
            >
              Total Products: {productCount || 0}
            </Typography>
          </Box>
        </Box>

        {/* All filters in a single expandable panel */}
        <Collapse in={filterVisible} timeout="auto" unmountOnExit>
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              boxSizing: "border-box",
              mt: 1.5,
              p: { xs: 1.25, sm: 2, md: 2 },
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Country, marketplace and search */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Box sx={{ width: "100%", minWidth: 0 }}>
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

              <FormControl size="small" fullWidth sx={{ minWidth: 0 }}>
                <Select
                  value={selectedCategory?.id || "all"}
                  onChange={(event) => {
                    const category = enhancedCategories.find(
                      (item) => item.id === event.target.value,
                    );

                    if (category) {
                      handleMarketplaceSelect(category);
                    }
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Marketplace" }}
                >
                  {marketplaceLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : (
                    enhancedCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0,
                          }}
                        >
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

                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ minWidth: 0 }}
                          >
                            {category.name}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                placeholder="Search Title | SKU | Product Type"
                value={searchTerm}
                onChange={handleSearchChange}
                inputProps={{
                  "aria-label": "Search products",
                }}
                sx={{
                  minWidth: 0,
                  "& input": {
                    fontSize: { xs: 12, sm: 14 },
                  },
                }}
              />
            </Box>

            {/* Existing category and brand filter component */}
            <Box
              sx={{
                mt: 12,
                pt: 2,
                borderTop: "1px solid #eee",
                width: "100%",
                minWidth: 0,
                "& > *": {
                  maxWidth: "100%",
                  boxSizing: "border-box",
                },
              }}
            >
              <FiltersUi
                categories={categories}
                setCategoryFilterList={setCategoryFilterList}
                onProductTypeChange={handleBrandChange}
                brandFilterList={brandFilterList}
                onBrandTypeChange={handleFilterBrand}
                resetKey={filterResetKey}
              />
            </Box>

            {/* Import and Export */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: 1,
                mt: 2,
              }}
            >
              <Tooltip title="Import" arrow>
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={handleImportClick}
                  sx={{
                    backgroundColor: "#000080",
                    textTransform: "none",
                    minHeight: 36,
                    "&:hover": {
                      backgroundColor: "darkblue",
                    },
                  }}
                >
                  Import
                </Button>
              </Tooltip>

              <Tooltip title="Export" arrow>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{
                    backgroundColor: "#000080",
                    color: "#fff",
                    textTransform: "none",
                    minHeight: 36,
                    "&:hover": {
                      backgroundColor: "darkblue",
                    },
                  }}
                >
                  Export
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Product table */}
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          overflowX: "auto",
          overflowY: "visible",
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            border: "1px solid #ddd",
            overflowX: "auto",
            minWidth: 0,
            "&::-webkit-scrollbar": {
              height: "4px",
              width: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
            },
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: 800,
              "& .MuiTableCell-root": {
                verticalAlign: "middle",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#f6f6f6",
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontSize={{ xs: "0.75rem", md: "0.875rem" }}
                  >
                    Image
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#f6f6f6",
                    minWidth: 80,
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontSize={{ xs: "0.75rem", md: "0.875rem" }}
                  >
                    SKU
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#f6f6f6",
                    minWidth: 180,
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontSize={{ xs: "0.75rem", md: "0.875rem" }}
                  >
                    Title
                    <IconButton
                      onClick={(event) =>
                        handleOpenMenu(event, "product_title")
                      }
                      size="small"
                      aria-label="Sort by title"
                    >
                      <MoreVertIcon sx={{ fontSize: { xs: 12, md: 14 } }} />
                    </IconButton>
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#f6f6f6",
                    minWidth: 110,
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontSize={{ xs: "0.75rem", md: "0.875rem" }}
                  >
                    Category
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, "category")}
                      size="small"
                      aria-label="Sort by category"
                    >
                      <MoreVertIcon sx={{ fontSize: { xs: 12, md: 14 } }} />
                    </IconButton>
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#f6f6f6",
                    minWidth: 90,
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontSize={{ xs: "0.75rem", md: "0.875rem" }}
                  >
                    Quantity
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, "quantity")}
                      size="small"
                      aria-label="Sort by quantity"
                    >
                      <MoreVertIcon sx={{ fontSize: { xs: 12, md: 14 } }} />
                    </IconButton>
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#f6f6f6",
                    minWidth: 80,
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontSize={{ xs: "0.75rem", md: "0.875rem" }}
                  >
                    Price
                    <IconButton
                      onClick={(event) => handleOpenMenu(event, "price")}
                      size="small"
                      aria-label="Sort by price"
                    >
                      <MoreVertIcon sx={{ fontSize: { xs: 12, md: 14 } }} />
                    </IconButton>
                  </Typography>
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#f6f6f6",
                    px: { xs: 1, md: 2 },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    fontSize={{ xs: "0.75rem", md: "0.875rem" }}
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && productData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <DottedCircleLoading />
                  </TableCell>
                </TableRow>
              ) : productData.length > 0 ? (
                productData.map((product) => (
                  <TableRow key={product.productId} hover>
                    <TableCell align="center">
                      <Link
                        to={productDetailsUrl(product.productId)}
                        style={{ textDecoration: "none" }}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          loading="lazy"
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 5,
                          }}
                        />
                      </Link>
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "left",
                        minWidth: 80,
                        maxWidth: 140,
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Link
                        to={productDetailsUrl(product.productId)}
                        style={{
                          color: "#121212",
                          textDecoration: "none",
                        }}
                      >
                        {product.sku || "N/A"}
                      </Link>
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "left",
                        minWidth: 180,
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Link
                        to={productDetailsUrl(product.productId)}
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            fontSize: {
                              xs: "0.75rem",
                              md: "0.875rem",
                            },
                            overflowWrap: "anywhere",
                          }}
                        >
                          {product.title}
                        </Typography>
                      </Link>
                    </TableCell>

                    <TableCell align="center" sx={{ px: { xs: 1, md: 2 } }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.875rem",
                          },
                        }}
                      >
                        {product.category || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center" sx={{ px: { xs: 1, md: 2 } }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.875rem",
                          },
                        }}
                      >
                        {product.quantity || 0}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        minWidth: 80,
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.875rem",
                          },
                        }}
                      >
                        {product.price || "$0.00"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Link
                        to={productDetailsUrl(product.productId)}
                        style={{ textDecoration: "none" }}
                      >
                        <IconButton
                          color="primary"
                          size="small"
                          aria-label={`Edit ${product.title}`}
                        >
                          <EditIcon
                            sx={{
                              color: "#000080",
                              fontSize: { xs: 18, md: 20 },
                            }}
                          />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1">No data available.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 2,
            gap: { xs: 1.5, md: 1 },
            pb: 1,
          }}
        >
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            size="small"
            aria-label="Rows per page"
            sx={{
              minWidth: 90,
              width: { xs: "100%", md: "auto" },
            }}
          >
            <MenuItem value={50}>50/page</MenuItem>
            <MenuItem value={75}>75/page</MenuItem>
            <MenuItem value={100}>100/page</MenuItem>
          </Select>

          <Pagination
            count={totalPages}
            page={Math.min(page, totalPages)}
            onChange={handlePageChange}
            color="primary"
            size="small"
            sx={{
              maxWidth: "100%",
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
      </Box>

      {/* Sorting menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {currentColumn === "product_title" && (
          <>
            <MenuItem onClick={() => handleSelectSort("product_title", "asc")}>
              Sort A-Z
            </MenuItem>
            <MenuItem onClick={() => handleSelectSort("product_title", "desc")}>
              Sort Z-A
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

        {currentColumn === "category" && (
          <>
            <MenuItem onClick={() => handleSelectSort("category", "asc")}>
              Sort A-Z
            </MenuItem>
            <MenuItem onClick={() => handleSelectSort("category", "desc")}>
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
      </Menu>

      {/* Product import dialog */}
      <ProductImport open={importOpen} onClose={handleImportClose} />
    </Box>
  );
};

export default ProductTable;
