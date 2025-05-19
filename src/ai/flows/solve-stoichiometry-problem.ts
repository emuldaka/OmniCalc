'use server';
/**
 * @fileOverview Solves stoichiometry problems, including balancing equations,
 * finding limiting reactants, theoretical yields, percent yields, and gas stoichiometry.
 *
 * - solveStoichiometryProblem - A function that processes a stoichiometry problem.
 * - StoichiometryInput - The input type for the solveStoichiometryProblem function.
 * - StoichiometryOutput - The return type for the solveStoichiometryProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schemas remain defined for type inference but not exported directly
const ReactantSchema = z.object({
  formula: z.string().describe('Chemical formula of the reactant (e.g., C3H8, O2).'),
  amount: z.number().describe('Amount of the reactant.'),
  unit: z.enum(['moles', 'grams', 'liters']).describe('Unit of the amount (moles, grams, or liters for gases).'),
  pressure: z.number().optional().describe('Pressure if reactant is a gas (e.g., 1.00).'),
  pressureUnit: z.enum(['atm', 'kPa', 'mmHg', 'torr']).optional().describe('Unit of pressure (e.g., atm).'),
  temperature: z.number().optional().describe('Temperature if reactant is a gas (e.g., 298).'),
  temperatureUnit: z.enum(['K', 'C', 'F']).optional().describe('Unit of temperature (K, C, or F).'),
});
export type Reactant = z.infer<typeof ReactantSchema>;

const ActualYieldSchema = z.object({
  formula: z.string().describe('Chemical formula of the product for which actual yield is given.'),
  amount: z.number().describe('Actual amount of product obtained.'),
  unit: z.enum(['grams', 'moles']).describe('Unit of the actual yield (grams or moles).'),
});
export type ActualYield = z.infer<typeof ActualYieldSchema>;

const TargetProductSchema = z.object({
  formula: z.string().describe('Chemical formula of the product to calculate yield for.'),
  calculateVolume: z.boolean().optional().describe('Set to true to calculate volume of this gaseous product.'),
  pressure: z.number().optional().describe('Pressure for gas volume calculation (e.g., 1.00).'),
  pressureUnit: z.enum(['atm', 'kPa', 'mmHg', 'torr']).optional().describe('Unit of pressure for gas volume calculation.'),
  temperature: z.number().optional().describe('Temperature for gas volume calculation (e.g., 298).'),
  temperatureUnit: z.enum(['K', 'C', 'F']).optional().describe('Unit of temperature for gas volume calculation.'),
});
export type TargetProduct = z.infer<typeof TargetProductSchema>;

const StoichiometryInputSchema = z.object({
  unbalancedEquation: z.string().describe('The chemical equation, can be unbalanced (e.g., "C3H8 + O2 -> CO2 + H2O").'),
  reactants: z.array(ReactantSchema).min(1).describe('An array of reactants with their amounts and units.'),
  targetProducts: z.array(TargetProductSchema).optional().describe('An array of products to calculate theoretical yields for, with optional gas conditions.'),
  actualYield: ActualYieldSchema.optional().describe('Actual yield of a specific product for percent yield calculation.'),
});
export type StoichiometryInput = z.infer<typeof StoichiometryInputSchema>;

const StoichiometryOutputSchema = z.object({
  balancedEquation: z.string().optional().describe('The balanced chemical equation.'),
  errorMessage: z.string().optional().describe('Error message if calculation fails or input is invalid.'),
  calculationLog: z.array(z.string()).optional().describe('Step-by-step reasoning, including molar masses used and intermediate calculations.'),
  limitingReactant: z.object({
    formula: z.string(),
    molesUsed: z.number(),
    gramsUsed: z.number(),
  }).optional().describe('The limiting reactant and the amount used.'),
  excessReactants: z.array(z.object({
    formula: z.string(),
    molesInitial: z.number(),
    gramsInitial: z.number(),
    molesRemaining: z.number(),
    gramsRemaining: z.number(),
  })).optional().describe('Excess reactants and their remaining amounts.'),
  theoreticalYields: z.array(z.object({
    formula: z.string(),
    moles: z.number(),
    grams: z.number().optional(),
    liters: z.number().optional(),
    conditions: z.string().optional().describe('Conditions (P, T) if volume was calculated.'),
  })).optional().describe('Theoretical yields of the target products.'),
  percentYield: z.object({
    productFormula: z.string(),
    percentage: z.number(),
    actualYieldGrams: z.number(),
    theoreticalYieldGrams: z.number(),
  }).optional().describe('Percent yield if actual yield was provided.'),
  molarMassesUsed: z.record(z.number()).optional().describe('A dictionary of formulas to molar masses (g/mol) used in calculation.')
});
export type StoichiometryOutput = z.infer<typeof StoichiometryOutputSchema>;

export async function solveStoichiometryProblem(input: StoichiometryInput): Promise<StoichiometryOutput> {
  // Static export: AI flow disabled
  // return solveStoichiometryProblemFlow(input);
  throw new Error("solveStoichiometryProblemFlow is disabled for static export.");
}

/*
const R_L_ATM_MOL_K = 0.08206; // L·atm/(mol·K)
const R_L_KPA_MOL_K = 8.314;   // L·kPa/(mol·K)
const R_L_MMHG_MOL_K = 62.36; // L·mmHg/(mol·K) or L·torr/(mol·K)


const prompt = ai.definePrompt({
  name: 'solveStoichiometryProblemPrompt',
  input: { schema: StoichiometryInputSchema },
  output: { schema: StoichiometryOutputSchema },
  prompt: \`You are an expert chemistry AI assistant. Solve the following stoichiometry problem.
Your task is to:
1.  Balance the chemical equation: {{{unbalancedEquation}}}. If already balanced, confirm it.
2.  For each reactant provided, calculate its molar mass (in g/mol). List these molar masses in the 'molarMassesUsed' output field. Use standard atomic weights (e.g., H:1.008, C:12.011, O:15.999, N:14.007, S:32.06, Fe:55.845, Cu:63.546, Na:22.990, Cl:35.453).
3.  Convert the given amount of each reactant to moles.
    - If a reactant amount is given in grams, use its molar mass for conversion.
    - If a reactant is a gas and its amount is given in liters, use the Ideal Gas Law (PV=nRT) to find moles.
      The Ideal Gas Constant R values are:
      - R = \${R_L_ATM_MOL_K} L·atm/(mol·K)
      - R = \${R_L_KPA_MOL_K} L·kPa/(mol·K)
      - R = \${R_L_MMHG_MOL_K} L·mmHg/(mol·K) (or L·torr/(mol·K))
      Ensure temperature is in Kelvin (K = °C + 273.15, K = (°F - 32) * 5/9 + 273.15).
      Ensure pressure is in atm, kPa, or mmHg/torr for the R values provided. If not, state that conversion is needed or use the appropriate R value.
4.  Using the balanced equation and mole amounts, determine the limiting reactant.
5.  Calculate the theoretical yield (in moles and grams) for each product formula specified in 'targetProducts'.
    - If 'calculateVolume' is true for a target product and it's a gas, also calculate its volume in Liters using PV=nRT under the specified conditions (or the conditions of a gaseous reactant if no specific product conditions are given). Assume standard conditions (1 atm, 298K) if no conditions specified.
6.  If 'actualYield' is provided for a product, calculate the percent yield: (actual_yield_grams / theoretical_yield_grams) * 100. Ensure actual yield is converted to grams if given in moles, using its calculated molar mass.
7.  Provide a step-by-step log of your calculations in the 'calculationLog' array. Include conversions, molar masses used, mole ratios, and intermediate results.
8.  If any part of the calculation is impossible or input is ambiguous, set 'errorMessage' with a clear explanation. Otherwise, 'errorMessage' should be omitted or null.

Reactants:
{{#each reactants}}
- Formula: {{formula}}, Amount: {{amount}} {{unit}}{{#if pressure}} at {{pressure}} {{pressureUnit}}{{/if}}{{#if temperature}}, {{temperature}} {{temperatureUnit}}{{/if}}
{{/each}}

{{#if targetProducts}}
Target Products for Yield Calculation:
{{#each targetProducts}}
- Formula: {{formula}}{{#if calculateVolume}} (calculate volume{{#if pressure}} at P={{pressure}} {{pressureUnit}}, T={{temperature}} {{temperatureUnit}}{{/if}}){{/if}}
{{/each}}
{{/if}}

{{#if actualYield}}
Actual Yield Provided: {{actualYield.amount}} {{actualYield.unit}} of {{actualYield.formula}}
{{/if}}

Return the output in the specified JSON format.
\`,
});

const solveStoichiometryProblemFlow = ai.defineFlow(
  {
    name: 'solveStoichiometryProblemFlow',
    inputSchema: StoichiometryInputSchema,
    outputSchema: StoichiometryOutputSchema,
  },
  async (input) => {
    // Basic input validation
    if (!input.unbalancedEquation || input.reactants.length === 0) {
        return { errorMessage: "Equation and at least one reactant are required." , calculationLog: [] };
    }

    const { output } = await prompt(input);
    if (!output) {
        return { errorMessage: "AI failed to generate a response.", calculationLog: [] };
    }
    return output;
  }
);
*/
