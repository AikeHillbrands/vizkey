import { useState } from "react"
import { Chart as ChartJS, registerables } from "chart.js"
import Papa from "papaparse"
import { DataInput } from "./components/DataInput"
import { ConfigPanel } from "./components/ConfigPanel"
import { TabLayout } from "./components/TabLayout"
import {
  DataItem,
  ChartType,
  GroupByConfig,
  Aggregation,
  Field,
  FieldType,
} from "./types"

ChartJS.register(...registerables)

const SAMPLE_DATA: DataItem[] = [
  {
    id: 1,
    date: "2024-01-01",
    category: "Electronics",
    product: "Laptop",
    price: 1299.99,
    quantity: 5,
    inStock: true,
    rating: "4.5",
    tags: "tech,computer,work",
    lastUpdated: "2024-03-15T14:30:00Z",
  },
  {
    id: 2,
    date: "2024-01-02",
    category: "Books",
    product: "JavaScript Guide",
    price: 49.99,
    quantity: 20,
    inStock: true,
    rating: "4.8",
    tags: "programming,education,tech",
    lastUpdated: "2024-03-14T09:15:00Z",
  },
  {
    id: 3,
    date: "2024-01-03",
    category: "Electronics",
    product: "Smartphone",
    price: 899.99,
    quantity: 8,
    inStock: false,
    rating: "4.2",
    tags: "tech,mobile,communication",
    lastUpdated: "2024-03-13T16:45:00Z",
  },
  {
    id: 4,
    date: "2024-01-03",
    category: "Clothing",
    product: "Winter Jacket",
    price: 89.99,
    quantity: 15,
    inStock: true,
    rating: "4.6",
    tags: "winter,outdoor,fashion",
    lastUpdated: "2024-03-13T11:20:00Z",
  },
  {
    id: 5,
    date: "2024-01-04",
    category: "Books",
    product: "TypeScript Handbook",
    price: 39.99,
    quantity: 25,
    inStock: true,
    rating: "4.9",
    tags: "programming,education,tech",
    lastUpdated: "2024-03-12T16:30:00Z",
  },
  {
    id: 6,
    date: "2024-01-04",
    category: "Electronics",
    product: "Wireless Headphones",
    price: 199.99,
    quantity: 0,
    inStock: false,
    rating: "4.7",
    tags: "tech,audio,wireless",
    lastUpdated: "2024-03-12T14:15:00Z",
  },
  {
    id: 7,
    date: "2024-01-05",
    category: "Food",
    product: "Organic Coffee",
    price: 15.99,
    quantity: 50,
    inStock: true,
    rating: "4.4",
    tags: "beverage,organic,fair-trade",
    lastUpdated: "2024-03-11T09:45:00Z",
  },
  {
    id: 8,
    date: "2024-01-05",
    category: "Clothing",
    product: "Running Shoes",
    price: 129.99,
    quantity: 12,
    inStock: true,
    rating: "4.3",
    tags: "sports,footwear,running",
    lastUpdated: "2024-03-11T08:30:00Z",
  },
  {
    id: 9,
    date: "2024-01-06",
    category: "Food",
    product: "Green Tea",
    price: 8.99,
    quantity: 75,
    inStock: true,
    rating: "4.1",
    tags: "beverage,healthy,organic",
    lastUpdated: "2024-03-10T15:20:00Z",
  },
  {
    id: 10,
    date: "2024-01-06",
    category: "Books",
    product: "React Cookbook",
    price: 45.99,
    quantity: 18,
    inStock: true,
    rating: "4.6",
    tags: "programming,education,tech",
    lastUpdated: "2024-03-10T13:10:00Z",
  },
]

