import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE_URL = 'https://dummyjson.com/users';

const buildQueryString = ({ limit, skip, sortField, sortOrder }) => {
  const params = new URLSearchParams();
  
  params.append('limit', limit);
  params.append('skip', skip);
  
  if (sortField && sortOrder) {
    // Маппинг полей для сортировки
    const sortMapping = {
      'lastName': 'lastName',
      'firstName': 'firstName',
      'age': 'age',
      'gender': 'gender',
      'phone': 'phone'
    };
    
    const apiSortField = sortMapping[sortField] || sortField;
    params.append('sortBy', apiSortField);
    params.append('order', sortOrder);
  }
  
  return params.toString();
};

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
      if (user.gender !== filters.gender) {
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

// Функция для сортировки пользователей
const sortUsers = (users, sortField, sortOrder) => {
  if (!sortField || !sortOrder) return users;

  return [...users].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Для поля gender используем исходное значение для сортировки
    if (sortField === 'gender') {
      aValue = a.genderRaw;
      bValue = b.genderRaw;
    }

    // Для строковых полей используем localeCompare для правильной сортировки
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    // Для числовых полей
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
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
      // Загружаем все данные для клиентской фильтрации и сортировки
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
        // Сохраняем оба значения: отображаемое и исходное
        genderDisplay: user.gender === 'male' ? 'Мужской' : 'Женский',
        genderRaw: user.gender, // для сортировки и фильтрации
        phone: user.phone,
        email: user.email,
        country: user.address?.country || '',
        city: user.address?.city || '',
        address: user.address,
        height: user.height,
        weight: user.weight,
        image: user.image,
        maidenName: user.maidenName || '',
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
    return sortUsers(filteredUsers, sortField, sortOrder);
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