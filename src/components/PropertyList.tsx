import { DataItem } from "../types"

interface PropertyListProps {
  data: DataItem[]
}

type PropertyType =
  | "number"
  | "boolean"
  | "string"
  | "date"
  | "number (as string)"
  | "unknown"

const TYPE_COLORS: Record<
  PropertyType,
  { bg: string; text: string; border: string }
> = {
  number: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  boolean: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  string: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  date: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "number (as string)": {
    bg: "bg-blue-50/50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  unknown: {
    bg: "bg-white",
    text: "text-gray-700",
    border: "border-gray-200",
  },
}

function getPropertyType(value: string | number | boolean): PropertyType {
  if (typeof value === "number") return "number"
  if (typeof value === "boolean") return "boolean"
  if (typeof value === "string") {
    // Try to parse as number
    if (!isNaN(Number(value))) return "number (as string)"
    // Try to parse as date
    const date = new Date(value)
    if (!isNaN(date.getTime())) return "date"
    return "string"
  }
  return "unknown"
}

export function PropertyList({ data }: PropertyListProps) {
  if (!data.length)
    return <div className="text-gray-500 italic">No data loaded</div>

  const firstRow = data[0]
  const properties = Object.entries(firstRow).map(([key, value]) => {
    const type = getPropertyType(value)
    return {
      name: key,
      type,
      example: String(value),
      colors: TYPE_COLORS[type],
    }
  })

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4">Detected Properties</h2>
      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          {properties.map((prop) => (
            <div
              key={prop.name}
              className={`p-3 border rounded transition-colors ${prop.colors.bg} ${prop.colors.border} hover:border-blue-500`}
            >
              <div className="flex justify-between">
                <span className="font-mono font-semibold text-sm px-1 py-0.5 rounded border mr-2 mb-1">
                  {prop.name}
                </span>
                <span className={`text-sm ${prop.colors.text}`}>
                  Type: {prop.type}
                </span>
              </div>

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
