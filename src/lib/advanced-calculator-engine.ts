// src/lib/advanced-calculator-engine.ts

export interface AdvancedCalculatorState {
  currentInput: string; // Current number being typed or result of last operation
  expression: string; // Full mathematical expression string being built
  displayValue: string; // Value shown on the main display line
  isRadians: boolean; // True for radians, false for degrees (for trig functions)
  secondFunctionActive: boolean; // True if "2nd" key is active
  openParentheses: number; // Count of open parentheses
  error: string | null; // Error message, if any
  overwrite: boolean; // If next digit should overwrite currentInput or append
}

export const initialState: AdvancedCalculatorState = {
  currentInput: "0",
  expression: "",
  displayValue: "0",
  isRadians: true, // Default to Radians
  secondFunctionActive: false,
  openParentheses: 0,
  error: null,
  overwrite: true,
};

export type AdvancedCalculatorAction =
  | { type: "INPUT_DIGIT"; payload: string }
  | { type: "INPUT_CONSTANT"; payload: string } // 'π', 'e'
  | { type: "INPUT_DECIMAL" }
  | { type: "INPUT_OPERATOR"; payload: string } // For binary operators +, -, ×, ÷, ^, mod
  | { type: "INPUT_UNARY_OPERATOR"; payload: string } // For log, ln, sin, cos, tan, √, 1/x, neg
  | { type: "INPUT_PARENTHESIS"; payload: "(" | ")" }
  | { type: "TOGGLE_SECOND_FUNCTION" }
  | { type: "TOGGLE_ANGLE_MODE" } // Rad/Deg
  | { type: "EVALUATE" }
  | { type: "CLEAR_ENTRY" } // CE
  | { type: "CLEAR_ALL" }   // AC
  | { type: "BACKSPACE" };

// Helper to sanitize and prepare expression for evaluation
const prepareExpressionForEval = (expr: string, isRadians: boolean): string => {
  let prepared = expr;
  
  // Replace visual operators with JS operators/functions
  prepared = prepared.replace(/×/g, "*");
  prepared = prepared.replace(/÷/g, "/");
  prepared = prepared.replace(/π/g, "Math.PI");
  prepared = prepared.replace(/e(?![a-zA-Z])/g, "Math.E"); // 'e' constant, not part of 'exp' or other words
  prepared = prepared.replace(/\^/g, "**"); // Exponentiation
  
  // Modulo operator
  prepared = prepared.replace(/mod/g, "%");

  // Factorial: This is tricky as it's not a direct Math function and needs a loop or recursion.
  // For simplicity in this step, we'll skip direct factorial replacement here.
  // It would require parsing out the number before '!' and replacing 'N!' with a factorial function call.

  // Square root
  prepared = prepared.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
  prepared = prepared.replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)"); // For √number without parens

  // Logs
  prepared = prepared.replace(/log\(([^)]+)\)/g, "Math.log10($1)");
  prepared = prepared.replace(/ln\(([^)]+)\)/g, "Math.log($1)");
  
  // Inverse log/ln (10^x, e^x)
  prepared = prepared.replace(/10\^\(([^)]+)\)/g, "Math.pow(10, $1)");
  prepared = prepared.replace(/e\^\(([^)]+)\)/g, "Math.exp($1)");

  // Trigonometric functions
  const trigReplacements: { [key: string]: string } = {
    "sin(": "Math.sin(", "cos(": "Math.cos(", "tan(": "Math.tan(",
    "asin(": "Math.asin(", "acos(": "Math.acos(", "atan(": "Math.atan(",
  };

  for (const func in trigReplacements) {
    const regex = new RegExp(func.replace("(", "\\(") + "([^)]+)\\)", "g");
    prepared = prepared.replace(regex, (match, angle) => {
      if (isRadians || func.includes("asin") || func.includes("acos") || func.includes("atan")) { // Inverse trig functions return radians
        return `${trigReplacements[func]}${angle})`;
      } else { // Convert degrees to radians for standard trig
        return `${trigReplacements[func]}(${angle} * Math.PI / 180)`;
      }
    });
  }
  
  return prepared;
};


