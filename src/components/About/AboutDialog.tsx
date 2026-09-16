import { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface AboutDialogProps {
  onClose: () => void;
}

export function AboutDialog({ onClose }: AboutDialogProps) {
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

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="about-title"
      aria-describedby="about-summary"
      onCancel={onClose}
      onClose={onClose}
      className="m-auto max-h-[calc(100vh-2rem)] w-11/12 max-w-xl overflow-y-auto rounded-xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-neutral-950/70 backdrop:backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <div className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-medium text-neutral-700 dark:text-neutral-300">
              &gt;_ about.md
            </span>
            <h2 id="about-title" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              Sobre o PureMD
            </h2>
          </div>

          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Fechar informações do projeto"
            title="Fechar"
            className="-mr-2 -mt-1 rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-neutral-300"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p id="about-summary" className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          O PureMD é um editor Markdown gratuito, criado para escrever, revisar e exportar documentos diretamente no navegador.
        </p>

        <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Projeto criado por ChrisG e distribuído sob a licença MIT.
        </p>

        <dl className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200 text-sm dark:divide-neutral-800 dark:border-neutral-800">
          <div className="grid gap-1 py-3 sm:grid-cols-4 sm:gap-4">
            <dt className="font-mono text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Licença</dt>
            <dd className="text-neutral-700 dark:text-neutral-300 sm:col-span-3">MIT — permite usar, copiar, modificar e distribuir o código, preservando os avisos da licença.</dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-4 sm:gap-4">
            <dt className="font-mono text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Privacidade</dt>
            <dd className="text-neutral-700 dark:text-neutral-300 sm:col-span-3">Sem backend, contas ou analytics. Os documentos ficam no armazenamento local do navegador.</dd>
          </div>
          <div className="grid gap-1 py-3 sm:grid-cols-4 sm:gap-4">
            <dt className="font-mono text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Tecnologias</dt>
            <dd className="text-neutral-700 dark:text-neutral-300 sm:col-span-3">React 18, TypeScript, Vite 6 e Tailwind CSS.</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/ChristianGCa/pure-md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:ring-neutral-300"
          >
            Código-fonte
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </dialog>
  );
}
