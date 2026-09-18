import { useTranslation } from "react-i18next";
import "./ErrorModal.scss";

export function ErrorModal({ message }) {
  const { t } = useTranslation();
  return (
    <div className="error-modal">
      <div className="error-modal__card">
        <div className="error-modal__icon">✕</div>
        <h2>{t("errorModal.titulo")}</h2>
        <p>{message || t("errorModal.mensaje")}</p>
      </div>
    </div>
  );
}
