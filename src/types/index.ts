export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: Date;
  shared: boolean;
}

export interface CalculatorState {
  display: string;
  expression: string;
  operator: string | null;
  previousValue: string | null;
  waitingForOperand: boolean;
  hasError: boolean;
}

export interface ShareModalProps {
  calculation: CalculationRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'equals' | 'function' | 'zero';
  className?: string;
}

export interface DisplayProps {
  expression: string;
  display: string;
  hasError: boolean;
}

export interface CalculationHistoryProps {
  calculations: CalculationRecord[];
  onShare: (calc: CalculationRecord) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ShareResponse {
  shareUrl: string;
  calculationId: number;
}
