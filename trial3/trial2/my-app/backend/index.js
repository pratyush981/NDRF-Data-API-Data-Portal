const express = require('express');
const fs = require('fs');
const { processCSV } = require('./processData');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = 3000;

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/process', upload.single('file'), (req, res) => {
  const inputFile = path.join(__dirname, 'data', 'input.csv');
  const outputFile = path.join(__dirname, 'data', 'output.json');

  fs.renameSync(req.file.path, inputFile);

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
