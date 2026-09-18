import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import { AlertaGenericaModal, AlertaConfirmacionModal } from '../../../components/alertas/AlertaModal';
import { useSettings } from '../../../context/SettingsContext';
import './SecuenciaVistasScreen.css';

// ─── Word versions (same as Flutter) ────────────────────────────────────────
const VERSIONES = [
    { id: 1, audio: '/audios/V1.mp3', words: ['Plátano', 'Amanecer', 'Silla'] },
    { id: 2, audio: '/audios/V2.mp3', words: ['Líder', 'Temporada', 'Mesa'] },
    { id: 3, audio: '/audios/V3.mp3', words: ['Pueblo', 'Cocina', 'Bebé'] },
    { id: 4, audio: '/audios/V4.mp3', words: ['Río', 'Nación', 'Dedo'] },
    { id: 5, audio: '/audios/V5.mp3', words: ['Capitán', 'Jardín', 'Retrato'] },
    { id: 6, audio: '/audios/V6.mp3', words: ['Hija', 'Cielo', 'Montaña'] },
];

const VERSIONES_EN = [
    { id: 1, audio: '/audios/V1en.mp3', words: ['Banana', 'Sunrise', 'Chair'] },
    { id: 2, audio: '/audios/V2en.mp3', words: ['Leader', 'Season', 'Table'] },
    { id: 3, audio: '/audios/V3en.mp3', words: ['Town', 'Kitchen', 'Baby'] },
    { id: 4, audio: '/audios/V4en.mp3', words: ['River', 'Nation', 'Finger'] },
    { id: 5, audio: '/audios/V5en.mp3', words: ['Captain', 'Garden', 'Portrait'] },
    { id: 6, audio: '/audios/V6en.mp3', words: ['Daughter', 'Sky', 'Mountain'] },
];

function getVersiones(language) {
    return language === 'en' ? VERSIONES_EN : VERSIONES;
}

