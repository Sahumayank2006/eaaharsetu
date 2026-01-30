'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest meal plans to farmers using their surplus crops.
 *
 * The flow takes surplus crops as input and returns a list of suggested meal plans.
 * - suggestSurplusMealPlans - A function that suggests meal plans based on surplus crops.
 * - SuggestSurplusMealPlansInput - The input type for the suggestSurplusMealPlans function.
 * - SuggestSurplusMealPlansOutput - The return type for the suggestSurplusMealPlans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSurplusMealPlansInputSchema = z.object({
  surplusCrops: z
    .array(z.string())
    .describe('A list of surplus crops that the farmer has available.'),
});
export type SuggestSurplusMealPlansInput = z.infer<typeof SuggestSurplusMealPlansInputSchema>;

const SuggestSurplusMealPlansOutputSchema = z.object({
  mealPlans: z
    .array(z.string())
    .describe('A list of suggested meal plans using the surplus crops.'),
});
export type SuggestSurplusMealPlansOutput = z.infer<typeof SuggestSurplusMealPlansOutputSchema>;

export async function suggestSurplusMealPlans(input: SuggestSurplusMealPlansInput): Promise<SuggestSurplusMealPlansOutput> {
  return suggestSurplusMealPlansFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSurplusMealPlansPrompt',
  input: {schema: SuggestSurplusMealPlansInputSchema},
  output: {schema: SuggestSurplusMealPlansOutputSchema},
  prompt: `You are a chef specializing in creating meal plans that utilize surplus crops to reduce waste.

  Given the following surplus crops, suggest meal plans that incorporate these ingredients. Provide multiple options.

  Surplus Crops:
  {{#each surplusCrops}}
  - {{{this}}}
  {{/each}}`,
});

const suggestSurplusMealPlansFlow = ai.defineFlow(
  {
    name: 'suggestSurplusMealPlansFlow',
    inputSchema: SuggestSurplusMealPlansInputSchema,
    outputSchema: SuggestSurplusMealPlansOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
