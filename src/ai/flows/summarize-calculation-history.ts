'use server';

/**
 * @fileOverview Summarizes the user's calculation history to provide insights into their calculation habits.
 *
 * - summarizeCalculationHistory - A function that summarizes the calculation history.
 * - SummarizeCalculationHistoryInput - The input type for the summarizeCalculationHistory function.
 * - SummarizeCalculationHistoryOutput - The return type for the summarizeCalculationHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCalculationHistoryInputSchema = z.object({
  calculationHistory: z
    .string()
    .describe(
      'A string containing the user calculation history. Each calculation should be separated by a newline.'
    ),
});
export type SummarizeCalculationHistoryInput = z.infer<typeof SummarizeCalculationHistoryInputSchema>;

const SummarizeCalculationHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the calculation history.'),
  frequentCalculationTypes: z
    .string()
    .describe('The types of calculations performed most often.'),
  commonNumberRanges: z.string().describe('The common ranges of numbers used.'),
});
export type SummarizeCalculationHistoryOutput = z.infer<typeof SummarizeCalculationHistoryOutputSchema>;

export async function summarizeCalculationHistory(
  input: SummarizeCalculationHistoryInput
): Promise<SummarizeCalculationHistoryOutput> {
  return summarizeCalculationHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCalculationHistoryPrompt',
  input: {schema: SummarizeCalculationHistoryInputSchema},
  output: {schema: SummarizeCalculationHistoryOutputSchema},
  prompt: `You are an AI assistant that analyzes a user's calculation history and provides insights.

  Analyze the following calculation history:
  {{calculationHistory}}

  Provide a summary of the calculation history, identify the most frequent calculation types (e.g., unit conversions, basic arithmetic), and the common ranges of numbers used. Return the output as a JSON object.
  `,
});

const summarizeCalculationHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeCalculationHistoryFlow',
    inputSchema: SummarizeCalculationHistoryInputSchema,
    outputSchema: SummarizeCalculationHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
