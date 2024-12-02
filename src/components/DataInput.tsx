import { useCallback } from 'react'
import { Field } from '../types'
import { PropertyList } from './PropertyList'

export function DataInput({ value, onChange, fields }: {
  value: string
  onChange: (value: string) => void
  fields: Field[]
}) {
  const handleFileInput = useCallback((event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const text = e.target?.result as string
      onChange(text)
    }
    
    reader.readAsText(file)
  }, [onChange])

  return (
    <div className="h-full flex">
      <div className="w-1/2 p-4 border-r">
        <textarea
          className="w-full h-full p-4 border rounded-lg font-mono text-xs dark:bg-gray-900"
          placeholder="Paste your JSON or CSV data here or drag a file..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileInput}
        />
      </div>
      <div className="w-1/2 bg-gray-50 dark:bg-gray-900">
        <PropertyList fields={fields} />
      </div>
    </div>
  )
} 