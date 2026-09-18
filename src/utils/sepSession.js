const SEP_FLOW_SESSION_KEYS = [
  "otp_session",
  "login_email",
  "login_password",
  "quien_realiza",
  "tipo_consentimiento",
  "terminos_aceptados",
  "terminos_tipo",
];

const SEP_LOGIN_VERIFICATION_KEYS = [
  "otp_session",
  "login_email",
  "login_password",
];

export function clearSepLoginVerificationSession() {
  SEP_LOGIN_VERIFICATION_KEYS.forEach((key) => sessionStorage.removeItem(key));
}

export function clearSepFlowSession() {
  SEP_FLOW_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
}
