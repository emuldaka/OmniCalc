// src/actions/ai-actions.ts
"use server";

import { understandCalculationIntent } from "@/ai/flows/understand-calculation-intent";

interface AiProcessResult {
  calculation?: string;
  evaluatedResult?: number;
  error?: string;
}

// Basic expression evaluator (safer than eval)
function evaluateExpression(expression: string): number | string {
  try {
    // Sanitize the expression: allow numbers, basic operators, parentheses, decimal points.
    // This is a very basic sanitizer and might need to be more robust for complex math.
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
    if (sanitizedExpression !== expression) {
      // Potentially harmful characters were removed or expression was malformed
      // For safety, one might choose to throw an error here or handle it differently.
      // For now, we try to evaluate the sanitized one but this indicates a potential issue.
    }

    // Using Function constructor for safer evaluation than direct eval()
    // It evaluates the code in the global scope, not the local scope of the function.
    const result = new Function('return ' + sanitizedExpression)();
    
    if (typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) {
      return result;
    } else {
      return "Error: Invalid calculation result";
    }
  } catch (e) {
    // console.error("Evaluation error:", e);
    return "Error: Could not evaluate expression";
  }
}


export async function processAiInput(expression: string): Promise<AiProcessResult> {
  try {
    const intentResult = await understandCalculationIntent({ expression });
    if (intentResult && intentResult.calculation) {
      const evaluated = evaluateExpression(intentResult.calculation);
      if (typeof evaluated === 'number') {
        return { calculation: intentResult.calculation, evaluatedResult: evaluated };
      } else {
        // evaluated is an error string
        return { calculation: intentResult.calculation, error: evaluated };
      }
    }
    return { error: "AI could not understand the expression." };
  } catch (error) {
    // console.error("AI processing error:", error);
    let errorMessage = "An error occurred while processing with AI.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
