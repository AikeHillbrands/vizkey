import { DataItem } from '../types'

interface PropertyListProps {
  data: DataItem[]
}

function getPropertyType(value: string | number | boolean): string {
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'string') {
    // Try to parse as number
    if (!isNaN(Number(value))) return 'number (as string)'
    // Try to parse as date
    const date = new Date(value)
    if (!isNaN(date.getTime())) return 'date'
    return 'string'
  }
  return 'unknown'
}

export function PropertyList({ data }: PropertyListProps) {
  if (!data.length) return (
    <div className="text-gray-500 italic">
      No data loaded
    </div>
  )

  const firstRow = data[0]
  const properties = Object.entries(firstRow).map(([key, value]) => ({
    name: key,
    type: getPropertyType(value),
    example: String(value)
  }))

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4">Detected Properties</h2>
      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          {properties.map(prop => (
            <div
              key={prop.name}
              className="p-3 border rounded bg-white hover:border-blue-500 transition-colors"
            >
              <div className="font-medium">{prop.name}</div>
              <div className="text-sm text-gray-600">Type: {prop.type}</div>
              <div className="text-sm text-gray-500 truncate">
                Example: {prop.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 