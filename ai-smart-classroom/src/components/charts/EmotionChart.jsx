import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function EmotionChart() {
  const data = {
    labels: ["Happy", "Neutral", "Sad", "Focused"],
    datasets: [
      {
        data: [45, 25, 10, 20],
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#ef4444",
          "#f59e0b",
        ],
      },
    ],
  };

  return (
    <Pie
      data={data}
      options={{
        responsive: true,
      }}
    />
  );
}

export default EmotionChart;