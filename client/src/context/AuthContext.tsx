import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react'; // ReactNode sí es solo un tipo

// El resto del código sigue igual...
// Actualizamos la interfaz para incluir ID y Apellido
interface User {
  id: number;        // Esencial para que el Profile busque los pedidos en el backend
  firstName: string;
  lastName: string;  // Necesario para el nombre completo y las iniciales del avatar
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('gymshark_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error al parsear el usuario guardado:", error);
        localStorage.removeItem('gymshark_user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('gymshark_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gymshark_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};