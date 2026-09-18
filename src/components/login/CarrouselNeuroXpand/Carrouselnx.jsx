import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Carrouselnx.css';

import { LanguageSelector } from '../../ui';

import img1 from "../../../assets/img/pag1.jpeg";
import img2 from "../../../assets/img/pag2.jpeg";
import img3 from "../../../assets/img/pag3.jpeg";
import img4 from "../../../assets/img/pag4.jpeg";
import img5 from "../../../assets/img/cu1.jpeg";
import img6 from "../../../assets/img/cu2.jpeg";
import img7 from "../../../assets/img/cu3.jpeg";
import img8 from "../../../assets/img/cu4.jpeg";

export function Carrouselnx(props) {
    const { onBack } = props;
    const swiperRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const irAlLogin = () => {
        navigate('/login-neuroXpand');
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="carousel-fullscreen-bg-nx ">
            <Swiper
                modules={[Navigation]} 
                spaceBetween={0}
                slidesPerView={1}
                navigation={true}
                className="swiper-full-nx"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
            >

                {/* Slide 1 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper-nx"
                        style={{ backgroundImage: `url(${img1})` }}
                    >
                        <div className="dark-overlay-nx "></div>

                        <div className="slide-inner-content-nx">
                            <h1 className="slide-title-nx">
                                {t('carousel.slide1.title')}
                            </h1>

                            <p className="slide-text-nx">
                                {t('carousel.slide1.text')}
                            </p>

                            <button
                                className="btn-carousel-action-nx"
                                onClick={irAlLogin}
                            >
                                {t('carousel.slide1.btn')}
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 2 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper-nx"
                        style={{ backgroundImage: `url(${img2})` }}
                    >
                        <div className="dark-overlay-nx "></div>
                        <div className="slide-inner-content-nx">
                            <h1
                                className="slide-title-nx"
                                style={{ fontSize: '3rem' }}
                            >
                                {t('carousel.slide2_nx.title', 'Aprende a tomar el control de tus emociones')}
                            </h1>
                            <p className="slide-text-nx">
                                {t('carousel.slide2_nx.text', 'La salud mental es un estado de bienestar que permite a las personas afrontar los factores estresantes de la vida. Busca la armonía entre la mente, la salud física y el entorno.')}
                            </p>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 3 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper-nx"
                        style={{ backgroundImage: `url(${img3})` }}
                    >
                        <div className="dark-overlay-nx "></div>
                        <div className="slide-inner-content-nx">
                            <h1 
                                className="slide-title-nx" 
                                style={{ fontSize: '2.5rem', fontWeight: '500', lineHeight: '1.4' }}
                            >
                                {t('carousel.slide3_nx.text', 'Te guiaremos a través de cuestionarios para conocer si tienes riesgo de desarrollar una enfermedad, o si ya la padeces y gestionar posibles tratamientos especializados.')}
                            </h1>
                        </div>
                    </div>
                </SwiperSlide>
                
               {/* Slide 4 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper-nx"
                        style={{ backgroundImage: `url(${img4})` }}
                    >
                        <div className="dark-overlay-nx "></div>
                        <div className="slide-inner-content-nx">
                            <h1 className="slide-title-nx" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                                {t('carousel.slide3.title', 'La aplicación tiene 4 secciones:')}
                            </h1>
                            <div className="secciones-list-nx" style={{ textAlign: 'center' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong>1. {t('carousel.slide3_nx.item1_bold', 'Dato socio demográfico')}</strong>{t('carousel.slide3_nx.item1_text', ', que ayuda a conocerte.')}
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong>2. {t('carousel.slide3_nx.item2_bold', 'Cuestionario de salud mental')}</strong>{t('carousel.slide3_nx.item2_text', ', que nos ayuda a orientar si estás en riesgo de algún tratamiento, te ayudaremos a un posible tratamiento si ya lo presentas.')}
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong>3. {t('carousel.slide3_nx.item3_bold', 'La salud física')}</strong>{t('carousel.slide3_nx.item3_text', ' también es importante y puede estar relacionada con la salud mental.')}
                                </p>
                                <p>
                                    <strong>4. {t('carousel.slide3_nx.item4_bold', 'Determinantes sociales')}</strong>{t('carousel.slide3_nx.item4_text', ', son datos ambientales que nos ayudan a saber si estos están afectando tu salud.')}
                                </p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 5 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper-nx"
                        style={{ backgroundImage: `url(${img4})` }}
                    >
                        <div className="dark-overlay-nx "></div>

                        <div className="slide-inner-content-nx">
                            <h1 className="slide-title-nx">
                                {t('carousel.slide4.title')}
                            </h1>

                            <p className="slide-text-nx">
                                {t('carousel.slide4.text')}
                            </p>

                            <div className="time-cards-container-nx">

                                <div className="time-card-nx">
                                    <img
                                        src={img5}
                                        alt="Sociodemográfico"
                                        className="time-card-image-nx"
                                    />
                                    <span>{t('carousel.slide4.card1')}</span>
                                    <span>15 {t('carousel.slide4.min')}</span>
                                </div>

                                <div className="time-card-nx">
                                    <img
                                        src={img6}
                                        alt="Salud mental"
                                        className="time-card-image-nx"
                                    />
                                    <span>{t('carousel.slide4.card2')}</span>
                                    <span>20 {t('carousel.slide4.min')}</span>
                                </div>

                                <div className="time-card-nx">
                                    <img
                                        src={img7}
                                        alt="Salud física"
                                        className="time-card-image-nx"
                                    />
                                    <span>{t('carousel.slide4.card3')}</span>
                                    <span>10 {t('carousel.slide4.min')}</span>
                                </div>

                                <div className="time-card-nx">
                                    <img
                                        src={img8}
                                        alt="Determinante social"
                                        className="time-card-image-nx"
                                    />
                                    <span>{t('carousel.slide4.card4')}</span>
                                    <span>15 {t('carousel.slide4.min')}</span>
                                </div>

                            </div>

                            <button
                                className="btn-carousel-action-nx"
                                onClick={() => navigate('/registro-neuroXpand')}
                            >
                                {t('carousel.slide4.btn')}
                            </button>
                        </div>
                    </div>
                </SwiperSlide>

            </Swiper>

            {/* Controls */}
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 99999,
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                }}
            >
                <LanguageSelector />

                <button
                    onClick={handleBack}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.4)',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backdropFilter: 'blur(5px)',
                        fontWeight: 'bold',
                        fontSize: '0.95rem'
                    }}
                >
                    {t('carousel.backMenu')}
                </button>
            </div>
        </div>
    );
}