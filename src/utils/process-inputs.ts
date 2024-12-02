import { DataItem, Field, InputRecord } from "../types"
import { detectValue, FieldDetection, getFieldType } from "./detect-columns"

export function processInput(inputRows: InputRecord[]): {
  fields: Field[]
  rows: DataItem[]
} {
  const columnTypeDetection: Record<string, FieldDetection> = {}

  for (const item of inputRows) {
    for (const [key, value] of Object.entries(item)) {
      const field = (columnTypeDetection[key] ??= {
        stringFounds: 0,
        numberFounds: 0,
        booleanFounds: 0,
        dateFounds: 0,
        nullFounds: 0,
        totalValues: 0,
      })

      detectValue(value, field)
    }
  }

  const fields = []

  for (const [name, field] of Object.entries(columnTypeDetection)) {
    const { type, isNullable, parse } = getFieldType(field)
    fields.push({
      type,
      isNullable,
      parse,
      name,
    })
  }

  

  const rows: DataItem[] = []
  for (const item of inputRows) {
    const resultItem: DataItem = {}
    for (const field of fields) {
      resultItem[field.name] = field.parse(item[field.name])
    }
    rows.push(resultItem)
  }

  return { fields, rows }
}
