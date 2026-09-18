import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from './AuthContext';

export const SettingsContext = createContext({
    fontSize: 16,
    isDarkMode: false,
    isDyslexiaFont: false,
    language: 'es',
    setFontSize: () => {},
    toggleDarkMode: () => {},
    toggleDyslexiaFont: () => {},
    toggleLanguage: () => {},
    saveSettings: async () => {},
    revertSettings: () => {},
    t: (k) => k,
});

function getKey(userId, name) {
    return userId ? `u_${userId}_${name}` : name;
}

export function SettingsProvider({ children }) {
    const { auth } = useContext(AuthContext);
    const { i18n } = useTranslation();
    const userId = auth?.userId ?? null;

    const [fontSize, setFontSizeState] = useState(16);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isDyslexiaFont, setIsDyslexiaFont] = useState(false);
    const [language, setLanguage] = useState('es');

    const [persisted, setPersisted] = useState({ fontSize: 16, isDarkMode: false, isDyslexiaFont: false });

    useEffect(() => {
        const fs = parseFloat(localStorage.getItem(getKey(userId, 'fontSize'))) || 16;
        const dm = localStorage.getItem(getKey(userId, 'isDarkMode')) === 'true';
        const df = localStorage.getItem(getKey(userId, 'isDyslexiaFont')) === 'true';
        const lg = localStorage.getItem(getKey(userId, 'language')) || 'es';
        setFontSizeState(fs);
        setIsDarkMode(dm);
        setIsDyslexiaFont(df);
        setLanguage(lg);
        setPersisted({ fontSize: fs, isDarkMode: dm, isDyslexiaFont: df });
    }, [userId]);

    const setFontSize = useCallback((size) => setFontSizeState(size), []);
    const toggleDarkMode = useCallback((force) => setIsDarkMode(v => force !== undefined ? force : !v), []);
    const toggleDyslexiaFont = useCallback((force) => setIsDyslexiaFont(v => force !== undefined ? force : !v), []);
    const toggleLanguage = useCallback(() => {
        setLanguage(l => {
            const next = l === 'es' ? 'en' : 'es';
            if (userId) localStorage.setItem(getKey(userId, 'language'), next);
            return next;
        });
    }, [userId]);

    const saveSettings = useCallback(async () => {
        if (!userId) return;
        localStorage.setItem(getKey(userId, 'fontSize'), fontSize);
        localStorage.setItem(getKey(userId, 'isDarkMode'), isDarkMode);
        localStorage.setItem(getKey(userId, 'isDyslexiaFont'), isDyslexiaFont);
        setPersisted({ fontSize, isDarkMode, isDyslexiaFont });
    }, [userId, fontSize, isDarkMode, isDyslexiaFont]);

    const revertSettings = useCallback(() => {
        setFontSizeState(persisted.fontSize);
        setIsDarkMode(persisted.isDarkMode);
        setIsDyslexiaFont(persisted.isDyslexiaFont);
    }, [persisted]);

    const t = useCallback(
        (key, options = {}) => i18n.t(`settings.${key}`, { lng: language, defaultValue: key, ...options }),
        [i18n, language]
    );

    return (
        <SettingsContext.Provider value={{ fontSize, isDarkMode, isDyslexiaFont, language, setFontSize, toggleDarkMode, toggleDyslexiaFont, toggleLanguage, saveSettings, revertSettings, t }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
