import { InputValue, FieldType, DataValue } from '../types';

export type FieldDetection = {
  stringFounds: number;
  numberFounds: number;
  booleanFounds: number;
  dateFounds: number;
  nullFounds: number;
  totalValues: number;
};

export function getFieldType(field: FieldDetection): {
  type: FieldType;
  isNullable: boolean;
  parse: (value: InputValue) => DataValue;
} {
  const isNullable = field.nullFounds > 0;
  if (field.totalValues === field.booleanFounds)
    return {
      type: 'boolean',
      isNullable,
      parse: (value) => Boolean(value),
    };

  if (field.totalValues === field.numberFounds) {
    return {
      type: 'number',
      isNullable,
      parse: (value) => Number(value),
    };
  }

  if (field.totalValues === field.dateFounds) {
    return {
      type: 'date',
      isNullable,
      parse: (value) => {
        const date = new Date(value as string);

        if (isNaN(date.getTime())) {
          return null;
        }

        return date;
      },
    };
  }

  return {
    type: 'string',
    isNullable,
    parse: (value) => String(value),
  };
}

export function detectValue(value: InputValue, fieldDetection: FieldDetection): void {
  if (value === null || value === undefined || value === '') {
    fieldDetection.nullFounds++;
    return;
  }

  fieldDetection.totalValues++;

  if (typeof value === 'boolean') {
    fieldDetection.booleanFounds++;
    return;
  }

  if (typeof value === 'number') {
    fieldDetection.numberFounds++;
    return;
  }

  if (typeof value === 'string') {
    if (value.match(/^\d+$/) || value.match(/^\d+\.\d+$/)) {
      fieldDetection.numberFounds++;
      return;
    }

    if (!isNaN(new Date(value).getTime())) {
      fieldDetection.dateFounds++;
    }

    if (value === 'true') {
      fieldDetection.booleanFounds++;
    }

    if (value === 'false') {
      fieldDetection.booleanFounds++;
    }

    if (value.match(/^\d+$/)) {
      fieldDetection.numberFounds++;
    }

    fieldDetection.stringFounds++;
  }
}
