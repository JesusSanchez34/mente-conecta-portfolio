import React from "react";
import { Modal } from "react-bootstrap";
import "./ModalBasic.css";

export function ModalBasic(props) {
  const { show, size, icon, title, children, onClose } = props;

  return (
    <Modal className="model-basic" show={show} onHide={onClose} size={size}>
      {title && (
        <Modal.Header closeButton>
          <div className="iconcolor me-2">{icon}</div>
          <div className="w-100 fs-5 text-center">{title}</div>
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
}

ModalBasic.defaultProps = {
  size: "sm",
};
