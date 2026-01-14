import React from "react";
import NoteItem from "./NoteItem";
import "./NotesList.css";

/**
 * Notes list is intentionally "dumb": filtering is done upstream.
 */
// PUBLIC_INTERFACE
function NotesList({ notes, selectedId, onSelect, emptyMessage }) {
  return (
    <div className="Panel NotesList">
      <div className="NotesList__header">
        <h2 className="NotesList__title">All notes</h2>
        <span className="NotesList__badge" aria-label={`${notes.length} notes in list`}>
          {notes.length}
        </span>
      </div>

      <div className="NotesList__items" role="list" aria-label="Notes">
        {notes.length === 0 ? (
          <div className="NotesList__empty" role="status">
            {emptyMessage}
          </div>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isSelected={note.id === selectedId}
              onClick={() => onSelect(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NotesList;
