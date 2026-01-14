import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import EmptyState from "./components/EmptyState";
import { notesReducer, notesInitialState } from "./hooks/notesReducer";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { createEmptyNote, getDerivedTitleFromBody } from "./hooks/noteUtils";

const STORAGE_KEY = "simple-notes-app.notes.v1";

/**
 * Derives a safe selected note id based on current notes and requested id.
 * If requested id doesn't exist, prefer first note if available, else null.
 */
function resolveSelectedId(notes, requestedId) {
  if (!notes || notes.length === 0) return null;
  if (requestedId && notes.some((n) => n.id === requestedId)) return requestedId;
  return notes[0].id;
}

// PUBLIC_INTERFACE
function App() {
  /** Theme is local-only. The app follows the requested modern light theme by default. */
  const [theme, setTheme] = useState("light");

  const { value: storedNotes, setValue: setStoredNotes, isHydrated } = useLocalStorage(
    STORAGE_KEY,
    []
  );

  const [state, dispatch] = useReducer(notesReducer, notesInitialState);
  const [query, setQuery] = useState("");

  // Hydrate reducer state from localStorage after first load.
  useEffect(() => {
    if (!isHydrated) return;

    const notes = Array.isArray(storedNotes) ? storedNotes : [];
    dispatch({ type: "HYDRATE", payload: { notes } });
  }, [isHydrated, storedNotes]);

  // Persist notes any time reducer notes change, after hydration.
  useEffect(() => {
    if (!isHydrated) return;
    setStoredNotes(state.notes);
  }, [isHydrated, setStoredNotes, state.notes]);

  // Apply theme to document root (CSS variables rely on this attribute).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const selectedNoteId = useMemo(
    () => resolveSelectedId(state.notes, state.selectedId),
    [state.notes, state.selectedId]
  );

  const selectedNote = useMemo(() => {
    if (!selectedNoteId) return null;
    return state.notes.find((n) => n.id === selectedNoteId) || null;
  }, [state.notes, selectedNoteId]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.notes;

    return state.notes.filter((n) => {
      const title = (n.title || "").toLowerCase();
      const body = (n.body || "").toLowerCase();
      return title.includes(q) || body.includes(q);
    });
  }, [state.notes, query]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "light" : "light"));
    // Note: Requirements specify modern light theme; we keep a toggle control slot,
    // but leave it pinned to light. If you want dark mode later, extend tokens in CSS.
  }, []);

  const handleAddNote = useCallback(() => {
    const newNote = createEmptyNote();
    dispatch({ type: "ADD_NOTE", payload: { note: newNote } });
  }, []);

  const handleSelectNote = useCallback((id) => {
    dispatch({ type: "SELECT_NOTE", payload: { id } });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNoteId) return;
    dispatch({ type: "DELETE_NOTE", payload: { id: selectedNoteId } });
  }, [selectedNoteId]);

  const handleUpdateSelected = useCallback(
    ({ title, body }) => {
      if (!selectedNoteId) return;

      // Keep UX pleasant: if title is empty, derive it from body preview.
      const normalizedTitle = (title || "").trim() ? title : getDerivedTitleFromBody(body);

      dispatch({
        type: "UPDATE_NOTE",
        payload: {
          id: selectedNoteId,
          patch: { title: normalizedTitle, body: body ?? "" },
        },
      });
    },
    [selectedNoteId]
  );

  return (
    <div className="App">
      <div className="AppShell">
        <Header
          query={query}
          onQueryChange={setQuery}
          onAddNote={handleAddNote}
          onToggleTheme={handleToggleTheme}
          theme={theme}
          notesCount={state.notes.length}
        />

        <main className="Main">
          <section className="LeftPane" aria-label="Notes list">
            <NotesList
              notes={filteredNotes}
              selectedId={selectedNoteId}
              onSelect={handleSelectNote}
              emptyMessage={query.trim() ? "No matching notes." : "No notes yet."}
            />
          </section>

          <section className="RightPane" aria-label="Note editor">
            {selectedNote ? (
              <NoteEditor
                key={selectedNote.id}
                note={selectedNote}
                onChange={handleUpdateSelected}
                onDelete={handleDeleteSelected}
              />
            ) : (
              <EmptyState
                title="Create your first note"
                description="Click “New note” to start writing. Notes are saved locally to this browser."
                primaryActionLabel="New note"
                onPrimaryAction={handleAddNote}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