export function advancedCalculatorReducer(state: AdvancedCalculatorState, action: AdvancedCalculatorAction): AdvancedCalculatorState {
  if (state.error && action.type !== "CLEAR_ALL" && action.type !== "CLEAR_ENTRY") {
    return state; // Only allow clear if in error state
  }

  let newExpression = state.expression;
  let newCurrentInput = state.currentInput;
  let newOverwrite = state.overwrite;
  let newDisplayValue = state.displayValue;

  switch (action.type) {
    case "INPUT_DIGIT":
      if (newOverwrite) {
        newCurrentInput = action.payload;
        newExpression += action.payload; // Append to expression if starting new number after op
      } else {
        newCurrentInput = newCurrentInput === "0" ? action.payload : newCurrentInput + action.payload;
        newExpression = state.expression.slice(0, state.expression.length - state.currentInput.length) + newCurrentInput;
      }
      newOverwrite = false;
      newDisplayValue = newCurrentInput;
      break;

    case "INPUT_DECIMAL":
      if (newOverwrite) {
        newCurrentInput = "0.";
        newExpression += "0.";
        newOverwrite = false;
      } else if (!newCurrentInput.includes(".")) {
        newCurrentInput += ".";
        newExpression += ".";
      }
      newDisplayValue = newCurrentInput;
      break;

    case "INPUT_CONSTANT": // π, e
      newCurrentInput = action.payload; // Display constant symbol
      newExpression += action.payload;
      newOverwrite = true; // Next op or number will use this
      newDisplayValue = newCurrentInput;
      break;

    case "INPUT_OPERATOR": // +, -, ×, ÷, ^, mod
      if (newCurrentInput === "Error") return state;
      // Prevent multiple operators in a row, or leading operator if expression is empty
      const lastChar = newExpression.trim().slice(-1);
      if (["+", "-", "×", "÷", "^", "%"].includes(lastChar) && action.payload !== "-") { // allow negative sign after operator
          // Replace last operator if a new one is pressed (except for negation)
          if (newExpression.length > 0) {
            newExpression = newExpression.trim().slice(0, -1) + action.payload;
          }
      } else {
        newExpression += action.payload;
      }
      newCurrentInput = "0"; // Reset current input for next number
      newOverwrite = true;
      newDisplayValue = "0"; // Or keep showing expression? For now, reset for next input.
      break;
      
    case "INPUT_UNARY_OPERATOR": { // log(, ln(, sin(, cos(, tan(, √, 1/x, neg
      const op = action.payload;
      if (newCurrentInput === "Error") return state;

      if (op === "neg") {
        if (newCurrentInput !== "0" && !newCurrentInput.startsWith("-")) {
          newCurrentInput = "-" + newCurrentInput;
           newExpression = state.expression.slice(0, state.expression.length - (newCurrentInput.length-1)) + newCurrentInput;

        } else if (newCurrentInput.startsWith("-")) {
          newCurrentInput = newCurrentInput.substring(1);
          newExpression = state.expression.slice(0, state.expression.length - (newCurrentInput.length+1)) + newCurrentInput;
        }
        newDisplayValue = newCurrentInput;
      } else if (op === "1/x") {
         newExpression += `(1/${newCurrentInput})`;
         // The evaluation will handle this. We set overwrite true so the result populates currentInput.
         newOverwrite = true;
      } else { // Functions like sin(, log( etc.
        newExpression += `${op}(`; // Append function and open parenthesis
        newCurrentInput = "0";
        newOverwrite = true; // Ready for input inside parenthesis
        return { ...state, expression: newExpression, currentInput: "0", displayValue: "0", openParentheses: state.openParentheses +1, overwrite: true, error: null };
      }
       newDisplayValue = newCurrentInput; // Should be result after eval for 1/x
      break;
    }


    case "INPUT_PARENTHESIS":
      if (action.payload === "(") {
        newExpression += "(";
        return { ...state, expression: newExpression, openParentheses: state.openParentheses + 1, currentInput: "0", displayValue: "0", overwrite: true, error: null };
      } else { // ")"
        if (state.openParentheses > 0) {
          newExpression += ")";
          return { ...state, expression: newExpression, openParentheses: state.openParentheses - 1, currentInput: state.currentInput, displayValue: state.currentInput, overwrite: true, error: null }; // currentInput might be the number before ')'
        }
      }
      break;

    case "EVALUATE":
      if (state.expression.trim() === "" || state.openParentheses > 0) {
        return { ...state, error: state.openParentheses > 0 ? "Unclosed parentheses" : "Invalid Expression", displayValue: "Error" };
      }
      try {
        const finalExpression = prepareExpressionForEval(state.expression, state.isRadians);
        const result = new Function('return ' + finalExpression)();
        
        if (typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) {
          const resultStr = parseFloat(result.toPrecision(12)).toString(); // Limit precision
          return {
            ...initialState, // Reset most state
            currentInput: resultStr,
            displayValue: resultStr,
            expression: state.expression + "=", // Show original expression
            isRadians: state.isRadians, // Persist mode
            secondFunctionActive: false, // Reset 2nd func
            overwrite: true,
          };
        } else {
          return { ...state, error: "Calculation Error", displayValue: "Error" };
        }
      } catch (e) {
        // console.error("Evaluation error:", e);
        return { ...state, error: "Syntax Error", displayValue: "Error" };
      }

    case "TOGGLE_SECOND_FUNCTION":
      return { ...state, secondFunctionActive: !state.secondFunctionActive };

    case "TOGGLE_ANGLE_MODE":
      return { ...state, isRadians: !state.isRadians };

    case "CLEAR_ENTRY": // CE
      // Clears the current number input, but not the whole expression
      if (!state.overwrite && state.currentInput !== "0") {
        newExpression = state.expression.slice(0, state.expression.length - state.currentInput.length);
      } // If overwrite is true, currentInput is "0" or result, CE shouldn't erase expression part from previous step
      return { ...state, currentInput: "0", displayValue: "0", error: null, overwrite: true };
      
    case "CLEAR_ALL": // AC
      return { ...initialState, isRadians: state.isRadians }; // Keep angle mode

    case "BACKSPACE":
      if (newOverwrite || newCurrentInput === "0") break; // Nothing to delete or currentInput is a result
      if (newCurrentInput.length === 1 || (newCurrentInput.startsWith("-") && newCurrentInput.length === 2)) {
        newCurrentInput = "0";
        newOverwrite = true;
      } else {
        newCurrentInput = newCurrentInput.slice(0, -1);
      }
      newExpression = state.expression.slice(0, state.expression.length - 1); // Simplistic backspace for expression
      newDisplayValue = newCurrentInput;
      break;

    default:
      return state;
  }
  
  return { ...state, expression: newExpression, currentInput: newCurrentInput, displayValue: newDisplayValue, overwrite: newOverwrite, error: null };
}


