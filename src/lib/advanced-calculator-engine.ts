
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
  history: Array<{ id: string; expression: string; result: string }>;
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
  history: [],
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
  prepared = prepared.replace(/(?<![a-zA-Z0-9_])e(?![a-zA-Z0-9_])/g, "Math.E");
  prepared = prepared.replace(/\^/g, "**");
  
  prepared = prepared.replace(/√\(([^)]+)\)/g, "Math.sqrt($1)");
  prepared = prepared.replace(/log\(([^)]+)\)/g, "Math.log10($1)");
  prepared = prepared.replace(/ln\(([^)]+)\)/g, "Math.log($1)");
  
  prepared = prepared.replace(/abs\(([^)]+)\)/g, "Math.abs($1)");
  prepared = prepared.replace(/10\^\(([^)]+)\)/g, "Math.pow(10, $1)");


  const trigFuncs = ["sin", "cos", "tan", "asin", "acos", "atan"];
  trigFuncs.forEach(func => {
    const regex = new RegExp(`${func}\\(([^)]+)\\)`, "g");
    prepared = prepared.replace(regex, (match, angleExpr) => {
      if (func.startsWith("a")) { 
        return `Math.${func}(${angleExpr})`; 
      } else if (!isRadians) { 
        return `Math.${func}((${angleExpr}) * Math.PI / 180)`;
      }
      return `Math.${func}(${angleExpr})`; 
    });
  });
  
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
  let newHistory = state.history;
  const operators = ["+", "-", "×", "÷", "^", "%"];

  switch (action.type) {
    case "INPUT_DIGIT":
      if (newOverwrite || newCurrentInput === "Error") {
        newCurrentInput = action.payload;
        if (state.overwrite && !["+", "-", "×", "÷", "^", "(", "mod"].includes(newExpression.slice(-1)) && newExpression !== "" && !newExpression.endsWith("E") ) {
           if (state.expression.endsWith("=")) newExpression = action.payload;
           else newExpression += action.payload;
        } else {
          newExpression += action.payload;
        }

      } else {
        newCurrentInput = newCurrentInput === "0" ? action.payload : newCurrentInput + action.payload;
        const lastNumRegex = new RegExp(state.currentInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
        if (state.currentInput !== "0" || state.expression.endsWith("0")) { 
            newExpression = newExpression.replace(lastNumRegex, newCurrentInput);
        } else { 
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
        newExpression += "."; 
      }
      newDisplayValue = newCurrentInput;
      break;

    case "INPUT_CONSTANT": 
      newCurrentInput = action.payload;
      newExpression += action.payload;
      newOverwrite = true;
      newDisplayValue = action.payload; 
      break;

    case "INPUT_OPERATOR": 
      if (newCurrentInput === "Error") return state;
      const lastChar = newExpression.trim().slice(-1);
      
      if (operators.includes(lastChar) && action.payload !== "-" && !newExpression.endsWith("E")) {
        if (newExpression.length > 0) {
          newExpression = newExpression.trim().slice(0, -1) + action.payload;
        }
      } else if (action.payload === "E" && (newCurrentInput.includes("E") || newCurrentInput === "0" || newOverwrite)) {
        // Prevent "EE" or "0E" or adding "E" after an operator
      } else if (action.payload === "E") {
        newExpression = newExpression.slice(0, newExpression.length - newCurrentInput.length) + newCurrentInput + "E";
        newCurrentInput += "E";
        newOverwrite = false; 
      }
      else {
        newExpression += action.payload;
        newOverwrite = true;
      }
      if (action.payload !== "E") { 
        newCurrentInput = "0"; 
        newDisplayValue = "0";
      } else {
        newDisplayValue = newCurrentInput;
      }
      break;
      
    case "INPUT_UNARY_OPERATOR": 
      if (newCurrentInput === "Error") return state;
      const funcWithParen = `${action.payload}(`;
      newExpression += funcWithParen;
      newCurrentInput = "0";
      newOverwrite = true; 
      newDisplayValue = "0";
      return { ...state, expression: newExpression, currentInput: "0", displayValue: "0", openParentheses: state.openParentheses +1, overwrite: true, error: null, secondFunctionActive: false, history: newHistory };


    case "APPLY_POSTFIX_UNARY": {
      if (state.currentInput === "Error") return state;
      if (state.overwrite && state.currentInput === "0" && state.expression === "" && action.payload !== "negate") return state;

      let numToOperateStr = state.currentInput;
      let exprToUpdate = state.expression;
      
      let numToOperate = parseFloat(numToOperateStr);
      if (isNaN(numToOperate) && action.payload !== "negate") return {...state, error: "Invalid input", displayValue: "Error", history: newHistory};

      let result: number;
      let resultStr: string;

      try {
        switch (action.payload) {
          case "negate":
            if (numToOperateStr === "0") { resultStr = "0"; break; } 
            result = numToOperate * -1;
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          case "square": 
            result = Math.pow(numToOperate, 2);
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          case "cube": 
             result = Math.pow(numToOperate, 3);
             resultStr = parseFloat(result.toPrecision(12)).toString();
             break;
          case "reciprocal": 
            if (numToOperate === 0) throw new Error("Div by zero");
            result = 1 / numToOperate;
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          case "factorial": 
            result = factorial(numToOperate);
            resultStr = parseFloat(result.toPrecision(12)).toString();
            break;
          default: return state;
        }
      } catch (e: any) {
        return {...state, error: e.message || "Calculation Error", displayValue: "Error", history: newHistory };
      }

      if (resultStr && !Number.isFinite(parseFloat(resultStr))) return {...state, error: "Result too large", displayValue: "Error", history: newHistory};
      
      if (state.expression.endsWith(state.currentInput) && !state.overwrite) {
         newExpression = exprToUpdate.slice(0, exprToUpdate.length - state.currentInput.length) + resultStr;
      } else if (state.overwrite && state.expression.endsWith("=")) { 
         newExpression = resultStr;
      } else if (action.payload === "negate" && state.currentInput === "0") {
          const lastCharInExpr = newExpression.slice(-1);
          if (lastCharInExpr === "+") newExpression = newExpression.slice(0, -1) + "-";
          else if (lastCharInExpr === "-") newExpression = newExpression.slice(0, -1) + "+";
          else if (newExpression === "" || newExpression.endsWith("(") || newExpression.endsWith("=")) newExpression += "-";
          else if (["×", "÷", "^"].includes(lastCharInExpr)) newExpression += "-";
          resultStr = "0"; 
      } else { 
        // This case might need more robust logic for expression building after a unary op if it's not the end of an expression
        newExpression += resultStr; // Appends if the expression was something like "5+" and then 1/x was applied to a new number
      }

      return {
        ...state,
        currentInput: resultStr,
        displayValue: resultStr,
        expression: newExpression,
        overwrite: true,
        error: null,
        secondFunctionActive: false, 
        history: newHistory
      };
    }

    case "INPUT_PARENTHESIS":
      if (action.payload === "(") {
        newExpression += "(";
        return { ...state, expression: newExpression, openParentheses: state.openParentheses + 1, currentInput: "0", displayValue: "0", overwrite: true, error: null, secondFunctionActive: false, history: newHistory };
      } else { // ")"
        if (state.openParentheses > 0) {
          newExpression += ")";
          return { ...state, expression: newExpression, openParentheses: state.openParentheses - 1, currentInput: state.currentInput, displayValue: state.currentInput, overwrite: true, error: null, secondFunctionActive: false, history: newHistory };
        }
      }
      break;

    case "EVALUATE":
      if (state.expression.trim() === "" || state.openParentheses !== 0) {
        return { ...state, error: state.openParentheses !== 0 ? "Unclosed parentheses" : "Invalid Expression", displayValue: "Error", history: newHistory };
      }
      try {
        let exprToEval = state.expression;
        const finalExpressionToEval = prepareExpressionForEval(exprToEval, state.isRadians);
        const result = new Function('return ' + finalExpressionToEval)();
        
        if (typeof result === 'number' && !Number.isNaN(result) && Number.isFinite(result)) {
          const resultStr = parseFloat(result.toPrecision(12)).toString();
          const historyEntry = { id: Date.now().toString(), expression: state.expression, result: resultStr };
          const updatedHistory = [historyEntry, ...state.history].slice(0, 50); // Add to history and limit size

          return {
            ...initialState, // Resets most state
            currentInput: resultStr,
            displayValue: resultStr,
            expression: state.expression + "=", 
            isRadians: state.isRadians, // Persist Rad/Deg mode
            history: updatedHistory, // Persist history
            overwrite: true,
          };
        } else {
          return { ...state, error: "Calculation Error", displayValue: "Error", history: newHistory };
        }
      } catch (e) {
        return { ...state, error: "Syntax Error", displayValue: "Error", history: newHistory };
      }

    case "TOGGLE_SECOND_FUNCTION":
      return { ...state, secondFunctionActive: !state.secondFunctionActive, history: newHistory };

    case "TOGGLE_ANGLE_MODE":
      return { ...state, isRadians: !state.isRadians, secondFunctionActive: false, history: newHistory };

    case "CLEAR_ENTRY": 
      if (state.currentInput !== "0" && !state.overwrite) { 
        newExpression = state.expression.slice(0, state.expression.length - state.currentInput.length);
      } 
      return { ...state, currentInput: "0", displayValue: "0", expression: newExpression, error: null, overwrite: true, secondFunctionActive: false, history: newHistory };
      
    case "CLEAR_ALL": 
      return { ...initialState, isRadians: state.isRadians, history: [] }; // Clear history on CLEAR_ALL

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
         if (newExpression.endsWith(state.currentInput)) { 
            newExpression = newExpression.slice(0, newExpression.length - 1);
         } else if (newExpression.endsWith(removedChar)) { 
            newExpression = newExpression.slice(0, -1);
         }
      }
      newDisplayValue = newCurrentInput;
      break;

    default:
      return state;
  }
  
  return { ...state, expression: newExpression, currentInput: newCurrentInput, displayValue: newDisplayValue, overwrite: newOverwrite, error: null, history: newHistory };
}


