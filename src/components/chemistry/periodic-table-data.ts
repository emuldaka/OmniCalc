
// src/components/chemistry/periodic-table-data.ts

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number | string; // String for ranges like some heavy elements
  electronConfiguration: string;
  electronegativity: number | null; // Pauling scale, null if not applicable/defined
  ionizationEnergies: number[]; // First, second, etc., in kJ/mol
  oxidationStates: (string | number)[];
  boilingPointK: number | null; // Kelvin
  meltingPointK: number | null; // Kelvin
  discovery: string; // e.g., "Person (Year)" or "Ancient"
  uses: string;
  category: string; // Key for elementCategories
  row: number; // Periodic table row (period)
  column: number; // Periodic table column (group)
}

export const elementsData: ElementData[] = [
  {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hydrogen',
    atomicMass: 1.008,
    electronConfiguration: '1s¹',
    electronegativity: 2.20,
    ionizationEnergies: [1312.0],
    oxidationStates: ['+1', '-1'],
    boilingPointK: 20.271,
    meltingPointK: 13.833,
    discovery: 'Henry Cavendish (1766)',
    uses: 'Ammonia production, hydrogenation, fuel cells.',
    category: 'nonmetal',
    row: 1,
    column: 1,
  },
  {
    atomicNumber: 2,
    symbol: 'He',
    name: 'Helium',
    atomicMass: 4.0026,
    electronConfiguration: '1s²',
    electronegativity: null,
    ionizationEnergies: [2372.3],
    oxidationStates: [0],
    boilingPointK: 4.22,
    meltingPointK: 0.95, // At 2.5 MPa
    discovery: 'Pierre Janssen & Norman Lockyer (1868)',
    uses: 'Balloons, cryogenics, welding shield gas.',
    category: 'nobleGas',
    row: 1,
    column: 18,
  },
  {
    atomicNumber: 3,
    symbol: 'Li',
    name: 'Lithium',
    atomicMass: 6.94,
    electronConfiguration: '[He] 2s¹',
    electronegativity: 0.98,
    ionizationEnergies: [520.2],
    oxidationStates: ['+1'],
    boilingPointK: 1615,
    meltingPointK: 453.65,
    discovery: 'Johan August Arfwedson (1817)',
    uses: 'Batteries, ceramics, grease.',
    category: 'alkaliMetal',
    row: 2,
    column: 1,
  },
  {
    atomicNumber: 6,
    symbol: 'C',
    name: 'Carbon',
    atomicMass: 12.011,
    electronConfiguration: '[He] 2s² 2p²',
    electronegativity: 2.55,
    ionizationEnergies: [1086.5],
    oxidationStates: ['+4', '+2', '-4'],
    boilingPointK: 5100, // Sublimes
    meltingPointK: 3800,
    discovery: 'Ancient',
    uses: 'Basis of organic life, fuels, steel, diamonds.',
    category: 'nonmetal',
    row: 2,
    column: 14,
  },
  {
    atomicNumber: 8,
    symbol: 'O',
    name: 'Oxygen',
    atomicMass: 15.999,
    electronConfiguration: '[He] 2s² 2p⁴',
    electronegativity: 3.44,
    ionizationEnergies: [1313.9],
    oxidationStates: ['-2'],
    boilingPointK: 90.188,
    meltingPointK: 54.36,
    discovery: 'Carl Wilhelm Scheele & Joseph Priestley (1774)',
    uses: 'Respiration, combustion, steelmaking.',
    category: 'nonmetal',
    row: 2,
    column: 16,
  },
  {
    atomicNumber: 11,
    symbol: 'Na',
    name: 'Sodium',
    atomicMass: 22.990,
    electronConfiguration: '[Ne] 3s¹',
    electronegativity: 0.93,
    ionizationEnergies: [495.8],
    oxidationStates: ['+1'],
    boilingPointK: 1156,
    meltingPointK: 370.944,
    discovery: 'Humphry Davy (1807)',
    uses: 'Table salt (NaCl), streetlights, chemical synthesis.',
    category: 'alkaliMetal',
    row: 3,
    column: 1,
  },
  {
    atomicNumber: 17,
    symbol: 'Cl',
    name: 'Chlorine',
    atomicMass: 35.45,
    electronConfiguration: '[Ne] 3s² 3p⁵',
    electronegativity: 3.16,
    ionizationEnergies: [1251.2],
    oxidationStates: ['+7', '+5', '+3', '+1', '-1'],
    boilingPointK: 239.11,
    meltingPointK: 171.6,
    discovery: 'Carl Wilhelm Scheele (1774)',
    uses: 'Water purification, bleach, PVC production.',
    category: 'halogen',
    row: 3,
    column: 17,
  },
  {
    atomicNumber: 18,
    symbol: 'Ar',
    name: 'Argon',
    atomicMass: 39.948,
    electronConfiguration: '[Ne] 3s² 3p⁶',
    electronegativity: null,
    ionizationEnergies: [1520.6],
    oxidationStates: [0],
    boilingPointK: 87.302,
    meltingPointK: 83.81,
    discovery: 'Lord Rayleigh & William Ramsay (1894)',
    uses: 'Welding shield gas, lighting, lasers.',
    category: 'nobleGas',
    row: 3,
    column: 18,
  },
  // Add more elements here to expand the table
];

export const getElementBySymbol = (symbol: string): ElementData | undefined => {
  return elementsData.find(el => el.symbol === symbol);
};

export const getElementByAtomicNumber = (atomicNumber: number): ElementData | undefined => {
  return elementsData.find(el => el.atomicNumber === atomicNumber);
}
