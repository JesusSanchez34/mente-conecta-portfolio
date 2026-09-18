import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthFeedbackDialog } from "./AuthFeedback";

function DialogHarness() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Abrir alerta
      </button>
      <AuthFeedbackDialog
        open={open}
        title="Términos y condiciones"
        message="Para continuar debes aceptar los términos y condiciones."
        onAction={() => setOpen(false)}
      />
    </>
  );
}

describe("AuthFeedbackDialog", () => {
  test("lleva el foco a la acción y lo restaura al cerrar con Escape", () => {
    render(<DialogHarness />);
    const trigger = screen.getByRole("button", { name: "Abrir alerta" });

    trigger.focus();
    fireEvent.click(trigger);

    const action = screen.getByRole("button", { name: "Aceptar" });
    expect(action).toHaveFocus();
    expect(screen.getByRole("alertdialog")).toHaveAttribute(
      "aria-describedby",
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test("mantiene el foco dentro del diálogo al usar Tab", () => {
    render(
      <AuthFeedbackDialog
        open
        title="Error"
        message="Revisa la información capturada."
        onAction={jest.fn()}
      />,
    );

    const action = screen.getByRole("button", { name: "Aceptar" });
    fireEvent.keyDown(document, { key: "Tab" });

    expect(action).toHaveFocus();
  });
});
