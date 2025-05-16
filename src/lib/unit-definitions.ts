
// src/lib/unit-definitions.ts
import { Ruler, Maximize, Box, Scale, Thermometer, Clock, DollarSign, Globe, Flame, Binary, Compass, Gauge, Compress, Bolt } from 'lucide-react';
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
      { id: 'celsius', name: 'Celsius', symbol: '°C', baseFactor: 0 },
      { id: 'fahrenheit', name: 'Fahrenheit', symbol: '°F', baseFactor: 0 },
      { id: 'kelvin', name: 'Kelvin', symbol: 'K', baseFactor: 0 },
    ],
    conversionFormula: temperatureConversion,
  },
  {
    id: 'time_duration', // Renamed from 'time' to avoid confusion with 'timezone'
    name: 'Time (Duration)',
    icon: Clock,
    baseUnit: 'second',
    units: [
      { id: 'second', name: 'Second', symbol: 's', baseFactor: 1 },
      { id: 'minute', name: 'Minute', symbol: 'min', baseFactor: 60 },
      { id: 'hour', name: 'Hour', symbol: 'hr', baseFactor: 3600 },
      { id: 'day', name: 'Day', symbol: 'd', baseFactor: 86400 },
      { id: 'week', name: 'Week', symbol: 'wk', baseFactor: 604800 },
      { id: 'month', name: 'Month (30d)', symbol: 'mo', baseFactor: 2592000 }, // Approx.
      { id: 'year', name: 'Year (365d)', symbol: 'yr', baseFactor: 31536000 }, // Approx.
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'timezone',
    name: 'Time Zone',
    icon: Globe,
    baseUnit: 'utc', 
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
    id: 'currency', 
    name: 'Currency',
    icon: DollarSign,
    baseUnit: 'usd', // Note: Static factors, not live rates
    units: [
      { id: 'usd', name: 'US Dollar', symbol: 'USD', baseFactor: 1 },
      { id: 'eur', name: 'Euro', symbol: 'EUR', baseFactor: 0.92 }, // Example rate
      { id: 'gbp', name: 'British Pound', symbol: 'GBP', baseFactor: 0.79 }, // Example rate
      { id: 'jpy', name: 'Japanese Yen', symbol: 'JPY', baseFactor: 150.0 }, // Example rate
      { id: 'cad', name: 'Canadian Dollar', symbol: 'CAD', baseFactor: 1.35 }, // Example rate
      { id: 'aud', name: 'Australian Dollar', symbol: 'AUD', baseFactor: 1.50 }, // Example rate
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: Flame,
    baseUnit: 'joule',
    units: [
      { id: 'joule', name: 'Joule', symbol: 'J', baseFactor: 1 },
      { id: 'kilojoule', name: 'Kilojoule', symbol: 'kJ', baseFactor: 1000 },
      { id: 'calorie', name: 'Calorie (th)', symbol: 'cal', baseFactor: 4.184 },
      { id: 'kilocalorie', name: 'Kilocalorie (Cal)', symbol: 'kcal', baseFactor: 4184 },
      { id: 'watt_hour', name: 'Watt-hour', symbol: 'Wh', baseFactor: 3600 },
      { id: 'kilowatt_hour', name: 'Kilowatt-hour', symbol: 'kWh', baseFactor: 3.6e6 },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', baseFactor: 1055.06 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'data_transfer_rate',
    name: 'Data Rate',
    icon: Binary,
    baseUnit: 'bps',
    units: [
      { id: 'bps', name: 'Bits per second', symbol: 'bps', baseFactor: 1 },
      { id: 'kbps', name: 'Kilobits per second', symbol: 'kbps', baseFactor: 1e3 },
      { id: 'mbps', name: 'Megabits per second', symbol: 'Mbps', baseFactor: 1e6 },
      { id: 'gbps', name: 'Gigabits per second', symbol: 'Gbps', baseFactor: 1e9 },
      { id: 'Bps', name: 'Bytes per second', symbol: 'B/s', baseFactor: 8 },
      { id: 'kBps', name: 'Kilobytes per second', symbol: 'kB/s', baseFactor: 8 * 1e3 },
      { id: 'mBps', name: 'Megabytes per second', symbol: 'MB/s', baseFactor: 8 * 1e6 },
      { id: 'gBps', name: 'Gigabytes per second', symbol: 'GB/s', baseFactor: 8 * 1e9 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'angle',
    name: 'Angle',
    icon: Compass,
    baseUnit: 'radian',
    units: [
      { id: 'radian', name: 'Radian', symbol: 'rad', baseFactor: 1 },
      { id: 'degree', name: 'Degree', symbol: '°', baseFactor: Math.PI / 180 },
      { id: 'gradian', name: 'Gradian', symbol: 'grad', baseFactor: Math.PI / 200 },
      { id: 'revolution', name: 'Revolution', symbol: 'rev', baseFactor: 2 * Math.PI },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: Gauge,
    baseUnit: 'mps', // meters per second
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', baseFactor: 1 },
      { id: 'kmph', name: 'Kilometers per hour', symbol: 'km/h', baseFactor: 1 / 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', baseFactor: 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', baseFactor: 0.514444 },
      { id: 'fps', name: 'Feet per second', symbol: 'fps', baseFactor: 0.3048 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: Compress,
    baseUnit: 'pascal',
    units: [
      { id: 'pascal', name: 'Pascal', symbol: 'Pa', baseFactor: 1 },
      { id: 'kilopascal', name: 'Kilopascal', symbol: 'kPa', baseFactor: 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', baseFactor: 1e5 },
      { id: 'psi', name: 'Pounds per sq. inch', symbol: 'psi', baseFactor: 6894.76 },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', baseFactor: 101325 },
      { id: 'mmhg', name: 'Millimeters of Mercury', symbol: 'mmHg', baseFactor: 133.322 },
    ],
    conversionFormula: standardConversion,
  },
  {
    id: 'power',
    name: 'Power',
    icon: Bolt,
    baseUnit: 'watt',
    units: [
      { id: 'watt', name: 'Watt', symbol: 'W', baseFactor: 1 },
      { id: 'kilowatt', name: 'Kilowatt', symbol: 'kW', baseFactor: 1000 },
      { id: 'megawatt', name: 'Megawatt', symbol: 'MW', baseFactor: 1e6 },
      { id: 'hp', name: 'Horsepower (mech)', symbol: 'hp', baseFactor: 745.7 },
      { id: 'ft_lb_s', name: 'Foot-pounds per second', symbol: 'ft·lb/s', baseFactor: 1.35582 },
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
  
  if (categoryId !== 'timezone') {
      const numericValue = parseFloat(inputValue);
      // Allow empty string to clear output, but not as valid "0" for conversion unless explicitly "0"
      if (isNaN(numericValue) && inputValue.trim() !== "") return "Invalid input value: not a number";
      if (!isFinite(numericValue) && inputValue.trim() !== "") return "Invalid input value: not finite";
       // If input is empty string, and not timezone, treat as "no input" rather than error
      if (inputValue.trim() === "" && categoryId !== 'timezone') return "";
  }


  if (category.conversionFormula) {
    return category.conversionFormula(inputValue, fromUnit, toUnit, category);
  }
  
  const numericValue = parseFloat(inputValue);
  if (isNaN(numericValue)) return "Invalid input value for fallback";
  return (numericValue * fromUnit.baseFactor) / toUnit.baseFactor;
}

    