// ─── Clock questions ─────────────────────────────────────────────────────────
const CLOCK_QS = [
    { img: '/images/relojp1.jpg', opts: ['3:12 hrs', '4:21 hrs', '12:00 hrs', '1:15 hrs'], correct: '1:15 hrs' },
    { img: '/images/relojv1.jpg', opts: ['2:30 hrs', '5:45 hrs', '11:50 hrs', '3:00 hrs'], correct: '11:50 hrs' },
    { img: '/images/relojv2.jpg', opts: ['12:00 hrs', '12:38 hrs', '3:45 hrs', '6:18 hrs'], correct: '12:00 hrs' },
    { img: '/images/relojv3.jpg', opts: ['4:24 hrs', '10:09 hrs', '7:30 hrs', '8:10 hrs'], correct: '10:09 hrs' },
    { img: '/images/relojv4.jpg', opts: ['2:37 hrs', '8:31 hrs', '12:30 hrs', '1:20 hrs'], correct: '2:37 hrs' },
    { img: '/images/relojv5.jpg', opts: ['7:30 hrs', '9:04 hrs', '4:41 hrs', '10:15 hrs'], correct: '10:15 hrs' },
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getRandomVersion(usedIds = [], versiones = VERSIONES) {
    const available = versiones.filter(v => !usedIds.includes(v.id));
    if (available.length === 0) return versiones[Math.floor(Math.random() * versiones.length)];
    return available[Math.floor(Math.random() * available.length)];
}

function buildOptions(version, versiones = VERSIONES) {
    const wrong = versiones.flatMap(v => v.id !== version.id ? v.words : []);
    const wrongPick = shuffleArray(wrong).slice(0, 3);
    return shuffleArray([...version.words, ...wrongPick]);
}

// ─── Step 1: Audio test ───────────────────────────────────────────────────────
function AudioStep({ onCompleted }) {
    const { t, language } = useSettings();
    const versiones = getVersiones(language);
    const [version] = useState(() => getRandomVersion([], versiones));
    const [options] = useState(() => buildOptions(version, versiones));
    const [selected, setSelected] = useState([]);
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerActive, setTimerActive] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const audioRef = useRef(null);
    const timerRef = useRef(null);

    const saveAndComplete = useCallback((sel) => {
        const correct = version.words.filter(w => sel.includes(w)).length;
        sessionStorage.setItem('audio_version', version.id);
        sessionStorage.setItem('audio_selected', JSON.stringify(sel));
        sessionStorage.setItem('audio_score', correct * 3);
        sessionStorage.setItem('audio_data', JSON.stringify({
            id_cuestionario: 47, id_pregunta: 1,
            respuesta_completa: { version: version.id, respuestas_seleccionadas: sel, raw: correct * 3 }
        }));
        onCompleted();
    }, [version, onCompleted]);

    useEffect(() => {
        if (!timerActive) return;
        if (timeLeft <= 0) {
            setTimerActive(false);
            setSubmitted(true);
            saveAndComplete(selected);
            return;
        }
        timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timerActive, timeLeft, selected, saveAndComplete]);

    const playAudio = () => {
        if (isPlaying || audioPlayed) return;
        const audio = new Audio(version.audio);
        audioRef.current = audio;
        setIsPlaying(true);
        audio.play();
        audio.onended = () => {
            setIsPlaying(false);
            setAudioPlayed(true);
            setTimerActive(true);
        };
        audio.onerror = () => setIsPlaying(false);
    };

    const toggleWord = (word) => {
        if (submitted || !audioPlayed) return;
        let newSel;
        if (selected.includes(word)) {
            newSel = selected.filter(w => w !== word);
        } else if (selected.length < 3) {
            newSel = [...selected, word];
        } else return;
        setSelected(newSel);
        if (newSel.length === 3) {
            setTimerActive(false);
            clearTimeout(timerRef.current);
            setSubmitted(true);
            saveAndComplete(newSel);
        }
    };

    const INFO_TEXT = language === 'en'
        ? "You will hear 3 words, after listening, you will have to select the words you heard."
        : "Va a escuchar 3 palabras, después de escucharlas, usted tendrá que seleccionar las palabras que escuchó.";

    return (
        <div className="sv-step">
            <div className="sv-step-header">
                <div className="header-left">
                    <FaArrowLeft className="back-icon" onClick={() => window.dispatchEvent(new Event('trigger-exit'))} />
                    <h2>{t('preguntas')}</h2>
                </div>
                <button className="sv-info-btn" onClick={() => setShowInfo(true)}>
                    <FaInfoCircle /> {t('instrucciones')}
                </button>
            </div>
            <div className="sv-instructions-card">
                <p>{INFO_TEXT}</p>
                <button
                    className={`sv-audio-btn ${isPlaying ? 'playing' : audioPlayed ? 'done' : ''}`}
                    onClick={playAudio}
                    disabled={isPlaying || audioPlayed || submitted}
                >
                    {isPlaying ? t('svReproduciendo') : audioPlayed ? t('svAudioReproducido') : t('svReproducirAudio')}
                </button>
                {audioPlayed && <p className="sv-timer">{t('svTiempoRestante')} {timeLeft} {t('svSegundos')}</p>}
            </div>
            <div className="sv-word-grid">
                {options.map(word => (
                    <button
                        key={word}
                        className={`sv-word-btn ${selected.includes(word) ? 'selected' : ''}`}
                        onClick={() => toggleWord(word)}
                        disabled={submitted || !audioPlayed}
                    >
                        {word}
                    </button>
                ))}
            </div>

            <AlertaGenericaModal
                isOpen={showInfo}
                title={t('instrucciones')}
                description={INFO_TEXT}
                onConfirm={() => setShowInfo(false)}
            />
        </div>
    );
}

