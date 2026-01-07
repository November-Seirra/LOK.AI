import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FileText, Upload, Sparkles, Search, ChevronDown,
    Settings, LogOut, User, Plus, Trash2, Eye, ShieldCheck, Clock
} from 'lucide-react';

// UI Components
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Documents = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Mock Data
    const initialDocuments = [
        { id: 1, name: 'Nepal Constitution - Part III.pdf', size: '2.4 MB', date: 'Dec 12, 2024', status: 'Analyzed', type: 'Law' },
        { id: 2, name: 'Public Administration Notes.docx', size: '1.1 MB', date: 'Dec 14, 2024', status: 'Processing', type: 'Admin' },
        { id: 3, name: 'Economy Review 2023.pdf', size: '5.8 MB', date: 'Dec 15, 2024', status: 'Analyzed', type: 'Economics' },
        { id: 4, name: 'Aptitude Test Sample.pdf', size: '800 KB', date: 'Dec 16, 2024', status: 'Error', type: 'Aptitude' },
    ];

    const [documents] = useState(initialDocuments);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Analyzed': return 'success';
            case 'Processing': return 'warning';
            case 'Error': return 'danger';
            default: return 'neutral';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Top Navigation - Same as Dashboard */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                LOK.AI
                            </span>
                            <div className="hidden md:flex items-center gap-1">
                                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Dashboard</Link>
                                <Link to="/documents" className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg">Documents</Link>
                                <Link to="/quizzes" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Quizzes</Link>
                                <Link to="/progress" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Progress</Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Document Library</h1>
                        <p className="text-gray-500 mt-1">Upload and manage your study materials for AI analysis.</p>
                    </div>
                    <Button leftIcon={<Plus size={18} />}>Upload New</Button>
                </div>

                {/* Upload Section */}
                <Card
                    className={`p-10 mb-10 border-2 border-dashed transition-all ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-gray-200 bg-white'
                        }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDragLeave}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Click or drag files to upload</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Upload PDFs, Word docs, or Text files. We'll extract content and generate quizzes for you.
                        </p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> Secure Storage</span>
                            <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-purple-500" /> AI OCR Ready</span>
                        </div>
                    </div>
                </Card>

                {/* Document Table */}
                <Card className="overflow-hidden border-gray-200 shadow-sm">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="relative flex-grow max-w-md">
                            <Input
                                placeholder="Search documents..."
                                icon={Search}
                                className="pl-10 h-10 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort by:</span>
                            <select className="text-sm bg-transparent font-semibold text-gray-600 focus:outline-none cursor-pointer">
                                <option>Recent First</option>
                                <option>Name A-Z</option>
                                <option>Largest Size</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 uppercase text-[10px] font-bold text-gray-400 tracking-widest">
                                    <th className="px-6 py-4">Document Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Uploaded</th>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                                                    {doc.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="neutral">{doc.type}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1.5 pt-7">
                                            <Clock size={14} /> {doc.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {doc.size}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusColor(doc.status)}>
                                                {doc.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button title="View" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                    <Eye size={18} />
                                                </button>
                                                <button title="Delete" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <p className="text-xs text-gray-500 font-medium tracking-tight">Showing 4 of 24 documents</p>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" className="px-3 py-1 text-xs">Previous</Button>
                            <Button variant="ghost" className="px-3 py-1 text-xs">Next</Button>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default Documents;
