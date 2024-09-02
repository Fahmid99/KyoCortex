const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const db = new sqlite3.Database('./files.db'); // Use a file-based database

app.use(cors());

// Create the table if it doesn't exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, name TEXT, data BLOB)");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to upload files
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const stmt = db.prepare("INSERT INTO files (name, data) VALUES (?, ?)");
  stmt.run(file.originalname, file.buffer, function(err) {
    if (err) {
      return res.status(500).send('Failed to store file.');
    }
    res.status(200).send('File uploaded successfully.');
  });
  stmt.finalize();
});

// Endpoint to gets all files in the database
app.get('/files', (req, res) => {
  db.all("SELECT id, name FROM files", (err, rows) => {
    if (err) {
      return res.status(500).send('Failed to retrieve files.');
    }
    res.json(rows);
  });
});

//Endpoint to get the content of a file in the database using it's id
//Example: /1/ will return the details of the file with id 1
app.get('/files/:id/', (req, res) => {
  const fileId = req.params.id;

  db.get("SELECT id, name FROM files WHERE id = ?", [fileId], (err, row) => {
    if (err) {
      return res.status(500).send('Failed to retrieve file.');
    }
    if (!row) {
      return res.status(404).send('File not found.');
    }
    res.json(row);
  });
});

//Endpoint to get the content of a file in the database using it's id
//Example: /1/content will return the raw data of the file with id 1
//Example: /1/content?format=base64 will return the data of the file with id 1 in base64 format
app.get('/files/:id/content', (req, res) => {
  const fileId = req.params.id;
  const format = req.query.format;

  db.get("SELECT data FROM files WHERE id = ?", [fileId], (err, row) => {
    if (err) {
      return res.status(500).send('Failed to retrieve file.');
    }
    if (!row) {
      return res.status(404).send('File not found.');
    }

    if (format === 'base64') {
      const base64Data = row.data.toString('base64');
      res.json({ data: base64Data });
    } else {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(row.data);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});