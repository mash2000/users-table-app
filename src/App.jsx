import React, { useState, useCallback } from 'react';
import Table from './components/Table/Table';
import UserModal from './components/Modal/UserModal';
import Pagination from './components/Pagination/Pagination';
import Filters from './components/Filters/Filters';
import useUsers from './hooks/useUsers';
import styles from './App.module.css';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    order: null, // 'asc', 'desc', null
  });
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    phone: '',
  });

  const limit = 10;
  const skip = (currentPage - 1) * limit;

  const { users, total, loading, error, refetch } = useUsers({
    limit,
    skip,
    sortField: sortConfig.field,
    sortOrder: sortConfig.order,
    filters,
  });

  const handleSort = useCallback((field) => {
    setSortConfig((prev) => {
      if (prev.field !== field) {
        return { field, order: 'asc' };
      }
      
      switch (prev.order) {
        case 'asc':
          return { field, order: 'desc' };
        case 'desc':
          return { field: null, order: null };
        default:
          return { field, order: 'asc' };
      }
    });
  }, []);

  const handleRowClick = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUser(null);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.title}>Пользователи</h1>
        
        <Filters filters={filters} onFilterChange={handleFilterChange} />
        
        {error && (
          <div className={styles.error}>
            <p>Ошибка загрузки данных: {error}</p>
            <button onClick={refetch}>Повторить</button>
          </div>
        )}
        
        {loading && !users.length ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <>
            <Table
              users={users}
              onSort={handleSort}
              sortConfig={sortConfig}
              onRowClick={handleRowClick}
            />
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;