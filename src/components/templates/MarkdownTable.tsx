// components/MarkdownTableExtended.tsx
import React from 'react';

interface MarkdownTableProps {
  headers: string[];
  rows: string[][];
  className?: string;
  showRowCount?: boolean;
}

type MarkdownSegment = {
  type: 'text' | 'bold' | 'italic' | 'code';
  content: string;
};

export function MarkdownTable({
                                        headers,
                                        rows,
                                        className = '',
                                        showRowCount = false
}: MarkdownTableProps) {

  // Parse markdown com múltiplos formatos
  const parseMarkdown = (text: string): MarkdownSegment[] => {
    const segments: MarkdownSegment[] = [];

    // Regex combinado para diferentes padrões markdown
    const regex = /(\*\*.*?\*\*)|(\*.*?\*)|(`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Adiciona texto antes do match
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Determina o tipo do match
      if (match[1]) { // **bold**
        segments.push({
          type: 'bold',
          content: match[1].slice(2, -2)
        });
      } else if (match[2]) { // *italic*
        segments.push({
          type: 'italic',
          content: match[2].slice(1, -1)
        });
      } else if (match[3]) { // `code`
        segments.push({
          type: 'code',
          content: match[3].slice(1, -1)
        });
      }

      lastIndex = match.index + match[0].length;
    }

    // Adiciona texto restante
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return segments;
  };

  const renderMarkdownContent = (content: string): React.ReactNode => {
    if (!content) return content;

    const segments = parseMarkdown(content);

    return segments.map((segment, index) => {
      switch (segment.type) {
        case 'bold':
          return (
            <strong key={index} className="text-blue-600 dark:text-blue-400 font-semibold">
              {segment.content}
            </strong>
          );
        case 'italic':
          return (
            <em key={index} className="text-gray-700 dark:text-gray-300 italic">
              {segment.content}
            </em>
          );
        case 'code':
          return (
            <code key={index} className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-pink-600 dark:text-pink-400">
              {segment.content}
            </code>
          );
        default:
          return <span key={index}>{segment.content}</span>;
      }
    });
  };

  // Validação de tipos
  if (!Array.isArray(headers) || !Array.isArray(rows)) {
    console.error('MarkdownTable: headers e rows devem ser arrays');
    return null;
  }

  return (
    <div className={`overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              scope="col"
              className={`
                  px-6 py-3 text-left text-xs font-medium
                  text-gray-500 dark:text-gray-400
                  uppercase tracking-wider
                  border-b border-gray-200 dark:border-gray-700
                `}
            >
              {renderMarkdownContent(header)}
            </th>
          ))}
        </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={`
                even:bg-gray-50 dark:even:bg-gray-900/50
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors duration-150
              `}
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    text-gray-900 dark:text-gray-100
                    ${cellIndex === 0 ? 'font-medium' : ''}
                  `}
              >
                {renderMarkdownContent(cell)}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>

      {showRowCount && rows.length > 0 && (
        <div className="mt-0 m-0 my-0 px-6 py-2 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          Total: {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
        </div>
      )}
    </div>
  );
};