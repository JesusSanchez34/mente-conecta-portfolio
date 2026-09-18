import React from 'react';
import { FormRegisterSeguridad } from '../../components/register/formRegister/FormRegisterSeguridad';

export function RegisterSeguridad() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f7f6' }}>
            {/* Aquí mandamos a llamar el formulario que creaste en el paso anterior */}
            <FormRegisterSeguridad />
        </div>
    );
}