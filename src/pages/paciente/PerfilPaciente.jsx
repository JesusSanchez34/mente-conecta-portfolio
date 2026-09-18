import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt, FaSave, FaFilePdf, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { FaHeart, FaShieldAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks';
import { toast } from 'react-toastify';
import { obtenerRespuestasUsuarioApi, obtenerReportePacienteApi } from '../../api/cuestionarios';
import { obtenerDatosUsuarioPacienteApi, ActualizarDatosUsuarioPacienteApi } from '../../api/user';
import { SpeedDialPaciente } from '../../components/ui/SpeedDialPaciente';
import './PerfilPaciente.css';

export function PerfilPaciente() {
    const { auth, logout, updateMeData } = useAuth();
    const navigate = useNavigate();

    const [lang, setLang] = useState(() => localStorage.getItem('mente_conecta_lang') || 'es');
    const [textSize, setTextSize] = useState(() => localStorage.getItem('mente_conecta_text_size') || 'md');
    const [highContrast, setHighContrast] = useState(() => localStorage.getItem('mente_conecta_high_contrast') === 'true');
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('mente_conecta_sound') !== 'false');
    const [darkMode] = useState(() => localStorage.getItem('mente_conecta_dark_mode') === 'true');
    const [readingMode] = useState(() => localStorage.getItem('mente_conecta_reading_mode') || 'normal');

    const [emailInput, setEmailInput] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [patientData, setPatientData] = useState(null);
    const [loadingPatient, setLoadingPatient] = useState(true);

    useEffect(() => {
        if (auth?.me) {
            (async () => {
                try {
                    const userId = auth.me.id || auth.me.user_id;
                    const res = await obtenerDatosUsuarioPacienteApi(userId, auth.token, auth.typeLogin);
                    if (res && res.data) {
                        setPatientData(res.data);
                        setEmailInput(res.data.email || auth.me.email || auth.me.username || '');
                    } else {
                        setEmailInput(auth.me.email || auth.me.username || '');
                    }
                } catch (e) {
                    console.error("Error loading patient details:", e);
                    toast.error(lang === 'es' ? `Error al obtener perfil: ${e.message}` : `Error loading profile: ${e.message}`);
                    setEmailInput(auth.me.email || auth.me.username || '');
                } finally {
                    setLoadingPatient(false);
                }
            })();
        }
    }, [auth]);

    if (auth === undefined) return null;
    if (!auth || auth?.detail || Number(auth?.typeLogin) !== 3) {
        return <Navigate to="/admin" replace />;
    }

    const getCleanVal = (val) => {
        if (!val) return null;
        if (typeof val !== 'string') return val;
        
        let target = val.trim();
        
        // 1. Si estÃ¡ envuelto en el formato de bytes de Python b'...' o b"..."
        if (/^b['"]/i.test(target) && (target.endsWith("'") || target.endsWith('"'))) {
            target = target.slice(2, -1);
        }
        
        // 2. Si parece ser una cadena cifrada o binaria cruda en formato de escape (\x...)
        // O si contiene secuencias \x que son tÃ­picas de representaciÃ³n de bytes
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
                // Ignorar error de decodificaciÃ³n
            }
            return null;
        }
        
        // 3. ComprobaciÃ³n final: si la cadena contiene caracteres de control binarios directos
        const hasControl = [...target].some(char => {
            const code = char.charCodeAt(0);
            return (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
        });
        if (hasControl) {
            return null;
        }
        
        return target;
    };

    const getNestedVal = (obj, key) => {
        if (!obj) return null;
        if (obj[key] !== undefined && obj[key] !== null) return obj[key];
        if (obj.paciente && obj.paciente[key] !== undefined && obj.paciente[key] !== null) return obj.paciente[key];
        if (obj.patient && obj.patient[key] !== undefined && obj.patient[key] !== null) return obj.patient[key];
        if (obj.paciente_data && obj.paciente_data[key] !== undefined && obj.paciente_data[key] !== null) return obj.paciente_data[key];
        if (obj.usuario && obj.usuario[key] !== undefined && obj.usuario[key] !== null) return obj.usuario[key];
        return null;
    };

    const nombre = getCleanVal(getNestedVal(patientData, 'nombre') || getNestedVal(auth?.me, 'nombre'));
    const apPaterno = getCleanVal(getNestedVal(patientData, 'apellido_paterno') || getNestedVal(auth?.me, 'apellido_paterno'));
    const apMaterno = getCleanVal(getNestedVal(patientData, 'apellido_materno') || getNestedVal(auth?.me, 'apellido_materno'));
    const firstName = getCleanVal(getNestedVal(patientData, 'first_name') || getNestedVal(auth?.me, 'first_name'));
    const lastName = getCleanVal(getNestedVal(patientData, 'last_name') || getNestedVal(auth?.me, 'last_name'));

    let fullName = 'Paciente';
    if (nombre) {
        fullName = [nombre, apPaterno, apMaterno].filter(Boolean).join(' ').trim();
    } else if (firstName) {
        fullName = `${firstName} ${lastName || ''}`.trim();
    } else {
        fullName = getNestedVal(patientData, 'email') || getNestedVal(patientData, 'username') || auth?.me?.username || auth?.me?.email || 'Paciente';
    }

    // Convertir a mayÃºsculas y minÃºsculas (Title Case) para coincidir con la app mÃ³vil
    if (fullName && !fullName.includes('@') && fullName !== 'Paciente') {
        fullName = fullName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const birthDate = getCleanVal(getNestedVal(patientData, 'fecha_nacimiento')) ||
                      getCleanVal(getNestedVal(patientData, 'birth_date')) ||
                      getCleanVal(getNestedVal(patientData, 'date_of_birth')) ||
                      getCleanVal(getNestedVal(auth?.me, 'fecha_nacimiento')) || 
                      getCleanVal(getNestedVal(auth?.me, 'birth_date')) || 
                      getCleanVal(getNestedVal(auth?.me, 'date_of_birth')) || 
                      null;

    const handleLogout = () => {
        logout();
        toast.success(lang === 'es' ? 'SesiÃ³n cerrada con Ã©xito' : 'Signed out successfully');
        navigate('/admin');
    };

    const handleSave = async () => {
        if (!emailInput.trim()) {
            toast.error(lang === 'es' ? 'El correo electrÃ³nico no puede estar vacÃ­o' : 'Email cannot be empty');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            toast.error(lang === 'es' ? 'Correo electrÃ³nico no vÃ¡lido' : 'Invalid email address');
            return;
        }

        try {
            const userId = auth.me?.id || auth.me?.user_id;
            const celular = patientData?.celular_paciente || '';
            await ActualizarDatosUsuarioPacienteApi(userId, emailInput, celular, auth.token, auth.typeLogin);

            if (updateMeData) {
                updateMeData({ email: emailInput });
            }
            setPatientData(prev => prev ? { ...prev, email: emailInput } : { email: emailInput });
            toast.success(lang === 'es' ? 'Cambios guardados con Ã©xito' : 'Changes saved successfully');
        } catch (error) {
            toast.error(lang === 'es' ? `Error al guardar los cambios: ${error.message}` : `Error saving changes: ${error.message}`);
            console.error("Error saving patient changes:", error);
        }
    };

    const JORGE_BASE_URL = process.env.REACT_APP_PACIENTE_BASE_URL || "";

    const fetchWithTimeout = async (resource, options = {}) => {
        const { timeout = 2000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    };

    const fetchReporteFromJorge = async (userId, token, lang = 'es') => {
        const action = lang === 'en' ? 'ReporteCuestionariosPorUsuariosEN' : 'ReporteCuestionariosPorUsuariosEs';
        const url = `${JORGE_BASE_URL}/cuestionario/respuesta/${action}/${userId}/`;
        const params = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            timeout: 2000
        };
        const response = await fetchWithTimeout(url, params);
        if (response.status !== 200) {
            throw new Error(`Failed status ${response.status}`);
        }
        return await response.json();
    };

    const fetchRespuestasFromJorge = async (userId, cuestionarioId, token) => {
        const url = `${JORGE_BASE_URL}/user/usuariorespuestas/obtener/`;
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                id_usuario: userId,
                id_cuestionario: cuestionarioId,
                id_parentesco: null,
            }),
            timeout: 2000
        };
        const response = await fetchWithTimeout(url, params);
        if (response.status !== 200) {
            return null;
        }
        const text = await response.text();
        if (!text) return null;
        return JSON.parse(text);
    };

    const handleReport = async () => {
        if (isGeneratingReport) return;
        if (!auth?.token) return;

        const reportWindow = window.open('', '_blank');
        if (!reportWindow) {
            toast.error(lang === 'es' ? 'Permiso de ventanas emergentes denegado' : 'Popup permission denied');
            return;
        }

        reportWindow.document.write(`
            <html>
            <head>
                <title>${lang === 'es' ? 'Generando Reporte...' : 'Generating Report...'}</title>
                <style>
                    body {
                        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        margin: 0;
                        background-color: #f8fafc;
                        color: #475569;
                    }
                    .loader-container {
                        text-align: center;
                    }
                    .spinner {
                        border: 4px solid rgba(7, 175, 184, 0.1);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border-left-color: #07afb8;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 15px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    p {
                        font-weight: 600;
                        font-size: 1.1rem;
                    }
                </style>
            </head>
            <body>
                <div class="loader-container">
                    <div class="spinner"></div>
                    <p>${lang === 'es' ? 'Generando reporte, por favor espera...' : 'Generating report, please wait...'}</p>
                </div>
            </body>
            </html>
        `);
        reportWindow.document.close();

        setIsGeneratingReport(true);
        const userId = auth.me?.id || auth.me?.user_id || 1;

        const loadingToast = toast.loading(
            lang === 'es' ? 'Generando reporte, por favor espera...' : 'Generating report, please wait...'
        );

        const results = [];

        try {
            let apiResults = [];
            let jorgeSuccess = false;

            let isJorgeOnline = false;
            try {
                const checkRes = await fetchWithTimeout(`${JORGE_BASE_URL}/cuestionario/seccion/`, { 
                    method: 'GET', 
                    timeout: 1500,
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                if (checkRes.status === 200 || checkRes.status === 401 || checkRes.status === 403 || checkRes.status === 404) {
                    isJorgeOnline = true;
                }
            } catch (e) {
                console.warn("Jorge's server is offline, skipping mobile DB fetch.");
            }

            if (isJorgeOnline) {
                try {
                    const reportData = await fetchReporteFromJorge(userId, auth.token, lang);
                    apiResults = reportData?.resultados || [];
                    jorgeSuccess = true;
                    console.log("Reporte obtenido con Ã©xito desde el servidor mÃ³vil de Jorge.");
                } catch (error) {
                    console.warn("API de reporte unificado de Jorge fallÃ³, intentando respuestas individuales del mÃ³vil...", error);
                    
                    const questionnaireInfo = [
                        { id: 2, key: 'Ansiedad', label: lang === 'es' ? 'Ansiedad' : 'Anxiety' },
                        { id: 4, key: 'DepresiÃ³n', label: lang === 'es' ? 'DepresiÃ³n' : 'Depression' },
                        { id: 1, key: 'Alcohol', label: lang === 'es' ? 'Alcohol' : 'Alcohol' },
                        { id: 3, key: 'Conducta Alimentaria', label: lang === 'es' ? 'Conducta Alimentaria' : 'Eating Behavior' },
                        { id: 5, key: 'Drogas', label: lang === 'es' ? 'Drogas' : 'Drugs' },
                        { id: 6, key: 'Riesgo de Suicidio', label: lang === 'es' ? 'Riesgo de Suicidio' : 'Suicide Risk' },
                        { id: 7, key: 'Tabaco', label: lang === 'es' ? 'Tabaco' : 'Tobacco' }
                    ];

                    const fallbackResults = [];
                    let fetchErrors = 0;

                    await Promise.all(questionnaireInfo.map(async (q) => {
                        try {
                            const res = await fetchRespuestasFromJorge(userId, q.id, auth.token);
                            if (res) {
                                if (res.estatus_finalizado === 1 && res.respuestas_json) {
                                    let parsedResponses = [];
                                    try {
                                        parsedResponses = JSON.parse(res.respuestas_json);
                                    } catch (e) {
                                        console.error("Error al parsear respuestas de Jorge para questId:", q.id, e);
                                    }

                                    let totalScore = 0;
                                    parsedResponses.forEach(item => {
                                        if (item && typeof item.calificacion === 'number') {
                                            totalScore += item.calificacion;
                                        }
                                    });

                                    const interp = getClientSideInterpretation(q.id, totalScore, lang);
                                    fallbackResults.push({
                                        cuestionario: q.key,
                                        nombre_escala: q.key,
                                        nota: totalScore,
                                        interpretacion: interp
                                    });
                                }
                            } else {
                                fetchErrors++;
                            }
                        } catch (e) {
                            fetchErrors++;
                            console.error(`Error de red al consultar respuestas de Jorge para el cuestionario ${q.id}:`, e);
                        }
                    }));

                    if (fetchErrors < questionnaireInfo.length) {
                        apiResults = questionnaireInfo.map(info => {
                            const match = fallbackResults.find(r => r.cuestionario === info.key);
                            return match || null;
                        }).filter(Boolean);
                        jorgeSuccess = true;
                        console.log("Respuestas individuales obtenidas con Ã©xito desde el servidor mÃ³vil de Jorge.");
                    }
                }
            }

            if (!jorgeSuccess) {
                console.warn("Servidor de Jorge inaccesible. Consultando base de datos local de CONASAMA...");
                try {
                    const reportData = await obtenerReportePacienteApi(userId, auth.token, lang);
                    apiResults = reportData?.resultados || [];
                } catch (error) {
                    console.warn("API de reporte unificado de CONASAMA fallÃ³, intentando respuestas individuales locales...", error);
                    
                    const questionnaireInfo = [
                        { id: 2, key: 'Ansiedad', label: lang === 'es' ? 'Ansiedad' : 'Anxiety' },
                        { id: 4, key: 'DepresiÃ³n', label: lang === 'es' ? 'DepresiÃ³n' : 'Depression' },
                        { id: 1, key: 'Alcohol', label: lang === 'es' ? 'Alcohol' : 'Alcohol' },
                        { id: 3, key: 'Conducta Alimentaria', label: lang === 'es' ? 'Conducta Alimentaria' : 'Eating Behavior' },
                        { id: 5, key: 'Drogas', label: lang === 'es' ? 'Drogas' : 'Drugs' },
                        { id: 6, key: 'Riesgo de Suicidio', label: lang === 'es' ? 'Riesgo de Suicidio' : 'Suicide Risk' },
                        { id: 7, key: 'Tabaco', label: lang === 'es' ? 'Tabaco' : 'Tobacco' }
                    ];

                    const fallbackResults = [];
                    
                    await Promise.all(questionnaireInfo.map(async (q) => {
                        try {
                            const res = await obtenerRespuestasUsuarioApi(userId, q.id, auth.token);
                            if (res && res.estatus_finalizado === 1 && res.respuestas_json) {
                                let parsedResponses = [];
                                try {
                                    parsedResponses = JSON.parse(res.respuestas_json);
                                } catch (e) {
                                    console.error("Error al parsear respuestas de CONASAMA para questId:", q.id, e);
                                }

                                let totalScore = 0;
                                parsedResponses.forEach(item => {
                                    if (item && typeof item.calificacion === 'number') {
                                        totalScore += item.calificacion;
                                    }
                                });

                                const interp = getClientSideInterpretation(q.id, totalScore, lang);
                                fallbackResults.push({
                                    cuestionario: q.key,
                                    nombre_escala: q.key,
                                    nota: totalScore,
                                    interpretacion: interp
                                });
                            }
                        } catch (e) {
                            console.error(`Error al consultar cuestionario individual ${q.id} en CONASAMA:`, e);
                        }
                    }));

                    apiResults = questionnaireInfo.map(info => {
                        const match = fallbackResults.find(r => r.cuestionario === info.key);
                        return match || null;
                    }).filter(Boolean);
                }
            }

            const questionnaireNames = [
                { key: 'Ansiedad', label: lang === 'es' ? 'Ansiedad' : 'Anxiety' },
                { key: 'DepresiÃ³n', label: lang === 'es' ? 'DepresiÃ³n' : 'Depression' },
                { key: 'Alcohol', label: lang === 'es' ? 'Alcohol' : 'Alcohol' },
                { key: 'Conducta Alimentaria', label: lang === 'es' ? 'Conducta Alimentaria' : 'Eating Behavior' },
                { key: 'Drogas', label: lang === 'es' ? 'Drogas' : 'Drugs' },
                { key: 'Riesgo de Suicidio', label: lang === 'es' ? 'Riesgo de Suicidio' : 'Suicide Risk' },
                { key: 'Tabaco', label: lang === 'es' ? 'Tabaco' : 'Tobacco' }
            ];

            for (const q of questionnaireNames) {
                const normalize = (str) => (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                const match = apiResults.find(r => 
                    normalize(r.cuestionario) === normalize(q.key) || 
                    normalize(r.nombre_escala) === normalize(q.key) ||
                    normalize(r.cuestionario) === normalize(q.label) || 
                    normalize(r.nombre_escala) === normalize(q.label)
                );

                if (match) {
                    results.push({
                        name: q.label,
                        score: match.nota !== undefined ? match.nota : (match.calificacion !== undefined ? match.calificacion : (match.score !== undefined ? match.score : '-')),
                        interpretacion: match.interpretacion || '',
                        completed: true
                    });
                } else {
                    results.push({
                        name: q.label,
                        score: '-',
                        interpretacion: lang === 'es' ? 'No completado' : 'Not completed',
                        completed: false
                    });
                }
            }

            toast.update(loadingToast, {
                render: lang === 'es' ? 'Reporte generado con Ã©xito' : 'Report generated successfully',
                type: 'success',
                isLoading: false,
                autoClose: 3000
            });

            reportWindow.document.open();

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayISO = `${year}-${month}-${day}`;

            const rowsHtml = results.map(r => {
                const color = getInterpretacionColor(r.interpretacion);
                return `
                    <tr>
                        <td>${r.name}</td>
                        <td style="text-align: center; font-weight: 600;">${r.score}</td>
                        <td style="color: ${color}; font-weight: 600;">${r.interpretacion}</td>
                    </tr>
                `;
            }).join('');

            let logoUrl = '';
            try {
                const logoResponse = await fetch('/image/mcLogoSF.png');
                const logoBlob = await logoResponse.blob();
                logoUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(logoBlob);
                });
            } catch (error) {
                console.error("Error loading logo image:", error);
                logoUrl = window.location.origin + '/image/mcLogoSF.png';
            }

            reportWindow.document.write(`
                <html>
                <head>
                    <title>${lang === 'es' ? 'Mente Conecta Pre-Diagnosticos' : 'Mente Conecta Pre-Diagnosis'}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
                        
                        @page {
                            size: A4;
                            margin: 0;
                        }
                        
                        body {
                            font-family: 'Inter', 'Outfit', sans-serif;
                            color: #000000;
                            margin: 0;
                            padding: 0;
                            line-height: 1.4;
                            background-color: #ffffff;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                            font-size: 14px;
                        }
                        
                        .page {
                            width: 210mm;
                            height: 297mm;
                            padding: 20mm;
                            box-sizing: border-box;
                            position: relative;
                            background-color: #ffffff;
                            display: flex;
                            flex-direction: column;
                            page-break-after: always;
                        }
                        
                        .page:last-child {
                            page-break-after: avoid;
                        }
                        
                        .header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-bottom: 2px solid #333333;
                            padding-bottom: 10px;
                            margin-bottom: 20px;
                        }
                        
                        .header-title {
                            font-family: 'Outfit', sans-serif;
                            font-weight: 800;
                            font-size: 22px;
                            color: #000000;
                            letter-spacing: -0.5px;
                        }
                        
                        .logo-img {
                            height: 40px;
                            width: auto;
                        }
                        
                        .section-title {
                            font-family: 'Outfit', sans-serif;
                            font-size: 16px;
                            font-weight: 700;
                            color: #000000;
                            margin-top: 10px;
                            margin-bottom: 4px;
                        }
                        
                        .divider {
                            border-top: 1px solid #cbd5e0;
                            margin-bottom: 15px;
                        }
                        
                        .personal-info-text {
                            font-size: 13px;
                            line-height: 1.6;
                            color: #333333;
                            margin-bottom: 20px;
                        }
                        
                        .results-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 25px;
                        }
                        
                        .results-table th {
                            background-color: #f2f2f2;
                            border: 1px solid #cbd5e0;
                            padding: 10px 12px;
                            font-weight: 700;
                            text-align: left;
                            font-size: 13px;
                            color: #1a202c;
                        }
                        
                        .results-table td {
                            border: 1px solid #cbd5e0;
                            padding: 10px 12px;
                            font-size: 13px;
                            color: #2d3748;
                        }
                        
                        .important-note {
                            color: #c53030;
                            font-style: italic;
                            font-size: 12px;
                            line-height: 1.6;
                            margin-top: 10px;
                            margin-bottom: 25px;
                            text-align: justify;
                        }
                        
                        .footer {
                            border-top: 1px solid #cbd5e0;
                            padding-top: 12px;
                            text-align: center;
                            font-size: 11px;
                            color: #718096;
                            line-height: 1.5;
                            margin-top: auto;
                        }
                        
                        .footer-links {
                            font-weight: 700;
                            margin-bottom: 4px;
                        }
                        
                        .footer-confidential {
                            font-style: italic;
                        }
                        
                        .references-list {
                            padding-left: 20px;
                            margin: 0;
                        }
                        
                        .references-list li {
                            margin-bottom: 12px;
                            font-size: 11px;
                            color: #333333;
                            text-align: justify;
                            line-height: 1.5;
                        }
                    </style>
                </head>
                <body>
                    <!-- PAGE 1: PRE-DIAGNOSTICS TABLE -->
                    <div class="page">
                        <div class="header">
                            <div class="header-title">
                                ${lang === 'es' ? 'Mente Conecta Pre-DiagnÃ³sticos' : 'Mente Conecta Pre-Diagnosis'}
                            </div>
                            <img src="${logoUrl}" alt="Logo" class="logo-img" />
                        </div>
                        
                        <div class="section-title">
                            ${lang === 'es' ? 'Datos Personales.' : 'Personal Data.'}
                        </div>
                        <div class="divider"></div>
                        
                        <div class="personal-info-text">
                            <strong>${lang === 'es' ? 'Nombre del Paciente:' : 'Patient Name:'}</strong> ${fullName}<br/>
                            <strong>${lang === 'es' ? 'Correo:' : 'Email:'}</strong> ${emailInput}
                        </div>

                        <table class="results-table">
                            <thead>
                                <tr>
                                    <th>${lang === 'es' ? 'Cuestionario' : 'Questionnaire'}</th>
                                    <th style="text-align: center; width: 80px;">${lang === 'es' ? 'Nota' : 'Score'}</th>
                                    <th>${lang === 'es' ? 'InterpretaciÃ³n' : 'Interpretation'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>

                        <div class="important-note">
                            ${lang === 'es' 
                                ? 'Nota Importante: Esta informaciÃ³n corresponde Ãºnicamente a un prediagnÃ³stico. Te recomendamos consultar a un especialista para una evaluaciÃ³n completa y precisa.' 
                                : 'Important Note: This information corresponds only to a pre-diagnosis. We recommend consulting a specialist for a complete and precise evaluation.'}
                        </div>

                        <div class="footer">
                            <div class="footer-links">
                                mente-conecta@loopconexion.com | www.mente-conecta.com | (55) 1234-5678
                            </div>
                            <div class="footer-confidential">
                                ${lang === 'es' 
                                    ? 'Este documento es confidencial y no sustituye la evaluaciÃ³n de un profesional.' 
                                    : 'This document is confidential and does not replace professional evaluation.'}
                            </div>
                            <div style="margin-top: 6px;">
                                ${lang === 'es' ? 'Fecha de EmisiÃ³n:' : 'Issue Date:'} ${todayISO}
                            </div>
                        </div>
                    </div>

                    <!-- PAGE 2: REFERENCES -->
                    <div class="page">
                        <div class="header">
                            <div class="header-title">
                                ${lang === 'es' ? 'Mente Conecta Pre-DiagnÃ³sticos' : 'Mente Conecta Pre-Diagnosis'}
                            </div>
                            <img src="${logoUrl}" alt="Logo" class="logo-img" />
                        </div>
                        
                        <div class="section-title">
                            ${lang === 'es' ? 'Referencias' : 'References'}
                        </div>
                        <div class="divider"></div>

                        <ol class="references-list">
                            <li>GarcÃ­a-Galicia A, DÃ­az-DÃ­az JF, Montiel-JarquÃ­n ÃJ, GonzÃ¡lez-LÃ³pez AM, VÃ¡zquez-Cruz E, Morales-Flores CF. Validity and consistency of an outpatient department user satisfaction rapid scale. Gac Med Mex. 2020;156(1):47-52. English. doi: 10.24875/GMM.19005144. PMID: 32026871.</li>
                            <li>Arrieta J, Aguerrebere M, Raviola G, Flores H, Elliott P, Espinosa A, Reyes A, Ortiz-Panozo E, RodrÃ­guez-GutiÃ©rrez EG, Mukherjee J, Palazuelos D, Franke MF. Validity and Utility of the Patient Health Questionnaire (PHQ)-2 and PHQ-9 for Screening and Diagnosis of Depression in Rural Chiapas, Mexico: A Cross-Sectional Study. J Clin Psychol. 2017 Sep;73(9):1076-1090. doi: 10.1002/jclp.22390. Epub 2017 Feb 13. PMID: 28195649; PMCID: PMC5573982.</li>
                            <li>Higgins-Biddle JC, Babor TF. A review of the Alcohol Use Disorders Identification Test (AUDIT), AUDIT-C, and USAUDIT for screening in the United States: Past issues and future directions. Am J Drug Alcohol Abuse. 2018;44(6):578-588. doi: 10.24875/2018.1456545. Epub 2018 May 3. PMID: 29723083; PMCID: PMC6217805.</li>
                            <li>Fairburn, CG, Beglin, SJ. Eating disorder examination questionnaire (EDE-Q 6.0). In: Fairburn CG Editors, Cognitive behavior therapy and eating disorders. Guilford Press; 2008. p. 309-313.</li>
                            <li>b.GarcÃ­a-PÃ©rez, M. A., GarcÃ­a-FernÃ¡ndez, G., GonzÃ¡lez-Blanco, L., et al. (2019). ValidaciÃ³n del Alcohol, Smoking, and Substance Involvement Screening Test versiÃ³n 3 (ASSIST v3) de la OrganizaciÃ³n Mundial de la Salud en una muestra de pacientes con trastornos mentales. Adicciones, 31(1), 23-32.</li>
                            <li>Susana Al-Halabi, Pilar A. SÃ¡iz, Patricia BurÃ³n, MarlÃ©n Garrido, Antoni Benabarre, Esther JimÃ©nez, Jorge Cervilla, MarÃ­a Isabel Navarrete, Eva M. DÃ­az-Mesa, Leticia GarcÃ­a-Ãlvarez, JosÃ© MuÃ±iz, Kelly Posner, Maria A. Oquendo, MarÃ­a Paz GarcÃ­a-Portilla, Julio Bobes. Validation of a Spanish version of the Columbia-Suicide Severity Rating Scale (C-SSRS). Revista de PsiquiatrÃ­a y salud mental. 2016, vol. 9, No. 3, 134-142pp.</li>
                            <li>Etter JF, Duc TV, Perneger TV. Validity of the FagerstrÃ¶m test for nicotine dependence and of the Heaviness of Smoking Index among relatively light smokers. Addiction. 1999 Feb;94(2):269-81. doi: 10.1046/j.1360-0443.1999.94226910.x. PMID: 10396794.</li>
                        </ol>

                        <div class="footer">
                            <div class="footer-links">
                                mente-conecta@loopconexion.com | www.mente-conecta.com | (55) 1234-5678
                            </div>
                            <div class="footer-confidential">
                                ${lang === 'es' 
                                    ? 'Este documento es confidencial y no sustituye la evaluaciÃ³n de un profesional.' 
                                    : 'This document is confidential and does not replace professional evaluation.'}
                            </div>
                            <div style="margin-top: 6px;">
                                ${lang === 'es' ? 'Fecha de EmisiÃ³n:' : 'Issue Date:'} ${todayISO}
                            </div>
                        </div>
                    </div>

                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 500);
                        };
                        window.onafterprint = function() {
                            window.close();
                        };
                    </script>
                </body>
                </html>
            `);
            reportWindow.document.close();
        } catch (error) {
            console.error("Error generating report:", error);
            try {
                reportWindow.close();
            } catch (err) {}
            toast.update(loadingToast, {
                render: lang === 'es' ? `Error al generar el reporte: ${error.message}` : `Error generating report: ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 5000
            });
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <div className={[
            'perfil-page-container',
            `patient-text-${textSize}`,
            darkMode && !highContrast ? 'patient-dark-mode' : '',
            readingMode === 'dislexia' ? 'patient-dyslexia' : '',
            highContrast ? 'patient-high-contrast' : '',
        ].filter(Boolean).join(' ')}>

            {/* â”€â”€ Header â”€â”€ */}
            <header className="perfil-top-bar">
                <button type="button" className="perfil-back-btn" onClick={() => navigate('/paciente/inicio')}>
                    <FaArrowLeft />
                </button>
                <h1 className="perfil-top-title">
                    {lang === 'es' ? 'Mi perfil' : 'My profile'}
                </h1>
            </header>



            {/* â”€â”€ Floating Background Icons â”€â”€ */}
            <div className="perfil-floating-bg">
                <GiBrain className="perfil-floating-icon p-icon-1" />
                <FaShieldAlt className="perfil-floating-icon p-icon-2" />
                <FaHeart className="perfil-floating-icon p-icon-3" />
                <GiBrain className="perfil-floating-icon p-icon-4" />
                <FaHeart className="perfil-floating-icon p-icon-5" />
                <FaShieldAlt className="perfil-floating-icon p-icon-6" />
            </div>

            <main className="perfil-content">

                {/* â”€â”€ Avatar + Nombre â”€â”€ */}
                <div className="perfil-avatar-section">
                    <div className="perfil-avatar-ring">
                        <FaUserCircle className="perfil-avatar-icon" />
                    </div>
                    <h2 className="perfil-name">{fullName}</h2>
                    {birthDate && (
                        <div className="perfil-birthdate-pill">
                            {lang === 'es' ? 'Fecha de nacimiento' : 'Date of birth'} {birthDate}
                        </div>
                    )}
                </div>

                {/* â”€â”€ Separador â”€â”€ */}
                <div className="perfil-divider" />

                {/* â”€â”€ InformaciÃ³n de Contacto â”€â”€ */}
                <div className="perfil-section">
                    <h3 className="perfil-section-title">
                        {lang === 'es' ? 'Informacion de contacto' : 'Contact information'}
                    </h3>

                    <div className="perfil-field-group">
                        <label className="perfil-field-label">
                            <FaEnvelope className="perfil-field-icon" />
                            {lang === 'es' ? 'Correo electrÃ³nico' : 'Email'}
                        </label>
                        <input
                            type="email"
                            className="perfil-field-value-input"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder={lang === 'es' ? 'Ingresa tu correo' : 'Enter your email'}
                        />
                    </div>
                </div>

                {/* â”€â”€ Botones â”€â”€ */}
                <div className="perfil-actions">
                    <button 
                        type="button" 
                        className="perfil-btn perfil-btn-blue" 
                        onClick={handleReport}
                        disabled={isGeneratingReport}
                    >
                        {isGeneratingReport ? <FaSpinner className="spinner-loading" /> : <FaFilePdf />}
                        {lang === 'es' ? 'Ver Reporte' : 'View Report'}
                    </button>

                    <button type="button" className="perfil-btn perfil-btn-gray" onClick={handleSave}>
                        <FaSave />
                        {lang === 'es' ? 'Guardar cambios' : 'Save changes'}
                    </button>

                    <button type="button" className="perfil-btn perfil-btn-red" onClick={handleLogout}>
                        <FaSignOutAlt />
                        {lang === 'es' ? 'Cerrar sesiÃ³n' : 'Sign out'}
                    </button>
                </div>

            </main>

            <SpeedDialPaciente
                lang={lang}
                setLang={setLang}
                textSize={textSize}
                setTextSize={setTextSize}
                highContrast={highContrast}
                setHighContrast={setHighContrast}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
            />
        </div>
    );
}

function getClientSideInterpretation(questId, score, lang = 'es') {
    const isEs = lang === 'es';
    if (questId === 2) {
        if (score <= 4) return isEs ? "Sin Ansiedad" : "No Anxiety";
        if (score <= 9) return isEs ? "Ansiedad Leve" : "Mild Anxiety";
        if (score <= 14) return isEs ? "Ansiedad Moderada" : "Moderate Anxiety";
        return isEs ? "Ansiedad Severa" : "Severe Anxiety";
    }
    if (questId === 4) {
        if (score <= 4) return isEs ? "Sin DepresiÃ³n" : "No Depression";
        if (score <= 9) return isEs ? "DepresiÃ³n Leve" : "Mild Depression";
        if (score <= 14) return isEs ? "DepresiÃ³n Moderada" : "Moderate Depression";
        if (score <= 19) return isEs ? "DepresiÃ³n Moderadamente Severa" : "Moderately Severe Depression";
        return isEs ? "DepresiÃ³n Severa" : "Severe Depression";
    }
    if (questId === 1) {
        if (score <= 7) return isEs ? "Sin Riesgo de Alcohol" : "No Alcohol Risk";
        if (score <= 15) return isEs ? "Consumo de Riesgo" : "Hazardous Consumption";
        if (score <= 19) return isEs ? "Consumo Perjudicial" : "Harmful Consumption";
        return isEs ? "Dependencia" : "Dependence";
    }
    if (questId === 3) {
        if (score < 2) return isEs ? "Riesgo MÃ­nimo de Trastorno Alimentario" : "Minimum Eating Disorder Risk";
        return isEs ? "Riesgo de Trastorno Alimentario" : "Eating Disorder Risk";
    }
    if (questId === 5) {
        if (score === 0) return isEs ? "Riesgo Nulo" : "No Risk";
        if (score <= 2) return isEs ? "Riesgo Bajo" : "Low Risk";
        if (score <= 5) return isEs ? "Riesgo Moderado" : "Moderate Risk";
        return isEs ? "Riesgo Alto" : "High Risk";
    }
    if (questId === 6) {
        if (score === 0) return isEs ? "Sin Riesgo de Suicidio" : "No Suicide Risk";
        return isEs ? "Riesgo de Suicidio" : "Suicide Risk";
    }
    if (questId === 7) {
        if (score <= 2) return isEs ? "Sin Dependencia a la Nicotina" : "No Nicotine Dependence";
        if (score <= 4) return isEs ? "Dependencia Baja" : "Low Dependence";
        if (score <= 6) return isEs ? "Dependencia Moderada" : "Moderate Dependence";
        return isEs ? "Dependencia Alta" : "High Dependence";
    }
    return isEs ? "Evaluado" : "Evaluated";
}

function getInterpretacionColor(interpretacion) {
    const val = (interpretacion || '').toLowerCase();
    if (val.includes('severa') || val.includes('alto') || val.includes('alta') || val.includes('suicidio')) {
        return '#d32f2f';
    }
    if (val.includes('moderada') || val.includes('moderado') || val.includes('peligroso') || val.includes('perjudicial')) {
        return '#f57c00';
    }
    if (val.includes('leve') || val.includes('dependencia baja') || val.includes('riesgo de trastorno')) {
        return '#d0a200';
    }
    if (val.includes('sin') || val.includes('nulo') || val.includes('mÃ­nimo') || val.includes('mÃ­nima') || val.includes('bajo')) {
        return '#388e3c';
    }
    return '#2d3748';
}

