'use server';
/**
 * @fileOverview This file defines a Genkit flow to optimize a delivery route.
 *
 * The flow takes a start location, a list of delivery points, and an optional end location,
 * and returns an optimized route with estimated distance and time.
 * - optimizeRoute - A function that handles the route optimization process.
 * - OptimizeRouteInput - The input type for the optimizeRoute function.
 * - OptimizeRouteOutput - The return type for the optimizeRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteInputSchema = z.object({
  startLocation: z.string().describe('The starting point of the delivery route.'),
  deliveryPoints: z
    .array(z.string())
    .describe('A list of locations where deliveries need to be made.'),
  endLocation: z.string().optional().describe('The final destination of the route. If not provided, it is assumed to be the start location.'),
});
export type OptimizeRouteInput = z.infer<typeof OptimizeRouteInputSchema>;

const RouteStopSchema = z.object({
    location: z.string().describe("The specific address or location of the stop."),
    instructions: z.string().describe("Specific instructions for this stop, e.g., 'Pickup 10 crates of tomatoes' or 'Deliver to loading bay 3'.")
});

const OptimizeRouteOutputSchema = z.object({
  optimizedRoute: z
    .array(RouteStopSchema)
    .describe('The optimized sequence of stops, including the start and end points.'),
  totalDistance: z
    .string()
    .describe('The total estimated distance for the entire route (e.g., "125 km").'),
  estimatedTime: z
    .string()
    .describe('The total estimated travel time for the entire route (e.g., "3 hours 45 minutes").'),
});
export type OptimizeRouteOutput = z.infer<typeof OptimizeRouteOutputSchema>;

export async function optimizeRoute(input: OptimizeRouteInput): Promise<OptimizeRouteOutput> {
  return optimizeRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRoutePrompt',
  input: {schema: OptimizeRouteInputSchema},
  output: {schema: OptimizeRouteOutputSchema},
  prompt: `You are a logistics expert specializing in route optimization for agricultural produce delivery.

  Your task is to create the most efficient delivery route based on the provided locations. Consider factors like typical traffic conditions and logical geographical sequencing to minimize travel time and distance.

  The route must start at the specified start location and visit all delivery points. If an end location is provided, the route should end there. Otherwise, it should be a round trip, ending at the start location.

  Start Location: {{{startLocation}}}
  
  Delivery Points:
  {{#each deliveryPoints}}
  - {{{this}}}
  {{/each}}

  {{#if endLocation}}
  End Location: {{{endLocation}}}
  {{/if}}

  Provide the final optimized route as an ordered list of stops, with a clear total distance and estimated time for the entire journey. For each stop, provide a clear instruction.`,
});

const optimizeRouteFlow = ai.defineFlow(
  {
    name: 'optimizeRouteFlow',
    inputSchema: OptimizeRouteInputSchema,
    outputSchema: OptimizeRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
