import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function EmotionChart() {
  const data = {
    labels: ["Happy", "Neutral", "Confused", "Sad"],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Student Emotions",
      },
    },
  };

  return <Pie data={data} options={options} />;
}

export default EmotionChart;