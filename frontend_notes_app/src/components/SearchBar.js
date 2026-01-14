import React from "react";
import "./SearchBar.css";

// PUBLIC_INTERFACE
function SearchBar({ value, onChange }) {
  return (
    <div className="SearchBar">
      <label className="SearchBar__label" htmlFor="notes-search">
        Search notes
      </label>
      <input
        id="notes-search"
        className="SearchBar__input"
        type="search"
        placeholder="Search…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}

export default SearchBar;
