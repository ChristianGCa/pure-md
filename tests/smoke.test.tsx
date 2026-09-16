import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByText(/criado por ChrisG/i)).toBeInTheDocument();
    expect(screen.getByText(/distribuído sob a licença MIT/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Licenças de terceiros' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Fechar informações do projeto' }));

    expect(aboutDialog).not.toBeInTheDocument();
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
