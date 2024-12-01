import { Chart } from 'react-chartjs-2'
import { ChartType, DataItem } from '../types'

interface DataChartProps {
  data: DataItem[]
  type: Exclude<ChartType, null>
}

export function DataChart({ data, type }: DataChartProps) {
  if (!data.length) return null

  const chartData = {
    labels: data.map((_, i) => `Item ${i + 1}`),
    datasets: Object.keys(data[0])
      .filter(key => typeof data[0][key] === 'number')
      .map(key => ({
        label: key,
        data: data.map(item => Number(item[key])),
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }))
  }

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
          }
        }}
      />
    </div>
  )
} 