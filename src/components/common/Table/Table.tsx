import React from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

export interface Column<T> {
  key: string;
  title: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  onRowClick?: (item: T) => void;
  selectedIds?: (string | number)[];
  onSelectionChange?: (ids: (string | number)[]) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  selectedIds,
  onSelectionChange,
  isLoading,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  const handleHeaderClick = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const handleRowSelection = (id: string | number) => {
    if (!onSelectionChange || !selectedIds) return;
    
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange || !selectedIds) return;

    const allIds = data.map(item => keyExtractor(item));
    const newSelection = selectedIds.length === data.length ? [] : allIds;
    
    onSelectionChange(newSelection);
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    if (sortColumn === column.key) {
      return sortDirection === 'asc' 
        ? <ChevronUpIcon className="h-4 w-4" />
        : <ChevronDownIcon className="h-4 w-4" />;
    }

    return <ChevronDownIcon className="h-4 w-4 opacity-0 group-hover:opacity-50" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-text-secondary">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-background-main">
          <tr>
            {onSelectionChange && (
              <th className="pl-6 py-3 w-px">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary/20"
                  checked={selectedIds?.length === data.length}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-text-secondary 
                  uppercase tracking-wider whitespace-nowrap
                  ${column.sortable ? 'cursor-pointer group' : ''}
                  ${column.width ? `w-${column.width}` : ''}
                `}
                onClick={() => handleHeaderClick(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-background-paper divide-y divide-border">
          {data.map((item) => {
            const id = keyExtractor(item);
            return (
              <tr
                key={id}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-background-main' : ''}
                  ${selectedIds?.includes(id) ? 'bg-primary/5' : ''}
                `}
                onClick={() => onRowClick?.(item)}
              >
                {onSelectionChange && (
                  <td className="pl-6 py-4 whitespace-nowrap w-px">
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary/20"
                      checked={selectedIds?.includes(id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelection(id);
                      }}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={`${id}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-text-primary"
                  >
                    {column.render
                      ? column.render(item)
                      : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;