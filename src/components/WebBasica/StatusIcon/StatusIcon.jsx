import React from "react";
import "./StatusIcon.scss";

export function StatusIcon({ children }) {
  return (
    <div className="status-icon">
      <div className="status-icon__inner">{children}</div>
    </div>
  );
}
