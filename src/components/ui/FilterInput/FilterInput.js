import React from "react";
import { Button, Form } from "react-bootstrap";
import { FiDelete } from "react-icons/fi";

import "./Filter.css";

export function Filter({ filterText, onFilter, onClear }) {
    return (
        <section className="filter">
            <div className="input-group">
                <Form.Control
                    id="search"
                    size="sm"
                    type="text"
                    placeholder="Busqueda..."
                    value={filterText}
                    onChange={onFilter}
                />
                <Button
                    size="sm"
                    variant="secondary"
                    className="filter-button"
                    onClick={onClear}
                >
                    <FiDelete />
                </Button>
            </div>
        </section>
    );
}
