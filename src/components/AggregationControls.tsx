import { AggregationType } from '../types'

const AGGREGATION_TYPES: AggregationType[] = [
  'sum', 'max', 'min', 'count', 'average',
  'p25', 'p50', 'p75', 'p90', 'p95', 'p99'
]

interface AggregationControlsProps {
  aggregations: { field: string; type: AggregationType }[]
  numericFields: string[]
  onAdd: () => void
  onUpdate: (index: number, field: string | AggregationType, isType: boolean) => void
  onRemove: (index: number) => void
}

export function AggregationControls({
  aggregations,
  numericFields,
  onAdd,
  onUpdate,
  onRemove
}: AggregationControlsProps) {
  return (
    <div className="space-y-2 pl-4">
      {aggregations.map((agg, index) => (
        <div key={index} className="flex items-center gap-2">
          <select
            className="flex-1 p-2 border rounded"
            value={agg.field}
            onChange={(e) => onUpdate(index, e.target.value, false)}
          >
            {numericFields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
          <select
            className="flex-1 p-2 border rounded"
            value={agg.type}
            onChange={(e) => onUpdate(index, e.target.value, true)}
          >
            {AGGREGATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            className="p-2 text-red-500"
            onClick={() => onRemove(index)}
          >
            ×
          </button>
        </div>
      ))}
      <button
        className="text-sm text-blue-500"
        onClick={onAdd}
      >
        + Add Aggregation
      </button>
    </div>
  )
} 