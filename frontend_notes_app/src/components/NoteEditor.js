import React, { useEffect, useMemo, useState } from "react";
import "./NoteEditor.css";

// PUBLIC_INTERFACE
function NoteEditor({ note, onChange, onDelete }) {
  const [title, setTitle] = useState(note.title || "");
  const [body, setBody] = useState(note.body || "");

  // Keep local editor state in sync when the selected note changes.
  useEffect(() => {
    setTitle(note.title || "");
    setBody(note.body || "");
  }, [note.id, note.title, note.body]);

  // Push changes up (debounce-free, simple local app).
  useEffect(() => {
    onChange({ title, body });
  }, [title, body, onChange]);

  const meta = useMemo(() => {
    const chars = (body || "").length;
    const words = (body || "").trim() ? (body || "").trim().split(/\s+/).length : 0;
    return { chars, words };
  }, [body]);

  return (
    <div className="Panel NoteEditor">
      <div className="NoteEditor__top">
        <div className="NoteEditor__meta" aria-label="Note stats">
          <span>{meta.words} words</span>
          <span>•</span>
          <span>{meta.chars} chars</span>
        </div>

        <button className="ButtonDanger" type="button" onClick={onDelete}>
          Delete
        </button>
      </div>

      <div className="NoteEditor__form" aria-label="Edit note">
        <label className="NoteEditor__label" htmlFor="note-title">
          Title
        </label>
        <input
          id="note-title"
          className="NoteEditor__title"
          type="text"
          value={title}
          placeholder="Untitled"
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="NoteEditor__label" htmlFor="note-body">
          Body (markdown/plain text)
        </label>
        <textarea
          id="note-body"
          className="NoteEditor__body"
          value={body}
          placeholder="Write something…"
          onChange={(e) => setBody(e.target.value)}
          spellCheck
        />
      </div>
    </div>
  );
}

export default NoteEditor;
