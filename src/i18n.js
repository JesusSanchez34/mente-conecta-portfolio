import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import en from './locales/en.json';

const resources = {
    es: { translation: es },
    en: { translation: en }
};

const normalizeLanguage = (language) => {
    const normalized = language?.split('-')[0]?.toLowerCase();
    return normalized === 'en' ? 'en' : 'es';
};

const getStoredLanguage = () => {
    if (typeof window === 'undefined') return 'es';

    return normalizeLanguage(
        localStorage.getItem('i18nextLng') ||
        localStorage.getItem('selectedLanguage') ||
        localStorage.getItem('sep_language') ||
        navigator.language
    );
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: getStoredLanguage(),
        fallbackLng: 'es',
        supportedLngs: ['es', 'en'],
        debug: false,
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage']
        }
    });

if (typeof window !== 'undefined') {
    i18n.on('languageChanged', (language) => {
        const normalized = normalizeLanguage(language);
        localStorage.setItem('i18nextLng', normalized);
        localStorage.setItem('selectedLanguage', normalized);
        localStorage.setItem('sep_language', normalized);
    });

    const originalFetch = window.fetch;
    window.fetch = async function fetchWithLanguage(url, options = {}) {
        options.headers = options.headers || {};
        const currentLanguage = normalizeLanguage(localStorage.getItem('i18nextLng') || i18n.language);

        if (options.headers instanceof Headers) {
            if (!options.headers.has('Accept-Language') && !options.headers.has('accept-language')) {
                options.headers.set('Accept-Language', currentLanguage);
            }
        } else if (Array.isArray(options.headers)) {
            const hasAcceptLanguage = options.headers.some(
                ([key]) => key.toLowerCase() === 'accept-language'
            );
            if (!hasAcceptLanguage) {
                options.headers.push(['Accept-Language', currentLanguage]);
            }
        } else if (typeof options.headers === 'object') {
            const hasAcceptLanguage = Object.keys(options.headers).some(
                (key) => key.toLowerCase() === 'accept-language'
            );
            if (!hasAcceptLanguage) {
                options.headers['Accept-Language'] = currentLanguage;
            }
        }

        return originalFetch(url, options);
    };
}

export default i18n;
