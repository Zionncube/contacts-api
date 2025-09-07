const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Contacts API - Week 01 Project');
});

// Mock contacts routes (will be replaced with real database routes)
app.get('/contacts', (req, res) => {
  res.json([
    { 
      id: 1, 
      firstName: "John", 
      lastName: "Doe", 
      email: "john@example.com",
      favoriteColor: "Blue",
      birthday: "1990-01-01"
    },
    { 
      id: 2, 
      firstName: "Jane", 
      lastName: "Smith", 
      email: "jane@example.com",
      favoriteColor: "Green",
      birthday: "1985-05-15"
    }
  ]);
});

app.get('/contacts/:id', (req, res) => {
  const contact = { 
    id: req.params.id, 
    firstName: "Test", 
    lastName: "User", 
    email: "test@example.com",
    favoriteColor: "Red",
    birthday: "2000-12-25"
  };
  res.json(contact);
});

// MongoDB connection (commented out for now until we fix the connection issue)
/*
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/contactsdb";

console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});
*/

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to test the API`);
});

module.exports = app;