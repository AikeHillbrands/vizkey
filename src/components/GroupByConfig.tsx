

interface GroupByConfigProps {
  fields: string[]
  selectedFields: string[]
  onFieldsChange: (fields: string[]) => void
}

export function GroupByConfig({
  fields,
  selectedFields,
  onFieldsChange,
}: GroupByConfigProps) {
  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      onFieldsChange(selectedFields.filter(f => f !== field))
    } else {
      onFieldsChange([...selectedFields, field])
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {fields.map(field => (
          <button
            key={field}
            onClick={() => toggleField(field)}
            className={`p-2 rounded text-left truncate ${
              selectedFields.includes(field)
                ? 'bg-blue-100 border-blue-500 border-2 text-blue-700'
                : 'border border-gray-300 hover:border-blue-500'
            }`}
          >
            {field}
          </button>
        ))}
      </div>
    </div>
  )
} 