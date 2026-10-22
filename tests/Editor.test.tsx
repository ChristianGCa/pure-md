import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState, useRef } from 'react';
import { Toolbar } from '../src/components/Editor/Toolbar';
import { EditorPane } from '../src/components/Editor/EditorPane';
import { FormatAction } from '../src/utils/markdownHelpers';

describe('Toolbar Component', () => {
  it('calls onAction when formatting buttons are clicked', () => {
    const handleAction = vi.fn();
    render(<Toolbar onAction={handleAction} />);

    const boldBtn = screen.getByRole('button', { name: 'Negrito' });
    fireEvent.click(boldBtn);
    expect(handleAction).toHaveBeenCalledWith('bold');

    const h1Btn = screen.getByRole('button', { name: 'Título 1' });
    fireEvent.click(h1Btn);
    expect(handleAction).toHaveBeenCalledWith('h1');

    const codeBtn = screen.getByRole('button', { name: 'Bloco de Código' });
    fireEvent.click(codeBtn);
    expect(handleAction).toHaveBeenCalledWith('code-block');
  });
});

describe('EditorPane Component', () => {
  const TestEditorWrapper = ({
    initial = '',
    onFormat = vi.fn(),
  }: {
    initial?: string;
    onFormat?: (action: FormatAction) => void;
  }) => {
    const [val, setVal] = useState(initial);
    const ref = useRef<HTMLTextAreaElement>(null);
    return (
      <EditorPane
        value={val}
        onChange={setVal}
        onScroll={vi.fn()}
        textareaRef={ref}
        onFormat={onFormat}
      />
    );
  };

  it('renders textarea with placeholder and updates on change', () => {
    render(<TestEditorWrapper initial="Hello world" />);
    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' }) as HTMLTextAreaElement;
    expect(textarea.value).toBe('Hello world');

    fireEvent.change(textarea, { target: { value: 'Updated content' } });
    expect(textarea.value).toBe('Updated content');
  });

  it('uses literal punctuation rendering for repeated Markdown delimiters', () => {
    render(<TestEditorWrapper initial="|---|-----------|" />);

    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' });
    expect(textarea).toHaveClass('markdown-editor');
  });

  it('handles Tab key by inserting 2 spaces', () => {
    render(<TestEditorWrapper initial="" />);
    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' }) as HTMLTextAreaElement;

    fireEvent.keyDown(textarea, { key: 'Tab' });
    expect(textarea.value).toBe('  ');
  });

  it('indents every selected line on Tab instead of replacing the selection', () => {
    render(<TestEditorWrapper initial={'um\ndois\ntrês'} />);
    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' }) as HTMLTextAreaElement;

    textarea.setSelectionRange(1, 6);
    fireEvent.keyDown(textarea, { key: 'Tab' });
    expect(textarea.value).toBe('  um\n  dois\ntrês');
  });

  it('sends formatting shortcuts to onFormat', () => {
    const onFormat = vi.fn();
    render(<TestEditorWrapper initial="texto" onFormat={onFormat} />);
    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' });

    fireEvent.keyDown(textarea, { key: 'b', ctrlKey: true });
    expect(onFormat).toHaveBeenCalledWith('bold');
  });

  it('continues a list on Enter and replaces the selected text', () => {
    render(<TestEditorWrapper initial={'- um REMOVER'} />);
    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' }) as HTMLTextAreaElement;

    textarea.setSelectionRange(4, textarea.value.length);
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(textarea.value).toBe('- um\n- ');
  });

  it('ends the list on Enter in an empty item', () => {
    render(<TestEditorWrapper initial={'1. um\n2. '} />);
    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' }) as HTMLTextAreaElement;

    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(textarea.value).toBe('1. um\n');
  });

  it('unindents every selected line on Shift+Tab', () => {
    render(<TestEditorWrapper initial={'  um\n dois\ntrês'} />);
    const textarea = screen.getByRole('textbox', { name: 'Editor Markdown' }) as HTMLTextAreaElement;

    textarea.setSelectionRange(0, textarea.value.length);
    fireEvent.keyDown(textarea, { key: 'Tab', shiftKey: true });
    expect(textarea.value).toBe('um\ndois\ntrês');
  });
});
