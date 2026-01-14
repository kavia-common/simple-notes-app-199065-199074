import { resolveSelectedAfterDelete, sortNotesByUpdatedAt } from "./noteUtils";

export const notesInitialState = {
  notes: [],
  selectedId: null,
};

/**
 * Notes reducer with predictable state transitions.
 */
// PUBLIC_INTERFACE
export function notesReducer(state, action) {
  switch (action.type) {
    case "HYDRATE": {
      const incoming = Array.isArray(action.payload?.notes) ? action.payload.notes : [];
      const sorted = sortNotesByUpdatedAt(incoming);
      const selectedId = sorted.length ? sorted[0].id : null;

      return { notes: sorted, selectedId };
    }

    case "ADD_NOTE": {
      const note = action.payload?.note;
      if (!note || !note.id) return state;

      const next = sortNotesByUpdatedAt([note, ...state.notes]);
      return { notes: next, selectedId: note.id };
    }

    case "SELECT_NOTE": {
      const id = action.payload?.id ?? null;
      return { ...state, selectedId: id };
    }

    case "UPDATE_NOTE": {
      const id = action.payload?.id;
      const patch = action.payload?.patch || {};
      if (!id) return state;

      const nextNotes = state.notes.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          ...patch,
          updatedAt: Date.now(),
        };
      });

      return { ...state, notes: sortNotesByUpdatedAt(nextNotes) };
    }

    case "DELETE_NOTE": {
      const id = action.payload?.id;
      if (!id) return state;

      const remaining = state.notes.filter((n) => n.id !== id);
      const nextSelectedId = resolveSelectedAfterDelete(remaining, id, state.selectedId);

      return { notes: sortNotesByUpdatedAt(remaining), selectedId: nextSelectedId };
    }

    default:
      return state;
  }
}
