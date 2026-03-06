'use client';

import { ButtonProps } from '@/types';

const variantStyles: Record<string, string> = {
  number:
    'bg-brand-surface text-white hover:bg-opacity-80 border border-brand-border',
  operator:
    'bg-gradient-to-br from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-lg',
  equals:
    'bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white hover:opacity-90 shadow-lg glow-purple',
  function:
    'bg-brand-card text-purple-400 hover:bg-opacity-80 border border-brand-border',
  zero: 'bg-brand-surface text-white hover:bg-opacity-80 border border-brand-border col-span-2',
};

export default function Button({ label, onClick, variant = 'number', className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        btn-press
        flex items-center justify-center
        rounded-2xl
        text-xl font-semibold
        h-16 w-full
        select-none
        cursor-pointer
        transition-all duration-150
        active:scale-95
        ${variantStyles[variant]}
        ${className}
      `}
      aria-label={label}
    >
      {label}
    </button>
  );
}
