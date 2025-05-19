// src/actions/ai-actions.ts
"use server";

// import { understandCalculationIntent } from "@/ai/flows/understand-calculation-intent";
// import { solveStoichiometryProblem as solveStoichiometryProblemFlow, type StoichiometryInput, type StoichiometryOutput } from "@/ai/flows/solve-stoichiometry-problem";
import type { StoichiometryInput, StoichiometryOutput } from "@/ai/flows/solve-stoichiometry-problem";


interface AiProcessResult {
  calculation?: string;
  evaluatedResult?: number;
  error?: string;
}

// Basic expression evaluator (safer than eval)
function evaluateExpression(expression: string): number | string {
  try {
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
    if (sanitizedExpression !== expression) {
      // Potentially harmful characters were removed
    }
    const result = new Function('return ' + sanitizedExpression)();
    if (typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) {
      return result;
    } else {
      return "Error: Invalid calculation result";
    }
  } catch (e) {
    return "Error: Could not evaluate expression";
  }
}


export async function processAiInput(expression: string): Promise<AiProcessResult> {
  // For static export, AI processing is not available.
  // const intentResult = await understandCalculationIntent({ expression });
  // if (intentResult && intentResult.calculation) {
  //   const evaluated = evaluateExpression(intentResult.calculation);
  //   if (typeof evaluated === 'number') {
  //     return { calculation: intentResult.calculation, evaluatedResult: evaluated };
  //   } else {
  //     return { calculation: intentResult.calculation, error: evaluated };
  //   }
  // }
  // return { error: "AI could not understand the expression." };
  return { error: "AI-powered input is unavailable in this static version." };
}

// Server action for the new stoichiometry flow
export async function solveStoichiometryProblem(input: StoichiometryInput): Promise<StoichiometryOutput> {
  // For static export, AI processing is not available.
  // try {
  //   const result = await solveStoichiometryProblemFlow(input);
  //   return result;
  // } catch (error) {
  //   console.error("Stoichiometry flow error in action:", error);
  //   let errorMessage = "An error occurred while solving the stoichiometry problem with AI.";
  //   if (error instanceof Error) {
  //     errorMessage = error.message;
  //   }
  //   return {
  //     errorMessage: errorMessage,
  //     calculationLog: ["Server action failed to invoke AI flow."]
  //   };
  // }
   return {
      errorMessage: "AI Stoichiometry Solver is unavailable in this static version.",
      calculationLog: ["AI processing is disabled for static export."]
    };
}
