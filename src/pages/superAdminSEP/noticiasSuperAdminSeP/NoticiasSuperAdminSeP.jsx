import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Button, Card, Alert } from 'react-bootstrap';
import { ModalBasic } from '../../../components/ui/modalBasic';
import { useAuth } from '../../../hooks';
import { getNoticiasSeP, deleteNoticiaSeP } from '../../../api/sep/noticiasSEP';
import { DetalleNoticia } from '../../../components/adminsep/noticias/DetalleNoticia';
import { RegisterNoticiaForm } from '../../../components/adminsep/noticias/RegisterNoticiaForm';

export function NoticiasSuperAdminSeP() {
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [contentModal, setContentModal] = useState(null);
    const [noticias, setNoticias] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const { auth } = useAuth();

    const onReload = () => setReload((prevState) => !prevState);

    const formatBase64 = (base64String) => {
        if (!base64String) return "";
        if (base64String.startsWith('data:image')) return base64String;
        return `data:image/png;base64,${base64String}`;
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const response = await getNoticiasSeP(auth.token);
                setNoticias(response);
            } catch (error) {
                console.error("Error al cargar:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [auth, reload]);

    const openModal = (title, content) => {
        setTitleModal(title);
        setContentModal(content);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTitleModal("");
        setContentModal(null);
    };

    // 1. Modal para registrar noticia
    const addNoticia = () => {
        openModal("Registrar Nueva Noticia", <RegisterNoticiaForm onClose={closeModal} onReload={onReload} />);
    };

    // 2. Modal para ver detalle
    const viewNoticia = (noticia) => {
        openModal("Información de la Noticia", <DetalleNoticia noticia={noticia} />);
    };

    // 3. Función real que ejecuta la eliminación en la API
    const confirmDelete = async (idNoticia) => {
        try {
            setErrorMsg("");
            await deleteNoticiaSeP(auth.token, idNoticia);
            onReload();
            closeModal();
        } catch (error) {
            setErrorMsg("Error al eliminar la noticia. Inténtalo más tarde.");
            closeModal();
        }
    };

    // 4. Modal para preguntar si está seguro
    const onDeleteClick = (noticia) => {
        openModal(
            "Confirmar Eliminación",
            <div>
                <p>¿Estás seguro de que deseas eliminar la noticia <strong>"{noticia.titulo}"</strong>?</p>
                <p className="text-danger">Esta acción no se puede deshacer.</p>
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button variant="secondary" onClick={closeModal}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={() => confirmDelete(noticia.id)}>
                        Sí, eliminar
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h1 style={{ color: "#4DB6AC" }}> Gestión de Noticias SuperAdmin </h1>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={addNoticia} style={{ background: "#4DB6AC", borderColor: "#4DB6AC" }}>
                        Registrar Nueva Noticia
                    </Button>
                </Col>
            </Row>

            <hr />

            {errorMsg && <Alert variant="danger" onClose={() => setErrorMsg("")} dismissible>{errorMsg}</Alert>}

            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" style={{ color: "#4DB6AC" }} />
                    <p>Cargando noticias...</p>
                </div>
            ) : (
                <Row>
    {noticias?.map((noticia, index) => (
        <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow-sm overflow-hidden">
                {/* Ajuste de imagen para las tarjetas */}
                <div style={{ backgroundColor: '#f4f6f8', textAlign: 'center' }}>
                    {noticia.imagen ? (
                        <Card.Img 
                            variant="top" 
                            src={formatBase64(noticia.imagen)} 
                            style={{ 
                                height: '220px', 
                                width: '100%', 
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderBottom: '1px solid #eaeaea'
                            }} 
                        />
                    ) : (
                        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                            <span>Sin imagen</span>
                        </div>
                    )}
                </div>
                
                <Card.Body className="d-flex flex-column">
                    <Card.Title style={{ color: "#4DB6AC", fontWeight: 'bold' }}>{noticia.titulo}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                        {noticia.descripcion_previa}
                    </Card.Text>
                    <div className="d-flex justify-content-between mt-3">
                        <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => viewNoticia(noticia)}
                            style={{ color: "#4DB6AC", borderColor: "#4DB6AC" }}
                        >
                            Ver completa
                        </Button>
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => onDeleteClick(noticia)}
                        >
                            Eliminar
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    ))}
</Row>
            )}

            <ModalBasic
                show={showModal}
                onClose={closeModal}
                title={titleModal}
                children={contentModal}
                size="md"
            />
        </Container>
    );
}

export default NoticiasSuperAdminSeP;
