import { DateTruncationOption } from "../utils/truncate-date"

export type ChartType = 'bar' | 'line' | 'scatter' | null

export type DataValue = string | number | boolean | null | Date
export interface DataItem {
  [key: string]: DataValue
}

export interface GroupByConfigType {
  fields: GroupByField[]
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
  }[]
} 

export type AggregationType = "sum" | "max" | "min" | "count" | "average"

export type Aggregation = {
  field: Field
  type: AggregationType
  key: string
}

export type FieldType = 'string' | 'number' | 'date' | 'boolean'

export interface Field {
  name: string
  type: FieldType
  isNullable: boolean
}

export interface GroupByField {
  field: Field
  truncation?: DateTruncationOption
}

export type InputValue = string | number | boolean | null | undefined
export type InputRecord = Record<string, InputValue>
