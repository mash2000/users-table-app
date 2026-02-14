import React from 'react';
import styles from './Filters.module.css';

const Filters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label htmlFor="firstName">Имя</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={filters.firstName}
          onChange={handleChange}
          placeholder="Поиск по имени"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="lastName">Фамилия</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={filters.lastName}
          onChange={handleChange}
          placeholder="Поиск по фамилии"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="age">Возраст</label>
        <input
          type="number"
          id="age"
          name="age"
          value={filters.age}
          onChange={handleChange}
          placeholder="Возраст"
          min="1"
          max="120"
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="gender">Пол</label>
        <select
          id="gender"
          name="gender"
          value={filters.gender}
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
          value={filters.phone}
          onChange={handleChange}
          placeholder="Поиск по телефону"
        />
      </div>
    </div>
  );
};

export default Filters;