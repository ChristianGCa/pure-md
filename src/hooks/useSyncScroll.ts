import { useRef, useCallback } from 'react';

export function useSyncScroll() {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollingSourceRef = useRef<'editor' | 'preview' | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScrollTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleEditorScroll = useCallback(() => {
    if (!editorRef.current || !previewRef.current) return;
    if (scrollingSourceRef.current === 'preview') return;

    scrollingSourceRef.current = 'editor';
    clearScrollTimeout();

    const editor = editorRef.current;
    const preview = previewRef.current;

    const editorScrollable = editor.scrollHeight - editor.clientHeight;
    const previewScrollable = preview.scrollHeight - preview.clientHeight;

    if (editorScrollable > 0 && previewScrollable > 0) {
      const scrollRatio = editor.scrollTop / editorScrollable;
      preview.scrollTop = scrollRatio * previewScrollable;
    }

    timeoutRef.current = setTimeout(() => {
      scrollingSourceRef.current = null;
    }, 50);
  }, []);

  const handlePreviewScroll = useCallback(() => {
    if (!editorRef.current || !previewRef.current) return;
    if (scrollingSourceRef.current === 'editor') return;

    scrollingSourceRef.current = 'preview';
    clearScrollTimeout();

    const editor = editorRef.current;
    const preview = previewRef.current;

    const editorScrollable = editor.scrollHeight - editor.clientHeight;
    const previewScrollable = preview.scrollHeight - preview.clientHeight;

    if (editorScrollable > 0 && previewScrollable > 0) {
      const scrollRatio = preview.scrollTop / previewScrollable;
      editor.scrollTop = scrollRatio * editorScrollable;
    }

    timeoutRef.current = setTimeout(() => {
      scrollingSourceRef.current = null;
    }, 50);
  }, []);

  return {
    editorRef,
    previewRef,
    handleEditorScroll,
    handlePreviewScroll,
  };
}
