import { GroupByConfig as GroupByConfigType, ChartType, DataItem } from '../types'
import { DataChart } from './DataChart'
import { DataTable } from './DataTable'
import { GroupByConfig } from './GroupByConfig'
import { VisualizationControls } from './VisualizationControls'

interface ConfigPanelProps {
  fields: string[]
  groupByConfigs: GroupByConfigType
  onGroupByConfigsChange: (configs: GroupByConfigType) => void
  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
  data: DataItem[]
}

export function ConfigPanel({
  fields,
  groupByConfigs,
  onGroupByConfigsChange,
  chartType,
  onChartTypeChange,
  data
}: ConfigPanelProps) {
  return (
    <div className="h-full flex">
      {/* Left side - Configuration */}
      <div className="w-1/3 p-4 space-y-6 overflow-auto border-r">
        {/* Grouping section */}
        <div className="space-y-2">
          <h3 className="font-bold">Group By Fields</h3>
          <GroupByConfig
            fields={fields}
            selectedFields={groupByConfigs.fields}
            onFieldsChange={(fields) => onGroupByConfigsChange({ fields })}
          />
        </div>

        <VisualizationControls
          chartType={chartType}
          onChartTypeChange={onChartTypeChange}
        />
      </div>

      {/* Right side - Visualization */}
      <div className="flex-1 p-4 overflow-auto">
        {chartType ? (
          <DataChart data={data} type={chartType} />
        ) : (
          <DataTable data={data} />
        )}
      </div>
    </div>
  )
} 