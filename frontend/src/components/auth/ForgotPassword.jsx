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
        setMessage('');
        setError('');
        try {
            await forgotPassword(email);
            setMessage('If an account exists, a reset link has been sent to your email.');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await resetPassword(token, newPassword);
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError('Failed to reset password. Link may be invalid or expired.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-100 via-white to-purple-100"></div>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>


            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 14l-1 1-1 1H6v2H5v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {token ? 'Reset Password' : 'Forgot Password?'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        {token
                            ? 'Enter your new password below.'
                            : 'No worries! Enter your email and we will send you restoration instructions.'}
                    </p>
                </div>

                {token ? (
                    <form className="space-y-6" onSubmit={handleResetSubmit}>
                        <div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-gray-900 transition outline-none"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg text-center font-medium">{message}</div>}
                        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center font-medium">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg"
                        >
                            Reset Password
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleForgotSubmit}>
                        <div>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-gray-900 transition outline-none"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {message && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg text-center font-medium">{message}</div>}
                        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center font-medium">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg"
                        >
                            Send Reset Link
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
