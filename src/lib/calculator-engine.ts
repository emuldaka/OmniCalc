// src/lib/calculator-engine.ts

export type CalculatorState = {
  currentOperand: string;
  previousOperand: string | null;
  operation: string | null;
  displayValue: string; // This will be what's shown on the main display
  expression: string; // Full expression string for secondary display
  overwrite: boolean; // True if next number input should overwrite currentOperand
  error: string | null;
};

export const initialState: CalculatorState = {
  currentOperand: "0",
  previousOperand: null,
  operation: null,
  displayValue: "0",
  expression: "",
  overwrite: true,
  error: null,
};

type Action =
  | { type: "ADD_DIGIT"; payload: string }
  | { type: "CHOOSE_OPERATION"; payload: string }
  | { type: "CLEAR_ALL" }
  | { type: "CLEAR_ENTRY" }
  | { type: "DELETE_DIGIT" }
  | { type: "EVALUATE" }
  | { type: "TOGGLE_SIGN" }
  | { type: "PERCENTAGE" }
  | { type: "SQUARE_ROOT" }
  | { type: "SET_AI_RESULT"; payload: { value: string | number, expression: string } };

export function calculatorReducer(state: CalculatorState, action: Action): CalculatorState {
  if (action.type !== "SET_AI_RESULT" && state.error && action.type !== "CLEAR_ALL" && action.type !== "CLEAR_ENTRY") {
    return state; // If in error state, only allow clear operations or AI override
  }
  
  switch (action.type) {
    case "ADD_DIGIT": {
      let newCurrentOperand = state.currentOperand;
      if (state.overwrite) {
        newCurrentOperand = action.payload === "." ? "0." : action.payload;
      } else {
        if (action.payload === "." && state.currentOperand.includes(".")) return state;
        if (action.payload === "0" && state.currentOperand === "0") return state;
        newCurrentOperand = state.currentOperand + action.payload;
      }
      return {
        ...state,
        currentOperand: newCurrentOperand,
        displayValue: newCurrentOperand,
        overwrite: false,
        error: null,
      };
    }

    case "CHOOSE_OPERATION": {
      if (state.currentOperand === "" && state.previousOperand === null) return state;
      
      let newState = { ...state };
      if (state.previousOperand !== null && state.operation && !state.overwrite) {
         // If there's a previous operation and new input, evaluate first
        newState = evaluate(newState);
        if (newState.error) return newState; // Stop if evaluation caused error
      }

      return {
        ...newState,
        operation: action.payload,
        previousOperand: newState.currentOperand,
        expression: `${newState.currentOperand} ${action.payload}`,
        overwrite: true,
        error: null,
      };
    }
    
    case "EVALUATE":
      if (state.operation && state.previousOperand !== null && state.currentOperand) {
        const evaluatedState = evaluate(state);
        return {
          ...evaluatedState,
          expression: `${state.expression || ""} ${state.currentOperand} =`,
          previousOperand: null, 
          // operation: null, // Keep operation for chained calculations or clear it
          overwrite: true,
        };
      }
      return state;

    case "CLEAR_ALL":
      return {...initialState, displayValue: "0"};

    case "CLEAR_ENTRY":
      return {
        ...state,
        currentOperand: "0",
        displayValue: "0",
        overwrite: true,
        error: null,
      };
    
    case "DELETE_DIGIT":
      if (state.overwrite) return { ...state, currentOperand: "0", displayValue: "0", overwrite: true, error: null };
      if (state.currentOperand === "0" || state.currentOperand.length === 1 || (state.currentOperand.startsWith("-") && state.currentOperand.length === 2)) {
        return { ...state, currentOperand: "0", displayValue: "0", overwrite: true, error: null };
      }
      const newOperand = state.currentOperand.slice(0, -1);
      return {
        ...state,
        currentOperand: newOperand,
        displayValue: newOperand,
        error: null,
      };

    case "TOGGLE_SIGN": {
      if (state.currentOperand === "0" || state.error) return state;
      const toggled = (parseFloat(state.currentOperand) * -1).toString();
      return {
        ...state,
        currentOperand: toggled,
        displayValue: toggled,
        error: null,
      };
    }
    
    case "PERCENTAGE": {
      if (state.error) return state;
      const val = parseFloat(state.currentOperand);
      if (isNaN(val)) return {...state, error: "Invalid Input", displayValue: "Error"};
      const result = (val / 100).toString();
      return {
        ...state,
        currentOperand: result,
        displayValue: result,
        expression: `${val}%`,
        overwrite: true,
        error: null,
      };
    }

    case "SQUARE_ROOT": {
      if (state.error) return state;
      const val = parseFloat(state.currentOperand);
      if (isNaN(val) || val < 0) return {...state, error: "Invalid Input for √", displayValue: "Error"};
      const result = Math.sqrt(val).toString();
      return {
        ...state,
        currentOperand: result,
        displayValue: result,
        expression: `√(${val})`,
        overwrite: true,
        error: null,
      };
    }

    case "SET_AI_RESULT": {
      const { value, expression } = action.payload;
      const valueStr = String(value);
      if (valueStr === "Error" || valueStr.toLowerCase().includes("error")) {
        return {
          ...initialState,
          displayValue: "Error",
          error: "AI Error",
          expression: expression || "AI Input Error"
        }
      }
      return {
        ...initialState,
        currentOperand: valueStr,
        displayValue: valueStr,
        expression: `${expression} =`,
        overwrite: true,
        error: null,
      };
    }
      
    default:
      return state;
  }
}

