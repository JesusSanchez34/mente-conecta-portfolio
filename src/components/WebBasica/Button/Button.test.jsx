import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button de SEP Web Básica", () => {
  it("usa clases aisladas de Bootstrap y conserva disabled", () => {
    render(
      <Button variant="primary" fullWidth disabled>
        Verificar
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Verificar" });

    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "sep-btn",
      "sep-btn--primary",
      "sep-btn--full",
    );
    expect(button).not.toHaveClass("btn");
  });
});
