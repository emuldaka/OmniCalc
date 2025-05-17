
// src/components/physics/physical-constants-data.ts

export interface PhysicalConstant {
  id: string;
  name: string;
  symbol: string;
  value: number;
  unit: string;
  description?: string;
}

export const physicalConstantsData: PhysicalConstant[] = [
  {
    id: 'c',
    name: 'Speed of Light in Vacuum',
    symbol: 'c',
    value: 299792458,
    unit: 'm/s',
    description: 'The speed at which all massless particles and associated fields travel in a vacuum.',
  },
  {
    id: 'h',
    name: "Planck's Constant",
    symbol: 'h',
    value: 6.62607015e-34,
    unit: 'J·s',
    description: 'Relates the energy of a photon to its frequency.',
  },
  {
    id: 'hbar',
    name: 'Reduced Planck Constant (Dirac Constant)',
    symbol: 'ħ',
    value: 1.054571817e-34,
    unit: 'J·s',
    description: 'h / (2π), commonly used in quantum mechanics.',
  },
  {
    id: 'G',
    name: 'Gravitational Constant',
    symbol: 'G',
    value: 6.67430e-11,
    unit: 'N·m²/kg²',
    description: 'Relates the gravitational force between two bodies to their masses and distance.',
  },
  {
    id: 'Na',
    name: "Avogadro's Number",
    symbol: 'Nₐ',
    value: 6.02214076e23,
    unit: 'mol⁻¹',
    description: 'The number of constituent particles (atoms or molecules) in one mole of a substance.',
  },
  {
    id: 'k',
    name: "Boltzmann Constant",
    symbol: 'k',
    value: 1.380649e-23,
    unit: 'J/K',
    description: 'Relates the average kinetic energy of particles in a gas with the temperature of the gas.',
  },
  {
    id: 'e',
    name: 'Elementary Charge',
    symbol: 'e',
    value: 1.602176634e-19,
    unit: 'C',
    description: 'The electric charge carried by a single proton, or the negative of the charge of a single electron.',
  },
  {
    id: 'me',
    name: 'Electron Mass',
    symbol: 'mₑ',
    value: 9.1093837015e-31,
    unit: 'kg',
    description: 'The rest mass of an electron.',
  },
  {
    id: 'mp',
    name: 'Proton Mass',
    symbol: 'mₚ',
    value: 1.67262192369e-27,
    unit: 'kg',
    description: 'The rest mass of a proton.',
  },
   {
    id: 'R',
    name: 'Ideal Gas Constant',
    symbol: 'R',
    value: 8.314462618,
    unit: 'J/(mol·K)',
    description: 'Constant in the ideal gas law (PV=nRT).',
  },
  {
    id: 'eps0',
    name: 'Vacuum Permittivity (Electric Constant)',
    symbol: 'ε₀',
    value: 8.8541878128e-12,
    unit: 'F/m',
    description: 'Relates electric fields to electric charges in a vacuum.',
  },
  {
    id: 'mu0',
    name: 'Vacuum Permeability (Magnetic Constant)',
    symbol: 'µ₀',
    value: 1.25663706212e-6, // 4π × 10⁻⁷ N/A² exactly by definition before 2019, now defined by ε₀ and c
    unit: 'N/A²',
    description: 'Relates magnetic fields to electric currents in a vacuum.',
  },
];