function App() {
  const [activeTab, setActiveTab] = useState<"data" | "config">("data")
  const [chartType, setChartType] = useState<ChartType>(null)
  const [data, setData] = useState<DataItem[]>(SAMPLE_DATA)
  const [fields, setFields] = useState<Field[]>([])
  const [inputText, setInputText] = useState(
    JSON.stringify(SAMPLE_DATA, null, 2)
  )
  const [groupByConfig, setGroupByConfig] = useState<GroupByConfig>({
    fields: [],
  })
  const [aggregations, setAggregations] = useState<Aggregation[]>([])

  const parseData = (input: string) => {
    try {
      // Try parsing as JSON first
      const jsonData = JSON.parse(input) as InputRecord[]

      const { fields, data } = prepareData(jsonData)

      setFields(fields)
      setData(data)

      // Reset configurations when new data is loaded
      setGroupByConfig({ fields: [] })
      setAggregations([])
    } catch {
      // If JSON parsing fails, try CSV
      Papa.parse(input, {
        complete: (results) => {
          const csvData = results.data as InputRecord[]
          const { fields, data } = prepareData(csvData)
          setFields(fields)
          setData(data)
          setGroupByConfig({ fields: [] })
          setAggregations([])
        },
        header: true,
      })
    }
  }

  return (
    <TabLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "data" ? (
        <DataInput
          value={inputText}
          onChange={setInputText}
          onDataParse={parseData}
          fields={fields}
        />
      ) : (
        <ConfigPanel
          fields={fields}
          groupByConfigs={groupByConfig}
          onGroupByConfigsChange={setGroupByConfig}
          aggregations={aggregations}
          onAggregationsChange={setAggregations}
          chartType={chartType}
          onChartTypeChange={setChartType}
          data={data}
        />
      )}
    </TabLayout>
  )
}

export default App

function prepareData(data: InputRecord[]): {
  fields: Field[]
  data: DataItem[]
} {
  const fieldsMap: Record<string, FieldDetection> = {}

  for (const item of data) {
    for (const [key, value] of Object.entries(item)) {
      const field = (fieldsMap[key] ??= {
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

  for (const [name, field] of Object.entries(fieldsMap)) {
    const { type, isNullable, parse } = getFieldType(field)
    fields.push({
      type,
      isNullable,
      parse,
      name,
    })
  }

  const result: DataItem[] = []

  for (const item of data) {
    const resultItem: DataItem = {}
    for (const field of fields) {
      resultItem[field.name] = field.parse(item[field.name])
    }
    result.push(resultItem)
  }

  return { fields, data: result }
}

type InputValue = string | number | boolean | null | undefined
type InputRecord = Record<string, InputValue>
type FieldValue = string | number | boolean | Date | null
type FieldDetection = {
  stringFounds: number
  numberFounds: number
  booleanFounds: number
  dateFounds: number
  nullFounds: number
  totalValues: number
}

function getFieldType(field: FieldDetection): {
  type: FieldType
  isNullable: boolean
  parse: (value: InputValue) => FieldValue
} {
  if (field.totalValues === field.booleanFounds)
    return {
      type: "boolean",
      isNullable: field.nullFounds > 0,
      parse: (value) => Boolean(value),
    }

  if (field.totalValues === field.numberFounds) {
    return {
      type: "number",
      isNullable: field.nullFounds > 0,
      parse: (value) => Number(value),
    }
  }

  if (field.totalValues === field.dateFounds) {
    return {
      type: "date",
      isNullable: field.nullFounds > 0,
      parse: (value) => {
        const date = new Date(value as string)
        if (isNaN(date.getTime())) {
          return null
        }
        return date
      },
    }
  }

  return {
    type: "string",
    isNullable: field.nullFounds > 0,
    parse: (value) => String(value),
  }
}

function detectValue(value: InputValue, fieldDetection: FieldDetection) {
  if (value === null || value === undefined) {
    fieldDetection.nullFounds++
    return null
  }

  fieldDetection.totalValues++

  if (typeof value === "boolean") {
    fieldDetection.booleanFounds++
    return value
  }

  if (typeof value === "number") {
    fieldDetection.numberFounds++
    return value
  }

  if (typeof value === "string") {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      fieldDetection.dateFounds++
      return date
    }

    if (value === "true") {
      fieldDetection.booleanFounds++
      return true
    }

    if (value === "false") {
      fieldDetection.booleanFounds++
      return false
    }

    fieldDetection.stringFounds++
    return value
  }

  return String(value)
}
