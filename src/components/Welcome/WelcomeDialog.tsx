import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-description welcome-privacy"
      onCancel={() => setIsOpen(false)}
      onClose={() => setIsOpen(false)}
      className="m-auto w-11/12 max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-neutral-950/70 backdrop:backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <div className="border-t-4 border-brand-500 px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 dark:bg-brand-500/20">
              <img src="/favicon.svg" alt="" className="h-8 w-8" />
            </div>
            <div>
              <span className="font-mono text-xs font-medium text-brand-700 dark:text-brand-400">
                &gt;_ hello.md
              </span>
              <h2 id="welcome-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                Bem-vindo ao PureMD
              </h2>
            </div>
          </div>

          <button
            type="button"
            autoFocus
            onClick={() => setIsOpen(false)}
            aria-label="Fechar mensagem de boas-vindas"
            title="Fechar"
            className="-mr-2 -mt-1 rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p id="welcome-description" className="mt-6 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
          O PureMD é um editor Markdown que funciona inteiramente no seu navegador. Ele serve para escrever, visualizar em tempo real e exportar documentos em <span className="font-mono text-sm text-neutral-800 dark:text-neutral-100">.md</span> com rapidez.
        </p>

        <div className="mt-6 flex items-start gap-3 border-t border-neutral-200 pt-5 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
          <p id="welcome-privacy">
            Seus textos ficam salvos localmente e não são enviados pelo aplicativo para nenhum servidor.
          </p>
        </div>
      </div>
    </dialog>
  );
}
