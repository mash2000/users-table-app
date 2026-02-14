import React from 'react';
import styles from './Table.module.css';

const TableHeader = ({ columns, columnWidths, sortConfig, onSort, onResizeStart }) => {
  const getSortIndicator = (columnKey) => {
    if (sortConfig.field !== columnKey) return '↕️';
    return sortConfig.order === 'asc' ? '↑' : '↓';
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            style={{ width: columnWidths[column.key], position: 'relative' }}
            className={styles.sortable}
            onClick={() => onSort(column.key)}
          >
            {column.label}
            <span className={styles.sortIndicator}>
              {getSortIndicator(column.key)}
            </span>
            <div
              className={styles.resizer}
              onMouseDown={(e) => {
                e.stopPropagation();
                onResizeStart(e, column.key);
              }}
            />
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;