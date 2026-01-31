import api from './api';

// This service handles all our document-related API calls
export const uploadDocument = async (file) => {
    // We use FormData for file uploads
    const formData = new FormData();
    formData.append('file', file);

    // We send a POST request to our new upload endpoint
    const response = await api.post('/documents/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getDocuments = async () => {
    // Fetches the list of documents for the current user
    const response = await api.get('/documents/');
    return response.data;
};

export const generateDocumentSummary = async (id) => {
    const response = await api.post(`/summary/${id}`);
    return response.data;
};

export const deleteDocument = async (id) => {
    // Deletes a specific document by its ID
    const response = await api.delete(`/documents/${id}`);
    return response.data;
};
