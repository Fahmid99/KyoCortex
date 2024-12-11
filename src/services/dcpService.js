// src/services/authService.js
import axios from 'axios';

axios.defaults.withCredentials = true;

const isAuthenticated = async () => {
  const response = await axios.get('http://localhost:3000/auth/is_authenticated');
  return response.data;
};

const API_BASE_URL = "http://localhost:3000";
const loginWithDcp = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/dcp`);
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.error("Error fetching config data:", err);
    }
};

export default { 
    isAuthenticated,
    loginWithDcp
};