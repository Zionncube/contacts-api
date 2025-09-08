const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory storage for testing (since we're focusing on API routes first)
let contacts = [
  {
    "id": 1,
    "firstName": "Happiness",
    "lastName": "Ncube",
    "email": "happiness@gmail.com",
    "favoriteColor": "Blue",
    "birthday": "2000-01-01"
  },
  {
    "id": 2,
    "firstName": "Thando",
    "lastName": "Ncube",
    "email": "thando@gmail.com",
    "favoriteColor": "Pink",
    "birthday": "2014-03-07"
  }
];


// Routes

// GET / - Home route
app.get('/', (req, res) => {
  res.send('Contacts API - Week 01 Project');
});

// GET /contacts - Get all contacts
app.get('/contacts', (req, res) => {
  res.json(contacts);
});

// GET /contacts/:id - Get single contact by ID
app.get('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contact = contacts.find(c => c.id === id);
  
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  
  res.json(contact);
});

// POST /contacts - Create new contact
app.post('/contacts', (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ 
      message: 'First name, last name, and email are required' 
    });
  }
  
  // Create new contact
  const newContact = {
    id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
    firstName,
    lastName,
    email,
    favoriteColor: favoriteColor || '',
    birthday: birthday || ''
  };
  
  contacts.push(newContact);
  res.status(201).json(newContact);
});

// PUT /contacts/:id - Update contact
app.put('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  
  // Update contact
  contacts[contactIndex] = {
    id,
    firstName: firstName || contacts[contactIndex].firstName,
    lastName: lastName || contacts[contactIndex].lastName,
    email: email || contacts[contactIndex].email,
    favoriteColor: favoriteColor || contacts[contactIndex].favoriteColor,
    birthday: birthday || contacts[contactIndex].birthday
  };
  
  res.json(contacts[contactIndex]);
});

// DELETE /contacts/:id - Delete contact
app.delete('/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  
  const deletedContact = contacts.splice(contactIndex, 1);
  res.json({ message: 'Contact deleted successfully', contact: deletedContact[0] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /contacts');
  console.log('  GET    /contacts/:id');
  console.log('  POST   /contacts');
  console.log('  PUT    /contacts/:id');
  console.log('  DELETE /contacts/:id');
});

module.exports = app;