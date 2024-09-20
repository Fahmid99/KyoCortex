import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();
const auth =
  "Basic " +
  Buffer.from(`${process.env.KEIMUSERNAME}:${process.env.PASSWORD}`).toString(
    "base64"
  );

// Upload File
export const uploadFile = async (req, res) => {
  const file = req.file;
  const uploadDate = new Date().toISOString();

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const stmt = prepare(
    "INSERT INTO files (name, data, uploadDate) VALUES (?, ?, ?)"
  );
  stmt.run(file.originalname, file.buffer, uploadDate, function (err) {
    if (err) {
      return res.status(500).send("Failed to store file.");
    }
    res.status(200).send("File uploaded successfully.");
  });
  stmt.finalize();
};

// Get Document
export const getDocument = async (req, res) => {
  const processId = req.query.processId;
  const activityId = req.query.activityId;
  let objectId = null;

  try {
    const response = await axios.get(
      `http://10.170.193.9/rest-ws/service/bpm/process/${processId}/activity/${activityId}/datafield`,
      {
        headers: { Authorization: auth },
      }
    );
    objectId = response.data.data.objectId;
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).send("Error fetching document");
  }

  try {
    const response = await axios.get(
      `http://10.170.193.9/rest-ws/service/dms/${objectId}?type=sysobject&version=-1&content=true&fields=true`,
      {
        headers: { Authorization: auth },
      }
    );
    const result = {
      id: objectId,
      type: response.data.type,
      formFields: response.data.data,
    };
    res.json(result);
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).send("Error fetching document");
  }
};

// Get Vendors
export const getVendors = async (req, res) => {
  try {
    const response = await axios.get(
      "http://10.170.193.9/rest-ws/service/result/query?type=vendor&offset=0&limit=-1",
      {
        headers: { Authorization: auth },
      }
    );

    const result = response.data.map((vendor) => ({
      vendorid: vendor.id,
      vendorname: vendor.title,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error getting vendors:", error);
    res.status(500).send("Error getting vendors");
  }
};
// Get File Types
export const getFileTypes = async (req, res) => {
  const { parentId } = req.query;

  try {
    const response = await axios.get(
      `http://10.170.193.9/rest-ws/service/prepare/types?parentid=${parentId}&parenttype=vendor`,
      {
        headers: { Authorization: auth },
      }
    );

    const result = response.data.types.map((type) => ({
      typeDisplayName: type.titlepattern,
      typeName: type.name,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error getting file types:", error);
    res.status(500).send("Error getting file types");
  }
};

// Create Object
export const createObj = async (req, res) => {
  const parentId = req.query.parentId;
  const fileType = req.query.fileType;

  try {
    const response1 = await axios.post(
      `http://10.170.193.9/rest-ws/service/dms/create/${fileType}?parenttype=vendor&parentid=${parentId}&keeplock=false`,
      {},
      {
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
      }
    );

    try {
      const file = req.file;

      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      const form = new FormData();
      form.append("fileData", file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response2 = await axios.post(
        `http://10.170.193.9/rest-ws/service/dms/${response1.data.id}/contents?type=${fileType}&keeplock=false`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: auth,
          },
        }
      );

      res.json({
        firstResponse: response1.data,
        secondResponse: response2.data,
      });
    } catch (error) {
      console.error(
        "Error in second POST request:",
        error.response ? error.response.data : error.message
      );
      res.status(500).send("Internal Server Error in second request");
    }
  } catch (error) {
    console.error(
      "Error in first POST request:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Internal Server Error in first request");
  }
};

// Submit Data
export const submitData = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.put(
      `http://10.170.193.9/rest-ws/service/dms/${id}?type=sysobject&keeplock=false&version=-1`,
      req.body,
      {
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      res.send("Data submitted successfully");
    } else {
      res
        .status(response.status)
        .send(`Error submitting data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).send("Error submitting data");
  }
};

// End Process
export const endProcess = async (req, res) => {
  try {
    const response = await axios.post(
      `http://10.170.193.9/rest-ws/service/bpm/process/terminate`,
      req.body,
      {
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      res.send("Process successfully ended");
    } else {
      res
        .status(response.status)
        .send(`Error ending process: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error ending process:", error);
    res.status(500).send("Error ending process");
  }
};
