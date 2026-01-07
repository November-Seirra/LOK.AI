import api from './api';

export const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const forgotPassword = async (email) => {
    
    const response = await api.post('/auth/forgot-password', { email, password: "dummy" });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password?token=${token}&new_password=${newPassword}`);
    return response.data;
};
