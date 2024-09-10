import axios from "axios";

const API_BASE_URL = "http://localhost:4001";

const getDocuments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alldocs`);
    return response.data;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};


const uploadDocument = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/uploadTray`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};


// const getDocuments = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/files`);
//     console.log(response.data);
//     return response.data;
//   } catch (err) {
//     console.error("Error fetching data:", err);
//   }
// };

const getDocumentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/alldocs/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching document:", err);
  }
};



export default {
  uploadDocument: uploadDocument,
  getDocuments: getDocuments,
  getDocumentById: getDocumentById,
};
