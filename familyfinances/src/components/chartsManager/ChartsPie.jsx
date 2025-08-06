import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartsPie({ data, title }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Dodane, aby wymusić rozmiar
    plugins: {
      legend: { position: "right" },
      title: { display: !!title, text: title },
    },
  };

  return (
    <div style={{ height: 350, width: "100%" }}>
      <Pie data={data} options={options} />
    </div>
  );
}
