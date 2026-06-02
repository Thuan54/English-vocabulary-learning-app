/**
 * Simple Markdown renderer — converts common markdown patterns to HTML.
 * Handles: headings, bold, italic, bullet lists, numbered lists, inline code.
 */
export function MarkdownContent({ content, className = '' }: { content: string; className?: string }) {
  const html = markdownToHtml(content);
  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Headings: # ## ### ####
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      if (inList) { result.push(listType === 'ol' ? '</ol>' : '</ul>'); inList = false; listType = null; }
      const level = headingMatch[1].length;
      const text = inlineFormat(headingMatch[2]);
      const sizes = ['text-base font-bold', 'text-sm font-bold', 'text-sm font-semibold', 'text-xs font-semibold uppercase tracking-wider'];
      result.push(`<div class="${sizes[level - 1] || sizes[0]} mt-3 mb-1 text-gray-800">${text}</div>`);
      continue;
    }

    // Bullet list: * or -
    const bulletMatch = line.match(/^\s*[*\-]\s+(.+)$/);
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ul class="list-disc list-inside space-y-0.5 text-sm">');
        inList = true; listType = 'ul';
      }
      result.push(`<li>${inlineFormat(bulletMatch[1])}</li>`);
      continue;
    }

    // Numbered list: 1. 2. 3.
    const numMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (numMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
        result.push('<ol class="list-decimal list-inside space-y-0.5 text-sm">');
        inList = true; listType = 'ol';
      }
      result.push(`<li>${inlineFormat(numMatch[1])}</li>`);
      continue;
    }

    // Close any open list
    if (inList) {
      result.push(listType === 'ol' ? '</ol>' : '</ul>');
      inList = false; listType = null;
    }

    // Empty line → spacing
    if (line.trim() === '') {
      result.push('<div class="h-2"></div>');
      continue;
    }

    // Regular paragraph
    result.push(`<p class="text-sm leading-relaxed">${inlineFormat(line)}</p>`);
  }

  if (inList) result.push(listType === 'ol' ? '</ol>' : '</ul>');
  return result.join('\n');
}

/** Inline formatting: **bold**, *italic*, `code` */
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs">$1</code>');
}
