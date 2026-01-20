import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário autenticado
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      const token = `token-${userData.id}-${Date.now()}`;

      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const userData = await response.json();
      const token = `token-${userData.id}-${Date.now()}`;

      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      router.push('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
