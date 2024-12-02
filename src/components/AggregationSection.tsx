import { Aggregation, AggregationType, Field } from "../types"


interface AggregationSectionProps {
  numericFields: Field[]
  aggregations: Aggregation[]
  onAggregationsChange: (aggregations: Aggregation[]) => void
}

const AGGREGATION_METHODS: AggregationType[] = [
  "average",
  "max",
  "min",
  "sum",
  "count",
]

export function AggregationSection({
  numericFields,
  aggregations,
  onAggregationsChange,
}: AggregationSectionProps) {
  const addAggregation = () => {
    onAggregationsChange([
      ...aggregations,
      { field: numericFields[0], type: "average", key: "average(numericFields[0].name)" }
    ])
  }

  const updateAggregation = (index: number, updates: Aggregation) => {
    const newAggregations = [...aggregations]
    newAggregations[index] = { ...newAggregations[index], ...updates }
    onAggregationsChange(newAggregations)
  }

  const removeAggregation = (index: number) => {
    onAggregationsChange(aggregations.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {aggregations.map((aggregation, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              className="flex-1 p-2 border rounded dark:bg-gray-900 text-sm"
              value={aggregation.field.name}
              onChange={(e) => {
                const field = numericFields.find(f => f.name === e.target.value)
                if (!field) return
                return updateAggregation(index, { field, type: aggregation.type, key: `${aggregation.type}(${field.name})` })
              }}
            >
              {numericFields.map(field => (
                <option key={field.name} value={field.name}>{field.name}</option>
              ))}
            </select>
            <select
              className="flex-1 p-2 border rounded dark:bg-gray-900 text-sm"
              value={aggregation.type}
              onChange={(e) => {
                const field = numericFields.find(f => f.name === aggregation.field.name)
                if (!field) return
                
                return updateAggregation(index, { 
                  field,
                  type: e.target.value as AggregationType,
                  key: `${e.target.value}(${field.name})`
                })
              }}
            >
              {AGGREGATION_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            {/* {agg.type === 'percentile' && (
              <input
                type="number"
                min="1"
                max="99"
                className="w-20 p-2 border rounded"
                value={agg.percentile ?? 50}
                onChange={(e) => updateAggregation(index, { 
                  percentile: Math.min(99, Math.max(1, Number(e.target.value)))
                })}
              />
            )} */}
            <button
              className="p-2 text-red-500"
              onClick={() => removeAggregation(index)}
            >
              ×
            </button>
          </div>
        ))}
        <button
          className="text-sm text-blue-500"
          onClick={addAggregation}
        >
          + Add Aggregation
        </button>
      </div>
    </div>
  )
} 