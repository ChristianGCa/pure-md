import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface PrivacyDialogProps {
  onClose: () => void;
}

export function PrivacyDialog({ onClose }: PrivacyDialogProps) {
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
      aria-labelledby="privacy-title"
      onCancel={onClose}
      onClose={onClose}
      className="m-auto max-h-[calc(100vh-2rem)] w-11/12 max-w-2xl overflow-y-auto rounded-xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl backdrop:bg-neutral-950/70 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <div className="px-6 pb-6 pt-6 text-sm leading-6 sm:px-8 sm:pb-8 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">&gt;_ privacidade.md</span>
            <h2 id="privacy-title" className="mt-1 text-xl font-semibold sm:text-2xl">Privacidade do PureMD</h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Fechar aviso de privacidade"
            className="-mr-2 -mt-1 rounded-md p-2 text-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-neutral-700 dark:text-neutral-300">
          <section>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Contato</h3>
            <p>Responsável pelo site: ChristianGCa.</p>
            <p>Para dúvidas ou solicitações sobre dados pessoais, escreva para <a className="underline" href="mailto:christiangca.dev@gmail.com">christiangca.dev@gmail.com</a>.</p>
          </section>

          <section>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Seus documentos no navegador</h3>
            <p>Quando o navegador permite, o texto, o título e a preferência de tema são salvos localmente para manter seu trabalho entre visitas. O aplicativo não envia o documento à hospedagem. Esses dados permanecem no dispositivo até você substituí-los ou remover os dados do site nas configurações do navegador. Se o salvamento falhar, o editor mostra um aviso. Você pode baixar o texto em `.md` a qualquer momento.</p>
          </section>

          <section>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Acesso ao site e hospedagem</h3>
            <p>O site é entregue pela Vercel. Ao acessá-lo, a hospedagem recebe dados técnicos da requisição, como endereço IP e informações do navegador, para entregar e proteger o serviço. A duração do tratamento desses registros depende dos serviços e das configurações da Vercel. Consulte a <a className="underline" href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">política de privacidade da Vercel</a> ou entre em contato conosco para informações sobre o tratamento relacionado a este site. O código do PureMD não integra analytics.</p>
          </section>

          <section>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Imagens externas</h3>
            <p>No preview, imagens externas só são carregadas quando você escolher carregar cada uma. No HTML copiado, imagens externas viram links. Ao carregar uma imagem ou abrir um desses links, o navegador acessará o servidor externo, que poderá receber seu IP e a URL solicitada. O tratamento feito por esse servidor segue as práticas do respectivo responsável.</p>
          </section>

          <section>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Seus direitos</h3>
            <p>Você pode consultar, copiar, corrigir ou apagar o documento diretamente neste navegador. Para exercer direitos relativos aos dados de acesso tratados na operação do site, inclusive solicitar informações, correção ou eliminação quando aplicável, use o contato acima.</p>
          </section>
        </div>
      </div>
    </dialog>
  );
}
