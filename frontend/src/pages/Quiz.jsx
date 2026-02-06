import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuiz } from '../services/quizzes';
import confetti from 'canvas-confetti';
import { Loader2, ArrowLeft, CheckCircle, XCircle, AlertCircle, ChevronRight, RefreshCw, Clock, Trophy, Share2, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: selectedIndex }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isTimerRunning && !isSubmitted) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, isSubmitted]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isSubmitted || loading) return;

            // Options 1-4
            if (['1', '2', '3', '4'].includes(e.key)) {
                const index = parseInt(e.key) - 1;
                const currentQ = quiz?.questions[currentQuestionIndex];
                if (currentQ && index < currentQ.options.length) {
                    handleOptionSelect(currentQ.id, index);
                }
            }

            // Next/Prev
            if (e.key === 'ArrowRight' && currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
                // Only if answer selected or allowed
                if (selectedAnswers[quiz?.questions[currentQuestionIndex].id] !== undefined) {
                    handleNext();
                }
            }
            if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
                handlePrev();
            }

            // Enter to submit if on last question
            if (e.key === 'Enter' && currentQuestionIndex === (quiz?.questions.length || 0) - 1) {
                if (Object.keys(selectedAnswers).length === quiz?.questions.length) {
                    handleSubmit();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [quiz, currentQuestionIndex, selectedAnswers, isSubmitted, loading]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuiz(id);
                setQuiz(data);
                setIsTimerRunning(true);
            } catch (err) {
                console.error("Failed to load quiz:", err);
                setError("Quiz not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = () => {
        if (!quiz) return;

        // Calculate score
        let correctCount = 0;
        quiz.questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correct_index) {
                correctCount++;
            }
        });

        setScore(Math.round((correctCount / quiz.questions.length) * 100));
        setIsSubmitted(true);
        setIsTimerRunning(false);

        // Fire Confetti!
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                    <p className="text-gray-900 font-bold mb-2">{error}</p>
                    <Link to="/documents" className="text-blue-600 hover:underline">Return to Documents</Link>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
    const answeredCount = Object.keys(selectedAnswers).length;
    const isComplete = answeredCount === quiz.questions.length;

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 animate-bounce-slow">
                            <Trophy size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Quiz Complete!</h1>
                        <p className="text-gray-500">Here's how you performed</p>
                    </div>

                    <Card className="p-8 mb-8 text-center border-t-4 border-blue-500 shadow-xl">
                        <div className="flex justify-center items-end gap-2 mb-2">
                            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{score}%</div>
                            <span className="text-gray-400 font-medium mb-3 text-lg">SCORE</span>
                        </div>

                        <div className="flex justify-center gap-8 my-6 text-sm">
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-gray-900">{formatTime(timeElapsed)}</span>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Time</span>
                            </div>
                            <div className="w-px h-8 bg-gray-100"></div>
                            <div className="flex flex-col items-center">
                                <span className="font-bold text-gray-900">{quiz.questions.length}</span>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Questions</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-8">
                            <Button onClick={() => window.location.reload()} variant="outline" leftIcon={<RefreshCw size={16} />}>
                                Retake
                            </Button>
                            <Button
                                onClick={() => navigate(quiz?.document_id ? `/documents/${quiz.document_id}` : '/documents')}
                                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                                leftIcon={<ArrowLeft size={16} />}
                            >
                                {quiz?.document_id ? 'Back to Document' : 'All Documents'}
                            </Button>
                            <Button variant="ghost" className="text-gray-400 hover:text-blue-600" leftIcon={<Share2 size={16} />}>
                                Share
                            </Button>
                        </div>
                    </Card>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Detailed Review</h2>
                            <span className="text-sm text-gray-500">Review your answers and explanations</span>
                        </div>

                        {quiz.questions.map((q, idx) => {
                            const userAnswer = selectedAnswers[q.id];
                            const isCorrect = userAnswer === q.correct_index;

                            return (
                                <Card key={q.id} className={`p-6 border-l-4 transition-all hover:shadow-md ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            {isCorrect ? <CheckCircle className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-relaxed">{idx + 1}. {q.text}</h3>

                                            <div className="space-y-2 mb-4">
                                                {q.options.map((opt, i) => (
                                                    <div key={i} className={`p-3 rounded-lg text-sm flex justify-between items-center transition-colors ${i === q.correct_index ? 'bg-green-50 text-green-900 font-medium border border-green-200' :
                                                        i === userAnswer && i !== q.correct_index ? 'bg-red-50 text-red-900 border border-red-200' :
                                                            'bg-gray-50 text-gray-500'
                                                        }`}>
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] opacity-50">
                                                                {['A', 'B', 'C', 'D'][i]}
                                                            </span>
                                                            {opt}
                                                        </span>
                                                        {i === q.correct_index && <span className="flex items-center gap-1 text-xs font-bold text-green-600"><Award size={12} /> CORRECT</span>}
                                                        {i === userAnswer && i !== q.correct_index && <span className="text-xs font-bold text-red-600">YOUR CHOICE</span>}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                <p className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
                                                    <Brain size={12} /> AI Explanation
                                                </p>
                                                <p className="text-sm text-blue-900/80 leading-relaxed">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Active Quiz View
    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* Logic background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/documents" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray-500" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{quiz.title}</h1>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <span className={isLastQuestion ? "text-blue-600 font-bold" : ""}>Q{currentQuestionIndex + 1}</span>
                                <span className="text-gray-300">/</span>
                                <span>{quiz.questions.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-600 font-mono text-sm bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <Clock size={14} className={timeElapsed > 60 ? "text-amber-500" : "text-blue-500"} />
                            {formatTime(timeElapsed)}
                        </div>
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out relative"
                                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Area */}
            <main className="flex-grow flex flex-col items-center justify-start pt-12 px-4 pb-20 relative z-10">
                <div className="max-w-3xl w-full">
                    <Card className="p-8 md:p-12 shadow-xl mb-8 border-t-4 border-blue-500 transition-all hover:shadow-2xl">
                        <div className="mb-6">
                            <Badge variant="primary" className="mb-4">Multiple Choice</Badge>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(currentQuestion.id, index)}
                                    className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center group relative overflow-hidden ${selectedAnswers[currentQuestion.id] === index
                                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md transform scale-[1.01]'
                                        : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 text-gray-700'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-5 transition-colors flex-shrink-0 ${selectedAnswers[currentQuestion.id] === index
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-gray-200 text-gray-400 group-hover:border-blue-300 group-hover:text-blue-500'
                                        }`}>
                                        {selectedAnswers[currentQuestion.id] === index ? <div className="w-2.5 h-2.5 bg-white rounded-full" /> : <span className="text-xs font-bold">{index + 1}</span>}
                                    </div>
                                    <span className="font-medium text-lg">{option}</span>

                                    {/* Keyboard hint */}
                                    {selectedAnswers[currentQuestion.id] !== index && (
                                        <span className="absolute right-4 text-[10px] font-bold text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 px-1.5 py-0.5 rounded">
                                            key {index + 1}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Navigation */}
                    <div className="flex justify-between items-center">
                        <Button
                            variant="ghost"
                            disabled={currentQuestionIndex === 0}
                            onClick={handlePrev}
                            className="text-gray-500 hover:text-gray-900"
                        >
                            Previous
                        </Button>

                        {isLastQuestion ? (
                            <Button
                                variant="primary"
                                disabled={!isComplete}
                                onClick={handleSubmit}
                                className="px-8 shadow-blue-500/20 shadow-lg py-3 text-base"
                                rightIcon={<CheckCircle size={18} />}
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                disabled={selectedAnswers[currentQuestion.id] === undefined}
                                onClick={handleNext}
                                rightIcon={<ChevronRight size={18} />}
                                className="px-6"
                            >
                                Next Question
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Quiz;
