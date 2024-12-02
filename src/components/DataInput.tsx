import { useState, useCallback } from 'react'
import { Field } from '../types'
import { PropertyList } from './PropertyList'
import Papa from 'papaparse'

export function DataInput({ value, onChange, fields }: {
  value: string
  onChange: (value: string) => void
  fields: Field[]
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateInput = (input: string) => {
    if (input === '') {
      setErrorMessage(null)
      return
    }
    try {
      // Try JSON first
      JSON.parse(input)
      setErrorMessage(null)
      return
    } catch (jsonError) {
      // If it doesn't look like JSON, try CSV
      if (!input.trim().startsWith('{') && !input.trim().startsWith('[')) {
        try {
          const result = Papa.parse(input, { header: true })
          if (result.errors.length > 0) {
            setErrorMessage(`CSV Error: ${result.errors[0].message}`)
          } else {
            setErrorMessage(null)
          }
        } catch {
          setErrorMessage('Invalid input format')
        }
      } else {
        // It looks like JSON but failed to parse
        if (jsonError instanceof Error) {
          setErrorMessage(jsonError.message)
        }
      }
    }
  }

  const handleFileInput = useCallback((event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    
    if (file.type === 'application/json' || file.type === 'text/csv' || file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        onChange(text)
        validateInput(text)
      }
      reader.readAsText(file)
    } else {
      setErrorMessage('Please drop a JSON or CSV file')
    }
  }, [onChange])

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value
    onChange(input)
    validateInput(input)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    const { selectionStart, selectionEnd, value } = target
    const isTextSelected = selectionEnd - selectionStart > 0
    let newValue = value

    if (event.key === 'Tab') {
      event.preventDefault()
      newValue = `${value.slice(0, Math.max(0, selectionStart))}  ${value.slice(
        Math.max(0, selectionEnd)
      )}`
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = selectionStart + 2
      }, 0)
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const currentLineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const currentLine = value.slice(currentLineStart, selectionStart)
      const indentMatch = currentLine.match(/^[\t ]*/)
      const indent = indentMatch ? indentMatch[0] : ''

      newValue =
        value.slice(0, Math.max(0, selectionStart)) +
        '\n' +
        indent +
        value.slice(Math.max(0, selectionEnd))

      setTimeout(() => {
        const newCaretPosition = selectionStart + 1 + indent.length
        target.selectionStart = target.selectionEnd = newCaretPosition
      }, 0)
    }

    // Handle quotes
    if (event.key === '"' || event.key === "'") {
      event.preventDefault()
      const insertDoubleQuotes = countQuotesAround(value, selectionStart - 1) % 2 === 0

      if (isTextSelected || insertDoubleQuotes) {
        newValue =
          value.slice(0, Math.max(0, selectionStart)) +
          `"${value.slice(Math.max(0, selectionStart), Math.max(0, selectionEnd))}"` +
          value.slice(Math.max(0, selectionEnd))
      } else {
        newValue =
          value.slice(0, Math.max(0, selectionStart)) +
          `"` +
          value.slice(Math.max(0, selectionEnd))
      }
      setTimeout(() => {
        target.selectionStart = selectionStart + 1
        target.selectionEnd = isTextSelected ? selectionEnd + 1 : selectionStart + 1
      }, 0)
    }

    // Handle brackets
    if (event.key === '{' || event.key === '[') {
      event.preventDefault()
      const closingBracket = event.key === '{' ? '}' : ']'
      newValue =
        value.slice(0, Math.max(0, selectionStart)) +
        `${event.key}${value.slice(Math.max(0, selectionStart), Math.max(0, selectionEnd))}${closingBracket}` +
        value.slice(Math.max(0, selectionEnd))
      setTimeout(() => {
        target.selectionStart = selectionStart + 1
        target.selectionEnd = isTextSelected ? selectionEnd + 1 : selectionStart + 1
      }, 0)
    }

    // Handle closing brackets
    if ((event.key === '}' || event.key === ']') && 
        !isTextSelected && 
        value.charAt(selectionStart) === event.key) {
      event.preventDefault()
      setTimeout(() => {
        target.selectionStart = selectionStart + 1
        target.selectionEnd = selectionStart + 1
      }, 0)
    }

    // Handle backspace for paired characters
    if (event.key === 'Backspace') {
      if (
        (value.charAt(selectionStart - 1) === '"' && value.charAt(selectionStart) === '"') ||
        (value.charAt(selectionStart - 1) === '{' && value.charAt(selectionStart) === '}') ||
        (value.charAt(selectionStart - 1) === '[' && value.charAt(selectionStart) === ']')
      ) {
        event.preventDefault()
        newValue = value.slice(0, selectionStart - 1) + value.slice(selectionStart + 1)
        setTimeout(() => {
          target.selectionStart = selectionStart - 1
          target.selectionEnd = selectionStart - 1
        }, 0)
      }
    }

    if (event.defaultPrevented) {
      target.value = newValue
      onChange(newValue)
      validateInput(newValue)
    }
  }

  return (
    <div className="h-full flex">
      <div className="w-1/2 p-4 border-r flex flex-col">
        <textarea
          className={`w-full border rounded-lg font-mono text-xs dark:bg-gray-900 p-4 ${
            errorMessage ? 'h-[calc(100%)]' : 'h-full'
          }`}
          placeholder="Paste your JSON or CSV data here or drag a file..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileInput}
          onBlur={() => {
            try {
              onChange(JSON.stringify(JSON.parse(value), null, 2))
            } catch {
              // If parsing fails, keep the original value
            }
          }}
        />
        {errorMessage && (
          <div className="mt-2 inline-flex w-full items-center rounded-md bg-red-50 px-3 py-2 text-xs font-light text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-900 dark:text-red-100">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="w-1/2 bg-gray-50 dark:bg-gray-900">
        <PropertyList fields={fields} />
      </div>
    </div>
  )
}

function countQuotesAround(s: string, index: number): number {
  if (index < 0 || index >= s.length) {
    return 0
  }

  let count = s.charAt(index) === '"' ? -1 : 0

  for (let i = index; i < s.length; i++) {
    if (s.charAt(i) === '"') count++
    if (s.charAt(i) === '\n') break
  }
  for (let i = index; i >= 0; i--) {
    if (s.charAt(i) === '"') count++
    if (s.charAt(i) === '\n') break
  }
  return count
} 