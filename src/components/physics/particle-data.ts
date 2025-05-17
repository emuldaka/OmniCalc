
// src/components/physics/particle-data.ts

export interface FundamentalParticle {
  id: string;
  name: string;
  symbol?: string; // e.g., e⁻, p⁺, γ
  category: 'Lepton' | 'Quark' | 'Boson' | 'Baryon' | 'Meson'; // Baryon/Meson are Hadrons
  mass: string; // e.g., "0.511 MeV/c²" or "938.3 MeV/c²"
  charge: string; // e.g., "-1 e", "+2/3 e", "0 e"
  spin: string; // e.g., "1/2", "1"
  notes?: string; // Fun facts or key properties
}

export const particleData: FundamentalParticle[] = [
  // Leptons
  {
    id: 'electron',
    name: 'Electron',
    symbol: 'e⁻',
    category: 'Lepton',
    mass: '0.511 MeV/c²',
    charge: '-1 e',
    spin: '1/2',
    notes: 'A fundamental lepton, orbits the nucleus of atoms. Carries negative electric charge.'
  },
  {
    id: 'electron_neutrino',
    name: 'Electron Neutrino',
    symbol: 'νₑ',
    category: 'Lepton',
    mass: '< 1 eV/c² (very small)',
    charge: '0 e',
    spin: '1/2',
    notes: 'A very light, neutral lepton that interacts weakly with other matter.'
  },
  // Quarks (Examples - there are 6 flavors)
  {
    id: 'up_quark',
    name: 'Up Quark',
    symbol: 'u',
    category: 'Quark',
    mass: '2.2 MeV/c²',
    charge: '+2/3 e',
    spin: '1/2',
    notes: 'A fundamental constituent of protons and neutrons.'
  },
  {
    id: 'down_quark',
    name: 'Down Quark',
    symbol: 'd',
    category: 'Quark',
    mass: '4.7 MeV/c²',
    charge: '-1/3 e',
    spin: '1/2',
    notes: 'A fundamental constituent of protons and neutrons.'
  },
  // Gauge Bosons
  {
    id: 'photon',
    name: 'Photon',
    symbol: 'γ',
    category: 'Boson',
    mass: '0 MeV/c²',
    charge: '0 e',
    spin: '1',
    notes: 'The quantum of the electromagnetic field; mediates electromagnetic interactions (light).'
  },
  {
    id: 'gluon',
    name: 'Gluon',
    symbol: 'g',
    category: 'Boson',
    mass: '0 MeV/c²',
    charge: '0 e',
    spin: '1',
    notes: 'Mediates the strong force, binding quarks together within hadrons.'
  },
  // Hadrons (Baryons - composed of 3 quarks)
  {
    id: 'proton',
    name: 'Proton',
    symbol: 'p⁺',
    category: 'Baryon',
    mass: '938.272 MeV/c²',
    charge: '+1 e',
    spin: '1/2',
    notes: 'Composed of two up quarks and one down quark (uud). Stable particle found in atomic nuclei.'
  },
  {
    id: 'neutron',
    name: 'Neutron',
    symbol: 'n⁰',
    category: 'Baryon',
    mass: '939.565 MeV/c²',
    charge: '0 e',
    spin: '1/2',
    notes: 'Composed of one up quark and two down quarks (udd). Found in atomic nuclei; free neutrons decay.'
  },
  // Higgs Boson
  {
    id: 'higgs_boson',
    name: 'Higgs Boson',
    symbol: 'H⁰',
    category: 'Boson',
    mass: 'approx. 125 GeV/c²',
    charge: '0 e',
    spin: '0',
    notes: 'Associated with the Higgs field, which gives mass to fundamental particles.'
  }
];
