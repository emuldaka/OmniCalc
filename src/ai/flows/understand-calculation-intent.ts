'use server';

/**
 * @fileOverview This flow uses AI to understand a calculation intent expressed in natural language.
 *
 * - understandCalculationIntent - A function that takes a natural language expression of a calculation and returns the calculation.
 * - UnderstandCalculationIntentInput - The input type for the understandCalculationIntent function.
 * - UnderstandCalculationIntentOutput - The return type for the understandCalculationIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UnderstandCalculationIntentInputSchema = z.object({
  expression: z
    .string()
    .describe(
      'A natural language expression of a calculation, e.g., \'What is 15% of 200 plus 10?\''
    ),
});
export type UnderstandCalculationIntentInput = z.infer<
  typeof UnderstandCalculationIntentInputSchema
>;

const UnderstandCalculationIntentOutputSchema = z.object({
  calculation: z
    .string()
    .describe(
      'A calculation derived from the input expression that can be directly evaluated.'
    ),
});
export type UnderstandCalculationIntentOutput = z.infer<
  typeof UnderstandCalculationIntentOutputSchema
>;

export async function understandCalculationIntent(
  input: UnderstandCalculationIntentInput
): Promise<UnderstandCalculationIntentOutput> {
  // Static export: AI flow disabled
  // return understandCalculationIntentFlow(input);
  throw new Error("understandCalculationIntentFlow is disabled for static export.");
}

/*
const prompt = ai.definePrompt({
  name: 'understandCalculationIntentPrompt',
  input: {schema: UnderstandCalculationIntentInputSchema},
  output: {schema: UnderstandCalculationIntentOutputSchema},
  prompt: `You are a calculation assistant. Your job is to take a natural language expression of a calculation and return the calculation in a format that can be directly evaluated.

For example, if the input is \'What is 15% of 200 plus 10?\', you should return \'0.15 * 200 + 10\'.

Expression: {{{expression}}}
`,
});

const understandCalculationIntentFlow = ai.defineFlow(
  {
    name: 'understandCalculationIntentFlow',
    inputSchema: UnderstandCalculationIntentInputSchema,
    outputSchema: UnderstandCalculationIntentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
*/
