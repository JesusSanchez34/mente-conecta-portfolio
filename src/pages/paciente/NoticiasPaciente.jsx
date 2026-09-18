import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FaArrowLeft, FaRegCalendar } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { FaHeart, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks';
import { getNoticiasApi } from '../../api/conasama/noticias';
import { TRANSLATIONS } from '../../utils/translations';
import { SpeedDialPaciente } from '../../components/ui/SpeedDialPaciente';
import './NoticiasPaciente.css';

export function NoticiasPaciente() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    // Settings preferences synced with localStorage
    const [lang, setLang] = useState(() => localStorage.getItem('mente_conecta_lang') || 'es');
    const [textSize, setTextSize] = useState(() => localStorage.getItem('mente_conecta_text_size') || 'md');
    const [highContrast, setHighContrast] = useState(() => localStorage.getItem('mente_conecta_high_contrast') === 'true');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode] = useState(() => localStorage.getItem('mente_conecta_dark_mode') === 'true');
    const [readingMode] = useState(() => localStorage.getItem('mente_conecta_reading_mode') || 'normal');

    useEffect(() => {
        localStorage.setItem('mente_conecta_lang', lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_text_size', textSize);
    }, [textSize]);

    useEffect(() => {
        localStorage.setItem('mente_conecta_high_contrast', highContrast ? 'true' : 'false');
    }, [highContrast]);

    const t = TRANSLATIONS[lang];

    // News states
    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [activeNewsTab, setActiveNewsTab] = useState('news'); // 'news' or 'help'
    const [selectedNews, setSelectedNews] = useState(null);

    const formatBase64 = (base64String) => {
        if (!base64String) return "";
        if (base64String.startsWith('data:image')) return base64String;
        return `data:image/png;base64,${base64String}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Tomar directamente los primeros 10 caracteres YYYY-MM-DD
        // sin conversión de zona horaria
        const str = String(dateString);
        if (str.length >= 10) return str.substring(0, 10);
        return str;
    };

    useEffect(() => {
        if (auth?.token) {
            (async () => {
                try {
                    setNewsLoading(true);
                    const data = await getNoticiasApi(auth.token);
                    const publishedNews = (data || []).filter(n => n.estatus === 1 || n.estatus === undefined);
                    setNews(publishedNews);
                } catch (error) {
                    console.error("Error fetching news:", error);
                } finally {
                    setNewsLoading(false);
                }
            })();
        }
    }, [auth?.token]);

    const handleBack = () => {
        if (selectedNews) {
            setSelectedNews(null);
        } else {
            navigate('/paciente/inicio');
        }
    };
    // Guard route: if not authenticated or not a Conasama patient, redirect to admin
    if (auth === undefined) return null;
    if (!auth || auth?.detail || Number(auth?.typeLogin) !== 3) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className={[
            'news-landing-container',
            `patient-text-${textSize}`,
            highContrast ? 'patient-high-contrast' : '',
            darkMode && !highContrast ? 'patient-dark-mode' : '',
            readingMode === 'dislexia' ? 'patient-dyslexia' : '',
        ].filter(Boolean).join(' ')}>
            {/* Header bar matches modules screen */}
            <header className="news-top-bar">
                <button
                    type="button"
                    className="news-back-btn"
                    onClick={handleBack}
                    title={t.back}
                >
                    <FaArrowLeft />
                </button>
                <h1 className="news-top-title">
                    {selectedNews 
                        ? (lang === 'es' ? selectedNews.titulo : (selectedNews.title || selectedNews.titulo)) 
                        : (lang === 'es' ? 'Noticias' : 'What\'s new!')}
                </h1>
            </header>

            {/* Floating Background Icons */}
            <div className="news-floating-bg">
                <GiBrain className="news-floating-icon n-icon-1" />
                <FaShieldAlt className="news-floating-icon n-icon-2" />
                <FaHeart className="news-floating-icon n-icon-3" />
                <GiBrain className="news-floating-icon n-icon-4" />
                <FaHeart className="news-floating-icon n-icon-5" />
                <FaShieldAlt className="news-floating-icon n-icon-6" />
            </div>

            <main className="news-content-container">
                {selectedNews ? (
                    <div className="news-full-detail-card">
                        {selectedNews.imagen && (
                            <div className="news-detail-page-img-wrapper">
                                <img src={formatBase64(selectedNews.imagen)} alt={selectedNews.titulo} className="news-detail-page-img" />
                            </div>
                        )}
                        <div className="news-detail-page-body">
                            <h2 className="news-detail-page-title">
                                {lang === 'es' ? selectedNews.titulo : (selectedNews.title || selectedNews.titulo)}
                            </h2>
                            {(selectedNews.fecha_modificacion || selectedNews.fecha || selectedNews.created_at || selectedNews.date || selectedNews.fecha_creacion || selectedNews.fecha_publicacion || selectedNews.created || selectedNews.fecha_noticia) && (
                                <div className="news-detail-page-date">
                                    <FaRegCalendar /> {formatDate(selectedNews.fecha_modificacion || selectedNews.fecha || selectedNews.created_at || selectedNews.date || selectedNews.fecha_creacion || selectedNews.fecha_publicacion || selectedNews.created || selectedNews.fecha_noticia)}
                                </div>
                            )}
                            <hr className="news-detail-divider" />
                            <div 
                                className="news-detail-page-content" 
                                dangerouslySetInnerHTML={{ 
                                    __html: lang === 'es' ? selectedNews.descripcion : (selectedNews.description || selectedNews.descripcion) 
                                }} 
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="news-page-tabs">
                            <button 
                                type="button" 
                                className={`news-page-tab-btn ${activeNewsTab === 'news' ? 'active' : ''}`}
                                onClick={() => setActiveNewsTab('news')}
                            >
                                {t.tabNews}
                            </button>
                            <button 
                                type="button" 
                                className={`news-page-tab-btn ${activeNewsTab === 'help' ? 'active' : ''}`}
                                onClick={() => setActiveNewsTab('help')}
                            >
                                {t.tabHelp}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="news-page-tab-content">
                            {activeNewsTab === 'news' && (
                                <div className="news-page-list">
                                    {newsLoading ? (
                                        <div className="news-page-loading-wrapper">
                                            <div className="news-page-spinner"></div>
                                            <p>{t.loadingNews}</p>
                                        </div>
                                    ) : news.length === 0 ? (
                                        <p className="news-page-no-data">{t.noNews}</p>
                                    ) : (
                                        news.map((noticia) => {
                                            const title = lang === 'es' ? noticia.titulo : (noticia.title || noticia.titulo);
                                            const prevDesc = lang === 'es' ? noticia.descripcion_previa : (noticia.previous_description || noticia.descripcion_previa);
                                            const date = noticia.fecha_modificacion || noticia.fecha || noticia.created_at || noticia.date || noticia.fecha_creacion || noticia.fecha_publicacion || noticia.created || noticia.fecha_noticia;
                                            return (
                                                <div key={noticia.id || noticia.titulo} className="news-page-card" onClick={() => setSelectedNews(noticia)}>
                                                    {noticia.imagen && (
                                                        <div className="news-page-card-img-wrapper">
                                                            <img src={formatBase64(noticia.imagen)} alt={title} className="news-page-card-img" />
                                                        </div>
                                                    )}
                                                    <div className="news-page-card-body">
                                                        <h3 className="news-page-card-title">{title}</h3>
                                                        <p className="news-page-card-desc">{prevDesc}</p>
                                                        <div className="news-page-card-footer">
                                                            <span className="news-page-card-date">
                                                                <FaRegCalendar /> {formatDate(date)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {activeNewsTab === 'help' && (
                                <div className="news-page-help-list">
                                    <div className="news-page-help-card">
                                        <span className="news-page-help-tag emergency">{t.emergencyTag}</span>
                                        <h3 className="news-page-help-title">{t.lifeLineTitle}</h3>
                                        <p className="news-page-help-content">{t.lifeLineDesc}</p>
                                        <a href="tel:8009112000" className="news-page-help-link">{t.lifeLineCall}</a>
                                    </div>

                                    <div className="news-page-help-card">
                                        <span className="news-page-help-tag">{t.healthTag}</span>
                                        <h3 className="news-page-help-title">{t.tipsTitle}</h3>
                                        <p className="news-page-help-content">{t.tipsDesc}</p>
                                    </div>

                                    <div className="news-page-help-card">
                                        <span className="news-page-help-tag">{t.portalTag}</span>
                                        <h3 className="news-page-help-title">{t.portalTitle}</h3>
                                        <p className="news-page-help-content">{t.portalDesc}</p>
                                        <span className="news-page-help-link" style={{cursor: 'pointer'}} onClick={() => navigate('/home')}>{t.portalLink}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
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
