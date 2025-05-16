// src/lib/advanced-calculator-engine.ts

export interface AdvancedCalculatorState {
  currentInput: string;
  expression: string;
  displayValue: string;
  isRadians: boolean;
  secondFunctionActive: boolean;
  openParentheses: number;
  error: string | null;
  overwrite: boolean;
}

export const initialState: AdvancedCalculatorState = {
  currentInput: "0",
  expression: "",
  displayValue: "0",
  isRadians: true,
  secondFunctionActive: false,
  openParentheses: 0,
  error: null,
  overwrite: true,
};

export type AdvancedCalculatorAction =
  | { type: "INPUT_DIGIT"; payload: string }
  | { type: "INPUT_CONSTANT"; payload: string }
  | { type: "INPUT_DECIMAL" }
  | { type: "INPUT_OPERATOR"; payload: string }
  | { type: "INPUT_UNARY_OPERATOR"; payload: string } // For functions like sin(, log( that expect further input
  | { type: "APPLY_POSTFIX_UNARY"; payload: "square" | "reciprocal" | "factorial" | "negate" | "cube" } // For immediate operations like x², 1/x, n!, +/-
  | { type: "INPUT_PARENTHESIS"; payload: "(" | ")" }
  | { type: "TOGGLE_SECOND_FUNCTION" }
  | { type: "TOGGLE_ANGLE_MODE" }
  | { type: "EVALUATE" }
  | { type: "CLEAR_ENTRY" }
  | { type: "CLEAR_ALL" }
  | { type: "BACKSPACE" };

// Helper for factorial
function factorial(n: number): number {
  if (n < 0) throw new Error("Factorial of negative");
  if (Math.floor(n) !== n) throw new Error("Factorial of non-integer");
  if (n === 0 || n === 1) return 1;
  if (n > 170) throw new Error("Factorial result too large"); // Max for JS standard numbers
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

const prepareExpressionForEval = (expr: string, isRadians: boolean): string => {
  let prepared = expr;
  prepared = prepared.replace(/×/g, "*");
  prepared = prepared.replace(/÷/g, "/");
  prepared = prepared.replace(/π/g, "Math.PI");
  prepared = prepared.replace(/(?<![a-zA-Z0-9_])e(?![a-zA-Z0-9_])/g, "Math.E"); // Whole word 'e'
  prepared = prepared.replace(/\^/g, "**");
  prepared = prepared.replace(/mod/g, "%");

  prepared = prepared.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
  prepared = prepared.replace(/log\(([^)]+)\)/g, "Math.log10($1)");
  prepared = prepared.replace(/ln\(([^)]+)\)/g, "Math.log($1)");
  
  prepared = prepared.replace(/abs\(([^)]+)\)/g, "Math.abs($1)");
  prepared = prepared.replace(/10\^\(([^)]+)\)/g, "Math.pow(10, $1)");


  const trigFuncs = ["sin", "cos", "tan", "asin", "acos", "atan"];
  trigFuncs.forEach(func => {
    const regex = new RegExp(`${func}\\(([^)]+)\\)`, "g");
    prepared = prepared.replace(regex, (match, angleExpr) => {
      // For inverse trig functions, the result is always in radians.
      // For regular trig functions, convert degrees to radians if in DEG mode.
      if (func.startsWith("a")) { // asin, acos, atan
        return `Math.${func}(${angleExpr})`; // Result will be in Radians
      } else if (!isRadians) { // sin, cos, tan in Degree mode
        return `Math.${func}((${angleExpr}) * Math.PI / 180)`;
      }
      return `Math.${func}(${angleExpr})`; // Radian mode or already handled
    });
  });
  
  // Handle scientific notation like 1.2E3, ensuring E isn't Math.E
  // This is usually handled by JS native parsing, but ensure "E" is not replaced if it's for notation.
  // The regex for 'e' constant above tries to avoid this: (?<![a-zA-Z0-9_])e(?![a-zA-Z0-9_])

  return prepared;
};


