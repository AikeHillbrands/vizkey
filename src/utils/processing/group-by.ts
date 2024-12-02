import { DataItem, GroupByConfigType, GroupByField } from "../../types"
import { truncateDate } from "../truncate-date"

export interface GroupData {
  resultEntry: DataItem
  entriesInGroup: DataItem[]
}

// Main grouping function
export function groupBy({
  rows,
  groupByConfig,
}: {
  rows: DataItem[]
  groupByConfig: GroupByConfigType
}) {
  const groupedData: Record<string, GroupData> = {}

  for (const item of rows) {
    const groupKey = groupByConfig.fields
      .map((field) => getGroupingKey(item, field))
      .join("_")

    groupedData[groupKey] ??= {
      resultEntry: {},
      entriesInGroup: [],
    }

    // Create result entry with grouped fields
    const resultEntry: DataItem = {}
    for (const field of groupByConfig.fields) {
      const value = getGroupingKey(item, field)
      resultEntry[field.field.name] = value
    }

    groupedData[groupKey].resultEntry = {
      ...groupedData[groupKey].resultEntry,
      ...resultEntry,
    }
    groupedData[groupKey].entriesInGroup.push(item)
  }

  return Object.values(groupedData)
}

function getGroupingKey(item: DataItem, groupByField: GroupByField): string {
  const value = item[groupByField.field.name]
  if (groupByField.field.type === "date") {
    return (
      truncateDate(
        value as Date | null,
        groupByField.truncation ?? "exact"
      )?.toISOString() ?? "null"
    )
  }
  return String(value)
}
