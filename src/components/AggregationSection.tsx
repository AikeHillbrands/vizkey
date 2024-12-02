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
      { field: numericFields[0], type: "average" }
    ])
  }

  const updateAggregation = (index: number, updates: Partial<Aggregation>) => {
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
        {aggregations.map((agg, index) => (
          <div key={index} className="flex items-center gap-2">
            <select
              className="flex-1 p-2 border rounded"
              value={agg.field.name}
              onChange={(e) => updateAggregation(index, { field: numericFields.find(f => f.name === e.target.value) })}
            >
              {numericFields.map(field => (
                <option key={field.name} value={field.name}>{field.name}</option>
              ))}
            </select>
            <select
              className="flex-1 p-2 border rounded"
              value={agg.type}
              onChange={(e) => updateAggregation(index, { 
                type: e.target.value as AggregationType,
              })}
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