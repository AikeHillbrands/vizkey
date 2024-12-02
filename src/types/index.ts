export type ChartType = 'bar' | 'line' | 'scatter' | null

export interface DataItem {
  [key: string]: string | number | boolean | null | Date
}

export interface GroupByConfig {
  fields: Field[]
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
}

export type FieldType = "string" | "number" | "boolean" | "date"
export type Field = {
  name: string
  isNullable: boolean
  type: FieldType
}