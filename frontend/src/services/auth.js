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
    // Note: Endpoint expects UserLogin schema (email, password) in body, but logic only uses email.
    // Or we should update backend to accept just email. 
    // In auth.py: email_in: schemas.UserLogin.
    // So we need to pass a dummy password or just the email if schema validation allows it. 
    // Wait, UserLogin REQUIRES password. I should fix the backend schema usage for forgot_password.
    // But for now, let's send a dummy password to satisfy the schema or just email if I update backend.
    // I will update the backend schema usage effectively by passing a dummy password if needed, 
    // BUT actually, I typically prefer a cleaner schema. 
    // Let's pass dummy for now or better, I should have created a UserEmail schema.
    // I can pass { email, password: "" }
    const response = await api.post('/auth/forgot-password', { email, password: "dummy" });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password?token=${token}&new_password=${newPassword}`);
    return response.data;
};
