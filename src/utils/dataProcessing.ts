import { Aggregation, DataItem, GroupByConfig } from "../types"


export const processData = ({
  data,
  groupByConfig,
  aggregations,
}: {
  data: DataItem[]
  groupByConfig: GroupByConfig
  aggregations: Aggregation[]
}): DataItem[] => {
  // If no grouping, return raw data
  if (groupByConfig.fields.length === 0) {
    return data
  }

  // Apply grouping
  const groupedData: Record<
    string,
    { resultEntry: DataItem; entriesInGroup: DataItem[] }
  > = {}

  // Group the data
  for (const item of data) {
    const groupKey = groupByConfig.fields
      .map((field) => String(item[field]))
      .join("_")

    groupedData[groupKey] ??= {
      resultEntry: {},
      entriesInGroup: [],
    }

    for (const field of groupByConfig.fields) {
      groupedData[groupKey].resultEntry[field] = item[field]
    }

    groupedData[groupKey].entriesInGroup.push(item)
  }

  const result: DataItem[] = []

  for (const group of Object.values(groupedData)) {
    for (const aggregation of aggregations) {
      let total = 0
      let count = 0
      let min = Infinity
      let max = -Infinity

      for (const entry of group.entriesInGroup) {
        const value = entry[aggregation.field]

        if (typeof value !== "number") {
          throw new Error(
            `Invalid value type for aggregation field ${aggregation.field}`
          )
        }

        count++
        total += value
        min = Math.min(min, value)
        max = Math.max(max, value)
      }

      switch (aggregation.type) {
        case "sum":
          group.resultEntry[`sum(${aggregation.field})`] = total
          break
        case "max":
          group.resultEntry[`max(${aggregation.field})`] = max
          break
        case "min":
          group.resultEntry[`min(${aggregation.field})`] = min
          break
        case "count":
          group.resultEntry[`count(${aggregation.field})`] = count
          break
        case "average":
          group.resultEntry[`average(${aggregation.field})`] = total / count
          break
      }
    }

    result.push(group.resultEntry)
  }

  return result
}
