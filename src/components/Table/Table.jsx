import React, { useState, useRef, useEffect } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import styles from './Table.module.css';

const Table = ({ users, onSort, sortConfig, onRowClick }) => {
  const [columnWidths, setColumnWidths] = useState({
    lastName: 120,
    firstName: 120,
    middleName: 120,
    age: 80,
    gender: 100,
    phone: 150,
    email: 200,
    country: 120,
    city: 120,
  });

  const tableRef = useRef(null);
  const resizingColumn = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const columns = [
    { key: 'lastName', label: 'Фамилия' },
    { key: 'firstName', label: 'Имя' },
    { key: 'middleName', label: 'Отчество' },
    { key: 'age', label: 'Возраст' },
    { key: 'gender', label: 'Пол' },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email' },
    { key: 'country', label: 'Страна' },
    { key: 'city', label: 'Город' },
  ];

  const handleMouseDown = (e, columnKey) => {
    e.preventDefault();
    resizingColumn.current = columnKey;
    startX.current = e.pageX;
    startWidth.current = columnWidths[columnKey];
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!resizingColumn.current) return;
    
    const diff = e.pageX - startX.current;
    let newWidth = startWidth.current + diff;
    
    // Минимальная ширина 50px
    newWidth = Math.max(50, newWidth);
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn.current]: newWidth
    }));
  };

  const handleMouseUp = () => {
    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} ref={tableRef}>
        <TableHeader
          columns={columns}
          columnWidths={columnWidths}
          sortConfig={sortConfig}
          onSort={onSort}
          onResizeStart={handleMouseDown}
        />
        <tbody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              user={user}
              columnWidths={columnWidths}
              onClick={() => onRowClick(user)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;