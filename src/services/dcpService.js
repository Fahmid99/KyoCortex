import axios from 'axios';

axios.defaults.withCredentials = true;

const API_BASE_URL = "http://localhost:3000";

const isAuthenticated = async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/is_authenticated`);
    return response.data;
};

const loginWithDcp = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/dcp`);
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.error("Error fetching config data:", err);
    }
};

const getDocumentClasses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cms/document_classes`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching document classes:", error);
    }
};

const getFolders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cms/folders`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching document classes:", error);
    }
};

const uploadFile = async (file, documentClass, parentId, fields) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentClass', documentClass);
        formData.append('parentId', parentId);
        formData.append('fields', JSON.stringify(fields));

        const response = await axios.post(`${API_BASE_URL}/files/content`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Assuming the token is stored in localStorage
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default {
    isAuthenticated,
    loginWithDcp,
    getDocumentClasses,
    getFolders,
    uploadFile
};