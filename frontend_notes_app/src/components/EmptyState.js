import React from "react";
import "./EmptyState.css";

// PUBLIC_INTERFACE
function EmptyState({ title, description, primaryActionLabel, onPrimaryAction }) {
  return (
    <div className="Panel EmptyState" role="status" aria-label="Empty state">
      <div className="EmptyState__icon" aria-hidden="true">
        ✎
      </div>
      <h2 className="EmptyState__title">{title}</h2>
      <p className="EmptyState__desc">{description}</p>
      <button className="EmptyState__button" type="button" onClick={onPrimaryAction}>
        {primaryActionLabel}
      </button>
    </div>
  );
}

export default EmptyState;
