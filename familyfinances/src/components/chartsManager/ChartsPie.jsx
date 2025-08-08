import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartsPie({ data, title }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      title: { display: !!title, text: title },
    },
  };

  return (
    <div
      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm transition-colors duration-300"
      style={{ height: 350, width: "100%" }}
    >
      <Pie data={data} options={options} />
    </div>
  );
}
