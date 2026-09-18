import { jwtDecode } from "jwt-decode";

export const getUserThemeKey = (userId) =>
  userId ? `webBasicaTheme:${userId}` : null;

const getLegacyUserThemeKey = (userId) =>
  userId ? `u_${userId}_isDarkMode` : null;

const normalizeTheme = (theme) =>
  theme === "dark" || theme === "oscuro" ? "dark" : "light";

export const getSystemTheme = () => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

export const getStoredTheme = (userId) => {
  if (typeof window === "undefined") {
    return "light";
  }

  const userKey = getUserThemeKey(userId);
  const userTheme = userKey ? localStorage.getItem(userKey) : null;

  if (userTheme === "dark" || userTheme === "light") {
    return userTheme;
  }

  const legacyUserKey = getLegacyUserThemeKey(userId);
  const legacyUserTheme = legacyUserKey
    ? localStorage.getItem(legacyUserKey)
    : null;

  if (legacyUserTheme === "true") return "dark";
  if (legacyUserTheme === "false") return "light";

  return "light";
};

export const applyTheme = (theme) => {
  if (typeof document === "undefined") {
    return normalizeTheme(theme);
  }

  const normalizedTheme = normalizeTheme(theme);
  const root = document.documentElement;

  root.setAttribute("data-sep-theme", normalizedTheme);
  document.body?.classList.toggle("sep-dark-mode", normalizedTheme === "dark");

  return normalizedTheme;
};

export const clearSepTheme = () => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.removeAttribute("data-sep-theme");
  document.body?.classList.remove("sep-dark-mode");
};

export const saveTheme = (theme, userId) => {
  if (typeof window === "undefined") {
    return normalizeTheme(theme);
  }

  const normalizedTheme = applyTheme(theme);

  const userKey = getUserThemeKey(userId);
  if (userKey) {
    localStorage.setItem(userKey, normalizedTheme);
  }

  const legacyUserKey = getLegacyUserThemeKey(userId);
  if (legacyUserKey) {
    localStorage.setItem(
      legacyUserKey,
      normalizedTheme === "dark" ? "true" : "false",
    );
  }

  return normalizedTheme;
};

export const getThemeUserIdentifier = ({ token, user } = {}) => {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const tokenId =
        decoded.user_id ||
        decoded.userId ||
        decoded.usuario_id ||
        decoded.id ||
        decoded.sub;

      if (tokenId) return String(tokenId);
    } catch {
      // El perfil de usuario puede traer el identificador aunque el token no sea decodificable.
    }
  }

  const userId =
    user?.user_id ||
    user?.userId ||
    user?.usuario_id ||
    user?.id ||
    user?.pk ||
    user?.email ||
    user?.correo ||
    user?.username;

  return userId ? String(userId).trim().toLowerCase() : null;
};
