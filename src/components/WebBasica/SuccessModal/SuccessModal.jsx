import { useTranslation } from "react-i18next";
import "./SuccessModal.scss";

export function SuccessModal() {
  const { t } = useTranslation();
  return (
    <div className="success-modal">
      <div className="success-modal__card">
        <div className="success-modal__icon">✓</div>
        <h2>{t("successModal.titulo")}</h2>
        <p>{t("successModal.mensaje")}</p>
      </div>
    </div>
  );
}
