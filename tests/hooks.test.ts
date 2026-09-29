import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../src/hooks/useLocalStorage';
import { useTheme } from '../src/hooks/useTheme';

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('persists changes to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('reads existing value from localStorage', () => {
    window.localStorage.setItem('test-key', JSON.stringify('existing'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('existing');
  });

  it('keeps editing in memory and reports a failed save', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
    });
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

    act(() => result.current[1]('unsaved text'));

    expect(result.current[0]).toBe('unsaved text');
    expect(result.current[2]).toBe(true);

    write.mockRestore();
    act(() => result.current[1]('saved text'));

    expect(result.current[0]).toBe('saved text');
    expect(result.current[2]).toBe(false);
    expect(window.localStorage.getItem('test-key')).toBe('"saved text"');
    warning.mockRestore();
  });

  it('keeps an invalid stored value available for recovery', () => {
    window.localStorage.setItem('test-key', '{unfinished document');

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('{unfinished document');
    expect(result.current[2]).toBe(true);
    expect(window.localStorage.getItem('test-key')).toBe('{unfinished document');
  });

  it('allows editing when reading localStorage is blocked', () => {
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
    expect(result.current[2]).toBe(true);
    read.mockRestore();
    warning.mockRestore();
  });
});

describe('useTheme hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light or system theme and allows toggling', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('keeps theme toggling available when storage is blocked', () => {
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Access denied', 'SecurityError');
    });
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    read.mockRestore();
    write.mockRestore();
    warning.mockRestore();
  });
});
