import { describe, it, expect } from 'vitest';
import { applyFormatting } from '../src/utils/markdownHelpers';

describe('markdownHelpers utility', () => {
  it('applies bold formatting to empty selection', () => {
    const text = 'hello ';
    const result = applyFormatting(text, 6, 6, 'bold');
    expect(result.text).toBe('hello **texto em negrito**');
    expect(result.selectionStart).toBe(8);
    expect(result.selectionEnd).toBe(24);
  });

  it('applies bold formatting to selected text', () => {
    const text = 'hello world';
    const result = applyFormatting(text, 6, 11, 'bold');
    expect(result.text).toBe('hello **world**');
    expect(result.selectionStart).toBe(6);
    expect(result.selectionEnd).toBe(15);
  });

  it('applies italic formatting', () => {
    const text = 'test';
    const result = applyFormatting(text, 0, 4, 'italic');
    expect(result.text).toBe('*test*');
  });

  it('applies strikethrough formatting', () => {
    const text = 'old price';
    const result = applyFormatting(text, 0, 9, 'strike');
    expect(result.text).toBe('~~old price~~');
  });

  it('applies inline code and code block formatting', () => {
    const inlineResult = applyFormatting('const x = 1;', 0, 12, 'inline-code');
    expect(inlineResult.text).toBe('`const x = 1;`');

    const blockResult = applyFormatting('const y = 2;', 0, 12, 'code-block');
    expect(blockResult.text).toBe('```ts\nconst y = 2;\n```');
  });

  it('applies heading formatting at start of line', () => {
    const text = 'Título';
    const resultH1 = applyFormatting(text, 0, 6, 'h1');
    expect(resultH1.text).toBe('# Título');

    const resultH2 = applyFormatting(text, 0, 6, 'h2');
    expect(resultH2.text).toBe('## Título');

    const resultH3 = applyFormatting(text, 0, 6, 'h3');
    expect(resultH3.text).toBe('### Título');
  });

  it('applies blockquote formatting', () => {
    const text = 'Uma citação inspiradora';
    const result = applyFormatting(text, 0, 23, 'quote');
    expect(result.text).toBe('> Uma citação inspiradora');
  });

  it('applies unordered list to multiple lines', () => {
    const text = "Item 1\nItem 2";
    const result = applyFormatting(text, 0, text.length, 'ul');
    expect(result.text).toBe("- Item 1\n- Item 2");
  });

  it('applies ordered list to multiple lines', () => {
    const text = "Passo A\nPasso B";
    const result = applyFormatting(text, 0, text.length, 'ol');
    expect(result.text).toBe("1. Passo A\n2. Passo B");
  });

  it('applies task list formatting', () => {
    const text = "Fazer compras";
    const result = applyFormatting(text, 0, text.length, 'task');
    expect(result.text).toBe("- [ ] Fazer compras");
  });

  it('inserts link formatting', () => {
    const text = 'Google';
    const result = applyFormatting(text, 0, 6, 'link');
    expect(result.text).toBe('[Google](url)');
  });

  it('inserts a markdown table', () => {
    const text = '';
    const result = applyFormatting(text, 0, 0, 'table');
    expect(result.text).toContain('| Cabeçalho 1 | Cabeçalho 2 |');
    expect(result.text).toContain('|---|---|');
  });
});
