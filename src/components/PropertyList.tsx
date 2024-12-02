import { Field, FieldType } from "../types"

interface PropertyListProps {
  fields: Field[]
}

const TYPE_COLORS: Record<
  FieldType,
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
}

export function PropertyList({ fields }: PropertyListProps) {
  if (!fields.length)
    return <div className="text-gray-500 italic">No data loaded</div>

  
  const properties = fields.map((field) => {
    return {
      name: field.name,
      type: field.type,
      colors: TYPE_COLORS[field.type],
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
