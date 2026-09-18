import React, { useRef } from "react";
import "./OtpInput.scss";

export function OtpInput({ value = [], onChange, length = 6, error = false }) {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, "");
    if (!val) return;
    const newValue = [...value];
    newValue[index] = val.slice(-1);
    onChange(newValue);
    // Avanza al siguiente
    if (index < length - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newValue = [...value];
      if (newValue[index]) {
        newValue[index] = "";
        onChange(newValue);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    const newValue = pasted.split("");
    onChange(newValue);
    inputs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className={`otp-input${error ? " otp-input--error" : ""}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="otp-input__box"
        />
      ))}
    </div>
  );
}
