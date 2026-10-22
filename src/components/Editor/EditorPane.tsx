import React, { useCallback, useEffect } from 'react';
import { FormatAction, getCursorPosition, getListContinuation } from '../../utils/markdownHelpers';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onScroll: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onFormat: (action: FormatAction) => void;
  onCursorChange?: (line: number, col: number) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  value,
  onChange,
  onScroll,
  textareaRef,
  onFormat,
  onCursorChange,
}) => {
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current || !onCursorChange) return;
    const textarea = textareaRef.current;
    const { line, col } = getCursorPosition(textarea.value, textarea.selectionStart);
    onCursorChange(line, col);
  }, [textareaRef, onCursorChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Shortcuts: Ctrl/Cmd + B, I, K
    if (isCmdOrCtrl && !e.shiftKey && !e.altKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onFormat('bold');
        return;
      }
      if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        onFormat('italic');
        return;
      }
      if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onFormat('link');
        return;
      }
    }

    // Tab key handling (2 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const selectedLines = value.substring(lineStart, end);

      if (e.shiftKey) {
        // Shift+Tab: Unindent every line touched by the selection
        let removedFromFirst = 0;
        let removedTotal = 0;
        const unindented = selectedLines
          .split('\n')
          .map((line, index) => {
            const removed = line.match(/^ {1,2}/)?.[0].length ?? 0;
            if (index === 0) removedFromFirst = removed;
            removedTotal += removed;
            return line.substring(removed);
          })
          .join('\n');

        if (removedTotal > 0) {
          const newText = value.substring(0, lineStart) + unindented + value.substring(end);
          onChange(newText);
          requestAnimationFrame(() => {
            const newStart = Math.max(lineStart, start - removedFromFirst);
            textarea.setSelectionRange(newStart, Math.max(newStart, end - removedTotal));
            updateCursorPosition();
          });
        }
      } else if (selectedLines.includes('\n')) {
        // Tab with a multi-line selection: indent the lines instead of replacing them
        const lines = selectedLines.split('\n');
        const indented = lines
          .map((line, index) => (index === lines.length - 1 && line === '' ? line : `  ${line}`))
          .join('\n');
        const newText = value.substring(0, lineStart) + indented + value.substring(end);
        onChange(newText);
        requestAnimationFrame(() => {
          textarea.setSelectionRange(start + 2, end + indented.length - selectedLines.length);
          updateCursorPosition();
        });
      } else {
        // Tab: Insert 2 spaces
        const newText = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newText);
        requestAnimationFrame(() => {
          textarea.setSelectionRange(start + 2, start + 2);
          updateCursorPosition();
        });
      }
      return;
    }

    // Enter key handling (smart list continuation)
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const continuation = getListContinuation(value.substring(lineStart, start));
      if (!continuation) return;

      e.preventDefault();
      // Like a normal Enter, any selected text is replaced
      const afterSelection = value.substring(end);

      if (continuation.content.trim() === '') {
        // Empty list item: remove the prefix to end the list
        onChange(value.substring(0, lineStart) + afterSelection);
        requestAnimationFrame(() => {
          textarea.setSelectionRange(lineStart, lineStart);
          updateCursorPosition();
        });
      } else {
        const prefix = `\n${continuation.nextPrefix}`;
        onChange(value.substring(0, start) + prefix + afterSelection);
        requestAnimationFrame(() => {
          textarea.setSelectionRange(start + prefix.length, start + prefix.length);
          updateCursorPosition();
        });
      }
    }
  };

  useEffect(() => {
    updateCursorPosition();
  }, [value, updateCursorPosition]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onScroll={onScroll}
      onKeyDown={handleKeyDown}
      onKeyUp={updateCursorPosition}
      onClick={updateCursorPosition}
      spellCheck={false}
      placeholder="Comece a escrever seu Markdown aqui..."
      aria-label="Editor Markdown"
      className="markdown-editor w-full h-full flex-1 p-6 font-mono text-sm leading-relaxed bg-transparent text-neutral-800 dark:text-neutral-200 resize-none focus:outline-none border-none selection:bg-brand-500/20 dark:selection:bg-brand-500/30"
    />
  );
};
