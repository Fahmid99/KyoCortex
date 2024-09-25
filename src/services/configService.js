import axios from "axios";

const API_BASE_URL = "http://localhost:4001/api";

const getConfig = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mergeddata`);
    return response.data;
  } catch (err) {
    console.error("Error fetching config data:", err);
  }
};

export const getFormFields = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/configformfields`, {
      params: { name },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching config data:", err);
  }
};

export const updateMapping = async (mappingObj, id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/updatemapping`, 
        { mapping: mappingObj }, // This is the body
        { params: { id } } // This is the query parameter
      );
      return response.data;
    } catch (err) {
      console.error("Error updating mapping:", err);
    }
  };

export default {
  getConfig: getConfig,
  getFormFields: getFormFields,
  updateMapping: updateMapping,
};
