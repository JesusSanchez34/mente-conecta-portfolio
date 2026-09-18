import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { SectionCard } from '../../../components/isemPaciente';
// Eliminamos la importación del catálogo estático SECCIONES
import { obtenerSecciones } from '../../../api/isem/cuestionarios'; // Asegúrate de que la ruta sea correcta
import { Spinner } from 'react-bootstrap';
import logoEdoMex from '../../../assets/login/isemlogo.png';
import './BienvenidaISEMPage.css';

/**
 * BienvenidaISEMPage
 * ============================================================
 * Pantalla principal del paciente ISEM post-login.
 *
 * Muestra:
 * • Saludo "¡Bienvenido! [nombre]"
 * • Logos institucionales
 * • Tarjetas de secciones cargadas dinámicamente desde el backend
 *
 * Idéntica para rol "Personal" y "Encuestador".
 * ============================================================
 */
export function BienvenidaISEMPage() {
  const { auth } = useAuth();
  
  // Estados para manejar la petición al backend
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SEO: Título de la pestaña
  useEffect(() => {
    document.title = '¡Bienvenido! · ISEM Salud Mental';
    return () => { document.title = 'Mente Conecta'; };
  }, []);

  // Efecto para cargar las secciones dinámicas
  useEffect(() => {
    if (!auth?.token) return;

    const cargarSecciones = async () => {
      try {
        setLoading(true);
        // Enviamos edad=1 como parámetro por defecto (como sugirió el plan)
        const data = await obtenerSecciones(1, auth.token);
        setSecciones(data || []);
      } catch (err) {
        console.error('Error al cargar secciones:', err);
        setError('No se pudieron cargar las secciones.');
      } finally {
        setLoading(false);
      }
    };

    cargarSecciones();
  }, [auth?.token]);

  // Nombre del usuario para el saludo
  const nombre = auth?.me?.first_name || auth?.me?.username || '';

  return (
    <div className="bienvenida-isem">
      {/* ── Header institucional guinda ──────────────── */}
      <header className="bienvenida-isem__header">
        <div className="bienvenida-isem__header-content">
          <h1 className="bienvenida-isem__saludo">
            ¡Bienvenido! {nombre}
          </h1>
          <div className="bienvenida-isem__logos">
            <img
              src={logoEdoMex}
              alt="Gobierno del Estado de México"
              className="bienvenida-isem__logo-img"
            />
          </div>
        </div>
      </header>

      {/* ── Contenido principal con tarjetas ────────── */}
      <div className="bienvenida-isem__body">
        
        {/* Manejo de estados de carga y error */}
        {loading && (
          <div className="bienvenida-isem__loading-container">
            <Spinner animation="border" className="bienvenida-isem__loading-spinner" />
            <p className="mt-3">Cargando secciones...</p>
          </div>
        )}

        {error && (
          <div className="bienvenida-isem__error-container">
            <p>{error}</p>
          </div>
        )}

        {/* Renderizado dinámico de las secciones */}
        {!loading && !error && (
          <div className="bienvenida-isem__sections">
            {secciones.map((seccion) => (
              <SectionCard
                key={seccion.id} // Ahora usamos el ID numérico del backend
                // Pasamos el objeto completo o mapeamos los datos para que no se rompa tu tarjeta actual
                seccionId={seccion.id}
                titulo={seccion.titulo || seccion.nombre}
                // Si tu backend no manda color ni imagen, usamos unos por defecto para no romper tu diseño
                color={seccion.color || '#6b3a5c'} 
              />
            ))}
          </div>
        )}

        {/* ── Footer de confidencialidad ──────────────── */}
        <footer className="bienvenida-isem__footer">
          <span className="bienvenida-isem__footer-icon" role="img" aria-label="candado">🔒</span>
          <p className="bienvenida-isem__footer-text">
            Tus respuestas son totalmente confidenciales y anónimas.
          </p>
        </footer>
      </div>
    </div>
  );
}