export function advancedCalculatorReducer(state: AdvancedCalculatorState, action: AdvancedCalculatorAction): AdvancedCalculatorState {
  if (state.error && action.type !== "CLEAR_ALL" && action.type !== "CLEAR_ENTRY") {
    return state;
  }

  let newExpression = state.expression;
  let newCurrentInput = state.currentInput;
  let newOverwrite = state.overwrite;
  let newDisplayValue = state.displayValue;

  switch (action.type) {
    case "INPUT_DIGIT":
      if (newOverwrite || newCurrentInput === "Error") {
        newCurrentInput = action.payload;
        if (state.overwrite && !["+", "-", "×", "÷", "^", "%", "("].includes(newExpression.slice(-1)) && newExpression !== "") {
           // If overwriting after a full number, expression should also reset or append carefully
           // For simplicity, if a full number result was there, new digit starts new expression segment
           if (state.expression.endsWith("=")) newExpression = action.payload;
           else newExpression += action.payload;
        } else {
          newExpression += action.payload;
        }

      } else {
        newCurrentInput = newCurrentInput === "0" ? action.payload : newCurrentInput + action.payload;
        // Replace the old currentInput part in expression with the new one
        const lastNumRegex = new RegExp(state.currentInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
        if (state.currentInput !== "0" || state.expression.endsWith("0")) { // Avoid replacing "0" if it's part of "log(0"
            newExpression = newExpression.replace(lastNumRegex, newCurrentInput);
        } else { // If currentInput was "0" and expression didn't end with it (e.g. after an operator)
            newExpression += newCurrentInput;
        }
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
        newExpression += "."; // Append to expression directly
      }
      newDisplayValue = newCurrentInput;
      break;

    case "INPUT_CONSTANT": // π, e
      newCurrentInput = action.payload;
      newExpression += action.payload;
      newOverwrite = true;
      newDisplayValue = action.payload; // Show the constant symbol
      break;

    case "INPUT_OPERATOR": // +, -, ×, ÷, ^, mod, E (for sci notation)
      if (newCurrentInput === "Error") return state;
      const lastChar = newExpression.trim().slice(-1);
      const operators = ["+", "-", "×", "÷", "^", "%"];
      if (operators.includes(lastChar) && action.payload !== "-" && !newExpression.endsWith("E")) {
        if (newExpression.length > 0) {
          newExpression = newExpression.trim().slice(0, -1) + action.payload;
        }
      } else if (action.payload === "E" && (newCurrentInput.includes("E") || newCurrentInput === "0" || newOverwrite)) {
        // Prevent "EE" or "0E" or adding "E" after an operator
      } else if (action.payload === "E") {
        newExpression = newExpression.slice(0, newExpression.length - newCurrentInput.length) + newCurrentInput + "E";
        newCurrentInput += "E";
        newOverwrite = false; // Allow digits after E
      }
      else {
        newExpression += action.payload;
        newOverwrite = true;
      }
      if (action.payload !== "E") { // Only reset currentInput if not adding scientific notation E
        newCurrentInput = "0"; // Reset for next number
        newDisplayValue = "0";
      } else {
        newDisplayValue = newCurrentInput;
      }
      break;
      
    case "INPUT_UNARY_OPERATOR": // log(, ln(, sin(, cos(, tan(, √, abs( etc.
      if (newCurrentInput === "Error") return state;
      const funcWithParen = `${action.payload}(`;
      newExpression += funcWithParen;
      newCurrentInput = "0";
      newOverwrite = true; 
      newDisplayValue = "0";
      return { ...state, expression: newExpression, currentInput: "0", displayValue: "0", openParentheses: state.openParentheses +1, overwrite: true, error: null, secondFunctionActive: false };


    case "APPLY_POSTFIX_UNARY": {
      if (state.currentInput === "Error") return state;
      if (state.overwrite && state.currentInput === "0" && state.expression === "") return state; // No op on initial 0

      let numToOperateStr = state.currentInput;
      let exprToUpdate = state.expression;

      // If overwriting a result, operate on that result
      if (state.overwrite && state.currentInput !== "0") {
          // This means currentInput is a result of a previous op or a constant
      } else if (state.overwrite && state.currentInput === "0") {
          // This might happen if an operator was just pressed. We might want to operate on previous part of expression.
          // This part is complex. For now, let's assume it operates on current visually displayed number.
          // Or, if expression ends with operator, this implies currentInput might be "0" placeholder.
          // Let's disable for "0" if overwrite is true unless it's "negate"
          if (action.payload !== "negate") return state;
      }
      
      let numToOperate = parseFloat(numToOperateStr);
      if (isNaN(numToOperate) && action.payload !== "negate") return {...state, error: "Invalid input", displayValue: "Error"};

      let result: number;
      let resultStr: string;

      try {
        switch (action.payload) {
          case "negate":
            if (numToOperateStr === "0") { resultStr = "0"; break; }
            result = numToOperate * -1;
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          case "square": // x²
            result = Math.pow(numToOperate, 2);
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          case "cube": // x³
             result = Math.pow(numToOperate, 3);
             resultStr = parseFloat(result.toPrecision(12)).toString();
             break;
          case "reciprocal": // 1/x
            if (numToOperate === 0) throw new Error("Div by zero");
            result = 1 / numToOperate;
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          case "factorial": // n!
            result = factorial(numToOperate);
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          default: return state;
        }
      } catch (e: any) {
        return {...state, error: e.message || "Calculation Error", displayValue: "Error" };
      }

      if (resultStr && !Number.isFinite(parseFloat(resultStr))) return {...state, error: "Result too large", displayValue: "Error"};
      
      // Smartly update expression: replace the part of expression that was currentInput
      if (exprToUpdate.endsWith(state.currentInput) && state.currentInput !== "0" && !state.overwrite) { // if currentInput was typed
         newExpression = exprToUpdate.slice(0, exprToUpdate.length - state.currentInput.length) + resultStr;
      } else if (state.overwrite && state.expression.endsWith("=")) { // After an evaluation
         newExpression = resultStr;
      } else if (state.currentInput === "0" && action.payload === "negate" && exprToUpdate.slice(-1) === "-") { // Toggling sign on a minus
         newExpression = exprToUpdate.slice(0, -1); // remove trailing minus if it was for negation
         resultStr = "0"; // No change to currentInput which remains 0
      } else if (state.currentInput === "0" && action.payload === "negate" && !operators.includes(exprToUpdate.slice(-1))) {
         newExpression += "-"; // Add negative sign if current input is 0 and no op before
         resultStr = "0"; // currentInput remains 0, display is 0, expression gets "-"
      }
      else { // Append if it's a new operation or operating on a result that wasn't part of expression
         newExpression = resultStr; // Or state.expression + resultStr if appropriate
      }
      // If currentInput was "0" and it was for negation, expression might just need "-" prepended or removed
      // This logic for expression update is tricky.
      // A safer bet: the postfix unary op finalizes the current number.
      // The `expression` string is complex. If `currentInput` was `5` and expression was `10+5`.
      // Pressing `x²` -> `currentInput` becomes `25`. `expression` should be `10+25`.
      if (state.expression.endsWith(state.currentInput)) {
        newExpression = state.expression.substring(0, state.expression.length - state.currentInput.length) + resultStr;
      } else {
        // If currentInput was '0' because an op was just pressed, or it was a result
        // The expression needs to reflect the new value.
        // This part needs to be careful not to duplicate.
        // If expression was "10+" and currentInput "0" (placeholder), and negate is pressed, currentInput stays 0 but expression could be "10-"
        // However, "negate" is special as it can apply to a "0" that's about to be typed.
        // For other postfix, assume they operate on a concrete number.
        newExpression = resultStr; // Fallback: expression becomes the result if it's unclear
        if (state.previousOperand && state.operation) { // Check if there was a pending operation
            newExpression = `${state.previousOperand}${state.operation}${resultStr}`;
        }

      }


      return {
        ...state,
        currentInput: resultStr,
        displayValue: resultStr,
        expression: newExpression,
        overwrite: true,
        error: null,
        secondFunctionActive: false, // Postfix ops usually reset 2nd
      };
    }

    case "INPUT_PARENTHESIS":
      if (action.payload === "(") {
        newExpression += "(";
        return { ...state, expression: newExpression, openParentheses: state.openParentheses + 1, currentInput: "0", displayValue: "0", overwrite: true, error: null, secondFunctionActive: false };
      } else { // ")"
        if (state.openParentheses > 0) {
          newExpression += ")";
          // currentInput might be the number just before ')'
          return { ...state, expression: newExpression, openParentheses: state.openParentheses - 1, currentInput: state.currentInput, displayValue: state.currentInput, overwrite: true, error: null, secondFunctionActive: false };
        }
      }
      break;

    case "EVALUATE":
      if (state.expression.trim() === "" || state.openParentheses !== 0) {
        return { ...state, error: state.openParentheses !== 0 ? "Unclosed parentheses" : "Invalid Expression", displayValue: "Error" };
      }
      try {
        const finalExpressionToEval = prepareExpressionForEval(state.expression, state.isRadians);
        // console.log("Evaluating:", finalExpressionToEval);
        const result = new Function('return ' + finalExpressionToEval)();
        
        if (typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) {
          const resultStr = parseFloat(result.toPrecision(12)).toString();
          return {
            ...initialState,
            currentInput: resultStr,
            displayValue: resultStr,
            expression: state.expression + "=", 
            isRadians: state.isRadians,
            secondFunctionActive: false,
            overwrite: true,
          };
        } else {
          return { ...state, error: "Calculation Error", displayValue: "Error" };
        }
      } catch (e) {
        // console.error("Evaluation error:", e, "Original expr:", state.expression);
        return { ...state, error: "Syntax Error", displayValue: "Error" };
      }

    case "TOGGLE_SECOND_FUNCTION":
      return { ...state, secondFunctionActive: !state.secondFunctionActive };

    case "TOGGLE_ANGLE_MODE":
      return { ...state, isRadians: !state.isRadians, secondFunctionActive: false };

    case "CLEAR_ENTRY": 
      if (state.currentInput !== "0" && !state.overwrite) { // Typed something
        newExpression = state.expression.slice(0, state.expression.length - state.currentInput.length);
      } // else if overwrite is true, currentInput is "0" or a result, CE acts like AC for current stage
      return { ...state, currentInput: "0", displayValue: "0", error: null, overwrite: true, secondFunctionActive: false };
      
    case "CLEAR_ALL": 
      return { ...initialState, isRadians: state.isRadians };

    case "BACKSPACE":
      if (newOverwrite || newCurrentInput === "0" || newCurrentInput === "Error") break; 
      if (newCurrentInput.length === 1 || (newCurrentInput.startsWith("-") && newCurrentInput.length === 2)) {
        const removedChar = newCurrentInput;
        newCurrentInput = "0";
        newOverwrite = true;
        if (newExpression.endsWith(removedChar)) {
          newExpression = newExpression.slice(0, newExpression.length - removedChar.length);
        }
      } else {
        const removedChar = newCurrentInput.slice(-1);
        newCurrentInput = newCurrentInput.slice(0, -1);
         if (newExpression.endsWith(state.currentInput)) { // if currentInput was the last part of expression
            newExpression = newExpression.slice(0, newExpression.length - 1);
         } else if (newExpression.endsWith(removedChar)) { // more generic backspace from expression
            newExpression = newExpression.slice(0, -1);
         }
      }
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
  colSpan?: number; 
}> = [
  // Row 1
  { label: "2nd", action: { type: "TOGGLE_SECOND_FUNCTION" }, className: "bg-primary/70 hover:bg-primary/90 text-primary-foreground" },
  { label: "Rad", action: { type: "TOGGLE_ANGLE_MODE" }, secondLabel: "Deg", secondAction: {type: "TOGGLE_ANGLE_MODE"}},
  { label: "sin", action: { type: "INPUT_UNARY_OPERATOR", payload: "sin" }, secondLabel: "asin", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "asin" } },
  { label: "cos", action: { type: "INPUT_UNARY_OPERATOR", payload: "cos" }, secondLabel: "acos", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "acos" } },
  { label: "tan", action: { type: "INPUT_UNARY_OPERATOR", payload: "tan" }, secondLabel: "atan", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "atan" } },
  { label: "C", action: { type: "CLEAR_ALL" }, className: "bg-destructive/70 hover:bg-destructive text-destructive-foreground" },
  { label: "CE", action: { type: "CLEAR_ENTRY" }, className: "bg-destructive/70 hover:bg-destructive text-destructive-foreground" },
  { label: "⌫", action: { type: "BACKSPACE" } },
  { label: "÷", action: { type: "INPUT_OPERATOR", payload: "÷" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  
  // Row 2
  { label: "x^y", action: { type: "INPUT_OPERATOR", payload: "^" } }, // x power y
  { label: "x²", action: { type: "APPLY_POSTFIX_UNARY", payload: "square" }, secondLabel: "x³", secondAction: { type: "APPLY_POSTFIX_UNARY", payload: "cube" } },
  { label: "√", action: { type: "INPUT_UNARY_OPERATOR", payload: "√" } }, // Square root, expects (
  { label: "log", action: { type: "INPUT_UNARY_OPERATOR", payload: "log" }, secondLabel: "10^x", secondAction: {type: "INPUT_UNARY_OPERATOR", payload: "10^"} }, // log base 10
  { label: "ln", action: { type: "INPUT_UNARY_OPERATOR", payload: "ln" } }, // Natural log
  { label: "7", action: { type: "INPUT_DIGIT", payload: "7" } },
  { label: "8", action: { type: "INPUT_DIGIT", payload: "8" } },
  { label: "9", action: { type: "INPUT_DIGIT", payload: "9" } },
  { label: "×", action: { type: "INPUT_OPERATOR", payload: "×" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },

  // Row 3
  { label: "1/x", action: { type: "APPLY_POSTFIX_UNARY", payload: "reciprocal" } },
  { label: "π", action: { type: "INPUT_CONSTANT", payload: "π" } },
  { label: "e", action: { type: "INPUT_CONSTANT", payload: "e" } },
  { label: "(", action: { type: "INPUT_PARENTHESIS", payload: "(" } },
  { label: ")", action: { type: "INPUT_PARENTHESIS", payload: ")" } },
  { label: "4", action: { type: "INPUT_DIGIT", payload: "4" } },
  { label: "5", action: { type: "INPUT_DIGIT", payload: "5" } },
  { label: "6", action: { type: "INPUT_DIGIT", payload: "6" } },
  { label: "-", action: { type: "INPUT_OPERATOR", payload: "-" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  
  // Row 4
  { label: "|x|", action: { type: "INPUT_UNARY_OPERATOR", payload: "abs"} }, // Absolute value
  { label: "exp", action: { type: "INPUT_OPERATOR", payload: "E"} }, // For scientific notation like 1.2E3
  { label: "mod", action: { type: "INPUT_OPERATOR", payload: "mod"} },
  { label: "n!", action: { type: "APPLY_POSTFIX_UNARY", payload: "factorial" } },
  { label: "±", action: { type: "APPLY_POSTFIX_UNARY", payload: "negate" } },
  { label: "1", action: { type: "INPUT_DIGIT", payload: "1" } },
  { label: "2", action: { type: "INPUT_DIGIT", payload: "2" } },
  { label: "3", action: { type: "INPUT_DIGIT", payload: "3" } },
  { label: "+", action: { type: "INPUT_OPERATOR", payload: "+" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },

  // Row 5 - 9 columns
  // Invisible placeholders or merge cells to make 0 span 2 and = span 2. 5 buttons needed.
  // Span for 0, ., =. Total 9.
  // (empty), (empty), (empty), (empty), (empty)
  // (0 span 2), (.), (= span 2)
  // Let's make this row have fewer real buttons and rely on colSpan or adjust.
  // We need 4 empty spots if 0 is colSpan 2, . is 1, = is 2. (2+1+2 = 5). 9-5 = 4 empty.
  { label: "", action: {type: "INPUT_DIGIT", payload:""}, className:"invisible", colSpan: 4}, // Placeholder for spacing
  { label: "0", action: { type: "INPUT_DIGIT", payload: "0" }, colSpan: 2 },
  { label: ".", action: { type: "INPUT_DECIMAL" } },
  { label: "=", action: { type: "EVALUATE" }, className: "bg-primary hover:bg-primary/90 text-primary-foreground", colSpan: 2 },
];
