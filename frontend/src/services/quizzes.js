import api from './api';

export const generateQuiz = async (documentId) => {
    const response = await api.post('/quizzes/generate', { document_id: documentId });
    return response.data;
};

export const getQuiz = async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
};

export const getQuizzes = async () => {
    const response = await api.get('/quizzes/');
    return response.data;
};
