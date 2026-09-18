import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { IconButton } from "../../ui";
import { FormLogin } from "../formLogin/FormLogin";
import { FormLoginEnvejecimiento } from "../formLoginEnvejecimiento/FormLoginEnvejecimiento";
import { CarrouselFase1 } from "../CarrouselFase1/CarrouselFase1";
import { Carrouselnx } from "../CarrouselNeuroXpand/Carrouselnx";
import SplashScreen from "../../adminfase1/Splash/SplashScreen";

import { ConasamaFlow } from "../conasamaFlow/ConasamaFlow";

import imagen from "../../../assets/img/logoColor.png";
import isem from "../../../assets/img/Colibri_Vertical_FondoClaro 02.png";
import jupyter from "../../../assets/img/Jupyter_log.png";
import logoMCA from "../../../assets/img/logoMCA.png";
import logoSep from "../../../assets/img/logoSep.png";
import logoSesyn from "../../../assets/img/logoSesyn.png";
import HomeImg from "../../../assets/img/Home.jpeg";
import logoSegu from "../../../assets/img/logoSeguridad2.png";

import "./SelectLogin.css";

export function SelectLogin() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [view, setView] = useState(0);
    const [isSplashActive, setIsSplashActive] = useState(false);

    const handleSplashNavigation = (rutaDestino) => {
        setIsSplashActive(true);
        document.body.classList.add("splash-active");

        setTimeout(() => {
            setIsSplashActive(false);
            document.body.classList.remove("splash-active");
            navigate(rutaDestino); 
        }, 3000);
    };

    if (isSplashActive) {
        return <SplashScreen />;
    }

    const Menu = () => (
        <div>
            <center style={{ marginTop: "40px", color: "#04547B" }}>
                <h2>
                    <b>{t("selectLogin.title")}</b>
                </h2>
            </center>

            <br />

            <div className="card-select-login">
                <IconButton
                    image={isem}
                    text={t("selectLogin.options.isem")}
                    onChangeMethod={() => navigate("/login/isem")}
                />

                <a href="#">
                    <IconButton
                        image={jupyter}
                        text={t("selectLogin.options.jupyter")}
                    />
                </a>

                <IconButton
                    image={imagen}
                    text={t("selectLogin.options.menteConecta")}
                    onChangeMethod={() => handleSplashNavigation("/carrusel")}
                />

                <IconButton
                    image={logoMCA}
                    text={t("selectLogin.options.adicciones")}
                    onChangeMethod={() => setView(3)}
                />

                <IconButton
                    image={logoSep}
                    text="Mente Conecta SEP"
                    onChangeMethod={() => navigate("/registro-sep")}
                />

                <IconButton
                    image={logoSesyn}
                    text={t("selectLogin.options.sesyn")}
                    onChangeMethod={() => setView(5)}
                />

                <IconButton
                    image={logoSegu}
                    text="Mente Conecta Seguridad Pública"
                    onChangeMethod={() => navigate("/loginseguridad")}
                />

                <IconButton
                    image={HomeImg}
                    text="Mente Conecta Envejecimiento"
                    onChangeMethod={() => navigate("/preview")}
                    imageStyle={{
                        height: "120px",
                        mixBlendMode: "multiply",
                        marginBottom: "0.2rem",
                    }}
                />
                <IconButton
                    image={imagen}
                    text={t("selectLogin.options.nx")}
                    onChangeMethod={() => handleSplashNavigation("/carrusel-neuroXpand")}
                />
            </div>

            <br />
            <br />
        </div>
    );

    const views = {
        0: <Menu />,
        2: (
            <CarrouselFase1
                onBack={() => setView(0)}
            />
        ),
        3: (
            <ConasamaFlow
                onBack={() => setView(0)}
            />
        ),
        4: (
            <FormLogin
                typeLogin={4}
                onBack={() => setView(0)}
            />
        ),
        5: (
            <FormLogin
                typeLogin={5}
                onBack={() => setView(0)}
            />
        ),
        6: (
            <FormLoginEnvejecimiento
                onBack={() => setView(0)}
            />
        ),
        7: (
            <Carrouselnx
                onBack={() => setView(0)}
            />
        ),
    };

    return views[view];
}