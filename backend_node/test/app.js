const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Create incoming payment (dummy route for now)
app.post('/create-incoming-payment', (req, res) => {
  // Simulate a successful incoming payment creation
  res.json({
    message: 'Incoming payment created successfully!',
    paymentUrl: 'https://example.com/incoming-payment/12345'
  });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
