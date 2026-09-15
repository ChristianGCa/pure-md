import React from 'react';
import { TextStats } from '../../utils/stats';

interface StatusBarProps {
  stats: TextStats;
  cursorPos: { line: number; col: number };
}

export const StatusBar: React.FC<StatusBarProps> = ({ stats, cursorPos }) => {
  return (
    <footer
      role="contentinfo"
      aria-label="Barra de status do documento"
      className="flex flex-wrap items-center justify-between px-4 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 select-none z-10"
    >
      <div className="flex items-center gap-4">
        <span>
          Linha <strong className="font-medium text-neutral-700 dark:text-neutral-200">{cursorPos.line}</strong>, Coluna{' '}
          <strong className="font-medium text-neutral-700 dark:text-neutral-200">{cursorPos.col}</strong>
        </span>
        <span className="hidden sm:inline-block text-neutral-300 dark:text-neutral-700">|</span>
        <span>
          <strong className="font-medium text-neutral-700 dark:text-neutral-200">{stats.words}</strong> palavras
        </span>
        <span className="hidden sm:inline-block text-neutral-300 dark:text-neutral-700">|</span>
        <span>
          <strong className="font-medium text-neutral-700 dark:text-neutral-200">{stats.characters}</strong> caracteres
        </span>
        <span className="hidden md:inline-block text-neutral-300 dark:text-neutral-700">|</span>
        <span className="hidden md:inline-block">
          ~<strong className="font-medium text-neutral-700 dark:text-neutral-200">{stats.readingTimeMinutes}</strong> min de leitura
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-[11px] font-mono">
          Markdown (GFM)
        </span>
        <span className="px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-[11px] font-mono">
          UTF-8
        </span>
      </div>
    </footer>
  );
};
