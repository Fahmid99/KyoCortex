const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const db = new sqlite3.Database("./files.db"); // Use a file-based database

app.use(cors());

const username = "root";
const password = "optimal";
const auth =
  "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

// Create the table if it doesn't exist
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, name TEXT, data BLOB, uploadDate TEXT)"
  );
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to upload files
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const uploadDate = new Date().toISOString(); // Get the current date and time

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const stmt = db.prepare(
    "INSERT INTO files (name, data, uploadDate) VALUES (?, ?, ?)"
  );
  stmt.run(file.originalname, file.buffer, uploadDate, function (err) {
    if (err) {
      return res.status(500).send("Failed to store file.");
    }
    res.status(200).send("File uploaded successfully.");
  });
  stmt.finalize();
});

// Endpoint to get all files in the database
app.get("/files", (req, res) => {
  db.all("SELECT id, name, uploadDate FROM files", (err, rows) => {
    if (err) {
      return res.status(500).send("Failed to retrieve files.");
    }
    res.json(rows);
  });
});

// Endpoint to get the details of a file by its ID
app.get("/files/:id/", (req, res) => {
  const fileId = req.params.id;

  db.get(
    "SELECT id, name, uploadDate FROM files WHERE id = ?",
    [fileId],
    (err, row) => {
      if (err) {
        return res.status(500).send("Failed to retrieve file.");
      }
      if (!row) {
        return res.status(404).send("File not found.");
      }
      res.json(row);
    }
  );
});

// Endpoint to get the content of a file by its ID
app.get("/files/:id/content", (req, res) => {
  const fileId = req.params.id;
  const format = req.query.format;

  db.get("SELECT data FROM files WHERE id = ?", [fileId], (err, row) => {
    if (err) {
      return res.status(500).send("Failed to retrieve file.");
    }
    if (!row) {
      return res.status(404).send("File not found.");
    }

    if (format === "base64") {
      const base64Data = row.data.toString("base64");
      res.json({ data: base64Data });
    } else {
      res.setHeader("Content-Type", "application/octet-stream");
      res.send(row.data);
    }
  });
});

app.post("/uploadTray", upload.single("file"), async (req, res) => {
  try {
    const file = req.file; // The uploaded file

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Create a FormData instance
    const form = new FormData();
    form.append("fileData", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    // Make the POST request with the FormData instance
    const response = await axios.post(
      "http://10.170.193.9/rest-ws/service/prepare/create?parentType=sysfolder&parenttype=sysfolder&childType=sysobject&form=false&contentmeta=false",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: auth,
        },
      }
    );

    res.json(response.data); // Send the response data back to the client
  } catch (error) {
    console.error("Error uploading data:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/alldocs", async (req, res) => {
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/prepare?user=ALL&form=false&contentmeta=false`,
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    const data = await response.json();
    res.json(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/alldocs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/prepare/${id}`,
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    const data = await response.json();
    res.json(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/document", async (req, res) => {
  const processId = req.query.processId;
  const activityId = req.query.activityId;
  let objectId = null;
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/bpm/process/${processId}/activity/${activityId}/datafield
`,
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    const data = await response.json();
    objectId = data.data.objectId;
  } catch (error) {
    console.error("Error fetching document:", error);
  }
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/dms/${objectId}?type=sysobject&version=-1&content=true&fields=true&typemeta=false&datameta=true&form=false&audit=false&versions=false&views=false&additionalvisibility=false&qname=false&contenttext=false&recyclebin=false&contextfolder=false&attachmentinfo=false&storageinfo=false&storageinfodetails=false&extendedinfo=false&nullvalues=true
`,
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    const data = await response.json();
    const result = { id: objectId, type: data.type, formFields: data.data };
    res.json(result);
  } catch (error) {
    console.error("Error fetching document:", error);
  }
});

app.get("/getuser", async (req, res) => {
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/organization/whoami?parents=false&ancestors=false&children=false&privileges=false&roles=false&views=false&acl=false&account=false`,
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    const data = await response.json();
    res.json(data);
    console.log(data);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
});

app.get("/signinkeim", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/user?section=web&favorites=true&privileges=true&roles=true&deputies=true&substitutesOf=true`,
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${username}:${password}`).toString("base64"),
        },
      }
    );

    // Handle the response as needed
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error signing in:", err);
    res.status(500).send("Error signing in");
  }
});

app.get("/vendors", async (req, res) => {
  try {
    const response = await fetch(
      "http://10.170.193.9/rest-ws/service/result/query?type=vendor&offset=0&limit=-1&header=false&datameta=false",
      {
        headers: {
          Authorization: auth,
        },
      }
    );
    const data = await response.json();

    const result = data.map((vendor) => ({
      vendorid: vendor.id,
      vendorname: vendor.title,
    }));
    console.log(result); // Log the result to verify
    res.json(result);
  } catch (err) {
    console.error("Error getting vendors:", err);
  }
});

app.get("/filetypes", async (req, res) => {
  const parentId = req.query.parentId;
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/prepare/types?parentid=${parentId}&parenttype=vendor&withcontent=false`,
      {
        headers: {
          Authorization: auth,
        },
      }
    );

    const data = await response.json();

    if (!data.types) {
      return res.status(400).json({ error: "No types found in the response" });
    }

    const result = data.types.map((type) => ({
      typeDisplayName: type.titlepattern,
      typeName: type.name,
    }));

    res.json(result);
  } catch (error) {
    console.error("Error getting file types:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/createObj", upload.single("file"), async (req, res) => {
  const parentId = req.query.parentId;
  const fileType = req.query.fileType;

  try {
    // First POST request
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

    // Second POST request to upload a file
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      // Create a FormData instance
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
});
app.put("/submit/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received data for document ID:", id, "with body:", req.body); // Log the request body
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/dms/${id}?type=sysobject&keeplock=false&version=-1&checkreferences=true`,
      {
        method: "PUT",
        body: JSON.stringify(req.body),
        headers: {
          Authorization: auth, // Ensure 'auth' is defined
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      res.send("Data submitted successfully");
    } else {
      console.error("Error in submitting:", response.statusText);
      res
        .status(response.status)
        .send(`Error submitting data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).send("Error submitting data");
  }
});

app.post("/endprocess", async (req, res) => {
  try {
    const response = await fetch(
      `http://10.170.193.9/rest-ws/service/bpm/process/terminate`,
      {
        method: "POST",
        body: JSON.stringify(req.body),
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(req.body);
    if (response.ok) {
      res.send("Process successfully ended");
    } else {
      console.error("Error in ending process:", response.statusText);
      res
        .status(response.status)
        .send(`Error ending process: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error ending process:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(4001, () => {
  console.log("Server is running on port 4001");
});
