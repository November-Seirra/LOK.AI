import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FileText, Upload, Sparkles, Search, ChevronDown, Copy, X,
    Settings, LogOut, User, Plus, Trash2, Eye, ShieldCheck, Clock, Loader2, PlayCircle, FileQuestion, BookOpen
} from 'lucide-react';

// UI Components
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

// Import our API service
import { getDocuments, uploadDocument, deleteDocument, generateDocumentSummary } from '../services/documents';
import { generateQuiz } from '../services/quizzes';

const Documents = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Used to trigger file selection

    // State management
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [generatingQuizId, setGeneratingQuizId] = useState(null); // Track which doc is generating a quiz

    // Summary State
    const [summaryData, setSummaryData] = useState(null); // { title: string, content: string }
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [generatingSummaryId, setGeneratingSummaryId] = useState(null);

    // This runs when the page first loads
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
            alert('Could not load documents. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // --- FILE UPLOAD LOGIC ---

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Start uploading
        setIsUploading(true);
        try {
            await uploadDocument(file);
            // Refresh the list after successful upload
            fetchDocuments();
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Check your connection.');
        } finally {
            setIsUploading(false);
            // Reset the input so the same file can be selected again
            event.target.value = '';
        }
    };

    const handlePreview = (filePath) => {
        // We open the file in a new tab
        // Note: Our backend is on port 8000 and serves /uploads
        const fileUrl = `http://localhost:8000/${filePath}`;
        window.open(fileUrl, '_blank');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await deleteDocument(id);
            // Update local state to remove the document immediately
            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Could not delete document.');
        }
    };

    const handleGenerateQuiz = async (docId) => {
        setGeneratingQuizId(docId);
        try {
            const result = await generateQuiz(docId);
            // In a real app, we might update the document status in the list or show a notification
            // For this flow, we'll navigate immediately as per the "Instant Study" preference option 
            // or show a "Ready" state. The implementation plan chose a Hybrid approach.

            // Let's pretend we update the local state to show it's ready, or just navigate.
            // For now, let's navigate to the quiz immediately to demonstrate the flow.
            navigate(`/quizzes/${result.quiz_id}`);

        } catch (error) {
            console.error('Quiz generation failed:', error);
            alert('Failed to generate quiz. Please try again.');
        } finally {
            setGeneratingQuizId(null);
        }
    };

    const handleSummarize = async (doc) => {
        setGeneratingSummaryId(doc.id);
        setIsSummaryLoading(true);
        try {
            const data = await generateDocumentSummary(doc.id);
            setSummaryData({
                title: doc.filename,
                content: data.content
            });
        } catch (error) {
            console.error('Summary generation failed:', error);
            alert('Failed to generate summary.');
        } finally {
            setGeneratingSummaryId(null);
            setIsSummaryLoading(false);
        }
    };

    const closeSummary = () => {
        setSummaryData(null);
    };

    const copySummary = () => {
        if (summaryData?.content) {
            navigator.clipboard.writeText(summaryData.content);
            alert('Summary copied to clipboard!');
        }
    };

    // --- HELPER FUNCTIONS ---

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            // Re-use our select logic
            handleFileSelect({ target: { files: [file] } });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Analyzed': return 'success';
            case 'Processing': return 'warning';
            case 'Error': return 'danger';
            default: return 'neutral';
        }
    };

    // Helper to format bytes to MB/KB
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* AMBIENT BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Summary Modal */}
            {summaryData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
                    <Card className="w-full max-w-2xl shadow-2xl animate-scale-in border-0 flex flex-col max-h-[80vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Document Summary</h3>
                                    <p className="text-xs text-gray-500 font-medium truncate max-w-[300px]">{summaryData.title}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={copySummary} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Copy Text">
                                    <Copy size={18} />
                                </button>
                                <button onClick={closeSummary} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-gray-600 text-sm whitespace-pre-wrap">
                            {summaryData.content}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <Button size="sm" onClick={closeSummary}>Close</Button>
                        </div>
                    </Card>
                </div>
            )}
            {/* Top Navigation */}
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
                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                />

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Document Library</h1>
                        <p className="text-gray-500 mt-1">Upload and manage your study materials for AI analysis.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={fetchDocuments} leftIcon={<Loader2 size={18} className={isLoading ? 'animate-spin' : ''} />}>
                            Refresh
                        </Button>
                        <Button
                            leftIcon={<Plus size={18} />}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Upload New
                        </Button>
                    </div>
                </div>

                {/* Upload Section */}
                <Card
                    className={`p-10 mb-10 border-2 border-dashed transition-all cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' : 'border-gray-200 bg-white hover:border-blue-400'
                        }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                            {isUploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {isUploading ? 'Uploading document...' : 'Click or drag files to upload'}
                        </h3>
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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                                            Loading your documents...
                                        </td>
                                    </tr>
                                ) : documents.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            No documents found. Upload your first one above!
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        <FileText size={20} />
                                                    </div>
                                                    <Link to={`/documents/${doc.id}`}>
                                                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                                                            {doc.filename}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="neutral">{doc.file_type.toUpperCase()}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5 pt-0.5">
                                                    <Clock size={14} /> {new Date(doc.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatSize(doc.size)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={getStatusColor(doc.status)}>
                                                    {doc.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        title="View"
                                                        onClick={() => handlePreview(doc.file_path)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        title="Delete"
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <div className="w-px h-6 bg-gray-200 mx-1"></div>

                                                    <button
                                                        title="Summarize"
                                                        onClick={() => handleSummarize(doc)}
                                                        disabled={generatingSummaryId === doc.id}
                                                        className={`p-2 rounded-lg transition-all ${generatingSummaryId === doc.id
                                                            ? 'bg-purple-50 text-purple-600'
                                                            : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                                                            }`}
                                                    >
                                                        {generatingSummaryId === doc.id ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
                                                    </button>

                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        leftIcon={generatingQuizId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                                        onClick={() => handleGenerateQuiz(doc.id)}
                                                        disabled={generatingQuizId === doc.id}
                                                        className="text-xs px-3 py-1.5 h-auto ml-1"
                                                    >
                                                        {generatingQuizId === doc.id ? '...' : 'Quiz'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && documents.length > 0 && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <p className="text-xs text-gray-500 font-medium tracking-tight">
                                Showing {documents.length} documents
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" className="px-3 py-1 text-xs">Previous</Button>
                                <Button variant="ghost" className="px-3 py-1 text-xs">Next</Button>
                            </div>
                        </div>
                    )}
                </Card>
            </main>
        </div>
    );
};

export default Documents;
