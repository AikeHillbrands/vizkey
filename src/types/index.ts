export type ChartType = 'bar' | 'line' | 'scatter' | null

export interface DataItem {
  [key: string]: string | number | boolean
}

export interface GroupByConfig {
  fields: string[]
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
  }[]
} 