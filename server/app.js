const express = require("express");
const multer = require("multer");
const FormData = require('form-data');
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
const auth = "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

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

  const stmt = db.prepare("INSERT INTO files (name, data, uploadDate) VALUES (?, ?, ?)");
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

  db.get("SELECT id, name, uploadDate FROM files WHERE id = ?", [fileId], (err, row) => {
    if (err) {
      return res.status(500).send("Failed to retrieve file.");
    }
    if (!row) {
      return res.status(404).send("File not found.");
    }
    res.json(row);
  });
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

app.post("/uploadTray", upload.single('file'), async (req, res) => {
  try {
    const file = req.file; // The uploaded file

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    // Create a FormData instance
    const form = new FormData();
    form.append('fileData', file.buffer, {
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
    console.log(data)
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


app.listen(4001, () => {
  console.log("Server is running on port 4001");
});
