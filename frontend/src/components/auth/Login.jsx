import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, LayoutDashboard, BookOpen, TrendingUp, FileText } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: LayoutDashboard, text: 'Access your personalized dashboard' },
        { icon: BookOpen, text: 'Continue where you left off' },
        { icon: TrendingUp, text: 'Track your learning progress' },
        { icon: FileText, text: 'Generate new practice quizzes' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-card overflow-hidden flex flex-col lg:flex-row">

                {/* Left Panel - Promotional */}
                <div className="w-full lg:w-[45%] gradient-dark p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px] lg:min-h-[600px]">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
                        <div className="absolute top-1/2 -left-20 w-48 h-48 rounded-full bg-purple-400 opacity-20 blur-3xl"></div>
                        <div className="absolute -bottom-20 right-10 w-56 h-56 rounded-full bg-indigo-400 opacity-15 blur-3xl"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="mb-10">
                            <span className="text-2xl font-bold tracking-tight">
                                LOK<span className="text-blue-300">.AI</span>
                            </span>
                        </div>

                        {/* Welcome message */}
                        <div className="mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-blue-300 mb-3">
                                Welcome Back!
                            </h2>
                            <p className="text-blue-100/80 text-sm lg:text-base leading-relaxed">
                                Continue your journey to government exam success with AI-powered learning tools.
                            </p>
                        </div>

                        {/* Features list */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                    <span className="text-sm text-blue-100/90">{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="relative z-10 mt-8 lg:mt-0">
                        <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                            <div className="text-3xl lg:text-4xl font-bold mb-1">10,000+</div>
                            <div className="text-blue-200 text-sm">Government employees trust LokAI</div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-[55%] p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Login to LokAI
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900"
                                        placeholder="employee@gov.np"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & Forgot password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full gradient-primary text-white font-semibold py-3.5 rounded-lg shadow-button hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Login <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-sm text-gray-500">OR</span>
                            </div>
                        </div>

                        {/* Register link */}
                        <p className="text-center text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                                Register here
                            </Link>
                        </p>

                        {/* Note */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xs text-blue-700">
                                <span className="font-semibold">Note:</span> Only official email addresses can register and access this platform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
