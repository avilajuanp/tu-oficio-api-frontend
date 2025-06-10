import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea contexto de autenticación
const AuthContext = createContext();

// Crea componente Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Chequea si el usuario está logueado cuando carga la App
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setUserType(parsedUser.userType);
    }
  }, []);

  // Login
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setUserType(userData.userType);
    // Graba userdata a localstorage para persistir entre páginas
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setUserType(null);
    // quita userdata de localStorage
    localStorage.removeItem('user');
  };

  // Provee contexto a los children
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
