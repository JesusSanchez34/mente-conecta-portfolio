import React from "react";
import { Form } from "react-bootstrap";

export interface GeneralInputProps {
    col?: string;
    tituloLabel?: string;
    formatoLabel?: string;
    nameControl: string;
    placeHolderControl?: string;
    valueControl: string | number;
    onChangeControl: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    touched?: boolean;
    disabled?: boolean;
    rounded?: string;
    type?: "text" | "number";
    min?: number;
    max?: number;
    step?: number;
    inputMode?: "text" | "numeric" | "decimal";
    pattern?: string;
}

export function GeneralInput({
    col,
    tituloLabel,
    formatoLabel,
    nameControl,
    placeHolderControl,
    valueControl,
    onChangeControl,
    error,
    touched,
    disabled,
    rounded,
    type = "text",
    min,
    max,
    step,
    inputMode,
    pattern,
}: GeneralInputProps) {
    return (
        <Form.Group className={col}>
            {tituloLabel && (
                <Form.Label className={formatoLabel}>{tituloLabel}</Form.Label>
            )}
            <Form.Control
                name={nameControl}
                type={type}
                placeholder={placeHolderControl}
                value={valueControl}
                onChange={onChangeControl}
                disabled={disabled}
                style={{
                    borderRadius: rounded || "0px",
                }}
                min={type === "number" ? min : undefined}
                max={type === "number" ? max : undefined}
                step={type === "number" ? step : undefined}
                inputMode={inputMode}
                pattern={pattern}
            />
            {touched && error && (
                <Form.Text className="text-danger text-start">
                    <b>{error}</b>
                </Form.Text>
            )}
        </Form.Group>
    );
}