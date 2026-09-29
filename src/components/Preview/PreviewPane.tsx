import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import { isExternalImageUrl, safeMarkdownUrl } from '../../utils/markdownUrls';

interface PreviewPaneProps {
  content: string;
  onScroll: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
}

const MarkdownImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, ...props }) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  if (!src || !isExternalImageUrl(src) || loadedSrc === src) {
    return <img src={src} alt={alt} {...props} />;
  }

  const hostname = new URL(src, window.location.href).hostname;

  return (
    <span className="inline-flex flex-col gap-2 rounded-md border border-neutral-300 p-3 text-sm dark:border-neutral-700">
      <span>{alt || 'Imagem externa'}</span>
      <button
        type="button"
        onClick={() => setLoadedSrc(src)}
        aria-label={`Carregar imagem externa: ${alt || hostname}`}
        className="self-start rounded border border-neutral-400 px-2 py-1 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-neutral-500"
      >
        Carregar imagem externa
      </button>
      <span className="text-xs text-neutral-600 dark:text-neutral-400">
        Seu navegador acessará {hostname}.
      </span>
    </span>
  );
};

const PreBlock: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const preRef = React.useRef<HTMLPreElement>(null);

  // Extract the language label from the highlighted code element.
  let language = '';

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as { className?: string; children?: React.ReactNode };
      if (childProps.className) {
        const match = /language-(\w+)/.exec(childProps.className);
        if (match) {
          language = match[1];
        }
      }
    }
  });

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) return;

      await navigator.clipboard.writeText(preRef.current?.textContent ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900">
      <div className="flex items-center justify-between px-3.5 py-1.5 text-xs text-neutral-400 bg-neutral-950/80 border-b border-neutral-800 select-none">
        <span className="font-mono uppercase font-semibold text-[11px] tracking-wider text-neutral-400">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copiar código"
          className="flex items-center gap-1.5 px-2 py-0.5 text-xs text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-brand-400 text-[11px]">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copiar</span>
            </>
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        {...props}
        className="!m-0 !p-4 !bg-transparent overflow-x-auto text-sm font-mono leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
};

export const MarkdownContent: React.FC<{ content: string; exportMode?: boolean }> = ({
  content,
  exportMode = false,
}) => {
  return (
    <Markdown
      skipHtml
      urlTransform={safeMarkdownUrl}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        img({ node: _node, ...props }) {
          return exportMode ? <img {...props} /> : <MarkdownImage {...props} />;
        },
        pre({ node: _node, ...props }) {
          return exportMode ? <pre {...props} /> : <PreBlock {...props} />;
        },
        code({ node: _node, className, children, ...props }) {
          const isInline = !className?.includes('hljs') && !className?.includes('language-');
          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        table({ node: _node, children, ...props }) {
          return (
            <div className="overflow-x-auto my-4">
              <table {...props} className="w-full text-left border border-neutral-200 dark:border-neutral-800">
                {children}
              </table>
            </div>
          );
        },
        a({ node: _node, children, href, ...props }) {
          const isExternal = href?.startsWith('http://') || href?.startsWith('https://');
          return (
            <a
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};

export const PreviewPane: React.FC<PreviewPaneProps> = ({ content, onScroll, previewRef }) => (
  <div
    ref={previewRef}
    onScroll={onScroll}
    className="w-full h-full flex-1 overflow-y-auto p-6 lg:p-8 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
    data-testid="preview-pane"
  >
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline prose-table:border prose-table:border-collapse prose-th:bg-neutral-100 dark:prose-th:bg-neutral-900 prose-th:p-2 prose-td:p-2 prose-td:border prose-th:border">
      <MarkdownContent content={content} />
    </div>
  </div>
);
