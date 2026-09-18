import { LoginWebBasicaLayout } from "../layouts/LoginWebBasica";
import { LoginWebBasica } from "../pages/webBasica/LoginWebBasica";
import { OlvideContrasena } from "../pages/webBasica/LoginWebBasica";
import { Verificacion2Pasos } from "../pages/webBasica/LoginWebBasica/Verificacion2Pasos/Verificacion2Pasos";
import { QuienLoRealiza } from "../pages/webBasica/QuienLoRealiza/QuienLoRealiza";
import { Consentimiento } from "../pages/webBasica/Consentimiento/Consentimiento";
import { Bienvenido } from "../pages/webBasica/Bienvenido/Bienvenido";
import { CuestionarioSociodemografico } from "../pages/webBasica/CuestionarioSociodemografico/CuestionarioSociodemografico";
import { Perfil } from "../pages/webBasica/Perfil/Perfil";
import { Configuracion } from "../pages/webBasica/Configuracion/Configuracion";
import { Chatbot } from "../pages/webBasica/Chatbot/Chatbot";
import { Noticias } from "../pages/webBasica/Noticias/Noticias";

const routesWebSep = [
  {
    path: "/login-sep",
    layout: LoginWebBasicaLayout,
    component: LoginWebBasica,
  },
  {
    path: "/login-sep/olvide-contrasena",
    layout: LoginWebBasicaLayout,
    component: OlvideContrasena,
  },
  {
    path: "/login-sep/verificacion",
    layout: LoginWebBasicaLayout,
    component: Verificacion2Pasos,
  },
  {
    path: "/login-sep/quien-realiza",
    layout: LoginWebBasicaLayout,
    component: QuienLoRealiza,
  },
  {
    path: "/login-sep/consentimiento",
    layout: LoginWebBasicaLayout,
    component: Consentimiento,
  },
  {
    path: "/login-sep/bienvenido",
    layout: LoginWebBasicaLayout,
    component: Bienvenido,
  },
  {
    path: "/login-sep/perfil_screen",
    layout: LoginWebBasicaLayout,
    component: Perfil,
  },
  {
    path: "/login-sep/configuracion",
    layout: LoginWebBasicaLayout,
    component: Configuracion,
  },
  {
    path: "/login-sep/chatbot",
    layout: LoginWebBasicaLayout,
    component: Chatbot,
  },
  {
    path: "/login-sep/actualizaciones",
    layout: LoginWebBasicaLayout,
    component: Noticias,
  },
  {
    path: "/login-sep/traductor",
    layout: LoginWebBasicaLayout,
    component: Configuracion,
  },
  {
    path: "/login-sep/ayuda_screen",
    layout: LoginWebBasicaLayout,
    component: Configuracion,
  },
  {
    path: "/login-sep/cuestionario",
    layout: LoginWebBasicaLayout,
    component: CuestionarioSociodemografico,
  },
  {
    path: "/login-sep/cuestionario-salud-mental",
    layout: LoginWebBasicaLayout,
    component: CuestionarioSociodemografico,
    props: { section: "salud-mental" },
  },
];

export default routesWebSep;
