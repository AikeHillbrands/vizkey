import { DataItem, Field } from '../types'

export function DataTable({ rows, fields }: {
  rows: DataItem[]
  fields: Field[]
}) {
  if (!rows.length) return null

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {fields.map(field => (
              <th
                key={field.name}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, i) => (
            <tr key={i}>
              {fields.map((field, fieldIndex) => {
                const value = row[field.name]

                const stringValue = value instanceof Date ? value.toISOString() : String(value)

                return (
                <td key={fieldIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stringValue}
                </td>
              )})}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 