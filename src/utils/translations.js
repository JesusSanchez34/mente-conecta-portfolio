import i18n from '../i18n';

const createTranslationProxy = (language) => new Proxy({}, {
    get: (_target, key) => {
        if (typeof key === 'symbol') return undefined;
        return i18n.t(`patient.${key}`, { lng: language, defaultValue: key });
    }
});

export const TRANSLATIONS = {
    es: createTranslationProxy('es'),
    en: createTranslationProxy('en')
};
