
// src/lib/unit-definitions.ts
import { Ruler, Maximize, Box, Scale, Thermometer, Clock, DollarSign, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  baseFactor: number; // Factor to convert to base unit, or UTC offset for timezones
}

export interface UnitCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  baseUnit: string; // ID of the base unit for this category
  units: Unit[];
  // Takes raw string input, from unit, to unit, and category details.
  // Formula is responsible for parsing inputValue if it's numeric.
  conversionFormula: (inputValue: string, fromUnit: Unit, toUnit: Unit, categoryDetails: UnitCategory) => number | string;
}

// Standard formula for most numeric conversions
const standardConversion = (inputValue: string, fromUnit: Unit, toUnit: Unit): number | string => {
  const numericValue = parseFloat(inputValue);
  if (isNaN(numericValue) || !isFinite(numericValue)) return "Invalid input";
  if (toUnit.baseFactor === 0 && fromUnit.baseFactor !== 0 && numericValue !==0) { // Avoid division by zero if toFactor is 0 but not fromFactor
      if (fromUnit.baseFactor === 0 && numericValue === 0) return 0; // 0 of anything is 0 of something else
      return "Cannot divide by zero in conversion";
  }
  if (toUnit.baseFactor === 0 && fromUnit.baseFactor === 0) return numericValue; // e.g. 0m to 0km

  return (numericValue * fromUnit.baseFactor) / toUnit.baseFactor;
};

// Temperature conversion formula
const temperatureConversion = (inputValue: string, fromUnit: Unit, toUnit: Unit): number | string => {
  const value = parseFloat(inputValue);
  if (isNaN(value) || !isFinite(value)) return "Invalid input";

  if (fromUnit.id === toUnit.id) return value;

  let celsiusValue: number;
  switch (fromUnit.id) {
    case 'celsius':
      celsiusValue = value;
      break;
    case 'fahrenheit':
      celsiusValue = (value - 32) * 5 / 9;
      break;
    case 'kelvin':
      celsiusValue = value - 273.15;
      break;
    default:
      return "Unknown temperature unit";
  }

  switch (toUnit.id) {
    case 'celsius':
      return celsiusValue;
    case 'fahrenheit':
      return (celsiusValue * 9 / 5) + 32;
    case 'kelvin':
      return celsiusValue + 273.15;
    default:
      return "Unknown temperature unit";
  }
};

