import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';

function mockDesktopViewport(isDesktop: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: query === '(min-width: 1024px)' ? isDesktop : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe('App Integration Test', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockDesktopViewport(true);
  });

  afterEach(() => vi.restoreAllMocks());

  it('renders application with editor, preview and toolbar', () => {
    render(<App />);

    // Header actions
    expect(screen.getByRole('img', { name: 'PureMD' })).toHaveAttribute('src', '/favicon.svg');
    expect(screen.getByLabelText('Título do Documento')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copiar Markdown' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Baixar Markdown' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alternar tema' })).toBeInTheDocument();

    // Toolbar and Editor
    expect(screen.getByRole('toolbar', { name: 'Formatação Markdown' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Editor Markdown' })).toBeInTheDocument();

    // Preview
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();

    // Status Bar
    expect(screen.getByRole('contentinfo', { name: 'Barra de status do documento' })).toBeInTheDocument();
  });

  it('warns about failed saves while keeping the document editable', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem de boas-vindas' }));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    fireEvent.change(screen.getByRole('textbox', { name: 'Editor Markdown' }), {
      target: { value: 'Texto ainda editável' },
    });

    expect(screen.getByRole('textbox', { name: 'Editor Markdown' })).toHaveValue('Texto ainda editável');
    expect(screen.getByRole('alert')).toHaveTextContent(/Não foi possível ler ou salvar dados locais/i);
    expect(screen.getByRole('button', { name: 'Baixar .md' })).toBeInTheDocument();
  });

  it('shows the PureMD welcome message on load and lets the user close it', () => {
    render(<App />);

    const welcomeDialog = screen.getByRole('dialog', { name: 'Bem-vindo ao PureMD' });

    expect(welcomeDialog).toBeInTheDocument();
    expect(screen.getByText(/editor Markdown que funciona inteiramente no seu navegador/i)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Fechar mensagem de boas-vindas' });
    expect(closeButton).toHaveFocus();
    fireEvent.click(closeButton);

    expect(welcomeDialog).not.toBeInTheDocument();
  });

  it('opens project details from the information button and closes the dialog', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem de boas-vindas' }));

    const aboutButton = screen.getByRole('button', { name: 'Sobre o PureMD' });
    fireEvent.click(aboutButton);

    const aboutDialog = screen.getByRole('dialog', { name: 'Sobre o PureMD' });
    expect(aboutDialog).toBeInTheDocument();
    expect(screen.getByText(/criado por ChristianGCa/i)).toBeInTheDocument();
    expect(screen.getByText(/distribuído sob a licença MIT/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Licença MIT' })).toHaveAttribute(
      'href',
      'https://github.com/ChristianGCa/pure-md/blob/main/LICENSE'
    );
    expect(screen.getByRole('link', { name: 'Licenças de terceiros' })).toHaveAttribute(
      'href',
      '/THIRD-PARTY-NOTICES.txt'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Fechar informações do projeto' }));

    expect(aboutDialog).not.toBeInTheDocument();
  });

  it('opens privacy information with a public contact address', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem de boas-vindas' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sobre o PureMD' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aviso de privacidade' }));

    expect(screen.getByRole('dialog', { name: 'Privacidade do PureMD' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'christiangca.dev@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:christiangca.dev@gmail.com'
    );
    expect(screen.getByText('Responsável pelo site: ChristianGCa.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Imagens externas' })).toBeInTheDocument();
  });

  it('switches view mode between split, editor and preview', () => {
    render(<App />);

    const editorOnlyBtn = screen.getByRole('button', { name: 'Apenas Editor' });
    fireEvent.click(editorOnlyBtn);
    expect(screen.getByRole('textbox', { name: 'Editor Markdown' })).toBeInTheDocument();
    expect(screen.queryByTestId('preview-pane')).not.toBeInTheDocument();

    const previewOnlyBtn = screen.getByRole('button', { name: 'Apenas Pré-visualização' });
    fireEvent.click(previewOnlyBtn);
    expect(screen.queryByRole('textbox', { name: 'Editor Markdown' })).not.toBeInTheDocument();
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();
  });

  it('copies safe document HTML in every view mode', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    window.localStorage.setItem(
      'markdown_document',
      JSON.stringify('# Título\n\n![external](https://images.example.com/p.png)\n\n![local](/favicon.svg)\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n```js\nconst ok = true;\n```')
    );
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Fechar mensagem de boas-vindas' }));

    for (const mode of ['Apenas Editor', 'Apenas Pré-visualização', 'Visualização Dividida']) {
      fireEvent.click(screen.getByRole('button', { name: mode }));
      fireEvent.click(screen.getByRole('button', { name: 'Copiar HTML' }));
      await waitFor(() => expect(writeText).toHaveBeenCalledTimes(
        mode === 'Apenas Editor' ? 1 : mode === 'Apenas Pré-visualização' ? 2 : 3
      ));
    }

    const outputs: string[] = writeText.mock.calls.map((call) => call[0]);
    expect(outputs[0]).toBe(outputs[1]);
    expect(outputs[1]).toBe(outputs[2]);
    expect(outputs[0]).toContain('<h1>Título</h1>');
    expect(outputs[0]).toContain('href="https://images.example.com/p.png"');
    expect(outputs[0]).toContain('>external</a>');
    expect(outputs[0]).not.toContain('src="https://images.example.com/p.png"');
    expect(outputs[0]).toContain('src="/favicon.svg"');
    expect(outputs[0]).not.toContain('<script');
    expect(outputs[0]).not.toContain('javascript:');
    expect(outputs[0]).not.toContain('Copiar código');
  });

  it('starts in editor mode and removes split view on mobile', () => {
    mockDesktopViewport(false);
    render(<App />);

    expect(screen.getByRole('textbox', { name: 'Editor Markdown' })).toBeInTheDocument();
    expect(screen.queryByTestId('preview-pane')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Visualização Dividida' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Apenas Pré-visualização' }));

    expect(screen.queryByRole('textbox', { name: 'Editor Markdown' })).not.toBeInTheDocument();
    expect(screen.getByTestId('preview-pane')).toBeInTheDocument();
  });
});
