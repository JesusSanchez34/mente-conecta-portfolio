import React from 'react';
import { Form } from 'react-bootstrap';
import './SelectForm.css';

export function SelectForm(props) {
    const {
        label, labelDirection,
        name, value, onChange,
        options, error, touched,
        disabled, size, col
    } = props;

    return (
        <Form.Group className={`${col} conteiner-input`}>
            {label && <Form.Label className={labelDirection}>{label}</Form.Label>}
            <center>
                <Form.Select
                    className={`input-control ${labelDirection}`}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    size={size}
                    style={{
                        borderColor: touched && error ? "red" : "#4DB6AC57",
                        width: "100%"
                    }}
                >
                    <option value="">Seleccione una opción...</option>
                    {options && options.map((opt, index) => (
                        <option key={opt.id || opt.value || index} value={opt.id || opt.value}>
                            {opt.opcion || opt.label}
                        </option>
                    ))}
                </Form.Select>
            </center>
            <Form.Text className="text-danger">
                {touched && error ?
                    <center><b><div className="text-danger">{error}</div></b></center>
                    : null}
            </Form.Text>
        </Form.Group>
    );
}
