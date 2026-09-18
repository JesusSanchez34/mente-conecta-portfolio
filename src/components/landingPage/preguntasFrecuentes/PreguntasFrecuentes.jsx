import React, { useState } from 'react';
import { faqData } from '../../../utils/constantsLandingPage/faq';

export function PreguntasFrecuentes() {

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="faq section">
            <div className="container section-title" data-aos="fade-up">
                <h2>¿Tienes alguna duda? </h2>
                <p>¡Checa nuestro apartado de preguntas frecuentas para poder ayudarte! </p>
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
                        <div className="faq-container">
                            {faqData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`faq-item ${activeIndex === index ? 'faq-active' : ''}`}
                                >
                                    <h3 onClick={() => toggleFAQ(index)}>
                                        {item.question}
                                    </h3>
                                    {activeIndex === index && (
                                        <div className="faq-content">
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                    <i
                                        className={`faq-toggle bi ${activeIndex === index ? 'bi-chevron-down' : 'bi-chevron-right'
                                            }`}
                                        onClick={() => toggleFAQ(index)}
                                    ></i>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
