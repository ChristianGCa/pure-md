import React, { useCallback, useEffect } from 'react';
import { applyFormatting, FormatAction } from '../../utils/markdownHelpers';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onScroll: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onCursorChange?: (line: number, col: number) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  value,
  onChange,
  onScroll,
  textareaRef,
  onCursorChange,
}) => {
  const updateCursorPosition = useCallback(() => {
    if (!textareaRef.current || !onCursorChange) return;
    const textarea = textareaRef.current;
    const pos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, pos);
    const lines = textBefore.split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    onCursorChange(currentLine, currentCol);
  }, [textareaRef, onCursorChange]);

  const handleAction = useCallback(
    (action: FormatAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const result = applyFormatting(value, selectionStart, selectionEnd, action);

      onChange(result.text);

      // Restore focus and selection
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(result.selectionStart, result.selectionEnd);
          updateCursorPosition();
        }
      });
    },
    [value, onChange, textareaRef, updateCursorPosition]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Shortcuts: Ctrl/Cmd + B, I, K
    if (isCmdOrCtrl && !e.shiftKey && !e.altKey) {
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleAction('bold');
        return;
      }
      if (e.key.toLowerCase() === 'i') {
        e.preventDefault();
        handleAction('italic');
        return;
      }
      if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handleAction('link');
        return;
      }
    }

    // Tab key handling (2 spaces)
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.shiftKey) {
        // Shift+Tab: Unindent current line(s)
        const before = value.substring(0, start);
        const lastNewLine = before.lastIndexOf('\n');
        const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
        const linePrefix = value.substring(lineStart, lineStart + 2);

        if (linePrefix === '  ') {
          const newText = value.substring(0, lineStart) + value.substring(lineStart + 2);
          onChange(newText);
          requestAnimationFrame(() => {
            const newPos = Math.max(lineStart, start - 2);
            textarea.setSelectionRange(newPos, Math.max(newPos, end - 2));
            updateCursorPosition();
          });
        }
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
      const pos = textarea.selectionStart;
      const beforeCursor = value.substring(0, pos);
      const afterCursor = value.substring(pos);
      const lastNewLine = beforeCursor.lastIndexOf('\n');
      const currentLine = lastNewLine === -1 ? beforeCursor : beforeCursor.substring(lastNewLine + 1);

      // Task list: "- [ ] " or "- [x] "
      const taskMatch = currentLine.match(/^(\s*)-\s\[([ x])\]\s(.*)$/);
      if (taskMatch) {
        e.preventDefault();
        if (taskMatch[3].trim() === '') {
          // Empty task list item: remove the prefix
          const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
          const newText = value.substring(0, lineStart) + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            textarea.setSelectionRange(lineStart, lineStart);
            updateCursorPosition();
          });
        } else {
          // Continue task list
          const prefix = `\n${taskMatch[1]}- [ ] `;
          const newText = beforeCursor + prefix + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            textarea.setSelectionRange(pos + prefix.length, pos + prefix.length);
            updateCursorPosition();
          });
        }
        return;
      }

      // Bullet list: "- " or "* "
      const bulletMatch = currentLine.match(/^(\s*)([-*])\s(.*)$/);
      if (bulletMatch) {
        e.preventDefault();
        if (bulletMatch[3].trim() === '') {
          // Empty bullet item: remove prefix
          const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
          const newText = value.substring(0, lineStart) + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            textarea.setSelectionRange(lineStart, lineStart);
            updateCursorPosition();
          });
        } else {
          // Continue bullet list
          const prefix = `\n${bulletMatch[1]}${bulletMatch[2]} `;
          const newText = beforeCursor + prefix + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            textarea.setSelectionRange(pos + prefix.length, pos + prefix.length);
            updateCursorPosition();
          });
        }
        return;
      }

      // Ordered list: "1. "
      const orderedMatch = currentLine.match(/^(\s*)(\d+)\.\s(.*)$/);
      if (orderedMatch) {
        e.preventDefault();
        if (orderedMatch[3].trim() === '') {
          // Empty ordered item: remove prefix
          const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
          const newText = value.substring(0, lineStart) + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            textarea.setSelectionRange(lineStart, lineStart);
            updateCursorPosition();
          });
        } else {
          // Continue ordered list
          const nextNumber = parseInt(orderedMatch[2], 10) + 1;
          const prefix = `\n${orderedMatch[1]}${nextNumber}. `;
          const newText = beforeCursor + prefix + afterCursor;
          onChange(newText);
          requestAnimationFrame(() => {
            textarea.setSelectionRange(pos + prefix.length, pos + prefix.length);
            updateCursorPosition();
          });
        }
        return;
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
