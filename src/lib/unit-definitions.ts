// src/lib/unit-definitions.ts
import { Ruler, Maximize, Box, Scale, Thermometer, Clock, DollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  baseFactor: number; // Factor to convert from this unit to the base unit of the category
}

export interface UnitCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  baseUnit: string; // ID of the base unit for this category
  units: Unit[];
  conversionFormula?: (value: number, fromFactor: number, toFactor: number, fromUnitId?: string, toUnitId?: string) => number;
}

const standardConversion = (value: number, fromFactor: number, toFactor: number) => (value * fromFactor) / toFactor;

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
    icon: Maximize, // Using Maximize as a stand-in for area/square
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
    id: 'mass', // Changed from weight to mass for scientific correctness
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
    baseUnit: 'celsius', // Base unit for internal consistency, though direct formulas are used.
    units: [
      { id: 'celsius', name: 'Celsius', symbol: '°C', baseFactor: 1 }, // baseFactor not used in standard way
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', baseFactor: 1 },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', baseFactor: 1 },
    ],
    conversionFormula: (value, _fromFactor, _toFactor, fromUnitId, toUnitId) => {
      if (fromUnitId === toUnitId) return value;
      // Convert to Celsius first, then to target
      let celsiusValue: number;
      if (fromUnitId === 'celsius') celsiusValue = value;
      else if (fromUnitId === 'fahrenheit') celsiusValue = (value - 32) * 5/9;
      else if (fromUnitId === 'kelvin') celsiusValue = value - 273.15;
      else return NaN; // Unknown fromUnit

      if (toUnitId === 'celsius') return celsiusValue;
      if (toUnitId === 'fahrenheit') return (celsiusValue * 9/5) + 32;
      if (toUnitId === 'kelvin') return celsiusValue + 273.15;
      return NaN; // Unknown toUnit
    },
  },
  {
    id: 'time',
    name: 'Time',
    icon: Clock,
    baseUnit: 'second',
    units: [
      { id: 'second', name: 'Second', symbol: 's', baseFactor: 1 },
      { id: 'minute', name: 'Minute', symbol: 'min', baseFactor: 60 },
      { id: 'hour', name: 'Hour', symbol: 'hr', baseFactor: 3600 },
      { id: 'day', name: 'Day', symbol: 'd', baseFactor: 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', baseFactor: 604800 },
      { id: 'month', name: 'Month (30d)', symbol: 'mo', baseFactor: 2592000 }, // Approximation
      { id: 'year', name: 'Year (365d)', symbol: 'yr', baseFactor: 31536000 }, // Approximation
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'currency',
    name: 'Currency',
    icon: DollarSign,
    baseUnit: 'usd', // Example base, actual rates would be dynamic
    units: [
      // Placeholder: Currency requires real-time API for accurate rates.
      // These are for UI demonstration only.
      { id: 'usd', name: 'US Dollar', symbol: 'USD', baseFactor: 1 },
      { id: 'eur', name: 'Euro', symbol: 'EUR', baseFactor: 0.92 }, // Example static rate
      { id: 'gbp', name: 'British Pound', symbol: 'GBP', baseFactor: 0.79 }, // Example static rate
      { id: 'jpy', name: 'Japanese Yen', symbol: 'JPY', baseFactor: 150.0 }, // Example static rate
    ],
    conversionFormula: standardConversion, // This will use the static baseFactors above.
  },
];

export const findCategory = (categoryId: string) => unitCategories.find(c => c.id === categoryId);
export const findUnit = (category: UnitCategory, unitId: string) => category.units.find(u => u.id === unitId);

export function convertUnits(value: number, fromUnitId: string, toUnitId: string, categoryId: string): number | string {
  const category = findCategory(categoryId);
  if (!category) return "Invalid category";

  const fromUnit = findUnit(category, fromUnitId);
  const toUnit = findUnit(category, toUnitId);

  if (!fromUnit || !toUnit) return "Invalid unit";
  if (isNaN(value) || !isFinite(value)) return "Invalid input value";

  if (category.conversionFormula) {
    return category.conversionFormula(value, fromUnit.baseFactor, toUnit.baseFactor, fromUnit.id, toUnit.id);
  }
  // Fallback for categories without a custom formula (should not happen if defined properly)
  return (value * fromUnit.baseFactor) / toUnit.baseFactor;
}
