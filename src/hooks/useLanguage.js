import { useTranslation } from "react-i18next";

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const isSpanish = currentLanguage === "es";

  const toggleLanguage = () => {
    const newLang = isSpanish ? "en" : "es";
    i18n.changeLanguage(newLang);
    localStorage.setItem("sep_language", newLang);
  };

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("sep_language", lang);
  };

  return { currentLanguage, isSpanish, toggleLanguage, setLanguage };
}