// Timezone conversion formula
const timezoneConversion = (inputValue: string, fromUnit: Unit, toUnit: Unit): string => {
  if (!/^\d{2}:\d{2}$/.test(inputValue)) return "Invalid time format (HH:MM)";

  const [hours, minutes] = inputValue.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return "Invalid time value";
  }

  const fromOffset = fromUnit.baseFactor; // UTC offset in hours
  const toOffset = toUnit.baseFactor;

  // Calculate input time in UTC hours
  // Example: Input 10:00 EST (fromOffset -5). UTC hours = 10 - (-5) = 15.
  let utcHours = hours - fromOffset;

  // Convert this UTC time to the target timezone's local hours
  // Example: 15 UTC to PST (toOffset -8). Target hours = 15 + (-8) = 7.
  let targetLocalHours = utcHours + toOffset;

  // Normalize targetLocalHours to be within 0-23, handling day rollovers
  targetLocalHours = (targetLocalHours % 24 + 24) % 24;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(targetLocalHours)}:${pad(minutes)}`;
};


export const unitCategories: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    icon: Ruler,
    baseUnit: 'meter',
    units: [
      { id: 'meter', name: 'Meter', symbol: 'm', baseFactor: 1 },
      { id: 'kilometer', name: 'Kilometer', symbol: 'km', baseFactor: 1000 },
      { id: 'centimeter', name: 'Centimeter', symbol: 'cm', baseFactor: 0.01 },
      { id: 'millimeter', name: 'Millimeter', symbol: 'mm', baseFactor: 0.001 },
      { id: 'mile', name: 'Mile', symbol: 'mi', baseFactor: 1609.34 },
      { id: 'yard', name: 'Yard', symbol: 'yd', baseFactor: 0.9144 },
      { id: 'foot', name: 'Foot', symbol: 'ft', baseFactor: 0.3048 },
      { id: 'inch', name: 'Inch', symbol: 'in', baseFactor: 0.0254 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'area',
    name: 'Area',
    icon: Maximize,
    baseUnit: 'sq_meter',
    units: [
      { id: 'sq_meter', name: 'Square Meter', symbol: 'm²', baseFactor: 1 },
      { id: 'sq_kilometer', name: 'Square Kilometer', symbol: 'km²', baseFactor: 1e6 },
      { id: 'hectare', name: 'Hectare', symbol: 'ha', baseFactor: 1e4 },
      { id: 'sq_foot', name: 'Square Foot', symbol: 'ft²', baseFactor: 0.092903 },
      { id: 'acre', name: 'Acre', symbol: 'acre', baseFactor: 4046.86 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: Box,
    baseUnit: 'liter',
    units: [
      { id: 'liter', name: 'Liter', symbol: 'L', baseFactor: 1 },
      { id: 'milliliter', name: 'Milliliter', symbol: 'mL', baseFactor: 0.001 },
      { id: 'cubic_meter', name: 'Cubic Meter', symbol: 'm³', baseFactor: 1000 },
      { id: 'gallon_us', name: 'US Gallon', symbol: 'gal', baseFactor: 3.78541 },
      { id: 'pint_us', name: 'US Pint', symbol: 'pt', baseFactor: 0.473176 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'mass',
    name: 'Mass',
    icon: Scale,
    baseUnit: 'kilogram',
    units: [
      { id: 'kilogram', name: 'Kilogram', symbol: 'kg', baseFactor: 1 },
      { id: 'gram', name: 'Gram', symbol: 'g', baseFactor: 0.001 },
      { id: 'milligram', name: 'Milligram', symbol: 'mg', baseFactor: 1e-6 },
      { id: 'pound', name: 'Pound', symbol: 'lb', baseFactor: 0.453592 },
      { id: 'ounce', name: 'Ounce', symbol: 'oz', baseFactor: 0.0283495 },
      { id: 'tonne', name: 'Metric Tonne', symbol: 't', baseFactor: 1000 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    baseUnit: 'celsius',
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C', baseFactor: 0 }, // baseFactor not directly used by its formula in the standard way
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', baseFactor: 0 },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', baseFactor: 0 },
    ],
    conversionFormula: temperatureConversion,
  },
  {
    id: 'time',
    name: 'Time (Duration)', // Renamed for clarity vs Time Zone
    icon: Clock,
    baseUnit: 'second',
    units: [
      { id: 'second', name: 'Second', symbol: 's', baseFactor: 1 },
      { id: 'minute', name: 'Minute', symbol: 'min', baseFactor: 60 },
      { id: 'hour', name: 'Hour', symbol: 'hr', baseFactor: 3600 },
      { id: 'day', name: 'Day', symbol: 'd', baseFactor: 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', baseFactor: 604800 },
      { id: 'month', name: 'Month (30d)', symbol: 'mo', baseFactor: 2592000 },
      { id: 'year', name: 'Year (365d)', symbol: 'yr', baseFactor: 31536000 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'timezone',
    name: 'Time Zone',
    icon: Globe,
    baseUnit: 'utc', // Conceptually, as offsets are relative to UTC
    units: [
      { id: 'utc', name: 'Coordinated Universal Time', symbol: 'UTC', baseFactor: 0 },
      { id: 'gmt', name: 'Greenwich Mean Time', symbol: 'GMT', baseFactor: 0 },
      { id: 'est', name: 'Eastern Standard Time (US)', symbol: 'EST', baseFactor: -5 },
      { id: 'edt', name: 'Eastern Daylight Time (US)', symbol: 'EDT', baseFactor: -4 },
      { id: 'cst', name: 'Central Standard Time (US)', symbol: 'CST', baseFactor: -6 },
      { id: 'cdt', name: 'Central Daylight Time (US)', symbol: 'CDT', baseFactor: -5 },
      { id: 'mst', name: 'Mountain Standard Time (US)', symbol: 'MST', baseFactor: -7 },
      { id: 'mdt', name: 'Mountain Daylight Time (US)', symbol: 'MDT', baseFactor: -6 },
      { id: 'pst', name: 'Pacific Standard Time (US)', symbol: 'PST', baseFactor: -8 },
      { id: 'pdt', name: 'Pacific Daylight Time (US)', symbol: 'PDT', baseFactor: -7 },
      { id: 'cet', name: 'Central European Time', symbol: 'CET', baseFactor: 1 },
      { id: 'cest', name: 'Central European Summer Time', symbol: 'CEST', baseFactor: 2 },
      { id: 'jst', name: 'Japan Standard Time', symbol: 'JST', baseFactor: 9 },
      { id: 'aest', name: 'Australian Eastern Standard Time', symbol: 'AEST', baseFactor: 10 },
      { id: 'aedt', name: 'Australian Eastern Daylight Time', symbol: 'AEDT', baseFactor: 11 },
    ],
    conversionFormula: timezoneConversion,
  },
  {
    id: 'currency', // Placeholder, requires API for real rates
    name: 'Currency',
    icon: DollarSign,
    baseUnit: 'usd',
    units: [
      { id: 'usd', name: 'US Dollar', symbol: 'USD', baseFactor: 1 },
      { id: 'eur', name: 'Euro', symbol: 'EUR', baseFactor: 0.92 },
      { id: 'gbp', name: 'British Pound', symbol: 'GBP', baseFactor: 0.79 },
      { id: 'jpy', name: 'Japanese Yen', symbol: 'JPY', baseFactor: 150.0 },
    ],
    conversionFormula: standardConversion,
  },
];

export const findCategory = (categoryId: string) => unitCategories.find(c => c.id === categoryId);
export const findUnit = (category: UnitCategory, unitId: string) => category.units.find(u => u.id === unitId);

export function convertUnits(inputValue: string, fromUnitId: string, toUnitId: string, categoryId: string): number | string {
  const category = findCategory(categoryId);
  if (!category) return "Invalid category";

  const fromUnit = findUnit(category, fromUnitId);
  const toUnit = findUnit(category, toUnitId);

  if (!fromUnit || !toUnit) return "Invalid unit";
  
  // For all categories except timezone, basic validation for numeric input string can be done here.
  // Timezone has its own HH:MM format check within its formula.
  if (categoryId !== 'timezone') {
      const numericValue = parseFloat(inputValue);
      if (isNaN(numericValue) && inputValue.trim() !== "") return "Invalid input value: not a number";
      if (!isFinite(numericValue) && inputValue.trim() !== "") return "Invalid input value: not finite";
  }


  if (category.conversionFormula) {
    return category.conversionFormula(inputValue, fromUnit, toUnit, category);
  }
  
  // Fallback, though all categories should have a formula.
  // This fallback implicitly uses standardConversion logic.
  const numericValue = parseFloat(inputValue);
  if (isNaN(numericValue)) return "Invalid input value for fallback";
  return (numericValue * fromUnit.baseFactor) / toUnit.baseFactor;
}

  