import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Lightbulb, Brain, Flame, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const QuizCustomizationModal = ({
    isOpen,
    onClose,
    chapterTitle,
    chapterId,
    onGenerate,
    defaultSettings = {
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: null
    }
}) => {
    const [difficulty, setDifficulty] = useState(defaultSettings.difficulty);
    const [questionCount, setQuestionCount] = useState(defaultSettings.questionCount);
    const [timeLimitEnabled, setTimeLimitEnabled] = useState(!!defaultSettings.timeLimit);
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(defaultSettings.timeLimit || 20);

    // Calculate estimated time based on difficulty and question count
    const getEstimatedTime = () => {
        const timePerQuestion = {
            easy: 1.5,
            medium: 2,
            hard: 2.5
        };
        return Math.ceil(questionCount * timePerQuestion[difficulty]);
    };

    // Load saved preferences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('quizPreferences');
        if (saved) {
            try {
                const prefs = JSON.parse(saved);
                setDifficulty(prefs.default_difficulty || 'medium');
                setQuestionCount(prefs.default_question_count || 10);
                setTimeLimitEnabled(!!prefs.default_time_limit);
                setTimeLimitMinutes(prefs.default_time_limit || 20);
            } catch (e) {
                console.error('Failed to load preferences:', e);
            }
        }
    }, [isOpen]);

    // Save preferences to localStorage
    const savePreferences = () => {
        const prefs = {
            default_difficulty: difficulty,
            default_question_count: questionCount,
            default_time_limit: timeLimitEnabled ? timeLimitMinutes : null,
            last_updated: new Date().toISOString()
        };
        localStorage.setItem('quizPreferences', JSON.stringify(prefs));
    };

    const handleGenerate = () => {
        savePreferences();
        onGenerate({
            difficulty,
            questionCount,
            timeLimit: timeLimitEnabled ? timeLimitMinutes : null
        });
        onClose();
    };

    if (!isOpen) return null;

    const difficultyOptions = [
        {
            value: 'easy',
            label: 'Easy',
            icon: <Lightbulb size={24} />,
            color: 'green',
            description: 'Basic concepts and definitions'
        },
        {
            value: 'medium',
            label: 'Medium',
            icon: <Brain size={24} />,
            color: 'blue',
            description: 'Moderate complexity'
        },
        {
            value: 'hard',
            label: 'Hard',
            icon: <Flame size={24} />,
            color: 'red',
            description: 'Advanced application'
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-lg shadow-2xl animate-scale-in border-0">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-blue-600" size={24} />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Customize Your Quiz</h2>
                            <p className="text-sm text-gray-500 mt-0.5">{chapterTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Difficulty Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3">
                            Select Difficulty
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {difficultyOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setDifficulty(option.value)}
                                    className={`
                                        relative p-4 rounded-xl border-2 transition-all duration-200
                                        ${difficulty === option.value
                                            ? `border-${option.color}-500 bg-${option.color}-50 shadow-md`
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                                        }
                                    `}
                                    style={difficulty === option.value ? {
                                        borderColor: option.color === 'green' ? '#10B981' : option.color === 'blue' ? '#3B82F6' : '#EF4444',
                                        backgroundColor: option.color === 'green' ? '#ECFDF5' : option.color === 'blue' ? '#EFF6FF' : '#FEF2F2'
                                    } : {}}
                                >
                                    {difficulty === option.value && (
                                        <CheckCircle
                                            size={16}
                                            className="absolute top-2 right-2 text-blue-600"
                                        />
                                    )}
                                    <div className={`flex justify-center mb-2 ${difficulty === option.value ? `text-${option.color}-600` : 'text-gray-400'}`}>
                                        {option.icon}
                                    </div>
                                    <div className={`text-xs font-bold text-center ${difficulty === option.value ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {option.label}
                                    </div>
                                    <div className="text-[10px] text-gray-500 text-center mt-1 leading-tight">
                                        {option.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Number of Questions */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold text-gray-900">
                                Number of Questions
                            </label>
                            <span className="text-3xl font-bold text-blue-600">
                                {questionCount}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="25"
                            step="1"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                            <span>5</span>
                            <span>10</span>
                            <span>15</span>
                            <span>20</span>
                            <span>25</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Recommended: 10-15 questions for optimal learning
                        </p>
                    </div>

                    {/* Time Limit Toggle */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold text-gray-900">
                                Time Limit <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <button
                                onClick={() => setTimeLimitEnabled(!timeLimitEnabled)}
                                className={`
                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                    ${timeLimitEnabled ? 'bg-blue-600' : 'bg-gray-200'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                        ${timeLimitEnabled ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>
                        {timeLimitEnabled && (
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    type="number"
                                    min="5"
                                    max="120"
                                    step="5"
                                    value={timeLimitMinutes}
                                    onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
                                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-600">minutes</span>
                                <Clock size={18} className="text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Estimated Time */}
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-blue-600" />
                            <span className="text-sm font-bold text-blue-900">
                                Estimated Time: ~{getEstimatedTime()} minutes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 border border-gray-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleGenerate}
                        leftIcon={<Sparkles size={18} />}
                        className="flex-1"
                    >
                        Generate Quiz
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default QuizCustomizationModal;
