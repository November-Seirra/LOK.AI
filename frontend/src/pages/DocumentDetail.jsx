import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FileText, Download, Eye, Sparkles, ChevronDown, Settings,
    LogOut, User, ArrowLeft, Calendar, HardDrive, CheckCircle, Loader2, BarChart3
} from 'lucide-react';

// UI Components
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ChapterCard from '../components/chapters/ChapterCard';
import QuizCustomizationModal from '../components/modals/QuizCustomizationModal';

// Services
import { getDocuments } from '../services/documents';
import { getMockChapters, generateChapterQuiz, getChapterSummary } from '../services/chapters';

const DocumentDetail = () => {
    const { id } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // State management
    const [document, setDocument] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [generatingChapterId, setGeneratingChapterId] = useState(null);

    // Quiz customization modal state
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);

    // Summary modal state
    const [summaryData, setSummaryData] = useState(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    useEffect(() => {
        fetchDocumentData();
    }, [id]);

    const fetchDocumentData = async () => {
        setIsLoading(true);
        try {
            // Fetch documents to find the one we need
            const docs = await getDocuments();
            const doc = docs.find(d => d.id === id);

            if (doc) {
                setDocument(doc);
                // Get mock chapters for now
                const mockChapters = getMockChapters(id);
                setChapters(mockChapters);
            } else {
                console.error('Document not found');
                navigate('/documents');
            }
        } catch (error) {
            console.error('Failed to fetch document:', error);
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

    const handleGenerateQuiz = (chapter) => {
        setSelectedChapter(chapter);
        setShowQuizModal(true);
    };

    const handleQuizGenerate = async (settings) => {
        if (!selectedChapter) return;

        setGeneratingChapterId(selectedChapter.id);

        try {
            // Call the quiz generation API with settings
            const result = await generateChapterQuiz(selectedChapter.id, settings);

            // Update the chapter status
            setChapters(prev => prev.map(ch =>
                ch.id === selectedChapter.id
                    ? { ...ch, quizStatus: 'ready', quizId: result.quiz_id }
                    : ch
            ));

            // Navigate to quiz page
            setTimeout(() => {
                navigate(`/quizzes/${result.quiz_id}`);
            }, 500);
        } catch (error) {
            console.error('Failed to generate quiz:', error);
            alert('Failed to generate quiz. Please try again.');
        } finally {
            setGeneratingChapterId(null);
        }
    };

    const handleStartQuiz = (quizId) => {
        navigate(`/quizzes/${quizId}`);
    };

    const handleViewSummary = async (chapter) => {
        setIsSummaryLoading(true);
        try {
            const summary = await getChapterSummary(chapter.id);
            setSummaryData({
                title: chapter.title,
                content: summary.content
            });
        } catch (error) {
            console.error('Failed to load summary:', error);
            alert('Failed to load summary.');
        } finally {
            setIsSummaryLoading(false);
        }
    };

    const closeSummary = () => {
        setSummaryData(null);
    };

    const handleDownload = () => {
        if (document?.file_path) {
            const fileUrl = `http://localhost:8000/${document.file_path}`;
            window.open(fileUrl, '_blank');
        }
    };

    const handleViewDocument = () => {
        if (document?.file_path) {
            const fileUrl = `http://localhost:8000/${document.file_path}`;
            window.open(fileUrl, '_blank');
        }
    };

    const handleGenerateAllQuizzes = () => {
        alert('Generate All Quizzes feature coming soon!');
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Analyzed': return 'success';
            case 'Processing': return 'warning';
            case 'Error': return 'danger';
            default: return 'neutral';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="animate-spin text-blue-600" />
                    <p className="text-gray-500">Loading document...</p>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Document not found</p>
                    <Button onClick={() => navigate('/documents')}>
                        Back to Documents
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Background Gradients */}
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
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Chapter Summary</h3>
                                    <p className="text-xs text-gray-500 font-medium truncate max-w-[300px]">{summaryData.title}</p>
                                </div>
                            </div>
                            <button onClick={closeSummary} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <span className="text-xl">×</span>
                            </button>
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

            {/* Quiz Customization Modal */}
            <QuizCustomizationModal
                isOpen={showQuizModal}
                onClose={() => setShowQuizModal(false)}
                chapterTitle={selectedChapter?.title || ''}
                chapterId={selectedChapter?.id || ''}
                onGenerate={handleQuizGenerate}
            />

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
            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
                {/* Back Button */}
                <Link
                    to="/documents"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Documents
                </Link>

                {/* Document Header */}
                <Card className="mb-8 p-8 border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                <FileText size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{document.filename}</h1>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={14} />
                                        <span>Uploaded {new Date(document.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <HardDrive size={14} />
                                        <span>{formatSize(document.size)}</span>
                                    </div>
                                    <Badge variant={getStatusColor(document.status)}>
                                        <CheckCircle size={12} className="mr-1" />
                                        {document.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="secondary"
                            size="md"
                            leftIcon={<Download size={18} />}
                            onClick={handleDownload}
                        >
                            Download PDF
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            leftIcon={<Eye size={18} />}
                            onClick={handleViewDocument}
                        >
                            View Full Document
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            leftIcon={<Sparkles size={18} />}
                            onClick={handleGenerateAllQuizzes}
                        >
                            Generate All Quizzes
                        </Button>
                        <Button
                            variant="ghost"
                            size="md"
                            leftIcon={<BarChart3 size={18} />}
                            onClick={() => navigate('/quizzes')}
                            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                            View Quiz History
                        </Button>
                    </div>
                </Card>

                {/* Chapters Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Chapters & Topics</h2>
                    <p className="text-gray-500">Click on any chapter to generate quizzes or view summaries</p>
                </div>

                {/* Chapters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chapters.map((chapter) => (
                        <ChapterCard
                            key={chapter.id}
                            chapter={chapter}
                            onGenerateQuiz={handleGenerateQuiz}
                            onStartQuiz={handleStartQuiz}
                            onViewSummary={handleViewSummary}
                            isGenerating={generatingChapterId === chapter.id}
                        />
                    ))}
                </div>

                {chapters.length === 0 && (
                    <Card className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No chapters found</h3>
                        <p className="text-gray-500">Chapters are being extracted from your document...</p>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default DocumentDetail;
