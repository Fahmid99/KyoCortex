import axios from "axios";

const API_BASE_URL = "http://localhost:6004";

const getDocuments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alldocs`);
    console.log(response.data)
    return response.data;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const getDocumentBase64 = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data/${id}`);
    return response.data.base64;
  } catch (err) {
    console.error("Error fetching base64:", err);
  }
};

const analyzeDocument = async (obj) => {
  try {
    // const response = await axios.post(`${API_BASE_URL}/analyze`, obj);

     const response = await axios.get(`${API_BASE_URL}/invoicedata`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error analyzing data:", err);
  }
};

export default {
  getDocuments: getDocuments,
  getDocumentBase64: getDocumentBase64,
  analyzeDocument: analyzeDocument,
};
