import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FileText, Brain, Target, Clock, Upload, Sparkles, PlayCircle,
    ChevronRight, Bell, Search, ChevronDown, BookOpen, BarChart3,
    Settings, LogOut, User, Menu, X, Plus, Calendar
} from 'lucide-react';

// UI Components
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

// Dashboard Components
import StatsCard from '../components/dashboard/StatsCard';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import ProgressChart from '../components/dashboard/ProgressChart';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mock Data
    const stats = [
        { title: 'Documents', value: '24', icon: FileText, trend: '+3 this week', color: 'bg-blue-600' },
        { title: 'Quizzes Taken', value: '156', icon: Brain, trend: '+12%', color: 'bg-purple-600' },
        { title: 'Avg Score', value: '78%', icon: Target, trend: '+5%', color: 'bg-green-600' },
        { title: 'Study Hours', value: '42h', icon: Clock, trend: '+8h', color: 'bg-amber-600' },
    ];

    const activities = [
        { title: 'Completed Indian Constitution Quiz', time: '2 hours ago', type: 'quiz', icon: Sparkles },
        { title: 'Uploaded "State Public Service Commission" PDF', time: '5 hours ago', type: 'document', icon: Upload },
        { title: 'Started New Daily Practice Set', time: 'Yesterday', type: 'quiz', icon: PlayCircle },
        { title: 'Generated summary for "Economy Volume 1"', time: '2 days ago', type: 'document', icon: FileText },
    ];

    const weeklyProgress = [
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 70 },
        { day: 'Wed', value: 55 },
        { day: 'Thu', value: 85 },
        { day: 'Fri', value: 65 },
        { day: 'Sat', value: 90 },
        { day: 'Sun', value: 40 },
    ];

    const recommendedQuizzes = [
        
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                LOK.AI
                            </span>
                            <div className="hidden md:flex items-center gap-1">
                                <Link to="/dashboard" className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">Dashboard</Link>
                                <Link to="/documents" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Documents</Link>
                                <Link to="/quizzes" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Quizzes</Link>
                                <Link to="/progress" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Progress</Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden lg:block w-72">
                                <Input placeholder="Search your assets..." icon={Search} className="py-2" />
                            </div>

                            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 p-1 pl-2 pr-2 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                        {user?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showProfileMenu && (
                                    <Card className="absolute right-0 mt-2 w-56 p-2 z-[60] shadow-xl border-gray-100 animate-fade-in">
                                        <div className="p-3 border-b border-gray-50 mb-1">
                                            <p className="text-sm font-bold text-gray-900">{user?.full_name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                            <User size={16} /> Profile Settings
                                        </button>
                                        <button className="w-full flex items-center gap-3 p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
                                            <Settings size={16} /> Preferences
                                        </button>
                                        <div className="h-px bg-gray-50 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back, {user?.full_name?.split(' ')[0] || 'Scholar'}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">You've completed 0% of your weekly study goal. Keep going!</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/documents">
                            <Button variant="secondary" leftIcon={<Upload size={18} />}>Upload PDF</Button>
                        </Link>
                        <Button leftIcon={<Plus size={18} />}>New Quiz</Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Progress & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Weekly Progress */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">Learning Intensity</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                    <Calendar size={14} /> This Week
                                </div>
                            </div>
                            <ProgressChart data={weeklyProgress} />
                        </Card>

                        {/* Recent Activity */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 border-l-4 border-purple-600 pl-3">Recent Activity</h3>
                                <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                            </div>
                            <ActivityFeed activities={activities} />
                        </Card>
                    </div>

                    {/* Right Column - Performance & Recommendations */}
                    <div className="space-y-8">
                        {/* Performance Summary */}
                        <Card className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0 shadow-xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500"></div>
                            <h3 className="text-lg font-bold mb-6 relative z-10 text-blue-200 uppercase tracking-widest text-xs">Performance Summary</h3>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <div className="flex justify-between text-sm mb-2 font-medium">
                                        <span>Accuracy Rate</span>
                                        <span className="text-blue-300">0%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 rounded-full shadow-lg" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-blue-300/60 uppercase font-bold tracking-tighter">Current Streak</p>
                                        <p className="text-3xl font-black italic">0 Days 🔥</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                                        <BarChart3 size={28} className="text-blue-300" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Recommended Quizzes */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 border-l-4 border-amber-500 pl-3">Next Challenges</h3>
                            <div className="space-y-4">
                                {recommendedQuizzes.map((quiz, index) => (
                                    <div key={index} className="group cursor-pointer p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant={index === 1 ? 'danger' : 'neutral'}>{quiz.category}</Badge>
                                            <span className="text-xs font-semibold text-gray-400">{quiz.time}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                            {quiz.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><BookOpen size={10} /> {quiz.questions}</span>
                                            <span className="flex items-center gap-1"><Target size={10} /> {quiz.difficulty}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-6 text-sm py-2">Discover More Quizzes</Button>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm font-medium">© 2025 LokAI Platform — Leveling up  Exam Preparation</p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
