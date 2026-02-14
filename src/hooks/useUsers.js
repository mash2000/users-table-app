import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://dummyjson.com/users';

const buildQueryString = ({ limit, skip, sortField, sortOrder, filters }) => {
  const params = new URLSearchParams();
  
  params.append('limit', limit);
  params.append('skip', skip);
  
  if (sortField && sortOrder) {
    params.append('sortBy', sortField);
    params.append('order', sortOrder);
  }
  
  // Добавляем фильтры (в dummyjson фильтрация через key=value)
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  
  return params.toString();
};

const useUsers = ({ limit, skip, sortField, sortOrder, filters }) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryString({ limit, skip, sortField, sortOrder, filters });
      const response = await fetch(`${API_BASE_URL}?${queryString}`);
      
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
        phone: user.phone,
        email: user.email,
        country: user.address?.country || '',
        city: user.address?.city || '',
      }));
      
      setUsers(transformedUsers);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit, skip, sortField, sortOrder, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, total, loading, error, refetch: fetchUsers };
};

export default useUsers;