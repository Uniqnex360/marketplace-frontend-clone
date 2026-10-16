import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  List,
  ListItem,
  Collapse,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

// Group items alphabetically.
const groupByAlphabet = (items = []) =>
  items.reduce((acc, item) => {
    const name = typeof item?.name === "string" ? item.name.trim() : "";

    const firstLetter = name.charAt(0).toUpperCase();
    const key = /^[A-Z]$/.test(firstLetter) ? firstLetter : "#";

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);

    return acc;
  }, {});

// Divide alphabet groups into three balanced columns.
const splitIntoColumns = (alphabetList) => {
  const mid = Math.ceil(alphabetList.length / 3);

  return [
    alphabetList.slice(0, mid),
    alphabetList.slice(mid, mid * 2),
    alphabetList.slice(mid * 2),
  ];
};

const FiltersUi = ({
  categories,
  setCategoryFilterList,
  onProductTypeChange,
  brandFilterList,
  onBrandTypeChange,
  resetKey = 0,
}) => {
  const [productTypes, setProductTypes] = useState([]);
  const [brandTypes, setBrandTypes] = useState([]);

  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [selectedBrandTypes, setSelectedBrandTypes] = useState([]);

  const [openCategoryPopup, setOpenCategoryPopup] = useState(false);
  const [openBrandPopup, setOpenBrandPopup] = useState(false);

  const [expandedSection, setExpandedSection] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogSearchQuery, setDialogSearchQuery] = useState("");
  const [dialogBrandSearchQuery, setDialogBrandSearchQuery] = useState("");

  const alphabet = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [leftColumn, centerColumn, rightColumn] = splitIntoColumns(alphabet);

  // Synchronize the available filter options with parent state.
  useEffect(() => {
    setProductTypes(
      Array.isArray(setCategoryFilterList) ? setCategoryFilterList : [],
    );

    setBrandTypes(Array.isArray(brandFilterList) ? brandFilterList : []);
  }, [setCategoryFilterList, brandFilterList]);

  // Clear the internal checkbox selections when the parent resets.
  useEffect(() => {
    setSelectedProductTypes([]);
    setSelectedBrandTypes([]);
    setSearchQuery("");
    setDialogSearchQuery("");
    setDialogBrandSearchQuery("");
    setExpandedSection(null);
    setOpenCategoryPopup(false);
    setOpenBrandPopup(false);
  }, [resetKey]);

  const groupedProductTypes = useMemo(
    () => groupByAlphabet(productTypes),
    [productTypes],
  );

  const groupedBrandTypes = useMemo(
    () => groupByAlphabet(brandTypes),
    [brandTypes],
  );

  const filterItems = (items, query) => {
    const search = query.trim().toLowerCase();

    return items.filter((item) =>
      String(item?.name || "")
        .toLowerCase()
        .includes(search),
    );
  };

  const filteredProductTypes = useMemo(
    () => filterItems(productTypes, searchQuery),
    [productTypes, searchQuery],
  );

  const filteredBrandTypes = useMemo(
    () => filterItems(brandTypes, searchQuery),
    [brandTypes, searchQuery],
  );

  const filteredDialogCategories = useMemo(() => {
    const result = {};

    Object.entries(groupedProductTypes).forEach(([letter, items]) => {
      const filtered = filterItems(items, dialogSearchQuery);

      if (filtered.length) result[letter] = filtered;
    });

    return result;
  }, [groupedProductTypes, dialogSearchQuery]);

  const filteredDialogBrands = useMemo(() => {
    const result = {};

    Object.entries(groupedBrandTypes).forEach(([letter, items]) => {
      const filtered = filterItems(items, dialogBrandSearchQuery);

      if (filtered.length) result[letter] = filtered;
    });

    return result;
  }, [groupedBrandTypes, dialogBrandSearchQuery]);

  const handleProductTypeChange = (productType) => {
    setSelectedProductTypes((previous) => {
      const exists = previous.some((item) => item.id === productType.id);

      const updatedList = exists
        ? previous.filter((item) => item.id !== productType.id)
        : [...previous, productType];

      onProductTypeChange?.({ updatedList });

      return updatedList;
    });
  };

  const handleBrandTypeChange = (brand) => {
    setSelectedBrandTypes((previous) => {
      const exists = previous.some((item) => item.id === brand.id);

      const updatedList = exists
        ? previous.filter((item) => item.id !== brand.id)
        : [...previous, brand];

      onBrandTypeChange?.({ updatedList });

      return updatedList;
    });
  };

  const toggleSection = (section) => {
    setExpandedSection((previous) => (previous === section ? null : section));
  };

  const checkboxSx = {
    color: "#777",
    "&.Mui-checked": {
      color: "#000080",
    },
  };

  const renderFilterItems = (items, selectedItems, onChange, limit) => {
    const visibleItems =
      typeof limit === "number" ? items.slice(0, limit) : items;

    return (
      <>
        {visibleItems.map((item) => (
          <ListItem
            key={item.id}
            disableGutters
            sx={{
              py: 0.25,
              px: 0,
              minWidth: 0,
              alignItems: "flex-start",
            }}
          >
            <FormControlLabel
              sx={{
                m: 0,
                width: "100%",
                minWidth: 0,
                alignItems: "flex-start",
                "& .MuiFormControlLabel-label": {
                  fontSize: 13,
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                  pt: 0.75,
                },
              }}
              control={
                <Checkbox
                  size="small"
                  checked={selectedItems.some(
                    (selected) => selected.id === item.id,
                  )}
                  onChange={() => onChange(item)}
                  sx={checkboxSx}
                />
              }
              label={`${item.name || "Unnamed"} (${item.product_count ?? 0})`}
            />
          </ListItem>
        ))}

        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
            No results found.
          </Typography>
        )}
      </>
    );
  };

  const renderDialogColumns = (
    groupedItems,
    selectedItems,
    onChange,
    columns,
  ) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 2,
        alignItems: "start",
      }}
    >
      {columns.map((column, columnIndex) => (
        <Box key={columnIndex} sx={{ minWidth: 0 }}>
          {column.map((letter) => {
            const items = groupedItems[letter];

            if (!items?.length) return null;

            return (
              <Box key={letter} sx={{ mb: 2, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#fff",
                    py: 0.5,
                  }}
                >
                  {letter}
                </Typography>

                <List dense disablePadding>
                  {renderFilterItems(items, selectedItems, onChange)}
                </List>
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );

  const sectionHeaderSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    width: "100%",
    px: 1.5,
    py: 1.25,
    backgroundColor: "#e1f5fe",
    color: "#000080",
    borderBottom: "2px solid #000080",
    borderRadius: 1,
    cursor: "pointer",
    userSelect: "none",
    "&:hover": {
      backgroundColor: "#d5effb",
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* Shared search for Category and Brand List */}
      <TextField
        label="Search categories and brands"
        placeholder="Type to search..."
        variant="outlined"
        fullWidth
        size="small"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        inputProps={{
          "aria-label": "Search categories and brands",
        }}
        sx={{
          minWidth: 0,
          "& .MuiInputBase-root": {
            backgroundColor: "#fff",
          },
        }}
      />

      {/* Category filter */}
      <Box sx={{ width: "100%", minWidth: 0 }}>
        <Box
          role="button"
          tabIndex={0}
          aria-expanded={expandedSection === "productTypes"}
          onClick={() => toggleSection("productTypes")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleSection("productTypes");
            }
          }}
          sx={sectionHeaderSx}
        >
          <Typography fontWeight="bold" variant="body2">
            Category
            <Typography
              component="span"
              variant="caption"
              sx={{ ml: 1, color: "#555" }}
            >
              ({filteredProductTypes.length})
            </Typography>
          </Typography>

          <Typography component="span">
            {expandedSection === "productTypes" ? "−" : "+"}
          </Typography>
        </Box>

        <Collapse in={expandedSection === "productTypes"}>
          <Box
            sx={{
              mt: 1,
              p: { xs: 1, sm: 1.5 },
              border: "1px solid #eee",
              borderRadius: 1,
              minWidth: 0,
            }}
          >
            <List dense disablePadding>
              {renderFilterItems(
                filteredProductTypes,
                selectedProductTypes,
                handleProductTypeChange,
                6,
              )}
            </List>

            {filteredProductTypes.length > 6 && (
              <Button
                variant="text"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setOpenCategoryPopup(true)}
                sx={{
                  mt: 0.5,
                  color: "#000080",
                  textTransform: "none",
                }}
              >
                View all {filteredProductTypes.length} categories
              </Button>
            )}
          </Box>
        </Collapse>
      </Box>

      {/* Brand filter */}
      <Box sx={{ width: "100%", minWidth: 0 }}>
        <Box
          role="button"
          tabIndex={0}
          aria-expanded={expandedSection === "brandTypes"}
          onClick={() => toggleSection("brandTypes")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggleSection("brandTypes");
            }
          }}
          sx={sectionHeaderSx}
        >
          <Typography fontWeight="bold" variant="body2">
            Brand List
            <Typography
              component="span"
              variant="caption"
              sx={{ ml: 1, color: "#555" }}
            >
              ({filteredBrandTypes.length})
            </Typography>
          </Typography>

          <Typography component="span">
            {expandedSection === "brandTypes" ? "−" : "+"}
          </Typography>
        </Box>

        <Collapse in={expandedSection === "brandTypes"}>
          <Box
            sx={{
              mt: 1,
              p: { xs: 1, sm: 1.5 },
              border: "1px solid #eee",
              borderRadius: 1,
              minWidth: 0,
            }}
          >
            <List dense disablePadding>
              {renderFilterItems(
                filteredBrandTypes,
                selectedBrandTypes,
                handleBrandTypeChange,
                6,
              )}
            </List>

            {filteredBrandTypes.length > 6 && (
              <Button
                variant="text"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setOpenBrandPopup(true)}
                sx={{
                  mt: 0.5,
                  color: "#000080",
                  textTransform: "none",
                }}
              >
                View all {filteredBrandTypes.length} brands
              </Button>
            )}
          </Box>
        </Collapse>
      </Box>

      {/* Category selection dialog */}
      <Dialog
        open={openCategoryPopup}
        onClose={() => setOpenCategoryPopup(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 1200,
            maxHeight: "85vh",
            m: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogTitle>Select Categories</DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Search categories"
            placeholder="Search by category name..."
            fullWidth
            size="small"
            value={dialogSearchQuery}
            onChange={(event) => setDialogSearchQuery(event.target.value)}
            sx={{ mb: 2 }}
          />

          {renderDialogColumns(
            filteredDialogCategories,
            selectedProductTypes,
            handleProductTypeChange,
            [leftColumn, centerColumn, rightColumn],
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenCategoryPopup(false)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Brand selection dialog */}
      <Dialog
        open={openBrandPopup}
        onClose={() => setOpenBrandPopup(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 1200,
            maxHeight: "85vh",
            m: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogTitle>Select Brands</DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Search brands"
            placeholder="Search by brand name..."
            fullWidth
            size="small"
            value={dialogBrandSearchQuery}
            onChange={(event) => setDialogBrandSearchQuery(event.target.value)}
            sx={{ mb: 2 }}
          />

          {renderDialogColumns(
            filteredDialogBrands,
            selectedBrandTypes,
            handleBrandTypeChange,
            [leftColumn, centerColumn, rightColumn],
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenBrandPopup(false)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FiltersUi;
