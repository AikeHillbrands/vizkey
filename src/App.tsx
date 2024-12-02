import { useMemo, useState } from "react"
import { Chart as ChartJS, registerables } from "chart.js"
import Papa from "papaparse"
import { DataInput } from "./components/DataInput"
import { ChartingPage } from "./components/ChartingPage"
import { TabLayout } from "./components/TabLayout"
import { InputRecord } from "./types"
import { EXAMPLE_DATA } from "./example-data"
import { processInput } from "./utils/process-inputs"

ChartJS.register(...registerables)

function App() {
  const [activeTab, setActiveTab] = useState<"data" | "config">("data")

  const [inputText, setInputText] = useState(
    JSON.stringify(EXAMPLE_DATA, null, 2)
  )

  const inputData = useMemo(() => {
    const data = tryParseInputData(inputText)
    return processInput(data)
  }, [inputText])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="border-b border-gray-200 dark:border-gray-700">
      </div>
      <TabLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "data" ? (
          <DataInput
            value={inputText}
            onChange={(data) => setInputText(data)}
            fields={inputData.fields}
          />
        ) : (
          <ChartingPage inputData={inputData} />
        )}
      </TabLayout>
    </div>
  )
}

export default App

function tryParseInputData(input: string) {
  console.log("input", input)
  try {
    // Try parsing as JSON first
    const jsonData = JSON.parse(input) as InputRecord[]

    return jsonData
  } catch {
    let result: InputRecord[] = []
    // If JSON parsing fails, try CSV
    Papa.parse(input, {
      complete: (results) => {
        result = results.data as InputRecord[]
      },
      header: true,
    })

    return result
  }
}
