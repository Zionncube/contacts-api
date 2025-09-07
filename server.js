const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ Mongo connection error:", err));

const contactsRoutes = require('./routes/contacts');
app.use('/api/contacts', contactsRoutes);

app.get('/', (req, res) => res.send('Hello, API is running!'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
