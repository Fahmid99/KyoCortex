import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const uploadDocument = async (formData) => {
  try {
    // Add the current date to the formData

    console.log(formData)
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("File upload success:", response.data);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};

const getDocuments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const getDocumentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files/${id}`);
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
