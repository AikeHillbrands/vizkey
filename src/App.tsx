import { useMemo, useState } from "react"
import { Chart as ChartJS, registerables } from "chart.js"
import Papa from "papaparse"
import { DataInput } from "./components/DataInput"
import { ChartingPage } from "./components/ChartingPage"
import { TabLayout } from "./components/TabLayout"
import { InputRecord } from "./types"
import { processInput } from "./utils/process-inputs"
import { PropertyList } from "./components/PropertyList"

ChartJS.register(...registerables)

function App() {
  const [activeTab, setActiveTab] = useState<"data" | "config">("data")
  const [inputText, setInputText] = useState("")
  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState(0)

  const datasets = useMemo(() => {
    return tryParseInputData(inputText)
  }, [inputText])

  const inputData = useMemo(() => {
    const selectedDataset = datasets[selectedDatasetIndex]
    return selectedDataset ? processInput(selectedDataset.rows) : { fields: [], rows: [] }
  }, [datasets, selectedDatasetIndex])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="border-b border-gray-200 dark:border-gray-700"></div>
      <TabLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "data" ? (
          <div className="h-full flex">
            <DataInput
              value={inputText}
              onChange={(data) => setInputText(data)}
            />
            <div className="w-1/2 bg-gray-50 dark:bg-gray-900 p-4">
              {datasets.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Select Dataset
                  </label>
                  <select
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                    value={selectedDatasetIndex}
                    onChange={(e) => setSelectedDatasetIndex(Number(e.target.value))}
                  >
                    {datasets.map((dataset, index) => (
                      <option key={dataset.name} value={index}>
                        {dataset.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <PropertyList fields={inputData.fields} />
            </div>
          </div>
        ) : (
          <ChartingPage inputData={inputData} />
        )}
      </TabLayout>
    </div>
  )
}

export default App

function tryParseInputData(input: string): {
  name: string
  rows: InputRecord[]
}[] {
  try {
    // Try parsing as JSON first
    const jsonData = JSON.parse(input)

    const arrays = findArrays(jsonData)

    const datasets = []

    for (const { rows, path } of arrays) {
      datasets.push({
        name: path.length > 0 ? path.join(".") : "Root",
        rows: flattenJson(rows),
      })
    }

    return datasets
  } catch {
    let result: InputRecord[] = []
    // If JSON parsing fails, try CSV
    Papa.parse(input, {
      complete: (results) => {
        result = results.data as InputRecord[]
      },
      header: true,
    })

    return [{ name: "CSV", rows: result }] 
  }
}

function flattenJson(json: unknown[]): InputRecord[] {
  const result: Record<string, unknown>[] = []

  for (const item of json) {
    const flattenedItem: Record<string, unknown> = {}
    flattenRecursively(item, [], flattenedItem)
    result.push(flattenedItem)
  }

  return result as InputRecord[]
}

function flattenRecursively(
  obj: unknown,
  path: string[],
  result: Record<string, unknown>
) {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const key in obj) {
      flattenRecursively(
        (obj as Record<string, unknown>)[key],
        [...path, key],
        result
      )
    }
  } else {
    result[path.join(".")] = obj
  }
}

function findArrays(obj: unknown) {
  const results: { rows: unknown[]; path: string[] }[] = []

  function findArrayRecursively(obj: unknown, path: string[]) {
    if (Array.isArray(obj)) {
      results.push({ rows: obj, path })
    } else if (obj && typeof obj === "object") {
      for (const key in obj) {
        findArrayRecursively((obj as Record<string, unknown>)[key], [
          ...path,
          key,
        ])
      }
    }
  }

  findArrayRecursively(obj, [])
  return results
}
