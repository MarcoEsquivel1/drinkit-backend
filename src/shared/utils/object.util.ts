export const hasProperty = (
  obj: Record<string, unknown>,
  key: string,
): boolean => {
  return (obj !== null &&
    obj !== undefined &&
    Object.prototype.hasOwnProperty.call(obj, key)) as boolean;
};

export const makeChunksFromArray = (
  arr: Array<any>,
  chunkSize: number,
): any[][] => {
  const result: any[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
};

export const getUniques = (
  value: any,
  index: number,
  array: Array<any>,
): boolean => array.indexOf(value) === index;

export const removeDuplicates = <T>(array: T[]): T[] => {
  return array.filter(getUniques);
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K,
): Record<string, T[]> => {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
};

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc',
): T[] => {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const pickProperties = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (hasProperty(obj, key as string)) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omitProperties = <T, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (Array.isArray(obj)) return obj.map(deepClone) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key as keyof T] = deepClone(obj[key as keyof T]);
      }
    }
    return clonedObj;
  }
  return obj;
};

export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const isNotEmpty = (value: any): boolean => {
  return !isEmpty(value);
};

export const flattenArray = <T>(arr: (T | T[])[]): T[] => {
  const result: T[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item));
    } else {
      result.push(item);
    }
  }

  return result;
};

export const findByProperty = <T>(
  array: T[],
  key: keyof T,
  value: any,
): T | undefined => {
  return array.find((item) => item[key] === value);
};

export const filterByProperty = <T>(
  array: T[],
  key: keyof T,
  value: any,
): T[] => {
  return array.filter((item) => item[key] === value);
};

export const sumByProperty = <T>(array: T[], key: keyof T): number => {
  return array.reduce((sum, item) => {
    const value = Number(item[key]);
    return sum + (isNaN(value) ? 0 : value);
  }, 0);
};

export const getUniqueByProperty = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const mergeObjects = <T extends object, U extends object>(
  obj1: T,
  obj2: U,
): T & U => {
  return { ...obj1, ...obj2 };
};

export const convertToQueryParams = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value != null && value !== '') {
      params.append(key, String(value));
    }
  });

  return params.toString();
};
