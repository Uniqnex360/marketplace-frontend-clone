import { getCurrencySymbol } from './currencySymbol';

export const formatCurrency = (value, country = 'US') => {
  const currencySymbol = getCurrencySymbol(country);
  return `${currencySymbol}${(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};