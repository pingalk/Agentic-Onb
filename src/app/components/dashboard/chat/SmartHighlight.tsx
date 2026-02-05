import React from 'react';

// Patterns for smart highlighting
const HIGHLIGHT_PATTERNS = {
  // Amounts: ₹1,000, Rs. 500, ₹1.5L, ₹1,00,000.00
  amount: /(?:₹|Rs\.?\s*)[\d,]+(?:\.\d{1,2})?(?:\s*(?:L|Lakhs?|Cr|Crores?|K))?/gi,

  // Dates: Jan 15, 15 Jan 2024, 15/01/2024, January 15, 2024, Today, Yesterday, Tomorrow
  date: /\b(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,?\s+\d{4})?|\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:,?\s+\d{4})?|\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|Today|Yesterday|Tomorrow)\b/gi,

  // Time: 10:30 AM, 2:45 PM, 14:30
  time: /\b\d{1,2}:\d{2}(?:\s*(?:AM|PM|am|pm))?\b/gi,

  // IDs: RRN, UTR, Transaction ID patterns (alphanumeric 8+ chars)
  id: /\b(?:RRN|UTR|TXN|REF|ID|Ticket|Order)[\s:#]*[A-Z0-9]{6,}\b|\b[A-Z]{2,4}[0-9]{8,}\b/gi,

  // Estimates/Durations: 5-7 days, 2-3 business days, within 24 hours, 5 days ago
  duration: /\b(?:\d+(?:\s*-\s*\d+)?\s*(?:business\s+)?(?:days?|hours?|minutes?|weeks?|months?)(?:\s+ago)?|within\s+\d+\s+(?:hours?|days?|weeks?))\b/gi,

  // Percentages: 98%, 2.5%
  percentage: /\b\d+(?:\.\d+)?%\b/g,

  // Status keywords
  status: /\b(?:Processed|Processing|Pending|Failed|Captured|Refunded|Escalated|Completed|Success(?:ful)?|Declined|Approved|Rejected)\b/gi,
};

// Highlight styles for different types (heavier font weight + #202020 color)
const HIGHLIGHT_STYLES: Record<string, string> = {
  amount: 'font-medium text-[#202020]',
  date: 'font-medium text-[#202020]',
  time: 'font-medium text-[#202020]',
  id: 'font-mono font-medium text-[#202020]',
  duration: 'font-medium text-[#202020]',
  percentage: 'font-medium text-[#202020]',
  status: 'font-medium text-[#202020]',
};

interface HighlightMatch {
  start: number;
  end: number;
  text: string;
  type: string;
}

function findAllMatches(text: string): HighlightMatch[] {
  const matches: HighlightMatch[] = [];

  for (const [type, pattern] of Object.entries(HIGHLIGHT_PATTERNS)) {
    // Reset regex lastIndex
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        type,
      });
    }
  }

  // Sort by start position and remove overlaps (prefer earlier/longer matches)
  matches.sort((a, b) => a.start - b.start || b.end - a.end);

  const nonOverlapping: HighlightMatch[] = [];
  let lastEnd = 0;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      nonOverlapping.push(match);
      lastEnd = match.end;
    }
  }

  return nonOverlapping;
}

function getHighlightClass(type: string): string {
  return HIGHLIGHT_STYLES[type] || '';
}

interface SmartHighlightProps {
  text: string;
  className?: string;
}

export const SmartHighlight: React.FC<SmartHighlightProps> = ({ text, className = '' }) => {
  const matches = findAllMatches(text);

  if (matches.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    // Add text before this match
    if (match.start > lastIndex) {
      parts.push(
        <span key={`text-${i}`}>
          {text.slice(lastIndex, match.start)}
        </span>
      );
    }

    // Add highlighted match
    parts.push(
      <span
        key={`highlight-${i}`}
        className={getHighlightClass(match.type)}
      >
        {match.text}
      </span>
    );

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key="text-end">
        {text.slice(lastIndex)}
      </span>
    );
  }

  return <span className={className}>{parts}</span>;
};

// Utility function to apply smart highlighting to text content
// Preserves **bold** markdown formatting while adding highlights
export const SmartHighlightWithBold: React.FC<SmartHighlightProps> = ({ text, className = '' }) => {
  // First split by bold markers
  const boldPattern = /\*\*(.*?)\*\*/g;
  const segments: { text: string; isBold: boolean }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = boldPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), isBold: false });
    }
    segments.push({ text: match[1], isBold: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isBold: false });
  }

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        const highlighted = <SmartHighlight key={i} text={segment.text} />;
        return segment.isBold ? (
          <strong key={i} className="font-medium text-[#192839]">
            {highlighted}
          </strong>
        ) : (
          highlighted
        );
      })}
    </span>
  );
};

export default SmartHighlight;
