import currency from 'currency.js';

const defaultOptions = { precision: 6 };

export const calculate = {
  add: (
    firstValue: number | string,
    secondValue: number | string,
    options = defaultOptions,
  ): number => {
    return currency(firstValue, options).add(secondValue).value;
  },

  subtract: (
    firstValue: number | string,
    secondValue: number | string,
    options = defaultOptions,
  ): number => {
    return currency(firstValue, options).subtract(secondValue).value;
  },

  multiply: (
    firstValue: number | string,
    secondValue: number | string,
    options = defaultOptions,
  ): number => {
    return currency(firstValue, options).multiply(secondValue).value;
  },

  divide: (
    firstValue: number | string,
    secondValue: number | string,
    options = defaultOptions,
  ): number => {
    return currency(firstValue, options).divide(secondValue).value;
  },

  toCurrency: (value: number | string, options = defaultOptions): currency => {
    return currency(value, options);
  },

  toCents: (value: number | string): string => {
    return currency(value).intValue.toString().padStart(12, '0');
  },

  toMoney: (value: number | string): string => {
    return currency(value, {
      precision: 2,
      separator: ',',
      decimal: '.',
    }).format();
  },

  fromCents: (value: string): number => {
    return currency(value, { fromCents: true }).value;
  },
};

export const formatCurrency = (
  value: number | string,
  symbol = '$',
  precision = 2,
): string => {
  return currency(value, {
    symbol,
    precision,
    separator: ',',
    decimal: '.',
  }).format();
};

export const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleanValue) || 0;
};

export const calculatePercentage = (
  value: number,
  percentage: number,
): number => {
  return calculate.multiply(value, calculate.divide(percentage, 100));
};

export const calculateDiscount = (
  price: number,
  discountPercent: number,
): number => {
  const discount = calculatePercentage(price, discountPercent);
  return calculate.subtract(price, discount);
};

export const calculateTax = (price: number, taxPercent: number): number => {
  return calculatePercentage(price, taxPercent);
};

export const calculateTotal = (price: number, taxPercent: number): number => {
  const tax = calculateTax(price, taxPercent);
  return calculate.add(price, tax);
};

export const calculateCommission = (
  amount: number,
  commissionPercent: number,
): number => {
  return calculatePercentage(amount, commissionPercent);
};

export const roundToDecimals = (value: number, decimals = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const isValidAmount = (amount: number | string): boolean => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount >= 0;
};

export const convertCentsToUnits = (cents: number): number => {
  return cents / 100;
};

export const convertUnitsToCents = (units: number): number => {
  return Math.round(units * 100);
};
