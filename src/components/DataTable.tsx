import { DataItem, Field } from '../types'

export function DataTable({ rows, fields }: {
  rows: DataItem[]
  fields: Field[]
}) {
  if (!rows.length) return null

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {fields.map(field => (
              <th
                key={field.name}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider bg-gray-50 dark:bg-gray-800"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, i) => (
            <tr key={i}>
              {fields.map((field, fieldIndex) => {
                const value = row[field.name]

                if (value === 'undefined') return <td key={fieldIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900">
                  <span className="italic">undefined</span>
                </td>

                const stringValue = value instanceof Date ? value.toISOString() : String(value)

                return (
                  <td key={fieldIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900">
                    {stringValue}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 