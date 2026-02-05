import React from 'react';
import { motion } from 'motion/react';
import { staggerContainer, tableRowEnter } from '../primitives/animations';

export interface TableColumn<T = Record<string, unknown>> {
  /** Column key */
  key: string;
  /** Column header label */
  label: string;
  /** Column width */
  width?: string | number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Custom cell renderer */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T = Record<string, unknown>> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Row data */
  rows: T[];
  /** Called when row is clicked */
  onRowClick?: (row: T, index: number) => void;
  /** Animate row entry */
  animate?: boolean;
  /** Show header */
  showHeader?: boolean;
  /** Striped rows */
  striped?: boolean;
  /** Hoverable rows */
  hoverable?: boolean;
  /** Compact size */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Row key extractor */
  getRowKey?: (row: T, index: number) => string | number;
}

/**
 * Animated data table
 *
 * Displays tabular data with animated row entry, custom cell renderers,
 * and interactive row clicks.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: 'id', label: 'ID', width: 80 },
 *     { key: 'name', label: 'Name' },
 *     { key: 'amount', label: 'Amount', align: 'right',
 *       render: (val) => `$${val.toFixed(2)}` },
 *     { key: 'status', label: 'Status',
 *       render: (val) => <Badge variant={val}>{val}</Badge> }
 *   ]}
 *   rows={transactions}
 *   onRowClick={(row) => openDetails(row.id)}
 *   animate
 * />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  onRowClick,
  animate = true,
  showHeader = true,
  striped = false,
  hoverable = true,
  compact = false,
  className = '',
  emptyMessage = 'No data available',
  getRowKey,
}: DataTableProps<T>) {
  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  const getKey = (row: T, index: number): string | number => {
    if (getRowKey) return getRowKey(row, index);
    if ('id' in row) return row.id as string | number;
    return index;
  };

  const Container = animate ? motion.tbody : 'tbody';
  const Row = animate ? motion.tr : 'tr';

  return (
    <div className={`overflow-x-auto blade-ai-scrollbar ${className}`}>
      <table className="w-full text-sm">
        {/* Header */}
        {showHeader && (
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    ${cellPadding}
                    text-left font-semibold text-slate-600
                    bg-slate-50
                    ${col.align === 'center' ? 'text-center' : ''}
                    ${col.align === 'right' ? 'text-right' : ''}
                  `}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Body */}
        <Container
          {...(animate
            ? {
                variants: staggerContainer,
                initial: 'hidden',
                animate: 'visible',
              }
            : {})}
        >
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <Row
                key={getKey(row, rowIndex)}
                {...(animate ? { variants: tableRowEnter } : {})}
                onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                className={`
                  border-b border-slate-100 last:border-b-0
                  ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/50' : ''}
                  ${hoverable ? 'hover:bg-slate-50 transition-colors' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map((col) => {
                  const value = row[col.key];
                  const content = col.render
                    ? col.render(value, row, rowIndex)
                    : String(value ?? '');

                  return (
                    <td
                      key={col.key}
                      className={`
                        ${cellPadding}
                        text-slate-700
                        ${col.align === 'center' ? 'text-center' : ''}
                        ${col.align === 'right' ? 'text-right' : ''}
                      `}
                    >
                      {content}
                    </td>
                  );
                })}
              </Row>
            ))
          )}
        </Container>
      </table>
    </div>
  );
}

export default DataTable;
