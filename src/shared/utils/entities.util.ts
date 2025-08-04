import { FindOptionsWhere, FindOptionsWhereProperty, ILike } from 'typeorm';

export const genSimpleWhere = <T>(
  query: string,
  fields: string,
  defaultWhere: FindOptionsWhere<T> = {},
): FindOptionsWhere<T> | FindOptionsWhere<T>[] => {
  const clauses = fields
    .split(',')
    .map((f) => ({ ...defaultWhere, [f.trim()]: ILike(`%${query}%`) }));
  return clauses.length === 1 ? clauses[0] : clauses;
};

export const genAdvancedWhere = <T>(
  query: string,
  fields: string,
  defaultWhere: FindOptionsWhere<T> = {},
): FindOptionsWhere<T> | FindOptionsWhere<T>[] => {
  const clauses = fields.split(',').map((field) => {
    const trimmedField = field.trim();
    const fieldParts = trimmedField.split('.');

    if (fieldParts.length === 1) {
      return { ...defaultWhere, [trimmedField]: ILike(`%${query}%`) };
    }

    const nestedWhere = { ...defaultWhere };
    let current = nestedWhere;

    for (let i = 0; i < fieldParts.length - 1; i++) {
      const part = fieldParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as FindOptionsWhere<T>;
    }

    const lastPart = fieldParts[fieldParts.length - 1];
    current[lastPart] = ILike(`%${query}%`);

    return nestedWhere;
  });

  return clauses.length === 1 ? clauses[0] : clauses;
};

export const buildSearchConditions = <T>(
  searchTerm?: string,
  searchFields?: string,
  defaultWhere: FindOptionsWhere<T> = {},
): FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined => {
  if (!searchTerm || !searchFields) {
    return Object.keys(defaultWhere).length > 0 ? defaultWhere : undefined;
  }

  if (searchFields.includes('.')) {
    return genAdvancedWhere(searchTerm, searchFields, defaultWhere);
  }

  return genSimpleWhere(searchTerm, searchFields, defaultWhere);
};

export const addDateRangeCondition = <T>(
  where: FindOptionsWhere<T>,
  dateField: keyof T,
  startDate?: Date,
  endDate?: Date,
): FindOptionsWhere<T> => {
  const updatedWhere = { ...where };

  if (startDate || endDate) {
    const dateCondition: { gte?: Date; lte?: Date } = {};
    if (startDate && endDate) {
      Object.assign(dateCondition, { gte: startDate, lte: endDate });
    } else if (startDate) {
      Object.assign(dateCondition, { gte: startDate });
    } else if (endDate) {
      Object.assign(dateCondition, { lte: endDate });
    }

    updatedWhere[dateField] =
      dateCondition as unknown as keyof T extends 'toString'
        ? unknown
        : FindOptionsWhereProperty<
            NonNullable<T[keyof T]>,
            NonNullable<T[keyof T]>
          >;
  }

  return updatedWhere;
};

export const addInCondition = <T>(
  where: FindOptionsWhere<T>,
  field: keyof T,
  values?: T[keyof T][],
): FindOptionsWhere<T> => {
  if (!values || values.length === 0) {
    return where;
  }

  return {
    ...where,
    [field]:
      values.length === 1
        ? values[0]
        : ({ in: values } as FindOptionsWhereProperty<T[keyof T], T[keyof T]>),
  };
};
