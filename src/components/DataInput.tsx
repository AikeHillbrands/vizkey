import { useCallback } from 'react'
import { DataItem } from '../types'
import { PropertyList } from './PropertyList'

interface DataInputProps {
  value: string
  onChange: (value: string) => void
  onDataParse: (text: string) => void
  data: DataItem[]
}

export function DataInput({ value, onChange, onDataParse, data }: DataInputProps) {
  const handleFileInput = useCallback((event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const text = e.target?.result as string
      onChange(text)
      onDataParse(text)
    }
    
    reader.readAsText(file)
  }, [onChange, onDataParse])

  return (
    <div className="h-full flex">
      <div className="w-1/2 p-4 border-r">
        <textarea
          className="w-full h-full p-4 border rounded-lg font-mono text-xs"
          placeholder="Paste your JSON or CSV data here or drag a file..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            if (e.target.value) {
              onDataParse(e.target.value)
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileInput}
        />
      </div>
      <div className="w-1/2 p-4 bg-gray-50">
        <PropertyList data={data} />
      </div>
    </div>
  )
} 