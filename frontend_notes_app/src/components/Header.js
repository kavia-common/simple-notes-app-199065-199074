import React from "react";
import SearchBar from "./SearchBar";
import "./Header.css";

// PUBLIC_INTERFACE
function Header({ query, onQueryChange, onAddNote, onToggleTheme, theme, notesCount }) {
  return (
    <header className="Header" aria-label="Notes app header">
      <div className="Header__inner">
        <div className="Header__brand">
          <div className="Header__logo" aria-hidden="true">
            N
          </div>
          <div className="Header__titles">
            <h1 className="Header__title">Notes</h1>
            <p className="Header__subtitle">{notesCount} note{notesCount === 1 ? "" : "s"}</p>
          </div>
        </div>

        <div className="Header__actions">
          <SearchBar value={query} onChange={onQueryChange} />
          <button className="Button Button--primary" type="button" onClick={onAddNote}>
            New note
          </button>

          {/* Theme toggle placeholder (kept for extensibility; pinned to light per requirements). */}
          <button
            className="Button Button--ghost"
            type="button"
            onClick={onToggleTheme}
            aria-label={`Theme is ${theme}.`}
            title="Theme (light)"
          >
            Light
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