function evaluate(state: CalculatorState): CalculatorState {
  const prev = parseFloat(state.previousOperand!);
  const current = parseFloat(state.currentOperand);

  if (isNaN(prev) || isNaN(current)) {
    return { ...state, error: "Invalid Input", displayValue: "Error", currentOperand: "Error" };
  }

  let computation: number = 0;
  switch (state.operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "×":
      computation = prev * current;
      break;
    case "÷":
      if (current === 0) {
        return { ...state, error: "Division by zero", displayValue: "Error", currentOperand: "Error" };
      }
      computation = prev / current;
      break;
    case "^": // Exponentiation
      computation = Math.pow(prev, current);
      break;
    default:
      return state; // Should not happen
  }

  if (!isFinite(computation)) {
     return { ...state, error: "Result is too large", displayValue: "Error", currentOperand: "Error" };
  }

  return {
    ...state,
    currentOperand: computation.toString(),
    displayValue: computation.toString(),
    operation: null, // Typically operation is cleared after eval, or kept for chained ops
    previousOperand: null, // Previous operand is consumed
    // expression: `${state.expression} ${state.currentOperand} =`, // Update expression in EVALUATE action
    overwrite: true,
    error: null,
  };
}

export const calculatorButtons = [
  { label: "AC", type: "CLEAR_ALL", className: "bg-destructive/80 hover:bg-destructive text-destructive-foreground col-span-2" },
  { label: "C", type: "CLEAR_ENTRY", className: "bg-destructive/80 hover:bg-destructive text-destructive-foreground" },
  { label: "÷", type: "CHOOSE_OPERATION", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  
  { label: "√", type: "SQUARE_ROOT", className: "bg-secondary hover:bg-secondary/80" },
  { label: "xʸ", type: "CHOOSE_OPERATION", value: "^", className: "bg-secondary hover:bg-secondary/80" },
  { label: "%", type: "PERCENTAGE", className: "bg-secondary hover:bg-secondary/80" },
  { label: "×", type: "CHOOSE_OPERATION", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },

  { label: "7", type: "ADD_DIGIT" },
  { label: "8", type: "ADD_DIGIT" },
  { label: "9", type: "ADD_DIGIT" },
  { label: "-", type: "CHOOSE_OPERATION", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },

  { label: "4", type: "ADD_DIGIT" },
  { label: "5", type: "ADD_DIGIT" },
  { label: "6", type: "ADD_DIGIT" },
  { label: "+", type: "CHOOSE_OPERATION", className: "bg-accent hover:bg-accent/90 text-accent-foreground" },

  { label: "1", type: "ADD_DIGIT" },
  { label: "2", type: "ADD_DIGIT" },
  { label: "3", type: "ADD_DIGIT" },
  { label: "=", type: "EVALUATE", className: "row-span-2 bg-primary hover:bg-primary/90 text-primary-foreground" },
  
  { label: "0", type: "ADD_DIGIT", className: "col-span-2" },
  { label: ".", type: "ADD_DIGIT" },
  // { label: "±", type: "TOGGLE_SIGN" }, // Add if desired
  // { label: "DEL", type: "DELETE_DIGIT" }, // Add if desired
];
