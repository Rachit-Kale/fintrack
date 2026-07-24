import axios from "axios";

export const API_BASE_URL = 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("FINTRACK_PAIRING_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getTransactions = async () => {
    const response = await apiClient.get('/transactions');
    return response.data.data || [];
};

export const getMicroDrainStats = async () => {
    const response = await apiClient.get('/analytics/micro-drain');
    return response.data.data || { totalMicroDrainAmount: 0, totalMicroTransactions: 0, breakdownByCategory: [] };
};
