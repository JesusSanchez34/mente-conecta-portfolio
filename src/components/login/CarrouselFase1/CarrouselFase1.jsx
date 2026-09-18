import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './CarrouselFase1.css';

import { LanguageSelector } from '../../ui';

import img1 from "../../../assets/img/pag1.jpeg";
import img2 from "../../../assets/img/pag2.jpeg";
import img3 from "../../../assets/img/pag3.jpeg";
import img4 from "../../../assets/img/pag4.jpeg";
import img5 from "../../../assets/img/cu1.jpeg";
import img6 from "../../../assets/img/cu2.jpeg";
import img7 from "../../../assets/img/cu3.jpeg";
import img8 from "../../../assets/img/cu4.jpeg";

export function CarrouselFase1(props) {
    const { onBack } = props;
    const swiperRef = useRef(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const irAlLogin = () => {
        navigate('/login-fase1');
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="carousel-fullscreen-bg">
            <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={true}
                className="swiper-full"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
            >

                {/* Slide 1 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper"
                        style={{ backgroundImage: `url(${img1})` }}
                    >
                        <div className="dark-overlay"></div>

                        <div className="slide-inner-content">
                            <h1 className="slide-title">
                                {t('carousel.slide1.title')}
                            </h1>

                            <p className="slide-text">
                                {t('carousel.slide1.text')}
                            </p>

                            <button
                                className="btn-carousel-action"
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
                        className="fase1-slide-wrapper"
                        style={{ backgroundImage: `url(${img2})` }}
                    >
                        <div className="dark-overlay"></div>

                        <div className="slide-inner-content">
                            <h1
                                className="slide-title"
                                style={{ fontSize: '3rem' }}
                            >
                                {t('carousel.slide2.title')}
                            </h1>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 3 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper"
                        style={{ backgroundImage: `url(${img3})` }}
                    >
                        <div className="dark-overlay"></div>

                        <div className="slide-inner-content">
                            <h1 className="slide-title">
                                {t('carousel.slide3.title')}
                            </h1>

                            <div className="secciones-list">
                                <p>{t('carousel.slide3.item1')}</p>
                                <p>{t('carousel.slide3.item2')}</p>
                                <p>{t('carousel.slide3.item3')}</p>
                                <p>{t('carousel.slide3.item4')}</p>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Slide 4 */}
                <SwiperSlide>
                    <div
                        className="fase1-slide-wrapper"
                        style={{ backgroundImage: `url(${img4})` }}
                    >
                        <div className="dark-overlay"></div>

                        <div className="slide-inner-content">
                            <h1 className="slide-title">
                                {t('carousel.slide4.title')}
                            </h1>

                            <p className="slide-text">
                                {t('carousel.slide4.text')}
                            </p>

                            <div className="time-cards-container">

                                <div className="time-card">
                                    <img
                                        src={img5}
                                        alt="Sociodemográfico"
                                        className="time-card-image"
                                    />
                                    <span>{t('carousel.slide4.card1')}</span>
                                    <span>15 {t('carousel.slide4.min')}</span>
                                </div>

                                <div className="time-card">
                                    <img
                                        src={img6}
                                        alt="Salud mental"
                                        className="time-card-image"
                                    />
                                    <span>{t('carousel.slide4.card2')}</span>
                                    <span>20 {t('carousel.slide4.min')}</span>
                                </div>

                                <div className="time-card">
                                    <img
                                        src={img7}
                                        alt="Salud física"
                                        className="time-card-image"
                                    />
                                    <span>{t('carousel.slide4.card3')}</span>
                                    <span>10 {t('carousel.slide4.min')}</span>
                                </div>

                                <div className="time-card">
                                    <img
                                        src={img8}
                                        alt="Determinante social"
                                        className="time-card-image"
                                    />
                                    <span>{t('carousel.slide4.card4')}</span>
                                    <span>15 {t('carousel.slide4.min')}</span>
                                </div>

                            </div>

                            <button
                                className="btn-carousel-action"
                                onClick={() => navigate('/registro-fase1')}
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