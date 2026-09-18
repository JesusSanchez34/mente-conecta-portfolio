# Resumen de evidencias

| Captura | Ruta | Que demuestra | Resultado de validacion |
|---|---|---|---|
| 01-reporte-modo-claro.png | /login-sep/reporte | Reporte en modo claro con informacion cargada, tabla de resultados, navegacion interna y boton Exportar PDF. | Correcto; datos personales ocultos, sin scroll horizontal ni imagenes rotas. |
| 02-reporte-modo-oscuro.png | /login-sep/reporte | Misma pantalla de reporte en modo oscuro. | Correcto; contraste y legibilidad conservados. |
| 03-reporte-exportacion.png | /login-sep/reporte | Accion real de exportacion desde el boton Exportar PDF. | Correcto; la exportacion se realiza por descarga directa, sin dialogo de impresion del navegador. |
| 04-alerta-error.png | /login-sep | Error real de inicio de sesion con credenciales no validas. | Correcto; mensaje visible: "Contrasena incorrecta o correo no registrado." |
| 05-alerta-exito.png | /login-sep/consentimiento | Estado real de terminos aceptados. | Correcto; boton Aceptar y Continuar visible. |
| 06-alerta-informacion-o-confirmacion.png | /login-sep/cuestionario-salud-mental | Modal informativo real antes de abrir un cuestionario. | Correcto; modal visible y legible. |
| 07-preguntas-modal-instrucciones.png | /login-sep/cuestionario-salud-mental | Pantalla de preguntas con boton Instrucciones y modal abierto. | Correcto; respuestas del fondo difuminadas para privacidad. |
| 09-noticias-estado-vacio-o-error.png | /login-sep/actualizaciones | Estado controlado real de noticias cuando la API no devuelve datos cargados. | Correcto; no queda carga indefinida. |
| 10-consentimiento-scroll-boton-visible.png | /login-sep/consentimiento | Parte inferior del consentimiento con mensaje de aceptacion y boton visible. | Correcto; sin bloqueo de scroll. |
| 11-cuestionarios-modo-claro.png | /login-sep/cuestionario-salud-mental | Tarjetas de cuestionarios en modo claro. | Correcto; cuerpo blanco y color por cuestionario. |
| 12-cuestionarios-modo-oscuro.png | /login-sep/cuestionario-salud-mental | Tarjetas de cuestionarios en modo oscuro. | Correcto; fondo oscuro y contraste adecuado. |
| 13-menu-interno-reporte.png | /login-sep/bienvenido | Menu interno con accesos reales a perfil, configuracion, noticias y reporte. | Correcto; menu visible y navegacion interna disponible. |

Endpoint del reporte:
`${REACT_APP_BASE_URL_SEP_V1}/cuestionario/respuesta/ReporteCuestionariosPorUsuarioEs/<usuarioId>/`

Endpoint del reporte en ingles:
`${REACT_APP_BASE_URL_SEP_V1}/cuestionario/respuesta/ReporteCuestionariosPorUsuarioEN/<usuarioId>/`

Metodo real de exportacion:
`jsPDF` en cliente con descarga directa mediante `doc.save()`. No utiliza la ventana de impresion del navegador.

Evidencia no obtenida:
`08-noticias-cargadas.png`: no se obtuvo porque la API de noticias no devolvio tarjetas cargadas durante los intentos reales. Se guardo `09-noticias-estado-vacio-o-error.png` como evidencia del estado controlado reproducible.

Validaciones generales:
Reporte requiere sesion activa. Las pantallas revisadas no presentaron scroll horizontal ni imagenes rotas. Noticias no permanecio en carga indefinida. La pantalla publica no heredo modo oscuro, daltonismo, fuente ni tamano de texto del modulo SEP. No se modificaron traducciones/locales ni backend.
