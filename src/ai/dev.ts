import { config } from 'dotenv';
config();

import '@/ai/flows/predict-crop-spoilage.ts';
import '@/ai/flows/suggest-surplus-meal-plans.ts';
import '@/ai/flows/optimize-route.ts';
