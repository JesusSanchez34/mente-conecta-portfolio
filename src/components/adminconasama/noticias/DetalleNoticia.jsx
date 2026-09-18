import React from 'react';

export function DetalleNoticia({ noticia }) {
    const formatBase64 = (base64String) => {
        if (!base64String) return null;
        if (base64String.startsWith('data:image')) return base64String;
        return `data:image/png;base64,${base64String}`;
    };

    return (
        <div>
            {noticia.imagen && (
                <img 
                    src={formatBase64(noticia.imagen)} 
                    alt={noticia.titulo} 
                    className="img-fluid mb-3 w-100" 
                    style={{ borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }} 
                />
            )}
            <h3 style={{ color: "#4DB6AC" }}>{noticia.titulo}</h3>
            <p className="text-muted"><strong>Resumen:</strong> {noticia.descripcion_previa}</p>
            <hr />
            <div 
                className="noticia-contenido"
                dangerouslySetInnerHTML={{ __html: noticia.descripcion }} 
            />
        </div>
    );
}