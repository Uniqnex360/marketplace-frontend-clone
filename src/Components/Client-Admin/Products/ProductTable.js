import React, { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { Refresh, Download } from "@mui/icons-material";
import PublishIcon from "@mui/icons-material/Publish";
import DottedCircleLoading from "../../Loading/DotLoading";
import FiltersUi from "./FiltersUi";
import soon from "../../assets/soon.png";
import ProductImport from "../Products/ProductImport";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MarketplaceOption from "./MarketplaceOption";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppsIcon from "@mui/icons-material/Apps";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useMarketplace } from "../../../utils/MarketplaceProvider";
import ImageIcon from "@mui/icons-material/Image";
import { useEnhancedCategories } from "../../../utils/UseEnhancedCategories";
import CountrySelector from "../../../utils/countrySelector";
import { formatCurrency } from "../../../utils/currencyFormatter";

const ProductTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [updatedList, setUpdatedList] = useState([]);
  const [UpdatedBrandId, setUpdatedBrandList] = useState([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [setCategoryFilterList, setsetCategoryFilterList] = useState([]);
  const [currentColumn, setCurrentColumn] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [brandFilterList, setBrandFilterList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [productCount, setProductCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const {
    categories,
    loading: marketplaceLoading,
    selectedCountry,
    setSelectedCountry,
  } = useMarketplace();

  const enhancedCategories = useEnhancedCategories(categories);

  const initialPage = parseInt(searchParams.get("page"), 10) || 1;
  const [page, setPage] = useState(initialPage);
  const initialRowsPerPage =
    parseInt(searchParams.get("rowsPerPage"), 10) || 50;

  // Ref to store last API call parameters to prevent unnecessary fetches
  let lastParamsRef = useRef("");

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    return storedCategory
      ? JSON.parse(storedCategory)
      : { id: "all", name: "All Channels" };
  });
  const handleMarketplaceSelect = (category) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", JSON.stringify(category));
    setPage(1);
  };

  // Effect to set initial rowsPerPage from URL on component mount
  useEffect(() => {
    setRowsPerPage(initialRowsPerPage);
  }, [location.search]);

  // Effect to ensure 'page' query parameter exists in URL
  useEffect(() => {
    if (!searchParams.has("page")) {
      searchParams.set("page", "1");
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
  }, [location, navigate, searchParams]);

  // Main effect to fetch products based on dependencies
  useEffect(() => {
    // Construct current parameters for comparison
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

    // Only fetch if parameters have actually changed
    if (lastParamsRef.current !== currentParams) {
      lastParamsRef.current = currentParams;
      fetchProducts();
    }
  }, [
    updatedList,
    UpdatedBrandId,
    page,
    rowsPerPage,
    sortConfig,
    selectedCategory,
    searchQuery,
    selectedCountry
  ]);

  // Effect to set search term from location state (for navigation)
  useEffect(() => {
    if (location.state && location.state.searchQuery) {
      setSearchTerm(location.state.searchQuery);
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  const handleImportClick = () => {
    setImportOpen(true);
  };

  const handleOpenMenu = (event, column) => {
    setAnchorEl(event.currentTarget);
    setCurrentColumn(column);
  };

  const handleSelectSort = (key, direction) => {
    setSortConfig({ key, direction });
    setPage(1);
    setAnchorEl(null);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleImportClose = () => {
    setImportOpen(false);
  };

  const fetchProducts = async () => {
    if (isFetching) return;

    setLoading(true);
    setIsFetching(true);

    try {
      const userData = localStorage.getItem("user");
      let userIds = "";

      if (userData) {
        const data = JSON.parse(userData);
        userIds = data.id;
      }

      const validRowsPerPage =
        rowsPerPage && rowsPerPage > 0 ? rowsPerPage : 50;
      const skip = (page - 1) * validRowsPerPage;

      const response = await axios.post(
        `${process.env.REACT_APP_IP}getProductList/`,
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
          skip: skip >= 0 ? skip : 0,
          limit: validRowsPerPage,
        }
      );

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.product_list)
      ) {
        const products = response.data.data.product_list.map((product) => ({
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
          price: product.price ? formatCurrency(product.price, selectedCountry) : formatCurrency('0.00', selectedCountry),
        }));

        setProductData(products);
        setProductCount(response.data.data.total_count);
        setTotalPages(
          Math.ceil(response.data.data.total_count / validRowsPerPage)
        );
      } else {
        console.error("No valid products found in response:", response.data);
        setProductData([]);
        setProductCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = e.target.value;
    setRowsPerPage(newRowsPerPage);
    navigate(`/Home/products?page=1&rowsPerPage=${newRowsPerPage}`);
    setPage(1);
  };

  const handlePageChange = (e, value) => {
    navigate(`/Home/products?page=${value}&rowsPerPage=${rowsPerPage}`);
    setPage(value);
  };
  
  const handleChangePage = (event, newPage) => {
    navigate(`/Home/products?page=${newPage}&&rowsPerPage=${rowsPerPage}`);
    setPage(newPage);
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (e.target.timeout) {
      clearTimeout(e.target.timeout);
    }
    e.target.timeout = setTimeout(() => {
      setSearchQuery(value);
      setPage(1);
    }, 500);
  };

  const handleAddFilterClick = () => {
    setFilterVisible(!filterVisible);
  };

  const handleResetChange = () => {
    setSearchTerm("");
    setSearchQuery("");
    setSortConfig({ key: "", direction: "asc" });
    setUpdatedBrandList([]);
    setUpdatedList([]);
    setFilterVisible(false);

    localStorage.removeItem("marketplace");
    const resetCategory = { id: "all", name: "All Channels" };
    setSelectedCategory(resetCategory);
    localStorage.setItem("selectedCategory", JSON.stringify(resetCategory));

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
      console.error("Error: Expected an array but received", productList);
      return;
    }
    const productTypeNames = productList.map((item) => item.name);
    setUpdatedList(productTypeNames);
    setPage(1);
  };

  const handleFilterBrand = (val) => {
    const productList = val?.updatedList;
    if (!Array.isArray(productList)) {
      console.error("Error: Expected an array but received", productList);
      return;
    }
    const productTypeId = productList.map((item) => item.id);
    setUpdatedBrandList(productTypeId);
    setPage(1);
  };

  const hanldefiltersCategory = (filteredCategories) => {
    console.log("george", filteredCategories);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        marginTop: { xs: "20px", md: "40px" },
        flexDirection: "column",
        px: { xs: 1, md: 0 },
      }}
    >
      <Box
        sx={{
          color: "#000080",
          flex: 1,
          overflow: "hidden",
          marginTop: { xs: "30px", md: "50px" },
        }}
      >
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
          {filterVisible && (
            <Box
              sx={{
                width: { xs: "100%", md: "215px" },
                display: "flex",
                flexDirection: "column",
                position: { xs: "static", md: "sticky" },
                top: 0,
                mb: { xs: 2, md: 0 },
              }}
            >
              <FiltersUi
                categories={categories}
                setCategoryFilterList={setCategoryFilterList}
                onProductTypeChange={handleBrandChange}
                brandFilterList={brandFilterList}
                onBrandTypeChange={handleFilterBrand}
              />
            </Box>
          )}

          {/* Fixed Header (Search, Buttons) */}
          {/* Fixed Header (Search, Buttons) */}
<Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: { xs: 1, md: 2 },
    my: 2,
    justifyContent: "flex-end",
    alignItems: { xs: "center", md: "center" }, // Changed from "stretch" to "center"
    position: "fixed",
    top: 0,
    right: 0,
    marginTop: { xs: "60px", md: "90px" },
    marginRight: { xs: "0px", md: "22px" },
    width: { xs: "calc(100% - 20px)", md: filterVisible ? "calc(100% - 235px)" : "100%" },
    backgroundColor: "white",
    zIndex: 100,
    padding: { xs: "8px", md: "10px" },
    border: { xs: "1px solid #e0e0e0", md: "none" },
    borderRadius: { xs: "8px", md: 0 },
    boxShadow: { xs: "0 2px 8px rgba(0,0,0,0.1)", md: "none" },
  }}
>
  <Box sx={{ 
    marginTop: { xs: 0, md: "-7px" },
    width: { xs: "100%", md: "auto" },
    display: "flex",
    justifyContent: "flex-start"
  }}>
    <CountrySelector
      selectedCountry={selectedCountry}
      onCountryChange={(country) => {
        setSelectedCountry(country);
        setPage(1); // Reset to first page when country changes
      }}
      minWidth={150}
      sx={{
        width: { xs: "100%", md: 150 }
      }}
    />
  </Box>

  {/* Marketplace Selector - Full width on mobile */}
  <Box sx={{ 
    marginTop: { xs: 0, md: "-7px" },
    width: { xs: "100%", md: "auto" }, // Added full width on mobile
    display: "flex",
    justifyContent: "flex" // Center on mobile
  }}>
    {/* <FormControl size="small" sx={{ width: { xs: "100%", md: 180 } }}>
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
                  ) : (
                    <ImageIcon fontSize="small" />
                  ))}
                <span>{category.name}</span>
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl> */}
  </Box>

  {/* Search Field - Full width on mobile */}
  <TextField
    size="small"
    placeholder="Search Title | SKU | Product Type"
    value={searchTerm}
    onChange={handleSearchChange}
    sx={{
      width: { xs: "100%", md: 300 },
      "& input": {
        fontSize: "14px",
      },
    }}
  />

  {/* Action Buttons - Horizontal on mobile */}
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "row", md: "row" },
      gap: 1,
      justifyContent: { xs: "center", md: "flex-start" }, // Changed to center on mobile
      width: { xs: "100%", md: "auto" },
    }}
  >
    {/* Mobile Filter Toggle Button */}
    <Tooltip title="Filter" arrow>
      <Button
        variant="text"
        color="primary"
        onClick={handleAddFilterClick}
        sx={{
          backgroundColor: "#000080",
          color: "white",
          minWidth: "auto",
          height: "32px",
          width: { xs: "48px", md: "32px" },
          padding: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: { xs: "none", md: "none" }, // Changed from 1 to none
          "&:hover": {
            backgroundColor: "darkblue",
          },
        }}
      >
        <FilterListIcon sx={{ color: "white", fontSize: "20px" }} />
      </Button>
    </Tooltip>

    <Tooltip title="Import" arrow>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#000080",
          minWidth: "auto",
          padding: "6px",
          height: "32px",
          width: { xs: "48px", md: "32px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: { xs: "none", md: "none" }, // Changed from 1 to none
          "&:hover": {
            backgroundColor: "darkblue",
          },
        }}
        onClick={handleImportClick}
      >
        <PublishIcon sx={{ color: "white", fontSize: "20px" }} />
      </Button>
    </Tooltip>

    <Tooltip title="Export" arrow>
      <Button
        variant="outlined"
        sx={{
          backgroundColor: "#000080",
          minWidth: "auto",
          padding: "6px",
          display: "flex",
          height: "32px",
          width: { xs: "48px", md: "32px" },
          justifyContent: "center",
          alignItems: "center",
          flex: { xs: "none", md: "none" }, // Changed from 1 to none
          "&:hover": {
            backgroundColor: "darkblue",
          },
        }}
      >
        <Download sx={{ color: "white", fontSize: "20px" }} />
      </Button>
    </Tooltip>

    <Tooltip title="Reset" arrow>
      <Button
        variant="outlined"
        sx={{
          backgroundColor: "#000080",
          minWidth: "auto",
          padding: "6px",
          height: "32px",
          width: { xs: "48px", md: "32px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: { xs: "none", md: "none" }, // Changed from 1 to none
          "&:hover": {
            backgroundColor: "darkblue",
          },
        }}
        onClick={() => {
          handleResetChange();
        }}
      >
        <Refresh sx={{ color: "white", fontSize: "20px" }} />
      </Button>
    </Tooltip>
  </Box>

  {/* Product Count - Full width on mobile */}
  <Typography 
    variant="body2" 
    sx={{ 
      textAlign: { xs: "center", md: "left" },
      width: { xs: "100%", md: "auto" },
      mt: { xs: 0, md: 0 }, // Removed top margin on mobile
      display: "flex",
      justifyContent: "center" // Center on mobile
    }}
  >
    Total Products: {productCount ? productCount : "0"}
  </Typography>
</Box>

          {/* Table Section (Scrollable) */}
          <Box
            sx={{
              flex: 1,
              marginTop: { xs: "140px", md: "60px" },
              height: { xs: "calc(100vh - 160px)", md: "calc(100vh - 120px)" },
              overflowY: "auto",
              overflowX: "auto",
              width: "100%",
              "&::-webkit-scrollbar": {
                width: "3px",
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
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: { xs: "75%", md: "85%" },
                border: "1px solid #ddd",
                overflowX: "auto",
                minWidth: { xs: "800px", md: "auto" },
                "&::-webkit-scrollbar": {
                  height: "4px",
                  width: "4px",
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
              <Table stickyHeader sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    {/* Render Static Column Headers */}
                    <TableCell
                      sx={{ 
                        textAlign: "center", 
                        backgroundColor: "#f6f6f6",
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        Image
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        backgroundColor: "#f6f6f6",
                        minWidth: { xs: "80px", md: "60px" },
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        SKU
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        backgroundColor: "#f6f6f6",
                        minWidth: { xs: "180px", md: "210px" },
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        Title
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, "product_title")}
                          size="small"
                        >
                          <MoreVertIcon sx={{ fontSize: { xs: "12px", md: "14px" } }} />
                        </IconButton>
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                        minWidth: { xs: "100px", md: "120px" },
                        backgroundColor: "#f6f6f6",
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        Category
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, "category")}
                          size="small"
                        >
                          <MoreVertIcon sx={{ fontSize: { xs: "12px", md: "14px" } }} />
                        </IconButton>
                      </Typography>
                    </TableCell>
                    
                    <TableCell
                      sx={{ 
                        textAlign: "center", 
                        backgroundColor: "#f6f6f6",
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        Channel
                      </Typography>
                    </TableCell>
                    
                    <TableCell
                      sx={{
                        textAlign: "center",
                        backgroundColor: "#f6f6f6",
                        minWidth: { xs: "70px", md: "90px" },
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        Quantity
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, "quantity")}
                          size="small"
                        >
                          <MoreVertIcon sx={{ fontSize: { xs: "12px", md: "14px" } }} />
                        </IconButton>
                      </Typography>
                    </TableCell>
                    
                    <TableCell
                      sx={{
                        textAlign: "center",
                        minWidth: { xs: "60px", md: "70px" },
                        backgroundColor: "#f6f6f6",
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        Price
                        <IconButton 
                          onClick={(e) => handleOpenMenu(e, "price")}
                          size="small"
                        >
                          <MoreVertIcon sx={{ fontSize: { xs: "12px", md: "14px" } }} />
                        </IconButton>
                      </Typography>
                    </TableCell>
                    
                    <TableCell
                      sx={{ 
                        textAlign: "center", 
                        backgroundColor: "#f6f6f6",
                        px: { xs: 1, md: 2 },
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" fontSize={{ xs: "0.75rem", md: "0.875rem" }}>
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading && productData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <DottedCircleLoading />
                      </TableCell>
                    </TableRow>
                  ) : productData.length > 0 ? (
                    productData.map((product) => (
                      <TableRow key={product.productId} hover>
                        <TableCell sx={{ textAlign: "center", px: { xs: 1, md: 2 } }}>
                          <Link
                            to={`/Home/products/details/${product.productId}?page=${page}&&rowsPerPage=${rowsPerPage}`}
                            style={{ textDecoration: "none" }}
                          >
                            <img
                              src={product.image}
                              alt="Product"
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
                            minWidth: { xs: "80px", md: "120px" },
                            width: { xs: "80px", md: "120px" },
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            px: { xs: 1, md: 2 },
                          }}
                        >
                          <Link
                            to={`/Home/products/details/${product.productId}?page=${page}&&rowsPerPage=${rowsPerPage}`}
                            style={{ color: "#121212", textDecoration: "none" }}
                          >
                            {product.sku || "N/A"}
                          </Link>
                        </TableCell>

                        <TableCell sx={{ textAlign: "left", px: { xs: 1, md: 2 } }}>
                          <Link
                            to={`/Home/products/details/${product.productId}?page=${page}&&rowsPerPage=${rowsPerPage}`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            <span style={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                              {product.title}
                            </span>
                          </Link>
                        </TableCell>
                        
                        <TableCell sx={{ textAlign: "center", px: { xs: 1, md: 2 } }}>
                          <span style={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            {product.category || "N/A"}
                          </span>
                        </TableCell>
                        
                        <TableCell
                          align="center"
                          sx={{ 
                            width: { xs: "80px", md: "100px" }, 
                            padding: { xs: "4px", md: "8px" } 
                          }}
                        >
                          <Box
                            display="flex"
                            flexWrap="wrap"
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                          >
                            {product.marketplacelogo &&
                            product.marketplacelogo.length > 0 ? (
                              product.marketplacelogo.map(
                                (imageUrl, imgIndex) => (
                                  <Box
                                    key={imgIndex}
                                    sx={{
                                      width: { xs: 25, md: 30 },
                                      height: { xs: 25, md: 30 },
                                      borderRadius: "4px",
                                      overflow: "hidden",
                                      backgroundColor: "#fff",
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`Marketplace Logo ${imgIndex}`}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                      }}
                                    />
                                  </Box>
                                )
                              )
                            ) : (
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ textAlign: "center" }}
                              >
                                N/A
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{ 
                            textAlign: "center", 
                            paddingLeft: { xs: "2px", md: "3px" },
                            px: { xs: 1, md: 2 },
                          }}
                        >
                          <span style={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            {product.quantity || 0}
                          </span>
                        </TableCell>
                        
                        <TableCell
                          sx={{
                            paddingLeft: { xs: "2px", md: "3px" },
                            textAlign: "center",
                            minWidth: { xs: "60px", md: "70px" },
                            width: { xs: "60px", md: "70px" },
                            px: { xs: 1, md: 2 },
                          }}
                        >
                          <span style={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>
                            {product.price || "$0.00"}
                          </span>
                        </TableCell>

                        <TableCell sx={{ textAlign: "center", px: { xs: 1, md: 2 } }}>
                          <Link
                            to={`/Home/products/details/${product.productId}?page=${page}&&rowsPerPage=${rowsPerPage}`}
                            style={{ textDecoration: "none" }}
                          >
                            <IconButton color="primary" size="small">
                              <EditIcon sx={{ color: "#000080", fontSize: { xs: "18px", md: "20px" } }} />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body1">
                          No data available.
                        </Typography>
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
                alignItems: { xs: "center", md: "center" },
                justifyContent: "flex-end",
                mt: 2,
                gap: { xs: 2, md: 1 },
              }}
            >
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                size="small"
                sx={{ 
                  minWidth: 70,
                  width: { xs: "100%", md: "auto" }
                }}
              >
                <MenuItem value={50}>50/page</MenuItem>
                <MenuItem value={75}>75/page</MenuItem>
                <MenuItem value={100}>100/page</MenuItem>
              </Select>

              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                color="primary"
                size="small"
                sx={{
                  "& .MuiPagination-ul": {
                    justifyContent: { xs: "center", md: "flex-start" },
                    flexWrap: "wrap",
                  }
                }}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {/* Sorting for Brand */}
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
        
        {/* Sorting for Price */}
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

      {/* Product Import Dialog */}
      <ProductImport open={importOpen} onClose={handleImportClose} />
    </Box>
  );
};

export default ProductTable;