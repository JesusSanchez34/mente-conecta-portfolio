import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useState } from "react";
import { getToken, removeToken, setToken } from "../api/token";
import { useUser } from "../hooks";
const DEMO_ACCESS_TOKEN = "demo-sep-access-token";
const DEMO_LOGIN_TYPE = 4;

const DEMO_USER = {
  id: 999999,
  email: "demo@menteconecta.test",
  username: "demo_recruiter",
  first_name: "Usuario",
  last_name: "Demo",
  nombre: "Usuario",
  apellido_paterno: "Demo",
  apellido_materno: "",
  is_superuser: false,
  is_staff: false,
  demo: true,
};

const isDemoSession = (token, typeLogin) =>
  process.env.REACT_APP_DEMO_MODE === "true" &&
  token === DEMO_ACCESS_TOKEN &&
  Number(typeLogin) === DEMO_LOGIN_TYPE;

const buildDemoAuth = (token, typeLogin) => ({
  token,
  typeLogin,
  me: DEMO_USER,
  userId: DEMO_USER.id,
  is_superuser: false,
  is_staff: false,
  demo: true,
});

export const AuthContext = createContext({
  auth: undefined,
  login: async () => {},
  logout: () => null,
});

export function AuthProvider(props) {
  const { children } = props;

  const [auth, setAuth] = useState(undefined);
  const { getMe } = useUser();

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const typeLogin = sessionStorage.getItem("typeLogin");

        if (token && typeLogin) {
          if (isDemoSession(token, typeLogin)) {
            setAuth(buildDemoAuth(token, typeLogin));
            return;
          }

          const decoded = jwtDecode(token);
          const expirationTime = decoded.exp * 1000 - 60000;

          if (Date.now() >= expirationTime) {
            removeToken();
            sessionStorage.removeItem("typeLogin");
            setAuth(null);
          } else {
            const me = await getMe(token, typeLogin);

            const isSuper = me?.is_superuser ?? false;
            const isStaff = me?.is_staff ?? false;

            // BLOQUEO DE PACIENTES PARA CONASAMA Y SEP (DESACTIVADO TEMPORALMENTE)
            /*
            if (Number(typeLogin) === 3 || Number(typeLogin) === 4) {
              if (!isSuper && !isStaff) {
                removeToken();
                sessionStorage.removeItem("typeLogin");
                setAuth(null);
                return;
              }
            }
            */

            setAuth({
              token,
              typeLogin,
              me,
              userId: decoded.user_id ?? me?.id ?? null,
              is_superuser: isSuper,
              is_staff: isStaff,
            });
          }
        } else {
          setAuth(null);
        }
      } catch (error) {
        console.error("Error al cargar sesión:", error);
        removeToken();
        sessionStorage.removeItem("typeLogin");
        setAuth(null);
      }
    })();
  }, []);

  const login = async (token, typeLogin) => {
    setToken(token);
    sessionStorage.setItem("typeLogin", typeLogin);

    if (isDemoSession(token, typeLogin)) {
      setAuth(buildDemoAuth(token, typeLogin));
      return;
    }

    const decoded = jwtDecode(token);
    const me = await getMe(token, typeLogin);

    const isSuper = me?.is_superuser ?? false;
    const isStaff = me?.is_staff ?? false;

    // BLOQUEO DE PACIENTES PARA CONASAMA Y SEP (DESACTIVADO TEMPORALMENTE)
    /*
    if (Number(typeLogin) === 3 || Number(typeLogin) === 4) {
      if (!isSuper && !isStaff) {
        removeToken();
        sessionStorage.removeItem("typeLogin");
        throw new Error("Tu cuenta no tiene acceso a esta plataforma.");
      }
    }
    */

    setAuth({
      token,
      me,
      typeLogin,
      userId: decoded.user_id ?? me?.id ?? null,
      is_superuser: isSuper,
      is_staff: isStaff,
    });
  };

  const logout = () => {
    removeToken();
    sessionStorage.removeItem("typeLogin");
    sessionStorage.removeItem("tipoRealizador");
    setAuth(null);
  };

  const updateMeData = (updatedFields) => {
    setAuth((prevAuth) => {
      if (!prevAuth) return prevAuth;
      return {
        ...prevAuth,
        me: {
          ...prevAuth.me,
          ...updatedFields,
        },
      };
    });
  };

  if (auth === undefined) return null;

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateMeData }}>
      {children}
    </AuthContext.Provider>
  );
}

