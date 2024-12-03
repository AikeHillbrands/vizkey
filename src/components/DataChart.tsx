import { Chart } from 'react-chartjs-2';
import { ChartType, DataItem } from '../types';

export function DataChart({ rows, type }: { rows: DataItem[]; type: Exclude<ChartType, null> }) {
  if (!rows.length) return null;

  const chartData = {
    labels: rows.map((_, i) => `Item ${i + 1}`),
    datasets: Object.keys(rows[0])
      .filter((key) => typeof rows[0][key] === 'number')
      .map((key) => ({
        label: key,
        data: rows.map((item) => Number(item[key])),
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      })),
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Chart
        type={type}
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            },
          },
        }}
      />
    </div>
  );
}
