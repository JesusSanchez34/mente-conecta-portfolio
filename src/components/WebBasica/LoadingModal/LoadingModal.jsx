import { useTranslation } from "react-i18next";
import "./LoadingModal.scss";

export function LoadingModal() {
  const { t } = useTranslation();
  return (
    <div className="loading-modal">
      <div className="loading-modal__card">
        <div className="spinner"></div>
        <p>{t("loadingModal.iniciandoSesion")}</p>
      </div>
    </div>
  );
}
