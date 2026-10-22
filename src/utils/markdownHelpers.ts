export interface FormatResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export type FormatAction =
  | 'bold'
  | 'italic'
  | 'strike'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'inline-code'
  | 'code-block'
  | 'quote'
  | 'ul'
  | 'ol'
  | 'task'
  | 'link'
  | 'table';

export function applyFormatting(
  fullText: string,
  selectionStart: number,
  selectionEnd: number,
  action: FormatAction
): FormatResult {
  const before = fullText.substring(0, selectionStart);
  const selected = fullText.substring(selectionStart, selectionEnd);
  const after = fullText.substring(selectionEnd);

  switch (action) {
    case 'bold': {
      const placeholder = 'texto em negrito';
      const content = selected || placeholder;
      const formatted = `**${content}**`;
      const newText = before + formatted + after;
      if (!selected) {
        return {
          text: newText,
          selectionStart: selectionStart + 2,
          selectionEnd: selectionStart + 2 + placeholder.length,
        };
      }
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'italic': {
      const placeholder = 'texto em itálico';
      const content = selected || placeholder;
      const formatted = `*${content}*`;
      const newText = before + formatted + after;
      if (!selected) {
        return {
          text: newText,
          selectionStart: selectionStart + 1,
          selectionEnd: selectionStart + 1 + placeholder.length,
        };
      }
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'strike': {
      const placeholder = 'texto tachado';
      const content = selected || placeholder;
      const formatted = `~~${content}~~`;
      const newText = before + formatted + after;
      if (!selected) {
        return {
          text: newText,
          selectionStart: selectionStart + 2,
          selectionEnd: selectionStart + 2 + placeholder.length,
        };
      }
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'h1':
    case 'h2':
    case 'h3': {
      const prefix = action === 'h1' ? '# ' : action === 'h2' ? '## ' : '### ';
      const placeholder = action === 'h1' ? 'Título 1' : action === 'h2' ? 'Título 2' : 'Título 3';
      const content = selected || placeholder;
      const formatted = `${prefix}${content}`;
      const newText = before + formatted + after;
      return {
        text: newText,
        selectionStart: selectionStart + prefix.length,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'inline-code': {
      const placeholder = 'código';
      const content = selected || placeholder;
      const formatted = `\`${content}\``;
      const newText = before + formatted + after;
      if (!selected) {
        return {
          text: newText,
          selectionStart: selectionStart + 1,
          selectionEnd: selectionStart + 1 + placeholder.length,
        };
      }
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'code-block': {
      const placeholder = 'seu código aqui';
      const content = selected || placeholder;
      const formatted = `\`\`\`ts\n${content}\n\`\`\``;
      const newText = before + formatted + after;
      return {
        text: newText,
        selectionStart: selectionStart + 6,
        selectionEnd: selectionStart + 6 + content.length,
      };
    }

    case 'quote': {
      const content = selected || 'Citação';
      const lines = content.split('\n');
      const quoted = lines.map((line) => `> ${line}`).join('\n');
      const newText = before + quoted + after;
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + quoted.length,
      };
    }

    case 'ul': {
      const content = selected || 'Item da lista';
      const lines = content.split('\n');
      const formatted = lines.map((line) => `- ${line}`).join('\n');
      const newText = before + formatted + after;
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'ol': {
      const content = selected || 'Item numerado';
      const lines = content.split('\n');
      const formatted = lines.map((line, idx) => `${idx + 1}. ${line}`).join('\n');
      const newText = before + formatted + after;
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'task': {
      const content = selected || 'Nova tarefa';
      const lines = content.split('\n');
      const formatted = lines.map((line) => `- [ ] ${line}`).join('\n');
      const newText = before + formatted + after;
      return {
        text: newText,
        selectionStart,
        selectionEnd: selectionStart + formatted.length,
      };
    }

    case 'link': {
      const placeholder = 'link';
      const content = selected || placeholder;
      const formatted = `[${content}](url)`;
      const newText = before + formatted + after;
      return {
        text: newText,
        selectionStart: selectionStart + formatted.indexOf('(url)') + 1,
        selectionEnd: selectionStart + formatted.indexOf('(url)') + 4,
      };
    }

    case 'table': {
      const tableMarkdown = `| Cabeçalho 1 | Cabeçalho 2 | Cabeçalho 3 |\n|---|---|---|\n| Linha 1 Col 1 | Linha 1 Col 2 | Linha 1 Col 3 |\n| Linha 2 Col 1 | Linha 2 Col 2 | Linha 2 Col 3 |\n`;
      const newText = before + tableMarkdown + after;
      return {
        text: newText,
        selectionStart: selectionStart + tableMarkdown.length,
        selectionEnd: selectionStart + tableMarkdown.length,
      };
    }

    default:
      return {
        text: fullText,
        selectionStart,
        selectionEnd,
      };
  }
}

export function getCursorPosition(text: string, position: number): { line: number; col: number } {
  const lines = text.substring(0, position).split('\n');
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

export interface ListContinuation {
  nextPrefix: string;
  content: string;
}

/** Returns the prefix for the next list item when the line is a GFM list item. */
export function getListContinuation(line: string): ListContinuation | null {
  const taskMatch = line.match(/^(\s*)([-*+])\s\[[ xX]\]\s(.*)$/);
  if (taskMatch) {
    return { nextPrefix: `${taskMatch[1]}${taskMatch[2]} [ ] `, content: taskMatch[3] };
  }

  const bulletMatch = line.match(/^(\s*)([-*+])\s(.*)$/);
  if (bulletMatch) {
    return { nextPrefix: `${bulletMatch[1]}${bulletMatch[2]} `, content: bulletMatch[3] };
  }

  const orderedMatch = line.match(/^(\s*)(\d+)([.)])\s(.*)$/);
  if (orderedMatch) {
    const nextNumber = parseInt(orderedMatch[2], 10) + 1;
    return { nextPrefix: `${orderedMatch[1]}${nextNumber}${orderedMatch[3]} `, content: orderedMatch[4] };
  }

  return null;
}
