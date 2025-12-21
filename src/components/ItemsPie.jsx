import React from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

function ItemsPie({ done, todo, doneLabel, todoLabel }) {
  const data = [    
    { name: doneLabel, value: done },
    { name: todoLabel, value: todo }
  ];

  const COLORS = ["#22c55e", "#f97316"]; 


  return (
    <div className="chartWrap">
      <ResponsiveContainer>
        <PieChart>
         <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ItemsPie;
