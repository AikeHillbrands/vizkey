import { DataItem, GroupByConfig } from '../types'

export const processData = (
  data: DataItem[],
  groupByConfig: GroupByConfig
): DataItem[] => {
  // If no grouping, return raw data
  if (groupByConfig.fields.length === 0) {
    return data
  }

  // Apply grouping
  const groupedData = data.reduce((acc, item) => {
    const groupKey = groupByConfig.fields.map(field => String(item[field])).join('_')
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {} as Record<string, DataItem[]>)

  return Object.entries(groupedData).map(([key, items]) => {
    const result: DataItem = {}
    groupByConfig.fields.forEach((field, index) => {
      result[field] = key.split('_')[index]
    })
    return result
  })
} 