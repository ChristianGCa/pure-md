export const DEFAULT_MARKDOWN = `# Bem-vindo ao PureMD

Este é um editor Markdown simples, rápido e 100% executado no navegador.

---

## Recursos Principais

- **Split Screen Sincronizado**: Escreva à esquerda e veja a renderização em tempo real à direita.
- **Barra de Ferramentas**: Aplique formatações com um clique ou use atalhos de teclado (\`Ctrl+B\`, \`Ctrl+I\`, \`Ctrl+K\`).
- **Syntax Highlighting**: Realce de sintaxe colorido para múltiplos idiomas de programação.
- **Dark & Light Mode**: Interface agradável e confortável para os olhos a qualquer hora.
- **Persistência Local**: Seus textos são salvos automaticamente no seu navegador.

---

## Lista de Tarefas (GFM)

- [x] Criar estrutura do editor
- [x] Implementar visualização com split-screen
- [x] Adicionar realce de sintaxe em código
- [ ] Escrever novas ideias e anotações incríveis

---

## Exemplo de Código com Syntax Highlighting

\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

function greetUser(user: UserProfile): string {
  return \`Olá, \${user.name}! Seu perfil é \${user.role}.\`;
}

console.log(greetUser({ id: '1', name: 'Dev', role: 'editor' }));
\`\`\`

\`\`\`python
def fibonacci(n: int) -> list[int]:
    """Gera sequência de Fibonacci até n termos."""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq[:n]

print(fibonacci(7))
\`\`\`

---

## Exemplo de Tabela

| Recurso | Suporte | Notas |
| :--- | :---: | :--- |
| GitHub Flavored Markdown | ✅ | Tabelas, tarefas, tachado |
| Deploy Vercel | ✅ | 100% estático, ultra-rápido |
| Atalhos de Teclado | ✅ | \`Tab\`, \`Ctrl+B\`, \`Ctrl+I\`, etc. |

---

> "A simplicidade é a sofisticação máxima."  
> — *Leonardo da Vinci*
`;
