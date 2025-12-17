import React, { useState } from 'react';
import { forgotPassword, resetPassword } from '../../services/auth';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setMessage('If an account exists, a reset link has been sent to your email (check console for demo).');
            setError('');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(token, newPassword);
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to reset password. Link may be invalid or expired.');
        }
    };

    if (token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        {message && <div className="text-green-500 text-sm text-center">{message}</div>}
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleForgotSubmit}>
                    <div>
                        <input
                            type="email"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {message && <div className="text-green-500 text-sm text-center">{message}</div>}
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Send Reset Link
                    </button>
                    <div className="text-center">
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
