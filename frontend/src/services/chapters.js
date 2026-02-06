import api from './api';

// Generate quiz for a specific chapter with custom settings
export const generateChapterQuiz = async (chapterId, settings) => {
    // For now, we'll simulate the API call
    // In production, this will call: POST /chapters/:chapterId/generate-quiz

    console.log('Generating quiz for chapter:', chapterId, 'with settings:', settings);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return mock quiz ID
    return {
        quiz_id: `quiz-${chapterId}-${Date.now()}`,
        status: 'ready',
        estimated_completion: 2
    };
};

// Get chapter summary
export const getChapterSummary = async (chapterId) => {
    // For now, we'll return mock summary
    // In production, this will call: GET /chapters/:chapterId/summary

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        content: `This chapter covers important concepts and provides detailed explanations about the topic. 
        
Key Points:
• Understanding fundamental principles
• Practical applications and examples
• Historical context and significance
• Modern interpretations and relevance

The chapter provides comprehensive coverage of the subject matter with clear explanations and examples to help students grasp the core concepts effectively.`
    };
};

// Get mock chapters for a document
export const getMockChapters = (documentId) => {
    return [
        {
            id: `chapter-1-${documentId}`,
            chapterNumber: 1,
            title: 'Fundamental Rights',
            startPage: 12,
            endPage: 45,
            quizId: null,
            quizStatus: 'not_started',
            score: null
        },
        {
            id: `chapter-2-${documentId}`,
            chapterNumber: 2,
            title: 'Directive Principles of State Policy',
            startPage: 46,
            endPage: 78,
            quizId: `quiz-2-${documentId}`,
            quizStatus: 'ready',
            score: null
        },
        {
            id: `chapter-3-${documentId}`,
            chapterNumber: 3,
            title: 'Union Executive',
            startPage: 79,
            endPage: 120,
            quizId: `quiz-3-${documentId}`,
            quizStatus: 'completed',
            score: { correct: 8, total: 10 }
        },
        {
            id: `chapter-4-${documentId}`,
            chapterNumber: 4,
            title: 'Parliament',
            startPage: 121,
            endPage: 165,
            quizId: null,
            quizStatus: 'not_started',
            score: null
        },
        {
            id: `chapter-5-${documentId}`,
            chapterNumber: 5,
            title: 'The Union Judiciary',
            startPage: 166,
            endPage: 210,
            quizId: null,
            quizStatus: 'not_started',
            score: null
        }
    ];
};
