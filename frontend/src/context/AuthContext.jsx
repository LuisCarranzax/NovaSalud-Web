import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Al cargar la app, revisamos si ya había un usuario guardado
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('novaSaludUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        // Guardamos el usuario en el estado y en localStorage para que no se borre al recargar
        setUser(userData);
        localStorage.setItem('novaSaludUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('novaSaludUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};