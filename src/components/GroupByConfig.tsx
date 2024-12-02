import { Field, GroupByField } from "../types"
import {DateTruncationOption, dateTruncations} from '../utils/truncate-date';

interface GroupByConfigProps {
  fields: Field[]
  selectedFields: GroupByField[]
  onFieldsChange: (fields: GroupByField[]) => void
}

export function GroupByConfig({
  fields,
  selectedFields,
  onFieldsChange,
}: GroupByConfigProps) {
  const toggleField = (field: Field) => {
    if (selectedFields.some(f => f.field === field)) {
      onFieldsChange(selectedFields.filter(f => f.field !== field))
    } else {
      onFieldsChange([...selectedFields, { field }])
    }
  }

  const updateTruncation = (field: Field, truncation: DateTruncationOption) => {
    onFieldsChange(
      selectedFields.map(f => 
        f.field === field ? { field, truncation } : f
      )
    )
  }

  const truncationOptions = Object.entries(dateTruncations).map(([key, value]) => ({
    key,
    label: value.label,
  }))

  const stringFields = fields.filter(field => field.type === 'string')
  const dateFields = fields.filter(field => field.type === 'date')

  const FieldButton = ({ field }: { field: Field }) => {
    const isSelected = selectedFields.some(f => f.field === field)
    const selectedField = selectedFields.find(f => f.field === field)

    return (
      <div key={field.name} className="flex flex-col space-y-2">
        <button
          onClick={() => toggleField(field)}
          className={`p-2 rounded text-left truncate ${
            isSelected
              ? 'bg-blue-100 border-blue-500 border-2 text-blue-700'
              : 'border border-gray-300 hover:border-blue-500'
          }`}
        >
          {field.name}
        </button>
        
        {field.type === 'date' && (
          <select
            value={selectedField?.truncation || 'exact'}
            onChange={(e) => updateTruncation(field, e.target.value as DateTruncationOption)}
            className="text-sm p-1 border rounded"
          >
            {truncationOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* String Fields Section */}
      {stringFields.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">String Fields</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {stringFields.map(field => (
              <FieldButton key={field.name} field={field} />
            ))}
          </div>
        </div>
      )}

      {/* Date Fields Section */}
      {dateFields.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Date Fields</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {dateFields.map(field => (
              <FieldButton key={field.name} field={field} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 