import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const pastelColors = [
    "#64B5F6",
];

// Tooltip personalizado
function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length > 0) {
        const punto = payload.find(p => p.value > 0 || p.value === 0);
        if (!punto) return null;
        
        // Buscar el valor original en los datos no normalizados
        const originalItem = payload[0].payload;
        const originalValue = originalItem.originalScore || Math.round(punto.value);
        
        return (
            <div style={{ background: "#fff", border: "1px solid #ccc", padding: 10 }}>
                <strong>{label}</strong>: {originalValue}
            </div>
        );
    }
    return null;
}

// Función para quitar "usuarios con " y truncar a 10 caracteres
function truncateLabel(label) {
    if (!label) return '';
    const clean = label.replace(/^usuarios con\s*/i, '');
    return clean.length > 10 ? clean.slice(0, 20) + '…' : clean;
}

export function InitialDashboard({ data, title }) {

    // Normalizar los valores para que el mayor llegue al borde
    let normalizedData = data;
    let maxValue = Math.max(...data.map(d => d.score), 1); // evitar 0

    if (data.length === 3) {
        normalizedData = data.map(d => ({
            ...d,
            score: (d.score / maxValue) * 100, // Normaliza a 100
            originalScore: d.score // Guardar el valor original
        }));
        maxValue = 100;
    } else {
        normalizedData = data.map(d => ({
            ...d,
            originalScore: d.score // Guardar el valor original también para casos no normalizados
        }));
    }

    return (
        <div style={{ width: '100%', height: 400, marginBottom: "2rem", overflow: "hidden" }}>
            <h4 style={{ textAlign: "center", whiteSpace: "normal", wordBreak: 'break-word', overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h4>
            <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedData}>
                    <PolarGrid />
                    <PolarAngleAxis 
                        dataKey="name"
                        tickFormatter={truncateLabel}
                        tick={{ 
                            fontSize: 13, 
                            whiteSpace: "nowrap", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis" 
                        }} 
                    />
                    <PolarRadiusAxis domain={[0, maxValue]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Radar
                        name={title}
                        dataKey="score"
                        stroke={pastelColors[0]}
                        fill={pastelColors[0]}
                        fillOpacity={0.7}
                        dot={false}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
