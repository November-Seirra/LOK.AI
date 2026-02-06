import React from 'react';
import { Sparkles, PlayCircle, CheckCircle, Loader2, BookOpen, Trophy } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ChapterCard = ({
    chapter,
    onGenerateQuiz,
    onStartQuiz,
    onViewSummary,
    isGenerating = false
}) => {
    const getStatusBadge = () => {
        switch (chapter.quizStatus) {
            case 'not_started':
                return <Badge variant="neutral">Not Started</Badge>;
            case 'generating':
                return (
                    <Badge variant="primary" className="animate-pulse">
                        <Loader2 size={12} className="animate-spin mr-1" />
                        Generating...
                    </Badge>
                );
            case 'ready':
                return (
                    <Badge variant="success">
                        <CheckCircle size={12} className="mr-1" />
                        Quiz Ready
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge className="bg-purple-50 text-purple-600 border-purple-100">
                        <CheckCircle size={12} className="mr-1" />
                        Completed
                    </Badge>
                );
            default:
                return <Badge variant="neutral">Unknown</Badge>;
        }
    };

    const getProgressPercentage = () => {
        if (chapter.quizStatus === 'completed' || chapter.quizStatus === 'ready') return 100;
        if (chapter.quizStatus === 'generating') return 45; // Simulated progress
        return 0;
    };

    const getPrimaryButton = () => {
        if (chapter.quizStatus === 'completed') {
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStartQuiz(chapter.quizId)}
                    className="flex-1"
                >
                    Review Quiz
                </Button>
            );
        }

        if (chapter.quizStatus === 'ready') {
            return (
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<PlayCircle size={16} />}
                    onClick={() => onStartQuiz(chapter.quizId)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                    Start Quiz
                </Button>
            );
        }

        return (
            <Button
                variant="primary"
                size="sm"
                leftIcon={isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                onClick={() => onGenerateQuiz(chapter)}
                disabled={isGenerating || chapter.quizStatus === 'generating'}
                className="flex-1"
                loading={isGenerating}
            >
                {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </Button>
        );
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Header with Badge */}
            <div className="flex items-start justify-between mb-4">
                {getStatusBadge()}
                <div className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    Chapter {chapter.chapterNumber}
                </div>
            </div>

            {/* Title and Page Range */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {chapter.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                    Pages {chapter.startPage}-{chapter.endPage}
                </p>
            </div>

            {/* Progress Bar */}
            {chapter.quizStatus !== 'not_started' && (
                <div className="mb-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${chapter.quizStatus === 'completed'
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                                    : chapter.quizStatus === 'ready'
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                }`}
                            style={{ width: `${getProgressPercentage()}%` }}
                        />
                    </div>
                    {chapter.quizStatus === 'ready' && (
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            10 questions • ~15 mins
                        </p>
                    )}
                </div>
            )}

            {/* Score Display for Completed Quizzes */}
            {chapter.quizStatus === 'completed' && chapter.score && (
                <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-purple-600" />
                            <span className="text-sm font-bold text-purple-900">
                                Score: {chapter.score.correct}/{chapter.score.total}
                            </span>
                        </div>
                        <span className="text-lg font-bold text-purple-600">
                            {Math.round((chapter.score.correct / chapter.score.total) * 100)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                {getPrimaryButton()}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewSummary(chapter)}
                    className="border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                    title="View Summary"
                >
                    <BookOpen size={16} />
                </Button>
            </div>
        </div>
    );
};

export default ChapterCard;
