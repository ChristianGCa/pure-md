import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Download,
  Copy,
  Code2,
  Trash2,
  RefreshCw,
  Columns,
  Square,
  Eye,
  Check,
} from 'lucide-react';

export type ViewMode = 'split' | 'editor' | 'preview';

interface HeaderProps {
  documentTitle: string;
  onTitleChange: (title: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showSplitMode: boolean;
  onCopyMarkdown: () => Promise<boolean>;
  onCopyHtml: () => Promise<boolean>;
  onDownloadMd: () => void;
  onResetSample: () => void;
  onClear: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  documentTitle,
  onTitleChange,
  viewMode,
  onViewModeChange,
  showSplitMode,
  onCopyMarkdown,
  onCopyHtml,
  onDownloadMd,
  onResetSample,
  onClear,
  isDark,
  onToggleTheme,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleCopyMd = async () => {
    const ok = await onCopyMarkdown();
    if (ok) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  const handleCopyHtml = async () => {
    const ok = await onCopyHtml();
    if (ok) {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 select-none z-20">
      {/* Left branding & document title */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400">
          <img src="/favicon.svg" alt="PureMD" className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Título do Documento"
            aria-label="Título do Documento"
            className="text-sm font-semibold bg-transparent text-neutral-800 dark:text-neutral-200 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-brand-500 dark:focus:border-brand-500 px-2 py-1 rounded focus:outline-none transition-colors"
          />
          <span className="text-xs text-neutral-400 font-mono">.md</span>
        </div>
      </div>

      {/* Center view mode selector */}
      <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => onViewModeChange('editor')}
          title="Apenas Editor"
          aria-label="Apenas Editor"
          aria-pressed={viewMode === 'editor'}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            viewMode === 'editor'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Square className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Editor</span>
        </button>

        {showSplitMode && (
          <button
            type="button"
            onClick={() => onViewModeChange('split')}
            title="Visualização Dividida"
            aria-label="Visualização Dividida"
            aria-pressed={viewMode === 'split'}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'split'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dividido</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onViewModeChange('preview')}
          title="Apenas Pré-visualização"
          aria-label="Apenas Pré-visualização"
          aria-pressed={viewMode === 'preview'}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            viewMode === 'preview'
              ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>
      </div>

      {/* Right action controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleCopyMd}
          title="Copiar texto Markdown"
          aria-label="Copiar Markdown"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md transition-colors"
        >
          {copiedMd ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{copiedMd ? 'Copiado!' : 'Copiar MD'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyHtml}
          title="Copiar HTML renderizado"
          aria-label="Copiar HTML"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-md transition-colors"
        >
          {copiedHtml ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Code2 className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{copiedHtml ? 'Copiado!' : 'Copiar HTML'}</span>
        </button>

        <button
          type="button"
          onClick={onDownloadMd}
          title="Baixar arquivo .md"
          aria-label="Baixar Markdown"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/50 border border-brand-200 dark:border-brand-800/60 rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Baixar .md</span>
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" aria-hidden="true" />

        <button
          type="button"
          onClick={onResetSample}
          title="Restaurar exemplo inicial"
          aria-label="Restaurar exemplo"
          className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onClear}
          title="Limpar editor"
          aria-label="Limpar editor"
          className="p-1.5 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
          aria-label="Alternar tema"
          className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
