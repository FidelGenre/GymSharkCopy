import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Definimos la interfaz del usuario (incluyendo phone opcional)
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string; 
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // Para saber si la app está "pensando" al inicio
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void; // Para actualizar datos sin borrar sesión
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Empezamos cargando

  useEffect(() => {
    // Al iniciar, leemos el localStorage
    const savedUser = localStorage.getItem('gymshark_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error al parsear el usuario guardado:", error);
        localStorage.removeItem('gymshark_user');
      }
    }
    // IMPORTANTE: Ya terminamos de revisar, quitamos el loading
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('gymshark_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gymshark_user');
  };

  // Función para guardar cambios del perfil
  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    // Creamos el nuevo objeto usuario mezclando lo anterior con lo nuevo
    const updatedUser = { ...user, ...data };
    
    // Actualizamos estado y localStorage
    setUser(updatedUser);
    localStorage.setItem('gymshark_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};