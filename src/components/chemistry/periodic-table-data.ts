
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
  row: number; // Periodic table visual row for grid (1-9)
  column: number; // Periodic table visual column for grid (1-18)
}

export const elementsData: ElementData[] = [
  // Period 1
  {
    atomicNumber: 1, symbol: 'H', name: 'Hydrogen', atomicMass: 1.008, electronConfiguration: '1s¹', electronegativity: 2.20, ionizationEnergies: [1312.0], oxidationStates: ['+1', '-1'], boilingPointK: 20.271, meltingPointK: 13.833, discovery: 'Henry Cavendish (1766)', uses: 'Ammonia production, hydrogenation, fuel cells.', category: 'nonmetal', row: 1, column: 1,
  },
  {
    atomicNumber: 2, symbol: 'He', name: 'Helium', atomicMass: 4.002602, electronConfiguration: '1s²', electronegativity: null, ionizationEnergies: [2372.3], oxidationStates: [0], boilingPointK: 4.22, meltingPointK: 0.95, discovery: 'Pierre Janssen & Norman Lockyer (1868)', uses: 'Balloons, cryogenics, welding shield gas.', category: 'nobleGas', row: 1, column: 18,
  },
  // Period 2
  {
    atomicNumber: 3, symbol: 'Li', name: 'Lithium', atomicMass: 6.94, electronConfiguration: '[He] 2s¹', electronegativity: 0.98, ionizationEnergies: [520.2], oxidationStates: ['+1'], boilingPointK: 1615, meltingPointK: 453.65, discovery: 'Johan August Arfwedson (1817)', uses: 'Batteries, ceramics, grease.', category: 'alkaliMetal', row: 2, column: 1,
  },
  {
    atomicNumber: 4, symbol: 'Be', name: 'Beryllium', atomicMass: 9.0121831, electronConfiguration: '[He] 2s²', electronegativity: 1.57, ionizationEnergies: [899.5], oxidationStates: ['+2'], boilingPointK: 2742, meltingPointK: 1560, discovery: 'Louis Nicolas Vauquelin (1798)', uses: 'Aerospace components, X-ray windows, alloys.', category: 'alkalineEarthMetal', row: 2, column: 2,
  },
  {
    atomicNumber: 5, symbol: 'B', name: 'Boron', atomicMass: 10.81, electronConfiguration: '[He] 2s² 2p¹', electronegativity: 2.04, ionizationEnergies: [800.6], oxidationStates: ['+3'], boilingPointK: 4200, meltingPointK: 2349, discovery: 'Joseph Louis Gay-Lussac & Louis Jacques Thénard (1808)', uses: 'Borosilicate glass, semiconductors, control rods.', category: 'metalloid', row: 2, column: 13,
  },
  {
    atomicNumber: 6, symbol: 'C', name: 'Carbon', atomicMass: 12.011, electronConfiguration: '[He] 2s² 2p²', electronegativity: 2.55, ionizationEnergies: [1086.5], oxidationStates: ['+4', '+2', '-4'], boilingPointK: 5100, meltingPointK: 3800, discovery: 'Ancient', uses: 'Basis of organic life, fuels, steel, diamonds.', category: 'nonmetal', row: 2, column: 14,
  },
  {
    atomicNumber: 7, symbol: 'N', name: 'Nitrogen', atomicMass: 14.007, electronConfiguration: '[He] 2s² 2p³', electronegativity: 3.04, ionizationEnergies: [1402.3], oxidationStates: ['+5', '+4', '+3', '+2', '-3'], boilingPointK: 77.355, meltingPointK: 63.15, discovery: 'Daniel Rutherford (1772)', uses: 'Fertilizers, explosives, cryogenics.', category: 'nonmetal', row: 2, column: 15,
  },
  {
    atomicNumber: 8, symbol: 'O', name: 'Oxygen', atomicMass: 15.999, electronConfiguration: '[He] 2s² 2p⁴', electronegativity: 3.44, ionizationEnergies: [1313.9], oxidationStates: ['-2'], boilingPointK: 90.188, meltingPointK: 54.36, discovery: 'Carl Wilhelm Scheele & Joseph Priestley (1774)', uses: 'Respiration, combustion, steelmaking.', category: 'nonmetal', row: 2, column: 16,
  },
  {
    atomicNumber: 9, symbol: 'F', name: 'Fluorine', atomicMass: 18.998403163, electronConfiguration: '[He] 2s² 2p⁵', electronegativity: 3.98, ionizationEnergies: [1681.0], oxidationStates: ['-1'], boilingPointK: 85.03, meltingPointK: 53.48, discovery: 'Henri Moissan (1886)', uses: 'Toothpaste, refrigerants, Teflon production.', category: 'halogen', row: 2, column: 17,
  },
  {
    atomicNumber: 10, symbol: 'Ne', name: 'Neon', atomicMass: 20.1797, electronConfiguration: '[He] 2s² 2p⁶', electronegativity: null, ionizationEnergies: [2080.7], oxidationStates: [0], boilingPointK: 27.07, meltingPointK: 24.56, discovery: 'William Ramsay & Morris Travers (1898)', uses: 'Lighting (neon signs), lasers, cryogenics.', category: 'nobleGas', row: 2, column: 18,
  },
  // Period 3
  {
    atomicNumber: 11, symbol: 'Na', name: 'Sodium', atomicMass: 22.98976928, electronConfiguration: '[Ne] 3s¹', electronegativity: 0.93, ionizationEnergies: [495.8], oxidationStates: ['+1'], boilingPointK: 1156.090, meltingPointK: 370.944, discovery: 'Humphry Davy (1807)', uses: 'Table salt (NaCl), streetlights, chemical synthesis.', category: 'alkaliMetal', row: 3, column: 1,
  },
  {
    atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', atomicMass: 24.305, electronConfiguration: '[Ne] 3s²', electronegativity: 1.31, ionizationEnergies: [737.7], oxidationStates: ['+2'], boilingPointK: 1363, meltingPointK: 923, discovery: 'Joseph Black (1755), Humphry Davy (1808)', uses: 'Alloys, flares, antacids.', category: 'alkalineEarthMetal', row: 3, column: 2,
  },
  {
    atomicNumber: 13, symbol: 'Al', name: 'Aluminum', atomicMass: 26.9815385, electronConfiguration: '[Ne] 3s² 3p¹', electronegativity: 1.61, ionizationEnergies: [577.5], oxidationStates: ['+3'], boilingPointK: 2792, meltingPointK: 933.47, discovery: 'Hans Christian Ørsted (1825)', uses: 'Construction, packaging, aircraft parts.', category: 'postTransitionMetal', row: 3, column: 13,
  },
  {
    atomicNumber: 14, symbol: 'Si', name: 'Silicon', atomicMass: 28.085, electronConfiguration: '[Ne] 3s² 3p²', electronegativity: 1.90, ionizationEnergies: [786.5], oxidationStates: ['+4', '+2', '-4'], boilingPointK: 3538, meltingPointK: 1687, discovery: 'Jöns Jacob Berzelius (1823)', uses: 'Semiconductors, glass, sealants.', category: 'metalloid', row: 3, column: 14,
  },
  {
    atomicNumber: 15, symbol: 'P', name: 'Phosphorus', atomicMass: 30.973761998, electronConfiguration: '[Ne] 3s² 3p³', electronegativity: 2.19, ionizationEnergies: [1011.8], oxidationStates: ['+5', '+3', '-3'], boilingPointK: 553.65, meltingPointK: 317.3, discovery: 'Hennig Brand (1669)', uses: 'Fertilizers, detergents, matches.', category: 'nonmetal', row: 3, column: 15,
  },
  {
    atomicNumber: 16, symbol: 'S', name: 'Sulfur', atomicMass: 32.06, electronConfiguration: '[Ne] 3s² 3p⁴', electronegativity: 2.58, ionizationEnergies: [999.6], oxidationStates: ['+6', '+4', '+2', '-2'], boilingPointK: 717.8, meltingPointK: 388.36, discovery: 'Ancient', uses: 'Sulfuric acid production, gunpowder, vulcanization.', category: 'nonmetal', row: 3, column: 16,
  },
  {
    atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', atomicMass: 35.45, electronConfiguration: '[Ne] 3s² 3p⁵', electronegativity: 3.16, ionizationEnergies: [1251.2], oxidationStates: ['+7', '+5', '+3', '+1', '-1'], boilingPointK: 239.11, meltingPointK: 171.6, discovery: 'Carl Wilhelm Scheele (1774)', uses: 'Water purification, bleach, PVC production.', category: 'halogen', row: 3, column: 17,
  },
  {
    atomicNumber: 18, symbol: 'Ar', name: 'Argon', atomicMass: 39.948, electronConfiguration: '[Ne] 3s² 3p⁶', electronegativity: null, ionizationEnergies: [1520.6], oxidationStates: [0], boilingPointK: 87.302, meltingPointK: 83.81, discovery: 'Lord Rayleigh & William Ramsay (1894)', uses: 'Welding shield gas, lighting, lasers.', category: 'nobleGas', row: 3, column: 18,
  },
  // Period 4
  {
    atomicNumber: 19, symbol: 'K', name: 'Potassium', atomicMass: 39.0983, electronConfiguration: '[Ar] 4s¹', electronegativity: 0.82, ionizationEnergies: [418.8], oxidationStates: ['+1'], boilingPointK: 1032, meltingPointK: 336.53, discovery: 'Humphry Davy (1807)', uses: 'Fertilizers, soap, batteries.', category: 'alkaliMetal', row: 4, column: 1,
  },
  {
    atomicNumber: 20, symbol: 'Ca', name: 'Calcium', atomicMass: 40.078, electronConfiguration: '[Ar] 4s²', electronegativity: 1.00, ionizationEnergies: [589.8], oxidationStates: ['+2'], boilingPointK: 1757, meltingPointK: 1115, discovery: 'Humphry Davy (1808)', uses: 'Bones and teeth, cement, lime.', category: 'alkalineEarthMetal', row: 4, column: 2,
  },
  {
    atomicNumber: 21, symbol: 'Sc', name: 'Scandium', atomicMass: 44.955908, electronConfiguration: '[Ar] 3d¹ 4s²', electronegativity: 1.36, ionizationEnergies: [633.1], oxidationStates: ['+3'], boilingPointK: 3109, meltingPointK: 1814, discovery: 'Lars Fredrik Nilson (1879)', uses: 'High-intensity lamps, alloys.', category: 'transitionMetal', row: 4, column: 3,
  },
  {
    atomicNumber: 22, symbol: 'Ti', name: 'Titanium', atomicMass: 47.867, electronConfiguration: '[Ar] 3d² 4s²', electronegativity: 1.54, ionizationEnergies: [658.8], oxidationStates: ['+4', '+3', '+2'], boilingPointK: 3560, meltingPointK: 1941, discovery: 'William Gregor (1791)', uses: 'Aerospace alloys, pigments, artificial joints.', category: 'transitionMetal', row: 4, column: 4,
  },
  {
    atomicNumber: 23, symbol: 'V', name: 'Vanadium', atomicMass: 50.9415, electronConfiguration: '[Ar] 3d³ 4s²', electronegativity: 1.63, ionizationEnergies: [650.9], oxidationStates: ['+5', '+4', '+3', '+2'], boilingPointK: 3680, meltingPointK: 2183, discovery: 'Andrés Manuel del Río (1801)', uses: 'Steel alloys, catalysts.', category: 'transitionMetal', row: 4, column: 5,
  },
  {
    atomicNumber: 24, symbol: 'Cr', name: 'Chromium', atomicMass: 51.9961, electronConfiguration: '[Ar] 3d⁵ 4s¹', electronegativity: 1.66, ionizationEnergies: [652.9], oxidationStates: ['+6', '+3', '+2'], boilingPointK: 2944, meltingPointK: 2180, discovery: 'Louis Nicolas Vauquelin (1797)', uses: 'Stainless steel, chrome plating, pigments.', category: 'transitionMetal', row: 4, column: 6,
  },
  {
    atomicNumber: 25, symbol: 'Mn', name: 'Manganese', atomicMass: 54.938044, electronConfiguration: '[Ar] 3d⁵ 4s²', electronegativity: 1.55, ionizationEnergies: [717.3], oxidationStates: ['+7', '+4', '+3', '+2'], boilingPointK: 2334, meltingPointK: 1519, discovery: 'Carl Wilhelm Scheele & Johan Gottlieb Gahn (1774)', uses: 'Steel alloys, batteries, fertilizers.', category: 'transitionMetal', row: 4, column: 7,
  },
  {
    atomicNumber: 26, symbol: 'Fe', name: 'Iron', atomicMass: 55.845, electronConfiguration: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, ionizationEnergies: [762.5], oxidationStates: ['+3', '+2'], boilingPointK: 3134, meltingPointK: 1811, discovery: 'Ancient', uses: 'Steel production, construction, hemoglobin.', category: 'transitionMetal', row: 4, column: 8,
  },
  {
    atomicNumber: 27, symbol: 'Co', name: 'Cobalt', atomicMass: 58.933194, electronConfiguration: '[Ar] 3d⁷ 4s²', electronegativity: 1.88, ionizationEnergies: [760.4], oxidationStates: ['+3', '+2'], boilingPointK: 3200, meltingPointK: 1768, discovery: 'Georg Brandt (1735)', uses: 'Alloys, magnets, pigments (cobalt blue).', category: 'transitionMetal', row: 4, column: 9,
  },
  {
    atomicNumber: 28, symbol: 'Ni', name: 'Nickel', atomicMass: 58.6934, electronConfiguration: '[Ar] 3d⁸ 4s²', electronegativity: 1.91, ionizationEnergies: [737.1], oxidationStates: ['+3', '+2'], boilingPointK: 3186, meltingPointK: 1728, discovery: 'Axel Fredrik Cronstedt (1751)', uses: 'Stainless steel, batteries, coins.', category: 'transitionMetal', row: 4, column: 10,
  },
  {
    atomicNumber: 29, symbol: 'Cu', name: 'Copper', atomicMass: 63.546, electronConfiguration: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, ionizationEnergies: [745.5], oxidationStates: ['+2', '+1'], boilingPointK: 2835, meltingPointK: 1357.77, discovery: 'Ancient', uses: 'Electrical wiring, plumbing, coins.', category: 'transitionMetal', row: 4, column: 11,
  },
  {
    atomicNumber: 30, symbol: 'Zn', name: 'Zinc', atomicMass: 65.38, electronConfiguration: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65, ionizationEnergies: [906.4], oxidationStates: ['+2'], boilingPointK: 1180, meltingPointK: 692.68, discovery: 'Recognized pre-1500s, Andreas Sigismund Marggraf (1746)', uses: 'Galvanizing steel, alloys (brass), batteries.', category: 'transitionMetal', row: 4, column: 12,
  },
  {
    atomicNumber: 31, symbol: 'Ga', name: 'Gallium', atomicMass: 69.723, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹', electronegativity: 1.81, ionizationEnergies: [578.8], oxidationStates: ['+3'], boilingPointK: 2477, meltingPointK: 302.9146, discovery: 'Lecoq de Boisbaudran (1875)', uses: 'Semiconductors (LEDs), thermometers.', category: 'postTransitionMetal', row: 4, column: 13,
  },
  {
    atomicNumber: 32, symbol: 'Ge', name: 'Germanium', atomicMass: 72.630, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p²', electronegativity: 2.01, ionizationEnergies: [762], oxidationStates: ['+4', '+2'], boilingPointK: 3106, meltingPointK: 1211.40, discovery: 'Clemens Winkler (1886)', uses: 'Semiconductors, fiber optics, infrared optics.', category: 'metalloid', row: 4, column: 14,
  },
  {
    atomicNumber: 33, symbol: 'As', name: 'Arsenic', atomicMass: 74.921595, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p³', electronegativity: 2.18, ionizationEnergies: [947.0], oxidationStates: ['+5', '+3', '-3'], boilingPointK: 887, meltingPointK: 1090, discovery: 'Albertus Magnus (pre-1250)', uses: 'Pesticides, semiconductors (gallium arsenide).', category: 'metalloid', row: 4, column: 15,
  },
  {
    atomicNumber: 34, symbol: 'Se', name: 'Selenium', atomicMass: 78.971, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁴', electronegativity: 2.55, ionizationEnergies: [941.0], oxidationStates: ['+6', '+4', '-2'], boilingPointK: 958, meltingPointK: 494, discovery: 'Jöns Jacob Berzelius (1817)', uses: 'Photocopiers, glass manufacturing, supplements.', category: 'nonmetal', row: 4, column: 16,
  },
  {
    atomicNumber: 35, symbol: 'Br', name: 'Bromine', atomicMass: 79.904, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96, ionizationEnergies: [1139.9], oxidationStates: ['+7', '+5', '+3', '+1', '-1'], boilingPointK: 332.0, meltingPointK: 265.8, discovery: 'Antoine Jérôme Balard & Carl Jacob Löwig (1825-1826)', uses: 'Flame retardants, pesticides, water purification.', category: 'halogen', row: 4, column: 17,
  },
  {
    atomicNumber: 36, symbol: 'Kr', name: 'Krypton', atomicMass: 83.798, electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p⁶', electronegativity: 3.00, ionizationEnergies: [1350.8], oxidationStates: ['+2'], boilingPointK: 119.93, meltingPointK: 115.79, discovery: 'William Ramsay & Morris Travers (1898)', uses: 'Lighting, lasers, airport runway lights.', category: 'nobleGas', row: 4, column: 18,
  },
  // Period 5
  {
    atomicNumber: 37, symbol: 'Rb', name: 'Rubidium', atomicMass: 85.4678, electronConfiguration: '[Kr] 5s¹', electronegativity: 0.82, ionizationEnergies: [403.0], oxidationStates: ['+1'], boilingPointK: 961, meltingPointK: 312.46, discovery: 'Robert Bunsen & Gustav Kirchhoff (1861)', uses: 'Atomic clocks, photocells.', category: 'alkaliMetal', row: 5, column: 1,
  },
  {
    atomicNumber: 38, symbol: 'Sr', name: 'Strontium', atomicMass: 87.62, electronConfiguration: '[Kr] 5s²', electronegativity: 0.95, ionizationEnergies: [549.5], oxidationStates: ['+2'], boilingPointK: 1655, meltingPointK: 1050, discovery: 'Adair Crawford & William Cruickshank (1790)', uses: 'Fireworks (red color), CRT glass.', category: 'alkalineEarthMetal', row: 5, column: 2,
  },
  {
    atomicNumber: 39, symbol: 'Y', name: 'Yttrium', atomicMass: 88.90584, electronConfiguration: '[Kr] 4d¹ 5s²', electronegativity: 1.22, ionizationEnergies: [600], oxidationStates: ['+3'], boilingPointK: 3609, meltingPointK: 1799, discovery: 'Johan Gadolin (1794)', uses: 'Phosphors (TV screens), lasers, superconductors.', category: 'transitionMetal', row: 5, column: 3,
  },
  {
    atomicNumber: 40, symbol: 'Zr', name: 'Zirconium', atomicMass: 91.224, electronConfiguration: '[Kr] 4d² 5s²', electronegativity: 1.33, ionizationEnergies: [640.1], oxidationStates: ['+4'], boilingPointK: 4682, meltingPointK: 2128, discovery: 'Martin Heinrich Klaproth (1789)', uses: 'Nuclear reactors, ceramics, alloys.', category: 'transitionMetal', row: 5, column: 4,
  },
  {
    atomicNumber: 41, symbol: 'Nb', name: 'Niobium', atomicMass: 92.90637, electronConfiguration: '[Kr] 4d⁴ 5s¹', electronegativity: 1.6, ionizationEnergies: [652.1], oxidationStates: ['+5', '+3'], boilingPointK: 5017, meltingPointK: 2750, discovery: 'Charles Hatchett (1801)', uses: 'Superconducting magnets, alloys.', category: 'transitionMetal', row: 5, column: 5,
  },
  {
    atomicNumber: 42, symbol: 'Mo', name: 'Molybdenum', atomicMass: 95.96, electronConfiguration: '[Kr] 4d⁵ 5s¹', electronegativity: 2.16, ionizationEnergies: [684.3], oxidationStates: ['+6', '+4', '+3', '+2'], boilingPointK: 4912, meltingPointK: 2896, discovery: 'Carl Wilhelm Scheele (1778)', uses: 'Steel alloys, catalysts, lubricants.', category: 'transitionMetal', row: 5, column: 6,
  },
  {
    atomicNumber: 43, symbol: 'Tc', name: 'Technetium', atomicMass: '(98)', electronConfiguration: '[Kr] 4d⁵ 5s²', electronegativity: 1.9, ionizationEnergies: [702], oxidationStates: ['+7', '+4'], boilingPointK: 4538, meltingPointK: 2430, discovery: 'Carlo Perrier & Emilio Segrè (1937)', uses: 'Medical imaging (radioactive tracer).', category: 'transitionMetal', row: 5, column: 7,
  },
  {
    atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', atomicMass: 101.07, electronConfiguration: '[Kr] 4d⁷ 5s¹', electronegativity: 2.2, ionizationEnergies: [710.2], oxidationStates: ['+8', '+6', '+4', '+3'], boilingPointK: 4423, meltingPointK: 2607, discovery: 'Karl Ernst Claus (1844)', uses: 'Electrical contacts, catalysts.', category: 'transitionMetal', row: 5, column: 8,
  },
  {
    atomicNumber: 45, symbol: 'Rh', name: 'Rhodium', atomicMass: 102.90550, electronConfiguration: '[Kr] 4d⁸ 5s¹', electronegativity: 2.28, ionizationEnergies: [719.7], oxidationStates: ['+4', '+3', '+1'], boilingPointK: 3968, meltingPointK: 2237, discovery: 'William Hyde Wollaston (1803)', uses: 'Catalytic converters, jewelry plating.', category: 'transitionMetal', row: 5, column: 9,
  },
  {
    atomicNumber: 46, symbol: 'Pd', name: 'Palladium', atomicMass: 106.42, electronConfiguration: '[Kr] 4d¹⁰', electronegativity: 2.20, ionizationEnergies: [804.4], oxidationStates: ['+4', '+2'], boilingPointK: 3236, meltingPointK: 1828.05, discovery: 'William Hyde Wollaston (1803)', uses: 'Catalytic converters, jewelry, electronics.', category: 'transitionMetal', row: 5, column: 10,
  },
  {
    atomicNumber: 47, symbol: 'Ag', name: 'Silver', atomicMass: 107.8682, electronConfiguration: '[Kr] 4d¹⁰ 5s¹', electronegativity: 1.93, ionizationEnergies: [731.0], oxidationStates: ['+1'], boilingPointK: 2435, meltingPointK: 1234.93, discovery: 'Ancient', uses: 'Jewelry, silverware, photography.', category: 'transitionMetal', row: 5, column: 11,
  },
  {
    atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', atomicMass: 112.414, electronConfiguration: '[Kr] 4d¹⁰ 5s²', electronegativity: 1.69, ionizationEnergies: [867.8], oxidationStates: ['+2'], boilingPointK: 1040, meltingPointK: 594.22, discovery: 'Karl Samuel Leberecht Hermann & Friedrich Stromeyer (1817)', uses: 'Batteries, pigments, electroplating.', category: 'transitionMetal', row: 5, column: 12,
  },
  {
    atomicNumber: 49, symbol: 'In', name: 'Indium', atomicMass: 114.818, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p¹', electronegativity: 1.78, ionizationEnergies: [558.3], oxidationStates: ['+3', '+1'], boilingPointK: 2345, meltingPointK: 429.75, discovery: 'Ferdinand Reich & Hieronymous Theodor Richter (1863)', uses: 'LCD screens (ITO), solders.', category: 'postTransitionMetal', row: 5, column: 13,
  },
  {
    atomicNumber: 50, symbol: 'Sn', name: 'Tin', atomicMass: 118.710, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p²', electronegativity: 1.96, ionizationEnergies: [708.6], oxidationStates: ['+4', '+2'], boilingPointK: 2875, meltingPointK: 505.08, discovery: 'Ancient', uses: 'Solder, tin plating, alloys (bronze).', category: 'postTransitionMetal', row: 5, column: 14,
  },
  {
    atomicNumber: 51, symbol: 'Sb', name: 'Antimony', atomicMass: 121.760, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p³', electronegativity: 2.05, ionizationEnergies: [834], oxidationStates: ['+5', '+3', '-3'], boilingPointK: 1860, meltingPointK: 903.78, discovery: 'Ancient', uses: 'Flame retardants, alloys, batteries.', category: 'metalloid', row: 5, column: 15,
  },
  {
    atomicNumber: 52, symbol: 'Te', name: 'Tellurium', atomicMass: 127.60, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁴', electronegativity: 2.1, ionizationEnergies: [869.3], oxidationStates: ['+6', '+4', '-2'], boilingPointK: 1261, meltingPointK: 722.66, discovery: 'Franz-Joseph Müller von Reichenstein (1782)', uses: 'Alloys, semiconductors, thermoelectric devices.', category: 'metalloid', row: 5, column: 16,
  },
  {
    atomicNumber: 53, symbol: 'I', name: 'Iodine', atomicMass: 126.90447, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁵', electronegativity: 2.66, ionizationEnergies: [1008.4], oxidationStates: ['+7', '+5', '+1', '-1'], boilingPointK: 457.4, meltingPointK: 386.85, discovery: 'Bernard Courtois (1811)', uses: 'Antiseptics, thyroid hormone, photography.', category: 'halogen', row: 5, column: 17,
  },
  {
    atomicNumber: 54, symbol: 'Xe', name: 'Xenon', atomicMass: 131.293, electronConfiguration: '[Kr] 4d¹⁰ 5s² 5p⁶', electronegativity: 2.6, ionizationEnergies: [1170.4], oxidationStates: ['+8', '+6', '+4', '+2'], boilingPointK: 165.03, meltingPointK: 161.4, discovery: 'William Ramsay & Morris Travers (1898)', uses: 'Lighting (xenon lamps), lasers, anesthesia.', category: 'nobleGas', row: 5, column: 18,
  },
  // Period 6
  {
    atomicNumber: 55, symbol: 'Cs', name: 'Caesium', atomicMass: 132.90545196, electronConfiguration: '[Xe] 6s¹', electronegativity: 0.79, ionizationEnergies: [375.7], oxidationStates: ['+1'], boilingPointK: 944, meltingPointK: 301.59, discovery: 'Robert Bunsen & Gustav Kirchhoff (1860)', uses: 'Atomic clocks, photoelectric cells.', category: 'alkaliMetal', row: 6, column: 1,
  },
  {
    atomicNumber: 56, symbol: 'Ba', name: 'Barium', atomicMass: 137.327, electronConfiguration: '[Xe] 6s²', electronegativity: 0.89, ionizationEnergies: [502.9], oxidationStates: ['+2'], boilingPointK: 2170, meltingPointK: 1000, discovery: 'Carl Wilhelm Scheele (1774)', uses: 'Medical imaging (barium meal), fireworks (green).', category: 'alkalineEarthMetal', row: 6, column: 2,
  },
  {
    atomicNumber: 57, symbol: 'La', name: 'Lanthanum', atomicMass: 138.90547, electronConfiguration: '[Xe] 5d¹ 6s²', electronegativity: 1.10, ionizationEnergies: [538.1], oxidationStates: ['+3'], boilingPointK: 3737, meltingPointK: 1193, discovery: 'Carl Gustaf Mosander (1839)', uses: 'Camera lenses, catalysts, lighter flints.', category: 'lanthanide', row: 6, column: 3,
  },
  // Lanthanides (Ce-Lu) in visual row 8 for grid
  {
    atomicNumber: 58, symbol: 'Ce', name: 'Cerium', atomicMass: 140.116, electronConfiguration: '[Xe] 4f¹ 5d¹ 6s²', electronegativity: 1.12, ionizationEnergies: [534.4], oxidationStates: ['+4', '+3'], boilingPointK: 3716, meltingPointK: 1068, discovery: 'Martin Klaproth, Jöns Berzelius & Wilhelm Hisinger (1803)', uses: 'Catalytic converters, glass polishing, lighter flints.', category: 'lanthanide', row: 8, column: 3,
  },
  {
    atomicNumber: 59, symbol: 'Pr', name: 'Praseodymium', atomicMass: 140.90766, electronConfiguration: '[Xe] 4f³ 6s²', electronegativity: 1.13, ionizationEnergies: [527], oxidationStates: ['+3'], boilingPointK: 3793, meltingPointK: 1208, discovery: 'Carl Auer von Welsbach (1885)', uses: 'Magnets, yellow glass pigment, carbon arc lights.', category: 'lanthanide', row: 8, column: 4,
  },
  {
    atomicNumber: 60, symbol: 'Nd', name: 'Neodymium', atomicMass: 144.242, electronConfiguration: '[Xe] 4f⁴ 6s²', electronegativity: 1.14, ionizationEnergies: [533.1], oxidationStates: ['+3'], boilingPointK: 3347, meltingPointK: 1297, discovery: 'Carl Auer von Welsbach (1885)', uses: 'Strong magnets (NdFeB), lasers, purple glass.', category: 'lanthanide', row: 8, column: 5,
  },
  {
    atomicNumber: 61, symbol: 'Pm', name: 'Promethium', atomicMass: '(145)', electronConfiguration: '[Xe] 4f⁵ 6s²', electronegativity: 1.13, ionizationEnergies: [540], oxidationStates: ['+3'], boilingPointK: 3273, meltingPointK: 1315, discovery: 'Chien Shiung Wu, Emilio Segrè & Hans Bethe (1945)', uses: 'Luminous paint, nuclear batteries (research).', category: 'lanthanide', row: 8, column: 6,
  },
  {
    atomicNumber: 62, symbol: 'Sm', name: 'Samarium', atomicMass: 150.36, electronConfiguration: '[Xe] 4f⁶ 6s²', electronegativity: 1.17, ionizationEnergies: [544.5], oxidationStates: ['+3', '+2'], boilingPointK: 2067, meltingPointK: 1345, discovery: 'Lecoq de Boisbaudran (1879)', uses: 'Magnets, lasers, neutron absorption.', category: 'lanthanide', row: 8, column: 7,
  },
  {
    atomicNumber: 63, symbol: 'Eu', name: 'Europium', atomicMass: 151.964, electronConfiguration: '[Xe] 4f⁷ 6s²', electronegativity: 1.2, ionizationEnergies: [547.1], oxidationStates: ['+3', '+2'], boilingPointK: 1802, meltingPointK: 1099, discovery: 'Eugène-Anatole Demarçay (1901)', uses: 'Phosphors (red in TVs/LEDs), lasers.', category: 'lanthanide', row: 8, column: 8,
  },
  {
    atomicNumber: 64, symbol: 'Gd', name: 'Gadolinium', atomicMass: 157.25, electronConfiguration: '[Xe] 4f⁷ 5d¹ 6s²', electronegativity: 1.2, ionizationEnergies: [593.4], oxidationStates: ['+3'], boilingPointK: 3546, meltingPointK: 1585, discovery: 'Jean Charles Galissard de Marignac (1880)', uses: 'MRI contrast agent, neutron capture therapy.', category: 'lanthanide', row: 8, column: 9,
  },
  {
    atomicNumber: 65, symbol: 'Tb', name: 'Terbium', atomicMass: 158.92535, electronConfiguration: '[Xe] 4f⁹ 6s²', electronegativity: 1.2, ionizationEnergies: [565.8], oxidationStates: ['+3'], boilingPointK: 3503, meltingPointK: 1629, discovery: 'Carl Gustaf Mosander (1843)', uses: 'Phosphors (green), lasers, sonar systems.', category: 'lanthanide', row: 8, column: 10,
  },
  {
    atomicNumber: 66, symbol: 'Dy', name: 'Dysprosium', atomicMass: 162.500, electronConfiguration: '[Xe] 4f¹⁰ 6s²', electronegativity: 1.22, ionizationEnergies: [573.0], oxidationStates: ['+3'], boilingPointK: 2840, meltingPointK: 1680, discovery: 'Lecoq de Boisbaudran (1886)', uses: 'High-intensity magnets, lasers, nuclear reactors.', category: 'lanthanide', row: 8, column: 11,
  },
  {
    atomicNumber: 67, symbol: 'Ho', name: 'Holmium', atomicMass: 164.93033, electronConfiguration: '[Xe] 4f¹¹ 6s²', electronegativity: 1.23, ionizationEnergies: [581.0], oxidationStates: ['+3'], boilingPointK: 2973, meltingPointK: 1734, discovery: 'Marc Delafontaine & Jacques-Louis Soret (1878)', uses: 'Lasers, magnets, nuclear control rods.', category: 'lanthanide', row: 8, column: 12,
  },
  {
    atomicNumber: 68, symbol: 'Er', name: 'Erbium', atomicMass: 167.259, electronConfiguration: '[Xe] 4f¹² 6s²', electronegativity: 1.24, ionizationEnergies: [589.3], oxidationStates: ['+3'], boilingPointK: 3141, meltingPointK: 1802, discovery: 'Carl Gustaf Mosander (1843)', uses: 'Fiber optic amplifiers, lasers, pink glass.', category: 'lanthanide', row: 8, column: 13,
  },
  {
    atomicNumber: 69, symbol: 'Tm', name: 'Thulium', atomicMass: 168.93422, electronConfiguration: '[Xe] 4f¹³ 6s²', electronegativity: 1.25, ionizationEnergies: [596.7], oxidationStates: ['+3'], boilingPointK: 2223, meltingPointK: 1818, discovery: 'Per Teodor Cleve (1879)', uses: 'Portable X-ray devices, lasers.', category: 'lanthanide', row: 8, column: 14,
  },
  {
    atomicNumber: 70, symbol: 'Yb', name: 'Ytterbium', atomicMass: 173.054, electronConfiguration: '[Xe] 4f¹⁴ 6s²', electronegativity: 1.1, ionizationEnergies: [603.4], oxidationStates: ['+3', '+2'], boilingPointK: 1469, meltingPointK: 1097, discovery: 'Jean Charles Galissard de Marignac (1878)', uses: 'Lasers, stainless steel, earthquake monitoring.', category: 'lanthanide', row: 8, column: 15,
  },
  {
    atomicNumber: 71, symbol: 'Lu', name: 'Lutetium', atomicMass: 174.9668, electronConfiguration: '[Xe] 4f¹⁴ 5d¹ 6s²', electronegativity: 1.27, ionizationEnergies: [523.5], oxidationStates: ['+3'], boilingPointK: 3675, meltingPointK: 1925, discovery: 'Georges Urbain, Carl Auer von Welsbach & Charles James (1907)', uses: 'Catalysts, high-refractive-index glass.', category: 'lanthanide', row: 8, column: 16,
  }, // End of visual Lanthanides on row 8. Lutetium is technically a transition metal sometimes.
  // Period 6 (continued after Lanthanides)
  {
    atomicNumber: 72, symbol: 'Hf', name: 'Hafnium', atomicMass: 178.49, electronConfiguration: '[Xe] 4f¹⁴ 5d² 6s²', electronegativity: 1.3, ionizationEnergies: [658.5], oxidationStates: ['+4'], boilingPointK: 4876, meltingPointK: 2506, discovery: 'Dirk Coster & George de Hevesy (1923)', uses: 'Nuclear control rods, alloys, microprocessors.', category: 'transitionMetal', row: 6, column: 4,
  },
  {
    atomicNumber: 73, symbol: 'Ta', name: 'Tantalum', atomicMass: 180.94788, electronConfiguration: '[Xe] 4f¹⁴ 5d³ 6s²', electronegativity: 1.5, ionizationEnergies: [761], oxidationStates: ['+5'], boilingPointK: 5731, meltingPointK: 3290, discovery: 'Anders Gustaf Ekeberg (1802)', uses: 'Capacitors, surgical implants, alloys.', category: 'transitionMetal', row: 6, column: 5,
  },
  {
    atomicNumber: 74, symbol: 'W', name: 'Tungsten', atomicMass: 183.84, electronConfiguration: '[Xe] 4f¹⁴ 5d⁴ 6s²', electronegativity: 2.36, ionizationEnergies: [770], oxidationStates: ['+6', '+4', '+2'], boilingPointK: 5828, meltingPointK: 3695, discovery: 'Fausto & Juan José Elhuyar (1783)', uses: 'Light bulb filaments, high-speed steel alloys.', category: 'transitionMetal', row: 6, column: 6,
  },
  {
    atomicNumber: 75, symbol: 'Re', name: 'Rhenium', atomicMass: 186.207, electronConfiguration: '[Xe] 4f¹⁴ 5d⁵ 6s²', electronegativity: 1.9, ionizationEnergies: [760], oxidationStates: ['+7', '+6', '+4'], boilingPointK: 5869, meltingPointK: 3459, discovery: 'Walter Noddack, Ida Tacke & Otto Berg (1925)', uses: 'Jet engine parts, catalysts.', category: 'transitionMetal', row: 6, column: 7,
  },
  {
    atomicNumber: 76, symbol: 'Os', name: 'Osmium', atomicMass: 190.23, electronConfiguration: '[Xe] 4f¹⁴ 5d⁶ 6s²', electronegativity: 2.2, ionizationEnergies: [840], oxidationStates: ['+8', '+6', '+4', '+3', '+2'], boilingPointK: 5285, meltingPointK: 3306, discovery: 'Smithson Tennant (1803)', uses: 'Fountain pen tips, electrical contacts, catalysts.', category: 'transitionMetal', row: 6, column: 8,
  },
  {
    atomicNumber: 77, symbol: 'Ir', name: 'Iridium', atomicMass: 192.217, electronConfiguration: '[Xe] 4f¹⁴ 5d⁷ 6s²', electronegativity: 2.20, ionizationEnergies: [880], oxidationStates: ['+6', '+4', '+3', '+1'], boilingPointK: 4701, meltingPointK: 2719, discovery: 'Smithson Tennant (1803)', uses: 'Spark plugs, crucibles, standard meter bar.', category: 'transitionMetal', row: 6, column: 9,
  },
  {
    atomicNumber: 78, symbol: 'Pt', name: 'Platinum', atomicMass: 195.084, electronConfiguration: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronegativity: 2.28, ionizationEnergies: [870], oxidationStates: ['+4', '+2'], boilingPointK: 4098, meltingPointK: 2041.4, discovery: 'Antonio de Ulloa (1735)', uses: 'Catalytic converters, jewelry, lab equipment.', category: 'transitionMetal', row: 6, column: 10,
  },
  {
    atomicNumber: 79, symbol: 'Au', name: 'Gold', atomicMass: 196.966569, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronegativity: 2.54, ionizationEnergies: [890.1], oxidationStates: ['+3', '+1'], boilingPointK: 3129, meltingPointK: 1337.33, discovery: 'Ancient', uses: 'Jewelry, currency, electronics.', category: 'transitionMetal', row: 6, column: 11,
  },
  {
    atomicNumber: 80, symbol: 'Hg', name: 'Mercury', atomicMass: 200.592, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronegativity: 2.00, ionizationEnergies: [1007.1], oxidationStates: ['+2', '+1'], boilingPointK: 629.88, meltingPointK: 234.3210, discovery: 'Ancient', uses: 'Thermometers, barometers, fluorescent lamps.', category: 'transitionMetal', row: 6, column: 12,
  },
  {
    atomicNumber: 81, symbol: 'Tl', name: 'Thallium', atomicMass: 204.38, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', electronegativity: 1.62, ionizationEnergies: [589.4], oxidationStates: ['+3', '+1'], boilingPointK: 1746, meltingPointK: 577, discovery: 'William Crookes (1861)', uses: 'Low-melting glass, photocells, rat poison (restricted).', category: 'postTransitionMetal', row: 6, column: 13,
  },
  {
    atomicNumber: 82, symbol: 'Pb', name: 'Lead', atomicMass: 207.2, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronegativity: 2.33, ionizationEnergies: [715.6], oxidationStates: ['+4', '+2'], boilingPointK: 2022, meltingPointK: 600.61, discovery: 'Ancient', uses: 'Batteries, radiation shielding, solder (historical).', category: 'postTransitionMetal', row: 6, column: 14,
  },
  {
    atomicNumber: 83, symbol: 'Bi', name: 'Bismuth', atomicMass: 208.98040, electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', electronegativity: 2.02, ionizationEnergies: [703], oxidationStates: ['+5', '+3'], boilingPointK: 1837, meltingPointK: 544.7, discovery: 'Claude François Geoffroy (1753)', uses: 'Pepto-Bismol, low-melting alloys, cosmetics.', category: 'postTransitionMetal', row: 6, column: 15,
  },
  {
    atomicNumber: 84, symbol: 'Po', name: 'Polonium', atomicMass: '(209)', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', electronegativity: 2.0, ionizationEnergies: [812.1], oxidationStates: ['+6', '+4', '+2', '-2'], boilingPointK: 1235, meltingPointK: 527, discovery: 'Marie & Pierre Curie (1898)', uses: 'Anti-static devices, neutron sources.', category: 'metalloid', row: 6, column: 16,
  },
  {
    atomicNumber: 85, symbol: 'At', name: 'Astatine', atomicMass: '(210)', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', electronegativity: 2.2, ionizationEnergies: [899.003], oxidationStates: ['+7', '+5', '+1', '-1'], boilingPointK: 610, meltingPointK: 575, discovery: 'Dale R. Corson, Kenneth Ross MacKenzie & Emilio Segrè (1940)', uses: 'Cancer treatment research (very rare).', category: 'halogen', row: 6, column: 17,
  },
  {
    atomicNumber: 86, symbol: 'Rn', name: 'Radon', atomicMass: '(222)', electronConfiguration: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', electronegativity: 2.2, ionizationEnergies: [1037], oxidationStates: ['+2'], boilingPointK: 211.3, meltingPointK: 202, discovery: 'Friedrich Ernst Dorn (1900)', uses: 'Radiation therapy (historical), earthquake prediction (research).', category: 'nobleGas', row: 6, column: 18,
  },
  // Period 7
  {
    atomicNumber: 87, symbol: 'Fr', name: 'Francium', atomicMass: '(223)', electronConfiguration: '[Rn] 7s¹', electronegativity: 0.7, ionizationEnergies: [380], oxidationStates: ['+1'], boilingPointK: 950, meltingPointK: 300, discovery: 'Marguerite Perey (1939)', uses: 'Scientific research (very rare).', category: 'alkaliMetal', row: 7, column: 1,
  },
  {
    atomicNumber: 88, symbol: 'Ra', name: 'Radium', atomicMass: '(226)', electronConfiguration: '[Rn] 7s²', electronegativity: 0.9, ionizationEnergies: [509.3], oxidationStates: ['+2'], boilingPointK: 2010, meltingPointK: 973, discovery: 'Marie & Pierre Curie (1898)', uses: 'Luminous paint (historical), cancer treatment (historical).', category: 'alkalineEarthMetal', row: 7, column: 2,
  },
  {
    atomicNumber: 89, symbol: 'Ac', name: 'Actinium', atomicMass: '(227)', electronConfiguration: '[Rn] 6d¹ 7s²', electronegativity: 1.1, ionizationEnergies: [499], oxidationStates: ['+3'], boilingPointK: 3471, meltingPointK: 1323, discovery: 'André-Louis Debierne (1899)', uses: 'Neutron source, cancer therapy research.', category: 'actinide', row: 7, column: 3,
  },
  // Actinides (Th-Lr) in visual row 9 for grid
  {
    atomicNumber: 90, symbol: 'Th', name: 'Thorium', atomicMass: 232.0377, electronConfiguration: '[Rn] 6d² 7s²', electronegativity: 1.3, ionizationEnergies: [587], oxidationStates: ['+4'], boilingPointK: 5061, meltingPointK: 2115, discovery: 'Jöns Jacob Berzelius (1829)', uses: 'Gas mantles, nuclear fuel research.', category: 'actinide', row: 9, column: 3,
  },
  {
    atomicNumber: 91, symbol: 'Pa', name: 'Protactinium', atomicMass: 231.03588, electronConfiguration: '[Rn] 5f² 6d¹ 7s²', electronegativity: 1.5, ionizationEnergies: [568], oxidationStates: ['+5', '+4'], boilingPointK: 4300, meltingPointK: 1841, discovery: 'Kasimir Fajans & Oswald Helmuth Göhring (1913)', uses: 'Scientific research (very rare).', category: 'actinide', row: 9, column: 4,
  },
  {
    atomicNumber: 92, symbol: 'U', name: 'Uranium', atomicMass: 238.02891, electronConfiguration: '[Rn] 5f³ 6d¹ 7s²', electronegativity: 1.38, ionizationEnergies: [597.6], oxidationStates: ['+6', '+5', '+4', '+3'], boilingPointK: 4404, meltingPointK: 1405.3, discovery: 'Martin Heinrich Klaproth (1789)', uses: 'Nuclear fuel, counterweights, armor plating.', category: 'actinide', row: 9, column: 5,
  },
  {
    atomicNumber: 93, symbol: 'Np', name: 'Neptunium', atomicMass: '(237)', electronConfiguration: '[Rn] 5f⁴ 6d¹ 7s²', electronegativity: 1.36, ionizationEnergies: [604.5], oxidationStates: ['+6', '+5', '+4', '+3'], boilingPointK: 4273, meltingPointK: 917, discovery: 'Edwin McMillan & Philip Abelson (1940)', uses: 'Neutron detection, research.', category: 'actinide', row: 9, column: 6,
  },
  {
    atomicNumber: 94, symbol: 'Pu', name: 'Plutonium', atomicMass: '(244)', electronConfiguration: '[Rn] 5f⁶ 7s²', electronegativity: 1.28, ionizationEnergies: [584.7], oxidationStates: ['+6', '+5', '+4', '+3'], boilingPointK: 3505, meltingPointK: 912.5, discovery: 'Glenn T. Seaborg et al. (1940)', uses: 'Nuclear fuel, nuclear weapons, RTGs for spacecraft.', category: 'actinide', row: 9, column: 7,
  },
  {
    atomicNumber: 95, symbol: 'Am', name: 'Americium', atomicMass: '(243)', electronConfiguration: '[Rn] 5f⁷ 7s²', electronegativity: 1.3, ionizationEnergies: [578], oxidationStates: ['+6', '+5', '+4', '+3'], boilingPointK: 2880, meltingPointK: 1449, discovery: 'Glenn T. Seaborg et al. (1944)', uses: 'Smoke detectors, neutron sources.', category: 'actinide', row: 9, column: 8,
  },
  {
    atomicNumber: 96, symbol: 'Cm', name: 'Curium', atomicMass: '(247)', electronConfiguration: '[Rn] 5f⁷ 6d¹ 7s²', electronegativity: 1.3, ionizationEnergies: [581], oxidationStates: ['+4', '+3'], boilingPointK: 3383, meltingPointK: 1613, discovery: 'Glenn T. Seaborg et al. (1944)', uses: 'Power source for spacecraft (alpha decay), research.', category: 'actinide', row: 9, column: 9,
  },
  {
    atomicNumber: 97, symbol: 'Bk', name: 'Berkelium', atomicMass: '(247)', electronConfiguration: '[Rn] 5f⁹ 7s²', electronegativity: 1.3, ionizationEnergies: [601], oxidationStates: ['+4', '+3'], boilingPointK: 2900, meltingPointK: 1259, discovery: 'Glenn T. Seaborg et al. (1949)', uses: 'Scientific research, source for heavier elements.', category: 'actinide', row: 9, column: 10,
  },
  {
    atomicNumber: 98, symbol: 'Cf', name: 'Californium', atomicMass: '(251)', electronConfiguration: '[Rn] 5f¹⁰ 7s²', electronegativity: 1.3, ionizationEnergies: [608], oxidationStates: ['+4', '+3', '+2'], boilingPointK: 1743, meltingPointK: 1173, discovery: 'Glenn T. Seaborg et al. (1950)', uses: 'Neutron startup sources for reactors, cancer treatment.', category: 'actinide', row: 9, column: 11,
  },
  {
    atomicNumber: 99, symbol: 'Es', name: 'Einsteinium', atomicMass: '(252)', electronConfiguration: '[Rn] 5f¹¹ 7s²', electronegativity: 1.3, ionizationEnergies: [619], oxidationStates: ['+3', '+2'], boilingPointK: 1269, meltingPointK: 1133, discovery: 'Albert Ghiorso et al. (1952)', uses: 'Scientific research, production of mendelevium.', category: 'actinide', row: 9, column: 12,
  },
  {
    atomicNumber: 100, symbol: 'Fm', name: 'Fermium', atomicMass: '(257)', electronConfiguration: '[Rn] 5f¹² 7s²', electronegativity: 1.3, ionizationEnergies: [627], oxidationStates: ['+3', '+2'], boilingPointK: null, meltingPointK: 1800, discovery: 'Albert Ghiorso et al. (1952)', uses: 'Scientific research (very rare).', category: 'actinide', row: 9, column: 13,
  },
  {
    atomicNumber: 101, symbol: 'Md', name: 'Mendelevium', atomicMass: '(258)', electronConfiguration: '[Rn] 5f¹³ 7s²', electronegativity: 1.3, ionizationEnergies: [635], oxidationStates: ['+3', '+2'], boilingPointK: null, meltingPointK: 1100, discovery: 'Albert Ghiorso et al. (1955)', uses: 'Scientific research (very rare).', category: 'actinide', row: 9, column: 14,
  },
  {
    atomicNumber: 102, symbol: 'No', name: 'Nobelium', atomicMass: '(259)', electronConfiguration: '[Rn] 5f¹⁴ 7s²', electronegativity: 1.3, ionizationEnergies: [642], oxidationStates: ['+3', '+2'], boilingPointK: null, meltingPointK: 1100, discovery: 'Joint Institute for Nuclear Research (JINR) (1966)', uses: 'Scientific research (very rare).', category: 'actinide', row: 9, column: 15,
  },
  {
    atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium', atomicMass: '(262)', electronConfiguration: '[Rn] 5f¹⁴ 7s² 7p¹', electronegativity: 1.3, ionizationEnergies: [470], oxidationStates: ['+3'], boilingPointK: null, meltingPointK: 1900, discovery: 'Albert Ghiorso et al. (1961)', uses: 'Scientific research (very rare).', category: 'actinide', row: 9, column: 16,
  }, // End of visual Actinides on row 9. Lawrencium is technically a transition metal sometimes.
  // Period 7 (continued after Actinides)
  {
    atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium', atomicMass: '(267)', electronConfiguration: '[Rn] 5f¹⁴ 6d² 7s²', electronegativity: null, ionizationEnergies: [580], oxidationStates: ['+4'], boilingPointK: null, meltingPointK: null, discovery: 'JINR (1964) & LBNL (1969)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 4,
  },
  {
    atomicNumber: 105, symbol: 'Db', name: 'Dubnium', atomicMass: '(270)', electronConfiguration: '[Rn] 5f¹⁴ 6d³ 7s²', electronegativity: null, ionizationEnergies: [660], oxidationStates: ['+5'], boilingPointK: null, meltingPointK: null, discovery: 'JINR (1968) & LBNL (1970)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 5,
  },
  {
    atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium', atomicMass: '(271)', electronConfiguration: '[Rn] 5f¹⁴ 6d⁴ 7s²', electronegativity: null, ionizationEnergies: [760], oxidationStates: ['+6'], boilingPointK: null, meltingPointK: null, discovery: 'JINR & LBNL/LLNL (1974)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 6,
  },
  {
    atomicNumber: 107, symbol: 'Bh', name: 'Bohrium', atomicMass: '(270)', electronConfiguration: '[Rn] 5f¹⁴ 6d⁵ 7s²', electronegativity: null, ionizationEnergies: [740], oxidationStates: ['+7'], boilingPointK: null, meltingPointK: null, discovery: 'Gesellschaft für Schwerionenforschung (GSI) (1981)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 7,
  },
  {
    atomicNumber: 108, symbol: 'Hs', name: 'Hassium', atomicMass: '(277)', electronConfiguration: '[Rn] 5f¹⁴ 6d⁶ 7s²', electronegativity: null, ionizationEnergies: [730], oxidationStates: ['+8'], boilingPointK: null, meltingPointK: null, discovery: 'GSI (1984)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 8,
  },
  {
    atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium', atomicMass: '(278)', electronConfiguration: '[Rn] 5f¹⁴ 6d⁷ 7s²', electronegativity: null, ionizationEnergies: [800], oxidationStates: ['+3','+1'], boilingPointK: null, meltingPointK: null, discovery: 'GSI (1982)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 9,
  },
  {
    atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium', atomicMass: '(281)', electronConfiguration: '[Rn] 5f¹⁴ 6d⁸ 7s²', electronegativity: null, ionizationEnergies: [960], oxidationStates: ['+2','0'], boilingPointK: null, meltingPointK: null, discovery: 'GSI (1994)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 10,
  },
  {
    atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium', atomicMass: '(282)', electronConfiguration: '[Rn] 5f¹⁴ 6d⁹ 7s²', electronegativity: null, ionizationEnergies: [1020], oxidationStates: ['+1','-1'], boilingPointK: null, meltingPointK: null, discovery: 'GSI (1994)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 11,
  },
  {
    atomicNumber: 112, symbol: 'Cn', name: 'Copernicium', atomicMass: '(285)', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', electronegativity: null, ionizationEnergies: [1150], oxidationStates: ['+2','0'], boilingPointK: null, meltingPointK: null, discovery: 'GSI (1996)', uses: 'Scientific research.', category: 'transitionMetal', row: 7, column: 12,
  },
  {
    atomicNumber: 113, symbol: 'Nh', name: 'Nihonium', atomicMass: '(286)', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', electronegativity: null, ionizationEnergies: [700], oxidationStates: ['+1'], boilingPointK: null, meltingPointK: null, discovery: 'RIKEN (2004)', uses: 'Scientific research.', category: 'postTransitionMetal', row: 7, column: 13,
  },
  {
    atomicNumber: 114, symbol: 'Fl', name: 'Flerovium', atomicMass: '(289)', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', electronegativity: null, ionizationEnergies: [600], oxidationStates: ['+2','0'], boilingPointK: null, meltingPointK: null, discovery: 'JINR (1999)', uses: 'Scientific research.', category: 'postTransitionMetal', row: 7, column: 14,
  },
  {
    atomicNumber: 115, symbol: 'Mc', name: 'Moscovium', atomicMass: '(290)', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', electronegativity: null, ionizationEnergies: [540], oxidationStates: ['+3','+1'], boilingPointK: null, meltingPointK: null, discovery: 'JINR & LLNL (2003)', uses: 'Scientific research.', category: 'postTransitionMetal', row: 7, column: 15,
  },
  {
    atomicNumber: 116, symbol: 'Lv', name: 'Livermorium', atomicMass: '(293)', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', electronegativity: null, ionizationEnergies: [720], oxidationStates: ['+2','0'], boilingPointK: null, meltingPointK: null, discovery: 'JINR & LLNL (2000)', uses: 'Scientific research.', category: 'postTransitionMetal', row: 7, column: 16,
  },
  {
    atomicNumber: 117, symbol: 'Ts', name: 'Tennessine', atomicMass: '(294)', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', electronegativity: null, ionizationEnergies: [740], oxidationStates: ['-1'], boilingPointK: null, meltingPointK: null, discovery: 'JINR & ORNL (2010)', uses: 'Scientific research.', category: 'halogen', row: 7, column: 17,
  },
  {
    atomicNumber: 118, symbol: 'Og', name: 'Oganesson', atomicMass: '(294)', electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', electronegativity: null, ionizationEnergies: [860], oxidationStates: ['+2','0'], boilingPointK: null, meltingPointK: null, discovery: 'JINR & LLNL (2006)', uses: 'Scientific research.', category: 'nobleGas', row: 7, column: 18, // Often predicted as noble gas, but category 'unknown' also used
  },
];

// Helper functions remain the same
export const getElementBySymbol = (symbol: string): ElementData | undefined => {
  return elementsData.find(el => el.symbol === symbol);
};

export const getElementByAtomicNumber = (atomicNumber: number): ElementData | undefined => {
  return elementsData.find(el => el.atomicNumber === atomicNumber);
}

