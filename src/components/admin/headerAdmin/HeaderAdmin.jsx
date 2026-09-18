import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks";
import './HeaderAdmin.css';


export function HeaderAdmin() {
  const { auth, logout } = useAuth();
  const nav = useNavigate();
  const renderName = () => {
    const getCleanVal = (val) => {
      if (!val || typeof val !== 'string') return null;
      
      let target = val.trim();
      
      // 1. Si está envuelto en el formato de bytes de Python b'...' o b"..."
      if (/^b['"]/i.test(target) && (target.endsWith("'") || target.endsWith('"'))) {
        target = target.slice(2, -1);
      }
      
      // 2. Si parece ser una cadena cifrada o binaria cruda en formato de escape (\x...)
      // O si contiene secuencias \x que son típicas de representación de bytes
      if (/^\\x/i.test(target) || target.toLowerCase().startsWith('\\x') || /\\x[0-9a-fA-F]{2}/.test(target) || /^x[0-9a-fA-F]+$/i.test(target)) {
        try {
          const cleanHex = target.replace(/^\\x/i, '').replace(/^x/i, '').replace(/\\x/g, '');
          if (/^[0-9a-fA-F]+$/.test(cleanHex)) {
            const bytes = new Uint8Array(cleanHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            const decoded = new TextDecoder('utf-8').decode(bytes);
            
            const hasControlChars = [...decoded].some(char => {
              const code = char.charCodeAt(0);
              return (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
            });
            if (!hasControlChars) {
              return decoded.trim();
            }
          }
        } catch (e) {
          // Ignorar error de decodificación
        }
        return null;
      }
      
      // 3. Comprobación final: si la cadena contiene caracteres de control binarios directos
      const hasControl = [...target].some(char => {
        const code = char.charCodeAt(0);
        return (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
      });
      if (hasControl) {
        return null;
      }
      
      return target;
    };

    const nombre = getCleanVal(auth?.me?.nombre);
    const apPaterno = getCleanVal(auth?.me?.apellido_paterno);
    const apMaterno = getCleanVal(auth?.me?.apellido_materno);
    const firstName = getCleanVal(auth?.me?.first_name);
    const lastName = getCleanVal(auth?.me?.last_name);
    const email = getCleanVal(auth?.me?.email);
    const username = getCleanVal(auth?.me?.username);

    // 1. Try custom name fields
    if (nombre) {
      const parts = [nombre, apPaterno, apMaterno].filter(Boolean);
      return parts.join(' ').toUpperCase();
    }

    // 2. Try standard Django name fields
    if (firstName) {
      const parts = [firstName, lastName].filter(Boolean);
      return parts.join(' ').toUpperCase();
    }

    // 3. Try username
    if (username) {
      return username.toUpperCase();
    }

    // 4. Try email
    if (email) {
      return email;
    }

    // 5. Fallbacks based on roles
    if (auth?.is_superuser) {
      return "SUPER ADMINISTRADOR";
    }
    if (auth?.is_staff) {
      return "ADMINISTRADOR";
    }
    return "USUARIO";
  };

  const regresar = () => {
    logout();
    nav("/admin");
  };

  return (
    <Navbar bg="light" variant="light" className="top-menu-admin">
      <Nav className="justify-content-end w-50 ">
      </Nav>
      <Navbar.Toggle />
      <Container>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Item className="cerrar-sesion">
            {renderName()}
          </Nav.Item>
          <Nav.Item>
            <FaRegUserCircle className="logo" />
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={regresar} className="cerrar-sesion">
              Cerrar Sesión
            </Nav.Link>
          </Nav.Item>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
