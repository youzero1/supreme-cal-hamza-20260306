'use client';

import { useState, useEffect, useCallback } from 'react';
import Display from './Display';
import Button from './Button';
import CalculationHistory from './CalculationHistory';
import ShareModal from './ShareModal';
import {
  CalcState,
  initialState,
  handleDigit,
  handleOperator,
  handleEquals,
  handleClear,
  handleBackspace,
  handlePercentage,
  handleToggleSign,
} from '@/lib/calculator';
import { CalculationRecord } from '@/types';

type Tab = 'calculator' | 'history';

export default function Calculator() {
  const [state, setState] = useState<CalcState>(initialState);
  const [tab, setTab] = useState<Tab>('calculator');
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [shareTarget, setShareTarget] = useState<CalculationRecord | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const fetchCalculations = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/calculations');
      const json = await res.json();
      if (json.data) setCalculations(json.data);
    } catch (e) {
      console.error('Failed to fetch calculations', e);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalculations();
  }, [fetchCalculations]);

  const saveCalculation = useCallback(async (expression: string, result: string) => {
    try {
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      const json = await res.json();
      if (json.data) {
        setCalculations((prev) => [json.data, ...prev]);
      }
    } catch (e) {
      console.error('Failed to save calculation', e);
    }
  }, []);

  const onDigit = (d: string) => setState((s) => handleDigit(s, d));

  const onOperator = (op: '+' | '-' | '×' | '÷') =>
    setState((s) => handleOperator(s, op));

  const onEquals = () => {
    setState((s) => {
      const result = handleEquals(s) as CalcState & {
        shouldSave?: boolean;
        savedExpression?: string;
        savedResult?: string;
      };
      if (result.shouldSave && result.savedExpression && result.savedResult) {
        saveCalculation(result.savedExpression, result.savedResult);
      }
      const { shouldSave: _s, savedExpression: _e, savedResult: _r, ...clean } = result as CalcState & {
        shouldSave?: boolean;
        savedExpression?: string;
        savedResult?: string;
      };
      return clean;
    });
  };

  const onClear = () => setState(handleClear());
  const onBackspace = () => setState((s) => handleBackspace(s));
  const onPercent = () => setState((s) => handlePercentage(s));
  const onToggleSign = () => setState((s) => handleToggleSign(s));

  const handleShare = (calc: CalculationRecord) => {
    setShareTarget(calc);
    setShareOpen(true);
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') onDigit(e.key);
      else if (e.key === '.') onDigit('.');
      else if (e.key === '+') onOperator('+');
      else if (e.key === '-') onOperator('-');
      else if (e.key === '*') onOperator('×');
      else if (e.key === '/') { e.preventDefault(); onOperator('÷'); }
      else if (e.key === 'Enter' || e.key === '=') onEquals();
      else if (e.key === 'Backspace') onBackspace();
      else if (e.key === 'Escape') onClear();
      else if (e.key === '%') onPercent();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Calculator Card */}
        <div className="w-full max-w-sm mx-auto lg:mx-0 flex-shrink-0">
          {/* Tab switcher (mobile) */}
          <div className="flex lg:hidden mb-4 bg-brand-card rounded-2xl p-1 border border-brand-border">
            <button
              onClick={() => setTab('calculator')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === 'calculator'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🧮 Calculator
            </button>
            <button
              onClick={() => setTab('history')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === 'history'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📜 History
              {calculations.length > 0 && (
                <span className="ml-1.5 bg-purple-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {calculations.length > 99 ? '99+' : calculations.length}
                </span>
              )}
            </button>
          </div>

          {/* Calculator panel (mobile: conditional, desktop: always visible) */}
          <div className={`${tab === 'history' ? 'hidden' : 'block'} lg:block`}>
            <div className="glass rounded-3xl overflow-hidden glow-purple">
              {/* Display */}
              <Display
                expression={state.expression}
                display={state.display}
                hasError={state.hasError}
              />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-brand-border to-transparent mx-4" />

              {/* Keypad */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {/* Row 1 */}
                <Button label="AC" onClick={onClear} variant="function" />
                <Button label="+/-" onClick={onToggleSign} variant="function" />
                <Button label="%" onClick={onPercent} variant="function" />
                <Button label="÷" onClick={() => onOperator('÷')} variant="operator" />

                {/* Row 2 */}
                <Button label="7" onClick={() => onDigit('7')} variant="number" />
                <Button label="8" onClick={() => onDigit('8')} variant="number" />
                <Button label="9" onClick={() => onDigit('9')} variant="number" />
                <Button label="×" onClick={() => onOperator('×')} variant="operator" />

                {/* Row 3 */}
                <Button label="4" onClick={() => onDigit('4')} variant="number" />
                <Button label="5" onClick={() => onDigit('5')} variant="number" />
                <Button label="6" onClick={() => onDigit('6')} variant="number" />
                <Button label="-" onClick={() => onOperator('-')} variant="operator" />

                {/* Row 4 */}
                <Button label="1" onClick={() => onDigit('1')} variant="number" />
                <Button label="2" onClick={() => onDigit('2')} variant="number" />
                <Button label="3" onClick={() => onDigit('3')} variant="number" />
                <Button label="+" onClick={() => onOperator('+')} variant="operator" />

                {/* Row 5 */}
                <Button label="0" onClick={() => onDigit('0')} variant="zero" className="col-span-2" />
                <Button label="." onClick={() => onDigit('.')} variant="number" />
                <Button label="=" onClick={onEquals} variant="equals" />
              </div>

              {/* Backspace row */}
              <div className="px-4 pb-4">
                <button
                  onClick={onBackspace}
                  className="w-full h-10 rounded-xl bg-brand-surface border border-brand-border text-gray-400 hover:text-white hover:border-purple-500 transition-all text-sm font-medium flex items-center justify-center gap-2 btn-press"
                >
                  <span>⌫</span>
                  <span>Backspace</span>
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: 'Calculations', value: calculations.length },
                { label: 'Shared', value: calculations.filter((c) => c.shared).length },
                { label: 'Today', value: calculations.filter((c) => new Date(c.createdAt).toDateString() === new Date().toDateString()).length },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-3 text-center border border-brand-border">
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* History panel (mobile only) */}
          <div className={`${tab === 'calculator' ? 'hidden' : 'block'} lg:hidden`}>
            <div className="glass rounded-3xl p-4 border border-brand-border" style={{ minHeight: '500px' }}>
              <CalculationHistory
                calculations={calculations}
                onShare={handleShare}
                onRefresh={fetchCalculations}
                isLoading={historyLoading}
              />
            </div>
          </div>
        </div>

        {/* History panel (desktop) */}
        <div className="hidden lg:flex flex-col flex-1 max-w-md">
          <div className="glass rounded-3xl p-5 border border-brand-border" style={{ height: '600px' }}>
            <CalculationHistory
              calculations={calculations}
              onShare={handleShare}
              onRefresh={fetchCalculations}
              isLoading={historyLoading}
            />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        calculation={shareTarget}
        isOpen={shareOpen}
        onClose={() => {
          setShareOpen(false);
          setShareTarget(null);
        }}
      />
    </div>
  );
}
