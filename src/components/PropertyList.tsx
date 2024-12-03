import { Field, FieldType } from "../types"

interface PropertyListProps {
  fields: Field[]
}

const TYPE_COLORS: Record<
  FieldType,
  { bg: string; text: string; border: string }
> = {
  number: {
    bg: "bg-blue-50 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-200",
    border: "border-blue-200 dark:border-blue-900",
  },
  boolean: {
    bg: "bg-teal-50 dark:bg-teal-900",
    text: "text-teal-700 dark:text-teal-200",
    border: "border-teal-200 dark:border-teal-900",
  },
  string: {
    bg: "bg-orange-50 dark:bg-orange-900",
    text: "text-orange-700 dark:text-orange-200",
    border: "border-orange-200 dark:border-orange-900",
  },
  date: {
    bg: "bg-purple-50 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-200",
    border: "border-purple-200 dark:border-purple-900",
  },
}

export function PropertyList({ fields }: PropertyListProps) {
  if (!fields.length)
    return <div className="text-gray-500 italic text-center mt-6">No data loaded</div>

  
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
                <span className="font-mono font-semibold text-sm px-1 py-0.5 rounded border mr-2 mb-1 dark:border-gray-300">
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
