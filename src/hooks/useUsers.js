import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE_URL = 'https://dummyjson.com/users';

// Функция для фильтрации пользователей на клиенте
const filterUsers = (users, filters) => {
  return users.filter(user => {
    // Фильтр по имени
    if (filters.firstName && !user.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) {
      return false;
    }
    
    // Фильтр по фамилии
    if (filters.lastName && !user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) {
      return false;
    }
    
    // Фильтр по возрасту
    if (filters.age) {
      const ageNum = parseInt(filters.age);
      if (!isNaN(ageNum) && user.age !== ageNum) {
        return false;
      }
    }
    
    // Фильтр по полу
    if (filters.gender) {
      const userGender = user.gender === 'male' ? 'male' : 'female';
      if (userGender !== filters.gender) {
        return false;
      }
    }
    
    // Фильтр по телефону
    if (filters.phone && !user.phone.includes(filters.phone)) {
      return false;
    }
    
    return true;
  });
};

const useUsers = ({ limit, skip, sortField, sortOrder, filters }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalFromApi, setTotalFromApi] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Загружаем все данные один раз (или больше при необходимости)
      // Для пагинации с фильтрацией лучше загрузить все данные
      const response = await fetch(`${API_BASE_URL}?limit=200`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Трансформируем данные для удобства
      const transformedUsers = data.users.map(user => ({
        ...user,
        fullName: `${user.firstName} ${user.lastName} ${user.maidenName || ''}`.trim(),
        age: user.age,
        gender: user.gender === 'male' ? 'Мужской' : 'Женский',
        genderRaw: user.gender, // для фильтрации
        phone: user.phone,
        email: user.email,
        country: user.address?.country || '',
        city: user.address?.city || '',
      }));
      
      setAllUsers(transformedUsers);
      setTotalFromApi(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Применяем фильтры на клиенте
  const filteredUsers = useMemo(() => {
    return filterUsers(allUsers, filters);
  }, [allUsers, filters]);

  // Применяем сортировку на клиенте
  const sortedUsers = useMemo(() => {
    if (!sortField || !sortOrder) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Специальная обработка для поля gender (сравниваем по raw значению)
      if (sortField === 'gender') {
        aValue = a.genderRaw;
        bValue = b.genderRaw;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortOrder]);

  // Применяем пагинацию на клиенте
  const paginatedUsers = useMemo(() => {
    const start = skip;
    const end = start + limit;
    return sortedUsers.slice(start, end);
  }, [sortedUsers, skip, limit]);

  const total = sortedUsers.length;

  return { 
    users: paginatedUsers, 
    total, 
    totalFromApi,
    loading, 
    error, 
    refetch: fetchUsers 
  };
};

export default useUsers;