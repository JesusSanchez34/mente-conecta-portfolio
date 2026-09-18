import {
  clearSepFlowSession,
  clearSepLoginVerificationSession,
} from "./sepSession";

test("elimina solo los datos temporales de la verificacion OTP", () => {
  sessionStorage.setItem("otp_session", "otp-prueba");
  sessionStorage.setItem("login_email", "usuario@prueba.test");
  sessionStorage.setItem("login_password", "password-prueba");
  sessionStorage.setItem("quien_realiza", "personal");

  clearSepLoginVerificationSession();

  expect(sessionStorage.getItem("otp_session")).toBeNull();
  expect(sessionStorage.getItem("login_email")).toBeNull();
  expect(sessionStorage.getItem("login_password")).toBeNull();
  expect(sessionStorage.getItem("quien_realiza")).toBe("personal");
});

test("elimina solo el estado temporal del flujo SEP", () => {
  const sepKeys = [
    "otp_session",
    "login_email",
    "login_password",
    "quien_realiza",
    "tipo_consentimiento",
    "terminos_aceptados",
    "terminos_tipo",
  ];

  sepKeys.forEach((key) => sessionStorage.setItem(key, "prueba"));
  sessionStorage.setItem("estado_otro_modulo", "conservar");

  clearSepFlowSession();

  sepKeys.forEach((key) => expect(sessionStorage.getItem(key)).toBeNull());
  expect(sessionStorage.getItem("estado_otro_modulo")).toBe("conservar");
});
