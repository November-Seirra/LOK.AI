import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Building2, Briefcase, ArrowRight, Check, X } from 'lucide-react';

const Register = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        position: '',
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const departments = [
        'Ministry of Finance',
        'Ministry of Home Affairs',
        'Ministry of Education',
        'Ministry of Health',
        'Ministry of Foreign Affairs',
        'Ministry of Agriculture',
        'Ministry of Law',
        'Ministry of Defense',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Password validation rules
    const passwordValidation = useMemo(() => {
        const password = formData.password;
        return {
            minLength: password.length >= 8,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
    }, [formData.password]);

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            setError('Please meet all password requirements.');
            return;
        }

        if (!passwordsMatch) {
            setError('Passwords do not match.');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('Please agree to the Terms & Conditions.');
            return;
        }

        setIsLoading(true);
        try {
            await register({
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                department: formData.department,
                position: formData.position
            });
            navigate('/login');

        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const ValidationItem = ({ valid, text }) => (
        <div className={`flex items-center gap-2 text-sm ${valid ? 'text-green-600' : 'text-gray-400'}`}>
            {valid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            <span>{text}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <Link to="/" className="inline-block mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                        LOK<span className="text-blue-600">.AI</span>
                    </span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                <p className="text-gray-500">Join thousands of  employees preparing for success</p>
            </div>

            {/* Form Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-card p-8">
                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            1
                        </div>
                        <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Account Details</span>
                    </div>
                    <div className={`w-16 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            2
                        </div>
                        <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Verification</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="full_name"
                                        required
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="Ram Sharma"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="name@gov.np"
                                    />
                                </div>
                                <p className="text-xs text-blue-600 mt-1">Must be an valid email address</p>
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Organization <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        name="department"
                                        required
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select organization</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="position"
                                        required
                                        value={formData.position}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="e.g., Section Officer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Create Password */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-12 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="Minimum 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-12 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="Re-enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-600 mb-3">Password must contain:</p>
                            <div className="grid grid-cols-2 gap-2">
                                <ValidationItem valid={passwordValidation.minLength} text="At least 8 characters" />
                                <ValidationItem valid={passwordValidation.hasUppercase} text="One uppercase letter" />
                                <ValidationItem valid={passwordValidation.hasLowercase} text="One lowercase letter" />
                                <ValidationItem valid={passwordValidation.hasNumber} text="One number or special character" />
                            </div>
                        </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                            I agree to the{' '}
                            <a href="#" className="text-blue-600 hover:underline font-medium">Terms & Conditions</a>
                            {' '}and{' '}
                            <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>.
                            {' '}I confirm that I am a  employee with a valid  email address.
                        </label>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <X className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full gradient-primary text-white font-semibold py-4 rounded-lg shadow-button hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Create Account <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Login link */}
                <p className="mt-8 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
