import React from "react";
import { FormControl, Input, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({ searchText, updateSearchText, widths }) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (e.target.value.length === 1) {
      updateSearchText(inputValue.trim());
    } else {
      updateSearchText(inputValue);
    }
  };

  const clearInput = () => {
    updateSearchText("");
  };

  if (!widths) {
    widths = {
      xs: "90%",
      sm: "90%",
      md: "50%",
      lg: "25%"
    };
  }

  const ClearButton = () => (
    <IconButton
      aria-label="clear search text"
      onClick={() => clearInput()}
      onMouseDown={() => clearInput()}
      edge="start"
    >
      <ClearIcon />
    </IconButton>
  );
  return (
    <FormControl sx={{ m: 1, width: widths }}>
      <Input
        id="outlined-adornment-password"
        type="text"
        value={searchText}
        placeholder="Search"
        onChange={handleChange}
        startAdornment={
          <InputAdornment position="start">
            {searchText ? <ClearButton /> : <SearchIcon />}
          </InputAdornment>
        }
        label="Search"
      />
    </FormControl>
  );
};

export default SearchBar;
