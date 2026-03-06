'use client';

import { DisplayProps } from '@/types';

export default function Display({ expression, display, hasError }: DisplayProps) {
  const displayLength = display.length;
  const fontSize =
    displayLength > 12
      ? 'text-2xl'
      : displayLength > 9
      ? 'text-3xl'
      : displayLength > 6
      ? 'text-4xl'
      : 'text-5xl';

  return (
    <div className="px-4 pt-4 pb-3 min-h-[120px] flex flex-col justify-end">
      {/* Expression line */}
      <div className="text-right text-sm text-gray-500 mb-1 min-h-[20px] overflow-hidden text-ellipsis whitespace-nowrap">
        {expression || '\u00A0'}
      </div>

      {/* Main display */}
      <div
        className={`
          text-right font-light tracking-wide
          transition-all duration-150
          overflow-hidden text-ellipsis whitespace-nowrap
          ${fontSize}
          ${hasError ? 'text-red-400' : 'text-white'}
        `}
      >
        {display}
      </div>
    </div>
  );
}
