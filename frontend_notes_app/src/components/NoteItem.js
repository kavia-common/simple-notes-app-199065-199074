import React, { useMemo } from "react";
import "./NoteItem.css";
import { truncateText } from "../hooks/noteUtils";

// PUBLIC_INTERFACE
function NoteItem({ note, isSelected, onClick }) {
  const title = (note.title || "Untitled").trim() || "Untitled";

  const snippet = useMemo(() => {
    const body = note.body || "";
    return truncateText(body.replace(/\s+/g, " ").trim(), 90);
  }, [note.body]);

  return (
    <button
      type="button"
      className={`NoteItem ${isSelected ? "NoteItem--selected" : ""}`}
      onClick={onClick}
      aria-current={isSelected ? "true" : "false"}
    >
      <div className="NoteItem__title">{title}</div>
      <div className="NoteItem__body">{snippet || "No content"}</div>
    </button>
  );
}

export default NoteItem;
