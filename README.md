# Mente Conecta — Frontend Portfolio

Versión de portafolio del frontend de **Mente Conecta**, aplicación web desarrollada de manera colaborativa.

Este repositorio fue preparado para mostrar mi participación técnica en el proyecto. Se removieron configuraciones privadas, credenciales, URLs temporales de desarrollo y el historial Git interno del repositorio original.

> Este fue un proyecto colaborativo. No todo el código presente en este repositorio fue desarrollado por mí. Mi participación se concentró principalmente en **SEP Web Básica**.

## Mi contribución

Mi trabajo se enfocó principalmente en el desarrollo y mantenimiento del módulo **SEP Web Básica**.

Entre las funcionalidades en las que participé se encuentran:

- Inicio de sesión conectado a API.
- Autenticación mediante OTP.
- Verificación en dos pasos.
- Manejo de sesión.
- Recuperación de contraseña.
- Registro y validaciones.
- Componentes reutilizables para autenticación.
- Internacionalización con i18n.
- Traducciones Español / Inglés.
- Ajustes de responsividad.
- Paridad visual.
- Desarrollo y corrección de vistas internas.
- Manejo de errores y retroalimentación al usuario.
- Pruebas unitarias.
- Correcciones derivadas de QA.

El resto de módulos se conserva para mostrar el contexto real de integración de SEP Web Básica dentro de la aplicación.

## Modo demo

El backend original y sus configuraciones privadas no forman parte de este repositorio.

Para facilitar la evaluación se agregó un **modo demo** que permite recorrer el flujo de autenticación de SEP Web Básica sin conectarse a los servicios originales.

### Credenciales demo

- **Correo:** `demo@menteconecta.test`
- **Contraseña:** `demo123`
- **Código OTP:** `123456`

Estas credenciales son completamente ficticias y existen únicamente para esta versión de demostración. No proporcionan acceso a usuarios, datos o infraestructura real.

### Flujo demo

`Inicio de sesión → Verificación OTP → Creación de sesión → SEP Web Básica`

El modo demo se habilita mediante:

`REACT_APP_DEMO_MODE=true`

## Instalación

1. Instalar dependencias:

`npm install`

2. Crear el archivo de configuración local a partir de `.env.example`.

En PowerShell:

`Copy-Item .env.example .env.development`

3. Verificar que el modo demo esté habilitado:

`REACT_APP_DEMO_MODE=true`

4. Ejecutar:

`npm start`

## Variables de entorno

`.env.example` contiene únicamente valores de referencia.

Los archivos `.env` reales no forman parte del repositorio y están excluidos mediante `.gitignore`.

## Tecnologías

- React
- JavaScript
- React Router
- Context API
- i18next
- SCSS
- APIs REST
- Fetch API
- JWT
- Jest / Testing Library
- Git

## Áreas relacionadas con mi participación

Principalmente:

- `src/api/sep/`
- `src/components/WebBasica/`
- `src/layouts/LoginWebBasica/`
- `src/pages/webBasica/`
- `src/services/authServiceWebBasica.js`
- `src/utils/sepSession.js`
- `src/locales/`
- `src/i18n.js`

También se incluye `evidencias-sep-basica/` con material relacionado con pruebas y validaciones realizadas durante el desarrollo.

## Seguridad y privacidad

Esta versión fue sanitizada antes de prepararse como portafolio.

Se excluyeron:

- Archivos `.env` originales.
- Credenciales reales.
- Tokens.
- URLs temporales de desarrollo.
- Dev tunnels.
- Direcciones de infraestructura utilizadas durante desarrollo.
- Configuración privada.
- Historial Git del repositorio original.

## Limitaciones

El backend original de Mente Conecta no está incluido.

Por esta razón, algunas funcionalidades que dependen directamente de APIs privadas pueden no estar disponibles. El modo demo permite evaluar el flujo de autenticación de SEP Web Básica sin depender de esa infraestructura.

## Participación

**Jesús Sánchez Rodríguez**

Participación en desarrollo frontend, principalmente en el módulo **SEP Web Básica** de Mente Conecta.

Repositorio preparado exclusivamente como muestra técnica de mi trabajo en el proyecto.
