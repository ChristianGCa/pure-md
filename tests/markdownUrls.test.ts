import { describe, expect, it } from 'vitest';
import { safeMarkdownUrl } from '../src/utils/markdownUrls';

describe('safeMarkdownUrl', () => {
  it('rejects credentials embedded in image and link URLs', () => {
    expect(safeMarkdownUrl('https://user:pass@images.example.com/x.png', 'src')).toBeUndefined();
    expect(safeMarkdownUrl('https://user@images.example.com/x.png', 'src')).toBeUndefined();
    expect(safeMarkdownUrl('https://:pass@images.example.com/x.png', 'src')).toBeUndefined();
    expect(safeMarkdownUrl('https://user:pass@example.com/', 'href')).toBeUndefined();
  });

  it('continues to allow ordinary HTTPS images and links', () => {
    expect(safeMarkdownUrl('https://images.example.com/x.png', 'src')).toBe('https://images.example.com/x.png');
    expect(safeMarkdownUrl('https://example.com/', 'href')).toBe('https://example.com/');
  });
});
