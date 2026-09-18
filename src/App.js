import React, { useState } from 'react'; // Agregamos useState
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthProvider, CuestionarioProvider } from './context';
import { SettingsProvider } from './context/SettingsContext';
import { Navigation } from './routes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // Creamos el estado aquí, en la raíz
  const [isSplashActive, setIsSplashActive] = useState(false);

  return (
    <AuthProvider>
      <SettingsProvider>
          <CuestionarioProvider>

              <div className={isSplashActive ? "splash-active" : ""}>
                  <Navigation setSplash={setIsSplashActive} />

                  <ToastContainer
                      position="top-right"
                      autoClose={3500}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      pauseOnHover
                      draggable
                      theme="colored"
                      style={{ marginTop: "70px" }}
                  />
              </div>

          </CuestionarioProvider>
      </SettingsProvider>
  </AuthProvider>
  );
}


export default App;
