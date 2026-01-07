import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Home = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col">
        {/* Navigation */}
        <nav className="px-6 py-6 backdrop-blur-md bg-white/5 sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <span className="text-2xl font-bold text-white tracking-tight">
                    LOK<span className="text-blue-400">.AI</span>
                </span>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                        Login
                    </Link>
                    <Link to="/register">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Decorative Blur Orbs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow delayed-animation"></div>

            <div className="text-center max-w-4xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-blue-300 text-xs font-semibold mb-8 animate-fade-in">
                    <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
                    Trusted by 10,000+ Aspirants
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-[1.1] tracking-tight animate-fade-in">
                    Your Intelligent Partner for
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                        Civil Service Success
                    </span>
                </h1>

                <p className="text-xl text-blue-100/70 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in">
                    Master your government exams with AI-driven personalized learning,
                    instant document analysis, and dynamic quiz generation.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in">
                    <Link to="/register">
                        <Button size="lg" className="min-w-[200px]">
                            Start Learning Free
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="ghost" size="lg" className="text-white hover:bg-white/10 min-w-[200px] border border-white/10">
                            Sign In
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-3xl mx-auto border-t border-white/10 pt-12 animate-fade-in">
                    <div className="space-y-1">
                        <div className="text-4xl font-bold text-white tracking-tight">10K+</div>
                        <div className="text-blue-300/60 text-sm font-medium uppercase tracking-wider">Active Users</div>
                    </div>
                    <div className="space-y-1 border-x border-white/10 px-4">
                        <div className="text-4xl font-bold text-white tracking-tight">500+</div>
                        <div className="text-blue-300/60 text-sm font-medium uppercase tracking-wider">Smart Quizzes</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-4xl font-bold text-white tracking-tight">95%</div>
                        <div className="text-blue-300/60 text-sm font-medium uppercase tracking-wider">Success Rate</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-white/10 bg-black/20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-blue-200/40 text-sm">© 2025 LokAI Platform. Empowing future civil servants.</p>
                <div className="flex gap-8">
                    <a href="#" className="text-blue-200/40 hover:text-white text-xs transition-colors underline-offset-4 hover:underline">Privacy Policy</a>
                    <a href="#" className="text-blue-200/40 hover:text-white text-xs transition-colors underline-offset-4 hover:underline">Terms of Service</a>
                </div>
            </div>
        </footer>
    </div>
);

export default Home;
