/**
 * Creates a reasonably unique id without extra dependencies.
 */
function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// PUBLIC_INTERFACE
export function createEmptyNote() {
  const now = Date.now();
  return {
    id: createId(),
    title: "",
    body: "",
    createdAt: now,
    updatedAt: now,
  };
}

// PUBLIC_INTERFACE
export function truncateText(text, maxLen) {
  const s = text || "";
  if (s.length <= maxLen) return s;
  return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
}

// PUBLIC_INTERFACE
export function sortNotesByUpdatedAt(notes) {
  return [...(notes || [])].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

// PUBLIC_INTERFACE
export function resolveSelectedAfterDelete(remainingNotes, deletedId, currentSelectedId) {
  if (!remainingNotes || remainingNotes.length === 0) return null;
  if (currentSelectedId && currentSelectedId !== deletedId) return currentSelectedId;
  return remainingNotes[0].id;
}

// PUBLIC_INTERFACE
export function getDerivedTitleFromBody(body) {
  const cleaned = (body || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return truncateText(cleaned, 32);
}
