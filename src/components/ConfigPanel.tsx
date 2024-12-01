import { GroupByConfig as GroupByConfigType, ChartType, DataItem, Aggregation } from '../types'
import { DataChart } from './DataChart'
import { DataTable } from './DataTable'
import { GroupByConfig } from './GroupByConfig'
import { AggregationSection } from './AggregationSection'
import { VisualizationControls } from './VisualizationControls'
import { processData } from '../utils/dataProcessing'
import { useMemo } from 'react'

interface ConfigPanelProps {
  fields: string[]
  groupByConfigs: GroupByConfigType
  onGroupByConfigsChange: (configs: GroupByConfigType) => void
  aggregations: Aggregation[]
  onAggregationsChange: (aggregations: Aggregation[]) => void
  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
  data: DataItem[]
}

export function ConfigPanel({
  fields,
  groupByConfigs,
  onGroupByConfigsChange,
  aggregations,
  onAggregationsChange,
  chartType,
  onChartTypeChange,
  data
}: ConfigPanelProps) {
  const numericFields = fields.filter(field => 
    data.length && typeof data[0][field] === 'number'
  )

  const processedData = useMemo(() => {
    return processData({ data, groupByConfig: groupByConfigs, aggregations })
  }, [data, groupByConfigs, aggregations])

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

        {/* Aggregation section */}
        <div className="space-y-2">
          <h3 className="font-bold">Aggregations</h3>
          <AggregationSection
            numericFields={numericFields}
            aggregations={aggregations}
            onAggregationsChange={onAggregationsChange}
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
          <DataChart data={processedData} type={chartType} />
        ) : (
          <DataTable data={processedData} />
        )}
      </div>
    </div>
  )
} 