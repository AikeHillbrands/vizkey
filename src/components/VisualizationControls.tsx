import { ChartType } from '../types'

interface VisualizationControlsProps {
  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
}

export function VisualizationControls({ chartType, onChartTypeChange }: VisualizationControlsProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold">Visualization</h3>
      <select
        className="w-full p-2 border rounded dark:bg-gray-900 text-sm"
        value={chartType || ''}
        onChange={(e) => onChartTypeChange(e.target.value as ChartType)}
      >
        <option value="">Table View</option>
        <option value="bar">Bar Chart</option>
        <option value="line">Line Chart</option>
        <option value="scatter">Scatter Plot</option>
      </select>
    </div>
  )
} 