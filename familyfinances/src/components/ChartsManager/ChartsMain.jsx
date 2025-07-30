import React from "react";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend as PieLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend,
  LineChart, Line, ResponsiveContainer
} from "recharts";

// Przykładowe kolory kategorii
const COLORS = [
  "#fb923c", "#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#f87171", "#4ade80"
];

export default function ChartsMain({ pieData, barData, lineData }) {
  return (
    <div className="max-w-6xl w-full mx-auto flex flex-col gap-8 my-8">
      {/* Wykres kołowy */}
      <div className="bg-white rounded-lg shadow-md border border-orange-200 p-4 flex flex-col items-center w-full">
        <h3 className="text-orange-700 font-bold text-center mb-2">Udział wydatków wg kategorii</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
            >
              {pieData.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <PieTooltip />
            <PieLegend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Wykres słupkowy */}
      <div className="bg-white rounded-lg shadow-md border border-orange-200 p-4 flex flex-col items-center w-full">
        <h3 className="text-orange-700 font-bold text-center mb-2">Wydatki/przychody miesięcznie</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <BarTooltip />
            <BarLegend />
            <Bar dataKey="income" fill="green" name="Przychody" />
            <Bar dataKey="expenses" fill="red" name="Wydatki" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Wykres liniowy */}
      <div className="bg-white rounded-lg shadow-md border border-orange-200 p-4 flex flex-col items-center w-full">
        <h3 className="text-orange-700 font-bold text-center mb-2">Trend wydatków/przychodów</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <BarTooltip />
            <BarLegend />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot name="Wydatki" />
            <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot name="Przychody" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}