import { useEffect, useRef } from "react";
import { Autocomplete, TextField, Box, Popper } from "@mui/material";

// Defined OUTSIDE the component so its identity is stable between renders.
// An inline version remounts the popper (and resets scroll) on every re-render.
const BrandPopper = (props) => (
  <Popper
    {...props}
    placement="bottom-start"
    sx={{
      zIndex: 1300,
      width: 220,
    }}
  />
);

const BrandSelector = ({
  selectedBrand,
  setSelectedBrand,
  brandList,
  inputValueBrand,
  setInputValueBrand,
  brandLimit,
  setBrandLimit,
  isLoading,
  hasMore,
  toggleSelection,
  label = "Brands",
  width = 190,
}) => {
  const listRef = useRef(null);
  const scrollTopRef = useRef(0);

  const handleListScroll = (event) => {
    const list = event.currentTarget;
    listRef.current = list;
    scrollTopRef.current = list.scrollTop;

    const nearBottom =
      list.scrollTop + list.clientHeight >= list.scrollHeight - 5;

    if (nearBottom && !isLoading && hasMore) {
      setBrandLimit((prev) => prev + 10);
    }
  };

  // After new options arrive, put the list back where the user was.
  useEffect(() => {
    if (listRef.current && scrollTopRef.current > 0) {
      listRef.current.scrollTop = scrollTopRef.current;
    }
  }, [brandList]);

  return (
    <Box
      sx={{
        width: `${width + 20}px`,
        minWidth: 0,
      }}
    >
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={[
          ...selectedBrand,
          ...brandList.filter(
            (b) => !selectedBrand.some((sb) => sb.id === b.id),
          ),
        ]}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        inputValue={inputValueBrand}
        onInputChange={(event, newInputValue, reason) => {
          setInputValueBrand(newInputValue);
          // Only when the user actually types a new search:
          // restart pagination and scroll position.
          if (reason === "input") {
            scrollTopRef.current = 0;
            setBrandLimit(11);
          }
        }}
        value={selectedBrand}
        onChange={(event, newValue) => {
          setSelectedBrand(newValue);
        }}
        renderTags={() => null}
        noOptionsText={inputValueBrand ? "No options" : ""}
        ListboxProps={{
          onScroll: handleListScroll,
          sx: {
            maxHeight: 300,
            overflowY: "auto",
            overscrollBehavior: "contain",
          },
        }}
        renderOption={(props, option) => {
          const isSelected = selectedBrand.some((b) => b.id === option.id);

          return (
            <Box
              component="li"
              {...props}
              onClick={() => toggleSelection(option)}
              sx={{
                backgroundColor: isSelected
                  ? "#b6d5f3 !important"
                  : "transparent",
                fontSize: 13,
                cursor: "pointer",
              }}
              key={option.id}
            >
              {option.name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            size="small"
            placeholder="Search brands..."
            InputProps={{
              ...params.InputProps,
              endAdornment: <>{params.InputProps.endAdornment}</>,
            }}
          />
        )}
        PopperComponent={BrandPopper}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            minHeight: 40,
            fontSize: 14,
          },
          "& input": {
            fontSize: 13,
          },
        }}
      />
    </Box>
  );
};

export default BrandSelector;
