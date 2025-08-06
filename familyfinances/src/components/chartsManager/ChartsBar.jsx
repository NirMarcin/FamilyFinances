import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Rejestracja Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartsBar({ data }) {
  const positiveData = {
    ...data,
    datasets: data.datasets.map((ds) => ({
      ...ds,
      data: ds.data.map((v) => Math.abs(Number(v))),
    })),
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Dodane, aby wymusić rozmiar
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Kwoty faktur wg kategorii",
      },
    },
    scales: {
      x: { title: { display: true, text: "Kategoria" } },
      y: { title: { display: true, text: "Kwota (zł)" }, beginAtZero: true },
    },
  };

  // Ustawienie stałej wysokości dla wykresu
  return (
    <div style={{ height: 350, width: "100%" }}>
      <Bar data={positiveData} options={barOptions} />
    </div>
  );
}
