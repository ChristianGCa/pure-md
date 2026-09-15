import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PreviewPane } from '../src/components/Preview/PreviewPane';

describe('PreviewPane Component', () => {
  const dummyRef = { current: null };

  it('renders markdown headings, lists and bold text', () => {
    const markdown = '# Meu Título\n\nTexto em **negrito** e *itálico*.\n\n- Item 1\n- Item 2';
    render(<PreviewPane content={markdown} onScroll={() => {}} previewRef={dummyRef} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Meu Título' })).toBeInTheDocument();
    expect(screen.getByText('negrito')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders GFM tables correctly', () => {
    const markdown = '| Nome | Cargo |\n|---|---|\n| Ana | Dev |';
    render(<PreviewPane content={markdown} onScroll={() => {}} previewRef={dummyRef} />);

    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Cargo')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('renders code blocks with copy button', () => {
    const markdown = '```js\nconsole.log("hello");\n```';
    render(<PreviewPane content={markdown} onScroll={() => {}} previewRef={dummyRef} />);

    expect(screen.getByRole('button', { name: 'Copiar código' })).toBeInTheDocument();
    expect(screen.getByText(/js/i)).toBeInTheDocument();
  });

  it('copies the complete text from highlighted code blocks', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <PreviewPane
        content={'```js\nconsole.log("hello");\n```'}
        onScroll={() => {}}
        previewRef={dummyRef}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copiar código' }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('console.log("hello");\n');
    });
  });

  it('blocks unsafe Markdown URLs while allowing web images', () => {
    const { container } = render(
      <PreviewPane
        content={[
          '<img src="x" onerror="alert(1)">',
          '',
          '[script](javascript:alert(1))',
          '',
          '![invalid image](mailto:attacker@example.com)',
          '',
          '![remote image](https://images.example.com/photo.png)',
        ].join('\n')}
        onScroll={() => {}}
        previewRef={dummyRef}
      />
    );

    expect(container.querySelector('img[onerror]')).not.toBeInTheDocument();
    expect(container.querySelector('a')).not.toHaveAttribute('href');
    expect(screen.getByAltText('invalid image')).not.toHaveAttribute('src');
    expect(screen.getByAltText('remote image')).toHaveAttribute(
      'src',
      'https://images.example.com/photo.png'
    );
  });

  it('does not leak parser metadata into HTML attributes', () => {
    const { container } = render(
      <PreviewPane
        content={'[link](https://example.com)\n\n| A |\n|---|\n| B |\n\n```js\nconst ok = true;\n```'}
        onScroll={() => {}}
        previewRef={dummyRef}
      />
    );

    expect(container.querySelector('[node]')).not.toBeInTheDocument();
  });
});
