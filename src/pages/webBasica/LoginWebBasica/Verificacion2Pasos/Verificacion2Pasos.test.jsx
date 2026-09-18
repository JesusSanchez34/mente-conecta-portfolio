import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Verificacion2Pasos } from "./Verificacion2Pasos";
import { verificarOtpLogin } from "../../../../services/authServiceWebBasica";

const mockLogin = jest.fn();
const mockLogout = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock("../../../../hooks", () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: mockLogout,
  }),
}));

jest.mock("../../../../services/authServiceWebBasica", () => ({
  loginOtp: jest.fn(),
  verificarOtpLogin: jest.fn(),
  SEP_WEB_BASICA_LOGIN_TYPE: 4,
}));

function renderVerification() {
  return render(
    <MemoryRouter initialEntries={["/login-sep/verificacion"]}>
      <Routes>
        <Route
          path="/login-sep/verificacion"
          element={<Verificacion2Pasos />}
        />
        <Route
          path="/login-sep/quien-realiza"
          element={<div>Destino autenticado</div>}
        />
        <Route path="/login-sep" element={<div>Inicio de sesion</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function enterOtp() {
  screen.getAllByRole("textbox").forEach((input, index) => {
    fireEvent.change(input, { target: { value: String(index + 1) } });
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  sessionStorage.setItem("login_email", "usuario@prueba.test");
  sessionStorage.setItem("login_password", "password-prueba");
  sessionStorage.setItem("otp_session", "sesion-otp-prueba");
});

test("conserva el correo y usa la sesion de SEP Basica hasta completar el login", async () => {
  verificarOtpLogin.mockResolvedValue({ access: "access-prueba" });
  mockLogin.mockImplementation(async () => {
    expect(sessionStorage.getItem("login_email")).toBe("usuario@prueba.test");
    expect(sessionStorage.getItem("otp_session")).toBe("sesion-otp-prueba");
  });

  renderVerification();
  expect(screen.getByText("usuario@prueba.test")).toBeInTheDocument();
  enterOtp();
  fireEvent.click(screen.getByRole("button", { name: "verificacion.verificar" }));

  expect(await screen.findByText("Destino autenticado")).toBeInTheDocument();
  expect(verificarOtpLogin).toHaveBeenCalledWith("123456", "sesion-otp-prueba");
  expect(mockLogin).toHaveBeenCalledWith("access-prueba", 4);
  expect(sessionStorage.getItem("login_email")).toBeNull();
  expect(sessionStorage.getItem("otp_session")).toBeNull();
});

test("no borra el correo ni reporta codigo incorrecto si falla la carga de sesion", async () => {
  verificarOtpLogin.mockResolvedValue({ access: "access-prueba" });
  mockLogin.mockRejectedValue(new Error("No se pudo cargar el perfil"));

  renderVerification();
  enterOtp();
  fireEvent.click(screen.getByRole("button", { name: "verificacion.verificar" }));

  expect(
    await screen.findByText("verificacion.modalSesionErrorTitulo"),
  ).toBeInTheDocument();
  expect(screen.getByText("usuario@prueba.test")).toBeInTheDocument();
  expect(sessionStorage.getItem("login_email")).toBe("usuario@prueba.test");
  expect(sessionStorage.getItem("otp_session")).toBe("sesion-otp-prueba");
  expect(mockLogout).toHaveBeenCalledTimes(1);
  expect(
    screen.queryByText("verificacion.modalCodigoIncorrectoTitulo"),
  ).not.toBeInTheDocument();
});

test("mantiene los datos para reintentar cuando el codigo es rechazado", async () => {
  verificarOtpLogin.mockRejectedValue(new Error("Codigo incorrecto"));

  renderVerification();
  enterOtp();
  fireEvent.click(screen.getByRole("button", { name: "verificacion.verificar" }));

  await waitFor(() => {
    expect(
      screen.getByText("verificacion.modalCodigoIncorrectoTitulo"),
    ).toBeInTheDocument();
  });
  expect(sessionStorage.getItem("login_email")).toBe("usuario@prueba.test");
  expect(sessionStorage.getItem("otp_session")).toBe("sesion-otp-prueba");
  expect(mockLogin).not.toHaveBeenCalled();
});
