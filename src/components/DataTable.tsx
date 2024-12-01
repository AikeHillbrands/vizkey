import { DataItem } from '../types'

interface DataTableProps {
  data: DataItem[]
}

export function DataTable({ data }: DataTableProps) {
  if (!data.length) return null

  const columns = Object.keys(data[0])

  return (
    <div className="overflow-auto">
        table
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(column => (
                <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {String(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 