import React, { useMemo } from 'react';

export interface HighlightPattern {
  /** Regex pattern to match */
  pattern: RegExp;
  /** CSS class to apply */
  className?: string;
  /** Custom render function */
  render?: (match: string, index: number) => React.ReactNode;
}

export interface MarkdownProps {
  /** The markdown content to render */
  content: string;
  /** Additional patterns to highlight */
  highlightPatterns?: HighlightPattern[];
  /** Additional CSS classes */
  className?: string;
  /** Whether to apply the blade-ai-markdown class for default styling */
  applyDefaultStyles?: boolean;
}

/**
 * Markdown renderer with smart highlighting
 *
 * Renders basic markdown (bold, italic, code, links) with optional
 * custom highlight patterns for emphasizing specific content.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Markdown content="**Bold** and *italic* text" />
 *
 * // With custom highlights
 * <Markdown
 *   content="The total is $1,234.56"
 *   highlightPatterns={[
 *     {
 *       pattern: /\$[\d,]+\.\d{2}/g,
 *       className: "text-emerald-600 font-semibold"
 *     }
 *   ]}
 * />
 * ```
 */
export const Markdown: React.FC<MarkdownProps> = ({
  content,
  highlightPatterns = [],
  className = '',
  applyDefaultStyles = true,
}) => {
  const rendered = useMemo(() => {
    if (!content) return null;

    // First, apply custom highlight patterns
    let processedContent = content;
    const highlightMarkers: Array<{
      start: number;
      end: number;
      replacement: string;
      className?: string;
    }> = [];

    // Collect all highlight matches
    highlightPatterns.forEach((pattern, patternIdx) => {
      const matches = Array.from(content.matchAll(pattern.pattern));
      matches.forEach((match, matchIdx) => {
        if (match.index !== undefined) {
          const marker = `__HIGHLIGHT_${patternIdx}_${matchIdx}__`;
          highlightMarkers.push({
            start: match.index,
            end: match.index + match[0].length,
            replacement: marker,
            className: pattern.className,
          });
        }
      });
    });

    // Parse the content into segments
    const parseInline = (text: string): React.ReactNode[] => {
      const elements: React.ReactNode[] = [];
      let remaining = text;
      let keyIndex = 0;

      while (remaining.length > 0) {
        // Check for highlight markers
        const highlightMatch = remaining.match(/__HIGHLIGHT_(\d+)_(\d+)__/);
        if (highlightMatch && highlightMatch.index === 0) {
          const patternIdx = parseInt(highlightMatch[1]);
          const matchIdx = parseInt(highlightMatch[2]);
          const pattern = highlightPatterns[patternIdx];

          // Get original match text
          const originalMatches = Array.from(content.matchAll(pattern.pattern));
          const originalMatch = originalMatches[matchIdx]?.[0] || '';

          if (pattern.render) {
            elements.push(
              <React.Fragment key={keyIndex++}>
                {pattern.render(originalMatch, matchIdx)}
              </React.Fragment>
            );
          } else {
            elements.push(
              <span key={keyIndex++} className={pattern.className}>
                {originalMatch}
              </span>
            );
          }

          remaining = remaining.slice(highlightMatch[0].length);
          continue;
        }

        // Check for bold (**text**)
        const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
        if (boldMatch) {
          elements.push(
            <strong key={keyIndex++} className="font-semibold text-slate-900">
              {parseInline(boldMatch[1])}
            </strong>
          );
          remaining = remaining.slice(boldMatch[0].length);
          continue;
        }

        // Check for italic (*text* or _text_)
        const italicMatch = remaining.match(/^(?:\*([^*]+)\*|_([^_]+)_)/);
        if (italicMatch) {
          elements.push(
            <em key={keyIndex++} className="italic">
              {parseInline(italicMatch[1] || italicMatch[2])}
            </em>
          );
          remaining = remaining.slice(italicMatch[0].length);
          continue;
        }

        // Check for inline code (`code`)
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
          elements.push(
            <code
              key={keyIndex++}
              className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800"
            >
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch[0].length);
          continue;
        }

        // Check for links [text](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          elements.push(
            <a
              key={keyIndex++}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {parseInline(linkMatch[1])}
            </a>
          );
          remaining = remaining.slice(linkMatch[0].length);
          continue;
        }

        // Check for line break
        if (remaining.startsWith('\n')) {
          elements.push(<br key={keyIndex++} />);
          remaining = remaining.slice(1);
          continue;
        }

        // Find next special character or end of string
        const nextSpecial = remaining.search(/\*\*|\*|_|`|\[|__HIGHLIGHT_|\n/);
        if (nextSpecial === -1) {
          // No more special characters, add remaining text
          elements.push(remaining);
          break;
        } else if (nextSpecial === 0) {
          // If we couldn't match a pattern but found a special char, just add it
          elements.push(remaining[0]);
          remaining = remaining.slice(1);
        } else {
          // Add text before the next special character
          elements.push(remaining.slice(0, nextSpecial));
          remaining = remaining.slice(nextSpecial);
        }
      }

      return elements;
    };

    // Parse block-level elements
    const parseBlocks = (text: string): React.ReactNode[] => {
      const lines = text.split('\n');
      const blocks: React.ReactNode[] = [];
      let keyIndex = 0;
      let currentParagraph: string[] = [];

      const flushParagraph = () => {
        if (currentParagraph.length > 0) {
          blocks.push(
            <p key={keyIndex++} className="mb-3 last:mb-0">
              {parseInline(currentParagraph.join('\n'))}
            </p>
          );
          currentParagraph = [];
        }
      };

      lines.forEach((line) => {
        const trimmedLine = line.trim();

        // Check for headers
        const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
        if (headerMatch) {
          flushParagraph();
          const level = headerMatch[1].length;
          const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
          const headerClasses: Record<number, string> = {
            1: 'text-2xl font-bold mb-4',
            2: 'text-xl font-semibold mb-3',
            3: 'text-lg font-semibold mb-2',
            4: 'text-base font-semibold mb-2',
            5: 'text-sm font-semibold mb-1',
            6: 'text-sm font-medium mb-1',
          };
          blocks.push(
            <HeaderTag key={keyIndex++} className={headerClasses[level] || ''}>
              {parseInline(headerMatch[2])}
            </HeaderTag>
          );
          return;
        }

        // Check for unordered list items
        const ulMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
        if (ulMatch) {
          flushParagraph();
          blocks.push(
            <li key={keyIndex++} className="ml-4 list-disc mb-1">
              {parseInline(ulMatch[1])}
            </li>
          );
          return;
        }

        // Check for ordered list items
        const olMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
        if (olMatch) {
          flushParagraph();
          blocks.push(
            <li key={keyIndex++} className="ml-4 list-decimal mb-1">
              {parseInline(olMatch[2])}
            </li>
          );
          return;
        }

        // Check for blockquote
        const quoteMatch = trimmedLine.match(/^>\s*(.*)$/);
        if (quoteMatch) {
          flushParagraph();
          blocks.push(
            <blockquote
              key={keyIndex++}
              className="border-l-3 border-slate-300 pl-4 text-slate-600 italic my-2"
            >
              {parseInline(quoteMatch[1])}
            </blockquote>
          );
          return;
        }

        // Check for horizontal rule
        if (/^[-*_]{3,}$/.test(trimmedLine)) {
          flushParagraph();
          blocks.push(<hr key={keyIndex++} className="my-4 border-slate-200" />);
          return;
        }

        // Empty line
        if (trimmedLine === '') {
          flushParagraph();
          return;
        }

        // Regular paragraph content
        currentParagraph.push(line);
      });

      flushParagraph();
      return blocks;
    };

    return parseBlocks(processedContent);
  }, [content, highlightPatterns]);

  return (
    <div className={`${applyDefaultStyles ? 'blade-ai-markdown' : ''} ${className}`}>
      {rendered}
    </div>
  );
};

/**
 * Simple inline text with bold pattern support
 * Used for streaming text final render
 */
export const SmartText: React.FC<{
  content: string;
  className?: string;
}> = ({ content, className = '' }) => {
  const rendered = useMemo(() => {
    if (!content) return null;

    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }, [content]);

  return <span className={className}>{rendered}</span>;
};

export default Markdown;
