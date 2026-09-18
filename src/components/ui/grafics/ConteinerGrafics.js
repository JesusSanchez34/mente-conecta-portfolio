import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';


export function ConteinerGrafics(props) {

    const { data } = props;

    if (!data) return undefined

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={800}>
                <Pie
                    data={data}
                    cx={300}
                    cy={300}
                    label
                    labelLine={false}
                    outerRadius={250}
                    fill="#8884d8"
                    isAnimationActive
                    dataKey="value"
                >
                    <Tooltip />
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>

        </ResponsiveContainer>
    )

}
