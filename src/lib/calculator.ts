export type OperatorType = '+' | '-' | '×' | '÷' | null;

export interface CalcState {
  display: string;
  expression: string;
  operator: OperatorType;
  previousValue: string | null;
  waitingForOperand: boolean;
  hasError: boolean;
  fullExpression: string;
}

export const initialState: CalcState = {
  display: '0',
  expression: '',
  operator: null,
  previousValue: null,
  waitingForOperand: false,
  hasError: false,
  fullExpression: '',
};

function calculate(prev: string, curr: string, op: OperatorType): string {
  const a = parseFloat(prev);
  const b = parseFloat(curr);

  if (isNaN(a) || isNaN(b)) return 'Error';

  switch (op) {
    case '+':
      return formatResult(a + b);
    case '-':
      return formatResult(a - b);
    case '×':
      return formatResult(a * b);
    case '÷':
      if (b === 0) return 'Error';
      return formatResult(a / b);
    default:
      return curr;
  }
}

function formatResult(num: number): string {
  if (!isFinite(num)) return 'Error';
  const str = num.toPrecision(12);
  const parsed = parseFloat(str);
  if (Math.abs(parsed) >= 1e12 || (Math.abs(parsed) < 1e-7 && parsed !== 0)) {
    return parsed.toExponential(6);
  }
  return String(parsed);
}

export function handleDigit(state: CalcState, digit: string): CalcState {
  if (state.hasError) return state;

  if (state.waitingForOperand) {
    return {
      ...state,
      display: digit,
      waitingForOperand: false,
    };
  }

  if (state.display === '0' && digit !== '.') {
    return { ...state, display: digit };
  }

  if (digit === '.' && state.display.includes('.')) {
    return state;
  }

  const newDisplay = state.display + digit;
  if (newDisplay.replace('.', '').replace('-', '').length > 12) {
    return state;
  }

  return { ...state, display: newDisplay };
}

export function handleOperator(state: CalcState, op: OperatorType): CalcState {
  if (state.hasError) return state;

  const current = state.display;

  if (state.operator && !state.waitingForOperand) {
    const result = calculate(state.previousValue!, current, state.operator);
    if (result === 'Error') {
      return {
        ...initialState,
        display: 'Error',
        hasError: true,
        expression: state.fullExpression + current + ' = Error',
        fullExpression: '',
      };
    }
    const newExpr = `${state.fullExpression}${current} ${op} `;
    return {
      ...state,
      display: result,
      expression: newExpr,
      fullExpression: newExpr,
      operator: op,
      previousValue: result,
      waitingForOperand: true,
    };
  }

  const newExpr = `${current} ${op} `;
  return {
    ...state,
    expression: newExpr,
    fullExpression: newExpr,
    operator: op,
    previousValue: current,
    waitingForOperand: true,
  };
}

export function handleEquals(state: CalcState): CalcState & { shouldSave?: boolean; savedExpression?: string; savedResult?: string } {
  if (state.hasError || !state.operator || state.previousValue === null) {
    return state;
  }

  const current = state.display;
  const result = calculate(state.previousValue, current, state.operator);
  const fullExpr = `${state.fullExpression}${current}`;

  if (result === 'Error') {
    return {
      ...initialState,
      display: 'Error',
      hasError: true,
      expression: `${fullExpr} = Error`,
      fullExpression: '',
    };
  }

  return {
    ...initialState,
    display: result,
    expression: `${fullExpr} = ${result}`,
    fullExpression: '',
    shouldSave: true,
    savedExpression: fullExpr,
    savedResult: result,
  };
}

export function handleClear(): CalcState {
  return { ...initialState };
}

export function handleBackspace(state: CalcState): CalcState {
  if (state.hasError) return { ...initialState };
  if (state.waitingForOperand) return state;
  if (state.display.length === 1 || (state.display.length === 2 && state.display.startsWith('-'))) {
    return { ...state, display: '0' };
  }
  return { ...state, display: state.display.slice(0, -1) };
}

export function handlePercentage(state: CalcState): CalcState {
  if (state.hasError) return state;
  const value = parseFloat(state.display);
  if (isNaN(value)) return state;
  const result = formatResult(value / 100);
  return { ...state, display: result };
}

export function handleToggleSign(state: CalcState): CalcState {
  if (state.hasError) return state;
  const value = parseFloat(state.display);
  if (isNaN(value) || value === 0) return state;
  return { ...state, display: formatResult(-value) };
}
