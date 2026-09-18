import React, { useEffect, useState } from 'react'
import { InitialDashboard } from '../../../components/adminfase1/dashboard'
import { useDashboardsF1 } from '../../../hooks'
import { Carousel, Card, Container, Row, Col, Spinner } from 'react-bootstrap'

export function EstadisticaFase1() {
    const { 
        //getDashBoardHasAlzheimerRisk, 
        //getDashBoardHasAlcoholEvaluation,
        getDashBoardHasColumbiaQuestionnaire, 
        //getDashBoardHasDrugsQuestionnaire, 
        //getDashBoardHasEatingBehavior,
        //getDashBoardHasGAD7,
        getDashBoardHasPSL5Questionnaire, 
        //getDashBoardHasPhysicalActivity,
        //getDashBoardHasPlutchickQuestionnaire, 
        getDashBoardHasPsychiatricSymptoms, 
        //getDashBoardHasSleepQuality,
        //getDashBoardHasTraumaticEvents,
        getOpcionesPreguntaUsuarios,
        getHasPHQ9s,
        getHasResilienceScale,
        getHasTobaccoEvaluation
    } = useDashboardsF1();

    const [slides, setSlides] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 992 : true);

    useEffect(() => {
        async function fetchData() {
            const results = await Promise.all([
                // getDashBoardHasAlzheimerRisk(),
                // getDashBoardHasAlcoholEvaluation(),
                getHasPHQ9s(),
                getHasResilienceScale(),
                getHasTobaccoEvaluation(),
                getDashBoardHasColumbiaQuestionnaire(),
                // getDashBoardHasDrugsQuestionnaire(),
                // getDashBoardHasEatingBehavior(),
                // getDashBoardHasGAD7(),

                getDashBoardHasPSL5Questionnaire(),
                // getDashBoardHasPhysicalActivity(),
                // getDashBoardHasPlutchickQuestionnaire(),
                getDashBoardHasPsychiatricSymptoms(),
                // getDashBoardHasSleepQuality(),
                // getDashBoardHasTraumaticEvents(),
            ]);

            const grouped = [];
            for (let i = 0; i < results.length; i += 3) { // Cambia 4 por 3
                grouped.push({
                    title: `Evaluación ${Math.floor(i / 3) + 1}`, // Ajusta el índice
                    data: results.slice(i, i + 3) // Cambia 4 por 3
                });
            }

            const ids = [1, 3, 4, 19];
            const preguntas = [];
            for (const id of ids) {
                try {
                    const res = await getOpcionesPreguntaUsuarios(id);
                    if (res?.opciones?.length) {
                        preguntas.push({
                            title: res.titulo,
                            data: res.opciones
                        });
                    }
                } catch (error) {
                    console.warn(`Pregunta ${id} no encontrada`, error);
                }
            }

            setSlides([...grouped, ...preguntas]);
            setLoadingData(false);
        }
        fetchData();
        // Ejecutar solo al montar. Las funciones provienen del hook y no deben re-ejecutar este efecto.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Detectar cambios de tamaño para alternar entre Carousel (móvil) y Grid (escritorio)
    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 992); // <992px: consideramos móvil/tablet
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <Container className="py-4">
            <h1 className="mb-4 text-center">Estadísticas Fase 1</h1>

            {loadingData ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 240 }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            ) : (
                isMobile ? (
                    // Móvil: mantener carrusel (mejor interacción táctil)
                    <Carousel
                        interval={5000}
                        controls={true}
                        indicators={true}
                        pause="hover"
                        keyboard={true}
                        wrap={true}
                        touch={true}
                        className="shadow-lg rounded"
                    >
                        {slides.map((slide, index) => (
                            <Carousel.Item key={index}>
                                <Card className="p-3 shadow-sm border-0" style={{ minHeight: '420px' }}>
                                    <Card.Body>
                                        {/* <h5 className="text-center mb-3">{slide.title}</h5> */}
                                        <InitialDashboard data={slide.data} title={slide.title} />
                                    </Card.Body>
                                </Card>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    // Escritorio: mostrar todas las tarjetas en un grid para mejor overview
                    
                    <Row xs={1} md={2} lg={3} className="g-4">
                        <br />
                        {slides.map((slide, index) => (
                            <Col key={index}>
                                <Card className="p-3 shadow-sm border-0 h-100" style={{ minHeight: '420px' }}>
                                    <Card.Body>
                                        {/* <h5 className="text-center mb-3">{slide.title}</h5> */}
                                        <InitialDashboard data={slide.data} title={slide.title} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )
            )}
        </Container>
    )
}