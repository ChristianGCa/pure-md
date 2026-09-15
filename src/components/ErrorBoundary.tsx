import { Component, createRef, Fragment, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  recoveryKey: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    recoveryKey: 0,
  };

  private headingRef = createRef<HTMLHeadingElement>();

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro de renderização não tratado', error, errorInfo);
    this.headingRef.current?.focus();
  }

  private handleRetry = () => {
    this.setState(({ recoveryKey }) => ({
      hasError: false,
      recoveryKey: recoveryKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="alert"
          className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100"
        >
          <section className="w-full max-w-xl border-l-4 border-brand-600 pl-6 dark:border-brand-400">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
              Erro de renderização
            </p>
            <h1
              ref={this.headingRef}
              tabIndex={-1}
              className="text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
            >
              Não foi possível exibir o editor
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              O editor encontrou um problema inesperado. Seus dados salvos neste navegador não foram apagados.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 border border-neutral-900 bg-neutral-900 px-4 py-2 font-mono text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-300 dark:focus-visible:outline-brand-400"
            >
              Tentar novamente
            </button>
          </section>
        </main>
      );
    }

    return <Fragment key={this.state.recoveryKey}>{this.props.children}</Fragment>;
  }
}
