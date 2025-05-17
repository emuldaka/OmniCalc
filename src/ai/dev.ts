
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-calculation-history.ts';
import '@/ai/flows/understand-calculation-intent.ts';
import '@/ai/flows/solve-stoichiometry-problem.ts'; // Added new flow
