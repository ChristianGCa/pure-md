import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState, useRef } from 'react';
import { Toolbar } from '../src/components/Editor/Toolbar';
import { EditorPane } from '../src/components/Editor/EditorPane';

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
  const TestEditorWrapper = ({ initial = '' }: { initial?: string }) => {
    const [val, setVal] = useState(initial);
    const ref = useRef<HTMLTextAreaElement>(null);
    return (
      <EditorPane
        value={val}
        onChange={setVal}
        onScroll={vi.fn()}
        textareaRef={ref}
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
});
