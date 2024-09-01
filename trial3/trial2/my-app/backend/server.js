// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

// Serve static files from the backend/data directory
app.use('/backend/data', express.static(path.join(__dirname, 'data')));

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
