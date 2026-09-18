import React from "react";
import "./Modal.scss";

export function Modal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box ${className}`.trim()} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
