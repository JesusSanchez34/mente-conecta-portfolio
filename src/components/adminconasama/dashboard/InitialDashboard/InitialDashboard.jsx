import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const pastelColors = [
    "#b251ca",
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
    const axisCount = normalizedData.length;
    const radius = axisCount >= 5 ? "60%" : "65%";

    return (
        <div style={{ width: '100%', height: 400, marginBottom: "2rem"}}>
            <h4 style={{ textAlign: "center", marginBottom: 10 }}>{title}</h4>
            <ResponsiveContainer>
                <RadarChart
                    cx="50%"
                    cy="58%"
                    outerRadius={radius}
                    data={normalizedData}
                >
                    <PolarGrid />
                    <PolarAngleAxis
                        dataKey="name"
                        tick={(props) => {
                            const { x, y, payload, textAnchor } = props;

                            const clean = payload.value.replace(/^usuarios con\s*/i, "");
                            const words = clean.split(" ");

                            // 👉 agrupar palabras de 2 en 2
                            const lines = [];
                            for (let i = 0; i < words.length; i += 2) {
                            lines.push(words.slice(i, i + 2).join(" "));
                            }

                            const lineHeight = 14;
                            const offsetY = -(lines.length - 1) * (lineHeight / 2);

                            return (
                            <text
                                x={x}
                                y={y + offsetY}
                                textAnchor={textAnchor}
                                fontSize={12}
                                fontWeight={500}
                            >
                                {lines.map((line, index) => (
                                <tspan key={index} x={x} dy={index === 0 ? 0 : lineHeight}>
                                    {line}
                                </tspan>
                                ))}
                            </text>
                            );
                        }}
                    />
                    <PolarRadiusAxis 
                        domain={[0, maxValue]} 
                        tick={false}
                        axisLine={false}
                    />
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
