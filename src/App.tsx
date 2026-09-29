import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSyncScroll } from './hooks/useSyncScroll';
import { useTheme } from './hooks/useTheme';
import { calculateStats } from './utils/stats';
import { DEFAULT_MARKDOWN } from './utils/sampleDocument';
import { Header, ViewMode } from './components/Layout/Header';
import { Toolbar } from './components/Editor/Toolbar';
import { EditorPane } from './components/Editor/EditorPane';
import { MarkdownContent, PreviewPane } from './components/Preview/PreviewPane';
import { StatusBar } from './components/Layout/StatusBar';
import { WelcomeDialog } from './components/Welcome/WelcomeDialog';
import { AboutDialog } from './components/About/AboutDialog';
import { PrivacyDialog } from './components/Privacy/PrivacyDialog';
import { applyFormatting, FormatAction } from './utils/markdownHelpers';

const DESKTOP_VIEW_QUERY = '(min-width: 1024px)';

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia(DESKTOP_VIEW_QUERY).matches;
}

export default function App() {
  const [content, setContent, contentStorageError] = useLocalStorage('markdown_document', DEFAULT_MARKDOWN);
  const [title, setTitle, titleStorageError] = useLocalStorage('markdown_document_title', 'meu-documento');
  const [isDesktop, setIsDesktop] = useState(isDesktopViewport);
  const [viewMode, setViewMode] = useState<ViewMode>(() => (isDesktopViewport() ? 'split' : 'editor'));
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const { editorRef, previewRef, handleEditorScroll, handlePreviewScroll } = useSyncScroll();

  const stats = calculateStats(content);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_VIEW_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      if (!event.matches) {
        setViewMode((currentMode) => (currentMode === 'split' ? 'editor' : currentMode));
      }
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  const handleCursorChange = useCallback((line: number, col: number) => {
    setCursorPos({ line, col });
  }, []);

  const handleToolbarAction = useCallback(
    (action: FormatAction) => {
      const textarea = editorRef.current;
      if (!textarea) return;

      const { selectionStart, selectionEnd } = textarea;
      const result = applyFormatting(content, selectionStart, selectionEnd, action);

      setContent(result.text);

      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.focus();
          editorRef.current.setSelectionRange(result.selectionStart, result.selectionEnd);
        }
      });
    },
    [content, setContent, editorRef]
  );

  const handleCopyMarkdown = useCallback(async (): Promise<boolean> => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(content);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [content]);

  const handleCopyHtml = useCallback(async (): Promise<boolean> => {
    try {
      if (!navigator.clipboard) return false;
      const { renderToStaticMarkup } = await import('react-dom/server');
      const html = renderToStaticMarkup(<MarkdownContent content={content} exportMode />);
      await navigator.clipboard.writeText(html);
      return true;
    } catch {
      return false;
    }
  }, [content]);

  const handleDownloadMd = useCallback(() => {
    const filename = `${title.trim() || 'documento'}.md`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [content, title]);

  const handleResetSample = useCallback(() => {
    if (window.confirm('Deseja restaurar o modelo inicial de exemplo? O texto atual será substituído.')) {
      setContent(DEFAULT_MARKDOWN);
    }
  }, [setContent]);

  const handleClear = useCallback(() => {
    if (window.confirm('Tem certeza de que deseja limpar todo o conteúdo do editor?')) {
      setContent('');
    }
  }, [setContent]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
      {/* Top Header */}
      <Header
        documentTitle={title}
        onTitleChange={setTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSplitMode={isDesktop}
        onCopyMarkdown={handleCopyMarkdown}
        onCopyHtml={handleCopyHtml}
        onDownloadMd={handleDownloadMd}
        onResetSample={handleResetSample}
        onClear={handleClear}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {(contentStorageError || titleStorageError) && (
        <div role="alert" className="flex flex-wrap items-center gap-2 bg-amber-50 px-4 py-2 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
          <span>Não foi possível ler ou salvar dados locais. Confira o texto e baixe uma cópia antes de fechar a aba.</span>
          <button type="button" onClick={handleDownloadMd} className="rounded border border-current px-2 py-1 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Baixar .md
          </button>
        </div>
      )}

      {/* Main Split-View Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Column */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <section
            aria-label="Área de Edição"
            className={`flex flex-col h-full overflow-hidden bg-white dark:bg-neutral-900/60 ${
              viewMode === 'split' ? 'w-full lg:w-1/2 border-r border-neutral-200 dark:border-neutral-800' : 'w-full'
            }`}
          >
            <Toolbar onAction={handleToolbarAction} />
            <div className="flex-1 overflow-hidden relative flex">
              <EditorPane
                value={content}
                onChange={setContent}
                onScroll={handleEditorScroll}
                textareaRef={editorRef}
                onCursorChange={handleCursorChange}
              />
            </div>
          </section>
        )}

        {/* Preview Column */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <section
            aria-label="Área de Pré-visualização"
            className={`flex flex-col h-full overflow-hidden ${
              viewMode === 'split' ? 'w-full lg:w-1/2' : 'w-full'
            }`}
          >
            <PreviewPane
              content={content}
              onScroll={handlePreviewScroll}
              previewRef={previewRef}
            />
          </section>
        )}
      </main>

      {/* Bottom Status Bar */}
      <StatusBar stats={stats} cursorPos={cursorPos} />

      <WelcomeDialog onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {isAboutOpen && (
        <AboutDialog
          onClose={() => setIsAboutOpen(false)}
          onOpenPrivacy={() => {
            setIsAboutOpen(false);
            setIsPrivacyOpen(true);
          }}
        />
      )}
      {isPrivacyOpen && <PrivacyDialog onClose={() => setIsPrivacyOpen(false)} />}
    </div>
  );
}
