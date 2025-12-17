import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService, register as registerService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token or fetch user profile (omitted for now)
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginService(email, password);
        localStorage.setItem('token', data.access_token);
        setUser({ token: data.access_token });
        return data;
    };

    const register = async (userData) => {
        return await registerService(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
