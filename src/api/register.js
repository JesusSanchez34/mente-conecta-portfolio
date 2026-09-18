import { BASE_API } from "../utils/constants";

function transformRegisterData(formValue) {
    return {
        password: formValue.password,
        nombre: formValue.nombre,
        apellido_paterno: formValue.apellido_paterno,
        apellido_materno: formValue.apellido_materno,
        username: formValue.username,
        curp: formValue.curp,
        email: formValue.email,
        genero: formValue.genero,
        ocupacion: formValue.ocupacion,
        telefono_movil: formValue.telefono,
        telefono_casa: formValue.telefono_casa || '',
        direccion: formValue.direccion,
        municipio: formValue.municipio,
        edades: 0,
        hospital: formValue.hospital ? parseInt(formValue.hospital) : 0,
        terminos_condiciones: true,
        role: 2,
    };
}

export async function registerApiISEM(formValue) {
    try {
        const url = `${BASE_API}/paciente/paciente/altaPacienteBeta/`;
        const payload = transformRegisterData(formValue);

        console.log('📤 Enviando datos de registro:', payload);

        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        const response = await fetch(url, params);

        if (response.status !== 201 && response.status !== 200) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Error del servidor:', errorData);
            throw new Error(
                errorData.detail || errorData.message || "Error al registrar usuario"
            );
        }

        const result = await response.json();
        console.log('✅ Registro exitoso:', result);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getHospitalesISEM() {
    try {
        const url = `${BASE_API}/catalogo/hospitales/`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener el catálogo de hospitales');
        }

        const data = await response.json();
        return data; // Retorna el arreglo de hospitales desde Python
    } catch (error) {
        console.error('❌ Error obteniendo hospitales:', error);
        throw error;
    }
}