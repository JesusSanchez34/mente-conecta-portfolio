import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Consentimiento } from "./Consentimiento";
import { aceptarTerminosWebBasica } from "../../../services/authServiceWebBasica";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => options?.defaultValue || key,
  }),
}));

jest.mock("../../../hooks", () => ({
  useAuth: () => ({
    auth: {
      token: "token-prueba",
    },
  }),
}));

jest.mock("../../../services/authServiceWebBasica", () => ({
  aceptarTerminosWebBasica: jest.fn(),
}));

function renderConsentimiento() {
  return render(
    <MemoryRouter initialEntries={["/login-sep/consentimiento"]}>
      <Routes>
        <Route
          path="/login-sep/consentimiento"
          element={<Consentimiento />}
        />
        <Route
          path="/login-sep/bienvenido"
          element={<div>Destino bienvenida</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  sessionStorage.setItem("tipo_consentimiento", "consentimiento");
  sessionStorage.setItem("quien_realiza", "personal");
});

test("no registra la aceptación al abrir la pantalla", async () => {
  renderConsentimiento();

  expect(
    await screen.findByRole("heading", { name: "Consentimiento Informado" }),
  ).toBeInTheDocument();
  expect(aceptarTerminosWebBasica).not.toHaveBeenCalled();
});

test("permite continuar sin aceptar y no llama al endpoint", async () => {
  renderConsentimiento();

  fireEvent.click(
    await screen.findByRole("button", { name: "Continuar" }),
  );

  expect(await screen.findByText("Destino bienvenida")).toBeInTheDocument();
  expect(aceptarTerminosWebBasica).not.toHaveBeenCalled();
});

test("registra la aceptación marcada antes de continuar", async () => {
  aceptarTerminosWebBasica.mockResolvedValue({ status: 200 });
  renderConsentimiento();

  fireEvent.click(
    await screen.findByRole("checkbox"),
  );
  fireEvent.click(screen.getByRole("button", { name: "Continuar" }));

  await waitFor(() => {
    expect(aceptarTerminosWebBasica).toHaveBeenCalledWith(
      {
        tipo_consentimiento: "consentimiento",
        quien_realiza: "personal",
        aceptado: true,
      },
      "token-prueba",
    );
  });
  expect(await screen.findByText("Destino bienvenida")).toBeInTheDocument();
});
