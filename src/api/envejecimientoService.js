import { BASE_API_ENVEJECIMIENTO } from '../utils/constants';

export async function obtenerDatosUsuario(usuarioId) {
    const res = await fetch(`${BASE_API_ENVEJECIMIENTO}/paciente/paciente/obtener-datos-usuario/?usuario_id=${usuarioId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
    return data.data ?? data;
}

export async function obtenerReporte(usuarioId, language = 'es') {
    const endpoint = language === 'en'
        ? `cuestionario/respuesta/ReporteCuestionariosPorUsuariosEN/${usuarioId}/`
        : `cuestionario/respuesta/ReporteCuestionariosPorUsuariosEs/${usuarioId}/`;
    const res = await fetch(`${BASE_API_ENVEJECIMIENTO}/${endpoint}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
    const esES = language !== 'en';
    return {
        usuario: data[esES ? 'usuario' : 'full_name'] ?? '',
        correo: data[esES ? 'correo' : 'email'] ?? '',
        celular: data[esES ? 'celular' : 'phone'] ?? '',
        resultados: (data[esES ? 'resultados' : 'results'] ?? []).map(r => ({
            cuestionario: r[esES ? 'nombre_escala' : 'scale_name'] ?? '',
            nota: r[esES ? 'calificacion' : 'score'] ?? '',
            interpretacion: r[esES ? 'interpretacion' : 'interpretation'] ?? '',
        })),
    };
}

export async function actualizarDatosUsuario({ usuarioId, email, celularPaciente, foto, token }) {
    const formData = new FormData();
    formData.append('usuario_id', usuarioId);
    formData.append('email', email);
    formData.append('celular_paciente', celularPaciente);
    if (foto) formData.append('foto', foto);

    const res = await fetch(`${BASE_API_ENVEJECIMIENTO}/paciente/paciente/ActualizarDatosUsuario/`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
    return data;
}

export async function activarConsentimiento(usuarioId, token) {
    const res = await fetch(`${BASE_API_ENVEJECIMIENTO}/paciente/paciente/activar-consentimiento/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id: usuarioId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
    return data;
}

export async function activarAsentimiento(usuarioId, token) {
    const res = await fetch(`${BASE_API_ENVEJECIMIENTO}/paciente/paciente/activar-asentimiento/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id: usuarioId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
    return data;
}