export const scientificCalculatorButtons: Array<{
  label: string;
  action: AdvancedCalculatorAction;
  secondLabel?: string;
  secondAction?: AdvancedCalculatorAction;
  className?: string;
  span?: number; // For grid column span
}> = [
  // Row 1
  { label: "2nd", action: { type: "TOGGLE_SECOND_FUNCTION" }, className: "bg-primary/80 hover:bg-primary text-primary-foreground" },
  { label: "π", action: { type: "INPUT_CONSTANT", payload: "π" } },
  { label: "e", action: { type: "INPUT_CONSTANT", payload: "e" } },
  { label: "C", action: { type: "CLEAR_ALL" }, className: "bg-destructive/70 hover:bg-destructive text-destructive-foreground" },
  { label: "CE", action: { type: "CLEAR_ENTRY" }, className: "bg-destructive/70 hover:bg-destructive text-destructive-foreground" },
  { label: "⌫", action: { type: "BACKSPACE" } },
  // Row 2
  { label: "x²", action: { type: "INPUT_OPERATOR", payload: "^2" }, secondLabel: "x³", secondAction: { type: "INPUT_OPERATOR", payload: "^3" }}, // Simplified: x^2 will be expression string x + "^2"
  { label: "1/x", action: { type: "INPUT_UNARY_OPERATOR", payload: "1/x" } },
  { label: "|x|", action: { type: "INPUT_UNARY_OPERATOR", payload: "abs(" } }, // abs will become Math.abs(
  { label: "exp", action: { type: "INPUT_OPERATOR", payload: "E" } }, // For scientific notation 1.2E3
  { label: "mod", action: { type: "INPUT_OPERATOR", payload: "mod" } },
  { label: "÷", action: { type: "INPUT_OPERATOR", payload: "÷" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  // Row 3
  { label: "x^y", action: { type: "INPUT_OPERATOR", payload: "^" }, secondLabel: "y√x", secondAction: { type: "INPUT_OPERATOR", payload: "^(1/" } }, // Power root
  { label: "7", action: { type: "INPUT_DIGIT", payload: "7" } },
  { label: "8", action: { type: "INPUT_DIGIT", payload: "8" } },
  { label: "9", action: { type: "INPUT_DIGIT", payload: "9" } },
  { label: "(", action: { type: "INPUT_PARENTHESIS", payload: "(" } },
  { label: "×", action: { type: "INPUT_OPERATOR", payload: "×" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  // Row 4
  { label: "10^x", action: { type: "INPUT_UNARY_OPERATOR", payload: "10^(" }, secondLabel: "log", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "log(" } }, // log base 10
  { label: "4", action: { type: "INPUT_DIGIT", payload: "4" } },
  { label: "5", action: { type: "INPUT_DIGIT", payload: "5" } },
  { label: "6", action: { type: "INPUT_DIGIT", payload: "6" } },
  { label: ")", action: { type: "INPUT_PARENTHESIS", payload: ")" } },
  { label: "-", action: { type: "INPUT_OPERATOR", payload: "-" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  // Row 5
  { label: "e^x", action: { type: "INPUT_UNARY_OPERATOR", payload: "e^(" }, secondLabel: "ln", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "ln(" } }, // Natural log
  { label: "1", action: { type: "INPUT_DIGIT", payload: "1" } },
  { label: "2", action: { type: "INPUT_DIGIT", payload: "2" } },
  { label: "3", action: { type: "INPUT_DIGIT", payload: "3" } },
  { label: "√", action: { type: "INPUT_UNARY_OPERATOR", payload: "√" } }, // Square root
  { label: "+", action: { type: "INPUT_OPERATOR", payload: "+" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  // Row 6
  { label: "Rad/Deg", action: { type: "TOGGLE_ANGLE_MODE" } },
  { label: "sin", action: { type: "INPUT_UNARY_OPERATOR", payload: "sin(" }, secondLabel: "asin", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "asin(" } },
  { label: "cos", action: { type: "INPUT_UNARY_OPERATOR", payload: "cos(" }, secondLabel: "acos", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "acos(" } },
  { label: "tan", action: { type: "INPUT_UNARY_OPERATOR", payload: "tan(" }, secondLabel: "atan", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "atan(" } },
  { label: "0", action: { type: "INPUT_DIGIT", payload: "0" } },
  { label: ".", action: { type: "INPUT_DECIMAL" } },
  // Row 7 - Spanning some buttons maybe
  { label: "±", action: { type: "INPUT_UNARY_OPERATOR", payload: "neg" } }, // Negate current number
  // { label: "MR", action: { type: "MEMORY_RECALL" } }, // Memory functions if added
  // { label: "M+", action: { type: "MEMORY_ADD" } },
  { label: "=", action: { type: "EVALUATE" }, className: "col-span-2 bg-primary hover:bg-primary/90 text-primary-foreground" }, // Make equals span more columns
];
// Note: x², x³, |x|, exp, y√x, 10^x, e^x will need specific handling in INPUT_UNARY_OPERATOR or INPUT_OPERATOR
// to correctly form expressions like 'Math.pow(current, 2)' or 'Math.abs(current)'.
// The current 'INPUT_OPERATOR' for x^y works by adding '^' to expression. x² can be `^(2)`.
// For simplicity some functions like `x²` `10^x` are treated as unary operators that start a sequence e.g. `10^(`
// The current input of x² might be better as currentInput + "^(2)" or it should directly evaluate currentInput^2
// The current engine needs more robust logic for unary vs binary ops and expression building.
// For instance, 'sin(' should make the calculator expect input for the sin function.

// The `x²` button is simplified to be an operator that appends "^2" to the expression. 
// A more robust solution would evaluate `Math.pow(currentNumber, 2)` immediately
// or integrate it better into the expression parser.
// Similarly for `10^x` which becomes `10^(`. A dedicated unary action would be `Math.pow(10, currentInput)`.
// The current approach relies heavily on the `prepareExpressionForEval` to correctly form Math calls.
// The `INPUT_UNARY_OPERATOR` logic needs significant expansion to handle cases like `sin`, `cos`
// correctly, potentially by wrapping the `currentInput` or preparing for new input within `Math.sin(...)`.
// The current implementation of `INPUT_UNARY_OPERATOR` for `sin(` just appends `sin(` to the expression.
// This structure provides a foundation. Each specific function's interaction with the expression string and
// current input needs careful implementation within the reducer.