// ─── Step 2: Clock test ───────────────────────────────────────────────────────
function ClockStep({ onCompleted }) {
    const { t, language } = useSettings();
    const [question] = useState(() => CLOCK_QS[Math.floor(Math.random() * CLOCK_QS.length)]);
    const [qIdx] = useState(() => CLOCK_QS.findIndex(q => q.img === question.img));
    const [selected, setSelected] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerActive, setTimerActive] = useState(true);
    const timerRef = useRef(null);
    const [showInfo, setShowInfo] = useState(false);

    const saveAndComplete = useCallback((ans) => {
        const score = ans === question.correct ? 2 : 0;
        sessionStorage.setItem('reloj_score', score);
        sessionStorage.setItem('reloj_data', JSON.stringify({
            id_pregunta: 2,
            respuesta_completa: { version: qIdx + 1, respuestas_seleccionadas: [ans || ''], raw: score }
        }));
        onCompleted();
    }, [question, qIdx, onCompleted]);

    useEffect(() => {
        if (!timerActive) return;
        if (timeLeft <= 0) {
            setTimerActive(false);
            setSubmitted(true);
            saveAndComplete(selected);
            return;
        }
        timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timerActive, timeLeft, selected, saveAndComplete]);

    const handleSelect = (opt) => {
        if (submitted || !timerActive) return;
        setSelected(opt);
        setTimerActive(false);
        clearTimeout(timerRef.current);
        setSubmitted(true);
        saveAndComplete(opt);
    };

    const INFO_TEXT = language === 'en'
        ? "Answer based on the clock drawing, indicate the time shown by the hands."
        : "Responde a cada pregunta basándote en cómo te has sentido en las últimas semanas.";

    return (
        <div className="sv-step">
            <div className="sv-step-header">
                <div className="header-left">
                    <FaArrowLeft className="back-icon" onClick={() => window.dispatchEvent(new Event('trigger-exit'))} />
                    <h2>{t('preguntas')}</h2>
                </div>
                <button className="sv-info-btn" onClick={() => setShowInfo(true)}>
                    <FaInfoCircle /> {t('instrucciones')}
                </button>
            </div>
            <p className="sv-clock-timer">{t('svTiempoRestante')} {timeLeft} {t('svSegundos')}</p>
            <div className="sv-clock-img-wrap">
                <img src={question.img} alt="Reloj" className="sv-clock-img" />
            </div>
            {submitted && <p style={{ textAlign: 'center', color: '#718096' }}>{t('svRespuestaRegistrada')}</p>}
            <div className="sv-clock-opts">
                {question.opts.map(opt => (
                    <button
                        key={opt}
                        className={`sv-clock-opt ${selected === opt ? 'selected' : ''}`}
                        onClick={() => handleSelect(opt)}
                        disabled={submitted || !timerActive}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            <AlertaGenericaModal
                isOpen={showInfo}
                title={t('instrucciones')}
                description={INFO_TEXT}
                onConfirm={() => setShowInfo(false)}
            />
        </div>
    );
}

// ─── Step 3: Words recall test ────────────────────────────────────────────────
function WordsStep({ onCompleted }) {
    const { t, language } = useSettings();
    const versiones = getVersiones(language);
    const [options] = useState(() => {
        const audioData = sessionStorage.getItem('audio_data');
        if (audioData) {
            try {
                const d = JSON.parse(audioData);
                const versionId = d.respuesta_completa.version;
                const version = versiones.find(v => v.id === versionId) || versiones[0];
                const wrong = versiones.flatMap(v => v.id !== version.id ? v.words : []);
                return shuffleArray([...version.words, ...shuffleArray(wrong).slice(0, 3)]);
            } catch (_) {}
        }
        return shuffleArray(versiones[0].words.concat(versiones[1].words)).slice(0, 6);
    });
    const [selected, setSelected] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerActive, setTimerActive] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const timerRef = useRef(null);

    const saveAndComplete = useCallback((sel) => {
        const audioData = sessionStorage.getItem('audio_data');
        let versionId = 1;
        let correctWords = [];
        if (audioData) {
            try {
                const d = JSON.parse(audioData);
                versionId = d.respuesta_completa.version;
                const v = versiones.find(v => v.id === versionId) || versiones[0];
                correctWords = v.words;
            } catch (_) {}
        }
        const raw = sel.filter(w => correctWords.includes(w)).length;
        sessionStorage.setItem('palabras_data', JSON.stringify({
            id_cuestionario: 47, id_pregunta: 3,
            respuesta_completa: { version: versionId, respuestas_seleccionadas: sel, raw }
        }));
        onCompleted();
    }, [onCompleted]);

    useEffect(() => {
        if (!timerActive) return;
        if (timeLeft <= 0) {
            setTimerActive(false);
            setSubmitted(true);
            saveAndComplete(selected);
            return;
        }
        timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timerActive, timeLeft, selected, saveAndComplete]);

    const toggle = (i) => {
        if (submitted || !timerActive) return;
        let newSel;
        if (selected.includes(i)) {
            newSel = selected.filter(x => x !== i);
        } else if (selected.length < 3) {
            newSel = [...selected, i];
        } else return;
        setSelected(newSel);
        if (newSel.length === 3) {
            setTimerActive(false);
            clearTimeout(timerRef.current);
            setSubmitted(true);
            saveAndComplete(newSel.map(idx => options[idx]));
        }
    };

    const INFO_TEXT = language === 'en'
        ? "Select the three words you remember hearing and then press -Send-"
        : "Seleccione las tres palabras que recuerde que escuchó y luego presione -Enviar-";

    return (
        <div className="sv-step">
            <div className="sv-step-header">
                <div className="header-left">
                    <FaArrowLeft className="back-icon" onClick={() => window.dispatchEvent(new Event('trigger-exit'))} />
                    <h2>{t('preguntas')}</h2>
                </div>
                <button className="sv-info-btn" onClick={() => setShowInfo(true)}>
                    <FaInfoCircle /> {t('instrucciones')}
                </button>
            </div>
            <p className="sv-words-ins">{t('svSeleccionaPalabras')}</p>
            {timerActive && !submitted && <p className="sv-timer-grey">{t('svTiempoRestante')} {timeLeft} {t('svSegundos')}</p>}
            {submitted && <p style={{ textAlign: 'center', color: '#718096' }}>{t('svRespuestaRegistrada')}</p>}
            <div className="sv-word-grid">
                {options.map((word, i) => (
                    <button
                        key={i}
                        className={`sv-word-btn ${selected.includes(i) ? 'selected' : ''}`}
                        onClick={() => toggle(i)}
                        disabled={submitted || !timerActive}
                    >
                        {word}
                    </button>
                ))}
            </div>

            <AlertaGenericaModal
                isOpen={showInfo}
                title={t('instrucciones')}
                description={INFO_TEXT}
                onConfirm={() => setShowInfo(false)}
            />
        </div>
    );
}

// ─── Main SecuenciaVistas container ──────────────────────────────────────────
export function SecuenciaVistasScreen() {
    const navigate = useNavigate();
    const { t } = useSettings();
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState([false, false, false]);
    const [exitModal, setExitModal] = useState(false);

    useEffect(() => {
        const now = Date.now();
        const startTime = sessionStorage.getItem('sv_start_time');
        
        if (startTime) {
            const diff = now - parseInt(startTime);
            if (diff > 10 * 60 * 1000) {
                // Caducidad de 10 minutos excedida
                ['audio_data', 'reloj_data', 'palabras_data', 'audio_score', 'reloj_score', 'audio_version', 'audio_selected'].forEach(k => sessionStorage.removeItem(k));
                sessionStorage.setItem('sv_start_time', now.toString());
            }
        } else {
            sessionStorage.setItem('sv_start_time', now.toString());
        }

        window.history.pushState(null, null, window.location.pathname);
        const handleExit = () => setExitModal(true);
        const handlePopState = (e) => {
            e.preventDefault();
            setExitModal(true);
            window.history.pushState(null, null, window.location.pathname);
        };
        window.addEventListener('trigger-exit', handleExit);
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('trigger-exit', handleExit);
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const markCompleted = (i) => {
        setCompleted(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
        });
        if (i < 2) setStep(i + 1);
    };

    const allDone = completed.every(Boolean);

    return (
        <div className="sv-bg">
            <div className="sv-steps-indicator">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className={`sv-step-dot ${i === step ? 'active' : completed[i] ? 'done' : ''}`}
                        onClick={() => { if (completed[i] || i === step) setStep(i); }}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>

            <div className="sv-content">
                {step === 0 && <AudioStep onCompleted={() => markCompleted(0)} />}
                {step === 1 && <ClockStep onCompleted={() => markCompleted(1)} />}
                {step === 2 && <WordsStep onCompleted={() => markCompleted(2)} />}
            </div>

            <div className="sv-footer">
                <button
                    className={`sv-send-btn ${!allDone ? 'disabled' : ''}`}
                    disabled={!allDone}
                    onClick={() => navigate('/ResultadoSecuenciasVistasScreen')}
                >
                    {t('enviar')}
                </button>
            </div>

            <AlertaConfirmacionModal
                isOpen={exitModal}
                title={t('estasSeguroSalir')}
                description={t('noGuardaranCambios')}
                onCancel={() => setExitModal(false)}
                onConfirm={() => navigate('/envejecimiento/salud-mental')}
            />
        </div>
    );
}
