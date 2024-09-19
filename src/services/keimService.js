import axios from "axios";

const API_BASE_URL = "http://localhost:4001";

const signInKeim = async (username, password) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/signinkeim`, {
      params: {
        username: username,
        password: password,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching user:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
};

const getVendors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendors`);
    return response.data;
  } catch (err) {
    console.error("Error fetching vendors:", err);
    throw err;
  }
};

const getFileTypes = async (parentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/filetypes`, {
      params: {
        parentId: parentId,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching file types:", err);
    throw err;
  }
};

const uploadNewFile = async (parentId, fileType, formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/createObj?parentId=${parentId}&fileType=${fileType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading document:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getDocumentByProcessId = async (processId, activityId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/document?processId=${processId}&activityId=${activityId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error getting document:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const submitData = async (docId, formData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/submit/${docId}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
};

const endProcess = async (processId) => {
  const terminationArray = [];
  terminationArray.push(processId);

  try {
    const response = await axios.post(
      `${API_BASE_URL}/endprocess/`,
      terminationArray
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting data:", error);
    throw error;
  }
};

export default {
  signInKeim: signInKeim,
  getVendors: getVendors,
  getFileTypes: getFileTypes,
  uploadNewFile: uploadNewFile,
  getDocumentByProcessId: getDocumentByProcessId,
  submitData: submitData,
  endProcess: endProcess,
};
