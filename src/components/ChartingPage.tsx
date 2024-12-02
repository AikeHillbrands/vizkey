import {
  ChartType,
  DataItem,
  Aggregation,
  Field,
  GroupByField,
  GroupByConfigType,
} from "../types"
import { DataChart } from "./DataChart"
import { DataTable } from "./DataTable"
import { AggregationSection } from "./AggregationSection"
import { VisualizationControls } from "./VisualizationControls"
import { processData } from "../utils/processing/data-processing"
import { useMemo, useState } from "react"
import { GroupByConfig } from "./GroupByConfig"

export function ChartingPage({
  inputData,
}: {
  inputData: {
    fields: Field[]
    rows: DataItem[]
  }
}) {
  const numericFields = inputData.fields.filter(
    (field) => field.type === "number"
  )
  const [chartType, setChartType] = useState<ChartType>(null)
  const [groupByConfig, setGroupByConfig] = useState<GroupByConfigType>({
    fields: [],
  })
  const [aggregations, setAggregations] = useState<Aggregation[]>([])

  const processedData = useMemo(
    () =>
      processData({
        rows: inputData.rows,
        groupByConfig,
        aggregations,
        allFields: inputData.fields,
      }),
    [inputData.rows, groupByConfig, aggregations, inputData.fields]
  )

  const handleGroupByFieldsChange = (groupByFields: GroupByField[]) => {
    setGroupByConfig({ fields: groupByFields })
  }

  return (
    <div className="h-full flex">
      <div className="w-1/3 p-4 space-y-6 overflow-auto border-r">
        {/* Grouping section */}
        <div className="space-y-2">
          <h3 className="font-bold">Group By Fields</h3>
          <GroupByConfig
            fields={inputData.fields}
            selectedFields={groupByConfig.fields}
            onFieldsChange={handleGroupByFieldsChange}
          />
        </div>

        {/* Aggregation section */}
        <div className="space-y-2">
          <h3 className="font-bold">Aggregations</h3>
          <AggregationSection
            numericFields={numericFields}
            aggregations={aggregations}
            onAggregationsChange={setAggregations}
          />
        </div>

        <VisualizationControls
          chartType={chartType}
          onChartTypeChange={setChartType}
        />
      </div>

      {/* Right side - Visualization */}
      <div className="flex-1 overflow-auto">
        {chartType ? (
          <DataChart rows={processedData.rows} type={chartType} />
        ) : (
          <DataTable rows={processedData.rows} fields={processedData.fields} />
        )}
      </div>
    </div>
  )
}
