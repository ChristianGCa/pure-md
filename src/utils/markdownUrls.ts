const SAFE_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export function safeMarkdownUrl(url: string, attribute: string): string | undefined {
  const normalizedUrl = url.trim();
  if (!normalizedUrl || CONTROL_CHARACTERS.test(normalizedUrl) || /^[\\/]{2}/.test(normalizedUrl)) {
    return undefined;
  }

  try {
    const base = new URL(window.location.href);
    const resolved = new URL(normalizedUrl, base);
    if (resolved.username || resolved.password) return undefined;

    if (attribute === 'src') {
      return resolved.origin === base.origin || resolved.protocol === 'https:'
        ? normalizedUrl
        : undefined;
    }

    return SAFE_LINK_PROTOCOLS.has(resolved.protocol) ? normalizedUrl : undefined;
  } catch {
    return undefined;
  }
}

export function isExternalImageUrl(src: string): boolean {
  return new URL(src, window.location.href).origin !== window.location.origin;
}
