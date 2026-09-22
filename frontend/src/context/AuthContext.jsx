import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('eventify_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(setUser)
      .catch(() => localStorage.removeItem('eventify_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('eventify_token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.post('/auth/register', payload);
    localStorage.setItem('eventify_token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('eventify_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
