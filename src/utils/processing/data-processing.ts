import { Aggregation, DataItem, Field, GroupByConfigType } from '../../types';
import { aggregateValue } from './aggregate-values';
import { groupBy } from './group-by';

// Main processing function
export function processData({
  rows,
  groupByConfig,
  aggregations,
  allFields,
}: {
  rows: DataItem[];
  groupByConfig: GroupByConfigType;
  aggregations: Aggregation[];
  allFields: Field[];
}): {
  rows: DataItem[];
  fields: Field[];
} {
  if (groupByConfig.fields.length === 0) {
    return { rows, fields: allFields };
  }

  const columns = groupByConfig.fields.map((x) => x.field);

  const groups = groupBy({ rows, groupByConfig });
  const result: DataItem[] = [];

  for (const group of groups) {
    const resultEntry = { ...group.resultEntry };
    result.push(resultEntry);

    for (const aggregation of aggregations) {
      const value = aggregateValue(group.entriesInGroup, aggregation);
      resultEntry[aggregation.key] = value;
    }
  }

  for (const aggregation of aggregations) {
    columns.push({
      isNullable: false,
      name: aggregation.key,
      type: 'number',
    });
  }

  return {
    rows: result,
    fields: columns,
  };
}
