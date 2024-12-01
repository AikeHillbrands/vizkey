import { useState } from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import Papa from 'papaparse'
import { DataInput } from './components/DataInput'
import { ConfigPanel } from './components/ConfigPanel'
import { TabLayout } from './components/TabLayout'
import { DataItem, ChartType, GroupByConfig } from './types'
import { processData } from './utils/dataProcessing'

ChartJS.register(...registerables)

function App() {
  const [activeTab, setActiveTab] = useState<'data' | 'config'>('data')
  const [chartType, setChartType] = useState<ChartType>(null)
  const [data, setData] = useState<DataItem[]>([])
  const [inputText, setInputText] = useState('')
  const [fields, setFields] = useState<string[]>([])
  const [groupByConfig, setGroupByConfig] = useState<GroupByConfig>({
    fields: []
  })

  const parseData = (input: string) => {
    try {
      // Try parsing as JSON first
      const jsonData = JSON.parse(input) as DataItem[]
      setData(jsonData)
      const newFields = Object.keys(jsonData[0])
      setFields(newFields)
      // Reset group by configs when new data is loaded
      setGroupByConfig({ fields: [] })
    } catch {
      // If JSON parsing fails, try CSV
      Papa.parse(input, {
        complete: (results) => {
          const csvData = results.data as DataItem[]
          setData(csvData)
          const newFields = Object.keys(csvData[0])
          setFields(newFields)
          // Reset group by configs when new data is loaded
          setGroupByConfig({ fields: [] })
        },
        header: true
      })
    }
  }

  const processedData = processData(data, groupByConfig)

  return (
    <TabLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'data' ? (
        <DataInput
          value={inputText}
          onChange={setInputText}
          onDataParse={parseData}
          data={data}
        />
      ) : (
        <ConfigPanel
          fields={fields}
          groupByConfigs={groupByConfig}
          onGroupByConfigsChange={setGroupByConfig}
          chartType={chartType}
          onChartTypeChange={setChartType}
          data={processedData}
        />
      )}
    </TabLayout>
  )
}

export default App
