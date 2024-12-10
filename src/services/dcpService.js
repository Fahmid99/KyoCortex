import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const getAuth = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/dcp`);
        return response.data;
    } catch (err) {
        console.error("Error fetching config data:", err);
    }
};

export default {
    getAuth: getAuth,

};
