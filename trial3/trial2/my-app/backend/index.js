const express = require('express');
const fs = require('fs');
const { processCSV } = require('./processData');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Multer setup for handling CSV file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/process', upload.single('file'), (req, res) => {
  const inputFile = path.join(__dirname, 'data', 'input.csv');
  const outputFile = path.join(__dirname, 'data', 'output.json');

  // Save the uploaded file as input.csv
  fs.renameSync(req.file.path, inputFile);

  // Process the CSV
  processCSV(inputFile, outputFile, (err) => {
    if (err) {
      res.status(500).send('Error processing data');
    } else {
      res.json({ message: 'Data processed successfully' });
    }
  });
});

app.get('/data', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'output.json'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
