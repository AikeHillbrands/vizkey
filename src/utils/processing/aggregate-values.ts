import { Aggregation, DataItem } from '../../types';
// Helper function to calculate aggregation values
export function aggregateValue(entries: DataItem[], aggregation: Aggregation) {
  let total = 0;
  let count = 0;
  let min = Infinity;
  let max = -Infinity;

  for (const entry of entries) {
    const value = entry[aggregation.field.name];
    if (typeof value !== 'number') {
      throw new Error(`Invalid value type for aggregation field ${aggregation.field.name}`);
    }

    count++;
    total += value;
    min = Math.min(min, value);
    max = Math.max(max, value);
  }

  const value = ((): number => {
    switch (aggregation.type) {
      case 'sum':
        return total;
      case 'max':
        return max;
      case 'min':
        return min;
      case 'count':
        return count;
      case 'average':
        return total / count;
    }
  })();

  return value;
}