export const scientificCalculatorButtons: Array<{
  label: string;
  action: AdvancedCalculatorAction;
  secondLabel?: string;
  secondAction?: AdvancedCalculatorAction;
  className?: string;
}> = [
  // Row 1
  { label: "2nd", action: { type: "TOGGLE_SECOND_FUNCTION" }, className: "bg-primary hover:bg-primary/80 text-primary-foreground" },
  { label: "Rad", action: { type: "TOGGLE_ANGLE_MODE" }, secondLabel: "Deg", secondAction: {type: "TOGGLE_ANGLE_MODE"}},
  { label: "sin", action: { type: "INPUT_UNARY_OPERATOR", payload: "sin" }, secondLabel: "asin", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "asin" } },
  { label: "cos", action: { type: "INPUT_UNARY_OPERATOR", payload: "cos" }, secondLabel: "acos", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "acos" } },
  { label: "tan", action: { type: "INPUT_UNARY_OPERATOR", payload: "tan" }, secondLabel: "atan", secondAction: { type: "INPUT_UNARY_OPERATOR", payload: "atan" } },
  { label: "7", action: { type: "INPUT_DIGIT", payload: "7" } },
  { label: "8", action: { type: "INPUT_DIGIT", payload: "8" } },
  { label: "9", action: { type: "INPUT_DIGIT", payload: "9" } },
  { label: "÷", action: { type: "INPUT_OPERATOR", payload: "÷" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  
  // Row 2
  { label: "x^y", action: { type: "INPUT_OPERATOR", payload: "^" } },
  { label: "x²", action: { type: "APPLY_POSTFIX_UNARY", payload: "square" }, secondLabel: "x³", secondAction: { type: "APPLY_POSTFIX_UNARY", payload: "cube" } },
  { label: "√", action: { type: "INPUT_UNARY_OPERATOR", payload: "√" } },
  { label: "log", action: { type: "INPUT_UNARY_OPERATOR", payload: "log" }, secondLabel: "10^x", secondAction: {type: "INPUT_UNARY_OPERATOR", payload: "10^"} },
  { label: "ln", action: { type: "INPUT_UNARY_OPERATOR", payload: "ln" } },
  { label: "4", action: { type: "INPUT_DIGIT", payload: "4" } },
  { label: "5", action: { type: "INPUT_DIGIT", payload: "5" } },
  { label: "6", action: { type: "INPUT_DIGIT", payload: "6" } },
  { label: "×", action: { type: "INPUT_OPERATOR", payload: "×" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },

  // Row 3
  { label: "(", action: { type: "INPUT_PARENTHESIS", payload: "(" }, className: "bg-blue-300 hover:bg-blue-400 text-blue-800" },
  { label: ")", action: { type: "INPUT_PARENTHESIS", payload: ")" }, className: "bg-blue-300 hover:bg-blue-400 text-blue-800" },
  { label: "1/x", action: { type: "APPLY_POSTFIX_UNARY", payload: "reciprocal" } },
  { label: "n!", action: { type: "APPLY_POSTFIX_UNARY", payload: "factorial" } },
  { label: "π", action: { type: "INPUT_CONSTANT", payload: "π" } },
  { label: "1", action: { type: "INPUT_DIGIT", payload: "1" } },
  { label: "2", action: { type: "INPUT_DIGIT", payload: "2" } },
  { label: "3", action: { type: "INPUT_DIGIT", payload: "3" } },
  { label: "-", action: { type: "INPUT_OPERATOR", payload: "-" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  
  // Row 4
  { label: "e", action: { type: "INPUT_CONSTANT", payload: "e" } },
  { label: "C", action: { type: "CLEAR_ALL" }, className: "bg-destructive hover:bg-destructive/80 text-destructive-foreground" },
  { label: "CE", action: { type: "CLEAR_ENTRY" }, className: "bg-destructive hover:bg-destructive/80 text-destructive-foreground" },
  { label: "⌫", action: { type: "BACKSPACE" }, className: "bg-red-500 hover:bg-red-600 text-primary-foreground" },
  { label: "=", action: { type: "EVALUATE" }, className: "bg-primary hover:bg-primary/90 text-primary-foreground" },
  { label: "0", action: { type: "INPUT_DIGIT", payload: "0" } },
  { label: ".", action: { type: "INPUT_DECIMAL" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  { label: "±", action: { type: "APPLY_POSTFIX_UNARY", payload: "negate" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  { label: "+", action: { type: "INPUT_OPERATOR", payload: "+" }, className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
];

