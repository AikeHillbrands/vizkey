type ParsedDate = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function defineTruncations<
  TMap extends Record<string, { label: string; transform: (date: ParsedDate) => ParsedDate }>,
>(options: TMap) {
  return options;
}

// Date truncation function
export function truncateDate(date: Date | null, truncation: DateTruncationOption): Date | null {
  if (!date) return null;

  const inputDate = parseDate(date);

  const transformedDate = dateTruncations[truncation].transform(inputDate);

  return parsedDateToDate(transformedDate);
}

export function parseDate(date: Date): ParsedDate {
  const match =
    date.toISOString().match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}.\d{3})Z/) ?? [];

  if (!match) throw new Error('Error parsing date!');

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6]),
  };
}

export function parsedDateToDate(parsedDate: ParsedDate): Date {
  const yearString = parsedDate.year.toString();
  const monthString = parsedDate.month.toString().padStart(2, '0');
  const dayString = parsedDate.day.toString().padStart(2, '0');
  const hourString = parsedDate.hour.toString().padStart(2, '0');
  const minuteString = parsedDate.minute.toString().padStart(2, '0');
  const secondString = parsedDate.second.toFixed(3).padStart(6, '0');

  return new Date(
    `${yearString}-${monthString}-${dayString}T${hourString}:${minuteString}:${secondString}Z`
  );
}

export type DateTruncationOption = keyof typeof dateTruncations;

export const dateTruncations = defineTruncations({
  exact: {
    label: 'Exact',
    transform: (date) => date,
  },
  minute: {
    label: 'Minute',
    transform: (date) => ({
      ...date,
      second: 0,
    }),
  },
  '20minute': {
    label: '20 Minute',
    transform: (date) => ({
      ...date,
      minute: date.minute - (date.minute % 20),
      second: 0,
    }),
  },
  hour: {
    label: 'Hour',
    transform: (date) => ({
      ...date,
      hour: 0,
      minute: 0,
      second: 0,
    }),
  },
  '6hour': {
    label: '6 Hour',
    transform: (date) => ({
      ...date,
      hour: date.hour - (date.hour % 6),
      minute: 0,
      second: 0,
    }),
  },
  day: {
    label: 'Day',
    transform: (date) => ({
      ...date,
      hour: 0,
      minute: 0,
      second: 0,
    }),
  },
  month: {
    label: 'Month',
    transform: (date) => ({
      ...date,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    }),
  },
  quarter: {
    label: 'Quarter',
    transform: (date) => ({
      ...date,
      month: date.month - (date.month % 3) + 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    }),
  },
  year: {
    label: 'Year',
    transform: (date) => ({
      ...date,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    }),
  },
});
