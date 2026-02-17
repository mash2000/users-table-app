import React, { useState } from 'react';
import styles from './Filters.module.css';

const Filters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Применяем все фильтры одновременно
    Object.entries(localFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
  };

  const handleReset = () => {
    const resetFilters = {
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      phone: '',
    };
    setLocalFilters(resetFilters);
    Object.entries(resetFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.filters}>
      <div className={styles.filterGroup}>
        <label htmlFor="firstName">Имя</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={localFilters.firstName}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Поиск по имени"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="lastName">Фамилия</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={localFilters.lastName}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Поиск по фамилии"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="age">Возраст</label>
        <input
          type="number"
          id="age"
          name="age"
          value={localFilters.age}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Точный возраст"
          min="1"
          max="120"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="gender">Пол</label>
        <select
          id="gender"
          name="gender"
          value={localFilters.gender}
          onChange={handleChange}
        >
          <option value="">Все</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="phone">Телефон</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={localFilters.phone}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Поиск по телефону"
        />
      </div>

      <div className={styles.filterActions}>
        <button type="submit" className={styles.applyButton}>
          Применить фильтры
        </button>
        <button type="button" onClick={handleReset} className={styles.resetButton}>
          Сбросить
        </button>
      </div>
    </form>
  );
};

export default Filters;