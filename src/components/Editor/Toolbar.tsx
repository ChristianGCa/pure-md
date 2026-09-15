import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Code,
  FileCode,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Link2,
  Table,
} from 'lucide-react';
import { FormatAction } from '../../utils/markdownHelpers';

interface ToolbarProps {
  onAction: (action: FormatAction) => void;
}

interface ToolButton {
  action: FormatAction;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onAction }) => {
  const tools: (ToolButton | 'separator')[] = [
    { action: 'h1', label: 'Título 1', icon: Heading1 },
    { action: 'h2', label: 'Título 2', icon: Heading2 },
    { action: 'h3', label: 'Título 3', icon: Heading3 },
    'separator',
    { action: 'bold', label: 'Negrito', icon: Bold, shortcut: 'Ctrl+B' },
    { action: 'italic', label: 'Itálico', icon: Italic, shortcut: 'Ctrl+I' },
    { action: 'strike', label: 'Tachado', icon: Strikethrough },
    'separator',
    { action: 'inline-code', label: 'Código Inline', icon: Code },
    { action: 'code-block', label: 'Bloco de Código', icon: FileCode },
    { action: 'quote', label: 'Citação', icon: Quote },
    'separator',
    { action: 'ul', label: 'Lista com Marcadores', icon: List },
    { action: 'ol', label: 'Lista Numerada', icon: ListOrdered },
    { action: 'task', label: 'Lista de Tarefas', icon: CheckSquare },
    'separator',
    { action: 'link', label: 'Inserir Link', icon: Link2, shortcut: 'Ctrl+K' },
    { action: 'table', label: 'Inserir Tabela', icon: Table },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Formatação Markdown"
      className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10"
    >
      {tools.map((item, index) => {
        if (item === 'separator') {
          return (
            <div
              key={`sep-${index}`}
              className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1"
              aria-hidden="true"
            />
          );
        }

        const IconComponent = item.icon;
        const tooltip = item.shortcut ? `${item.label} (${item.shortcut})` : item.label;

        return (
          <button
            key={item.action}
            type="button"
            title={tooltip}
            aria-label={item.label}
            onClick={() => onAction(item.action)}
            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <IconComponent className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};
