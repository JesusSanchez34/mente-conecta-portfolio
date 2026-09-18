import { render, screen } from "@testing-library/react";
import { MexicoFlag } from "./MexicoFlag";

describe("MexicoFlag", () => {
  it("renderiza el recurso vectorial mexicano con texto alternativo", () => {
    render(<MexicoFlag />);

    const flag = screen.getByRole("img", { name: "Bandera de México" });

    expect(flag).toHaveAttribute(
      "src",
      expect.stringContaining("flag-mexico.svg"),
    );
    expect(flag).toHaveAttribute("width", "24");
    expect(flag).toHaveAttribute("height", "18");
  });
});
