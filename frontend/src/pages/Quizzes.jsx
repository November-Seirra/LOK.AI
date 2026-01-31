import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizzes } from '../services/quizzes';
import {
    Search, Filter, PlayCircle, Clock, CheckCircle, BarChart3,
    MoreVertical, ArrowRight, Brain, Loader2
} from 'lucide-react';

import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Quizzes = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, New, In Progress, Completed

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        setIsLoading(true);
        try {
            const data = await getQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.error('Failed to fetch quizzes:', error);
            // Fallback for demo if API fails (e.g. during dev)
            setQuizzes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'primary';
            case 'In Progress': return 'warning';
            case 'Completed': return 'success';
            default: return 'neutral';
        }
    };

    const filteredQuizzes = filter === 'All'
        ? quizzes
        : quizzes.filter(q => q.status === filter);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[100px]"></div>
            </div>

            {/* Top Navigation (Placeholder - usually shared layout) */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                LOK.AI
                            </span>
                            <div className="hidden md:flex items-center gap-1">
                                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Dashboard</Link>
                                <Link to="/documents" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Documents</Link>
                                <Link to="/quizzes" className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">Quizzes</Link>
                                <Link to="/progress" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Progress</Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {user?.full_name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Quiz Library</h1>
                        <p className="text-gray-500 max-w-xl">
                            Challenge yourself with AI-generated quizzes from your documents.
                            Track your progress and master your subjects.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded-lg border border-gray-200 flex sm:hidden">
                            <button className="p-2 text-gray-400"><Filter size={18} /></button>
                        </div>
                        <div className="hidden sm:flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                            {['All', 'New', 'In Progress', 'Completed'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${filter === f
                                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Input
                        icon={Search}
                        placeholder="Search quizzes by topic or document name..."
                        className="w-full py-3 text-lg shadow-sm border-gray-200 focus:border-blue-500 pl-11"
                    />
                </div>

                {/* Quiz Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
                        <p>Loading your library...</p>
                    </div>
                ) : filteredQuizzes.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Brain size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No quizzes found</h3>
                        <p className="text-gray-500 mb-6">Upload a document to generate your first quiz!</p>
                        <Link to="/documents">
                            <Button variant="primary">Go to Documents</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <Card key={quiz.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-100 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant={getStatusColor(quiz.status)} className="mb-2">
                                            {quiz.status}
                                        </Badge>
                                        <button className="text-gray-300 hover:text-gray-600 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>

                                    <div className="mb-6 h-16">
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                            {quiz.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} /> 10 Mins
                                        </div>
                                        <div className="h-3 w-px bg-gray-200"></div>
                                        <div className="flex items-center gap-1.5">
                                            <BarChart3 size={14} /> 10 Qs
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                            className="w-full justify-between group-hover:bg-blue-600 group-hover:text-white transition-all"
                                            rightIcon={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                        >
                                            {quiz.status === 'Completed' ? 'Review Results' : 'Start Quiz'}
                                        </Button>
                                    </div>
                                </div>
                                {quiz.status === 'In Progress' && (
                                    <div className="h-1 w-full bg-gray-100">
                                        <div className="h-full bg-amber-500 w-[45%]"></div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Quizzes;
