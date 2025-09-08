const mongoose = require('mongoose');
require('dotenv').config();

const initdb = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/contactsdb";
    
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Create sample data if collection is empty
    await createSampleData();
    
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    throw error;
  }
};

const createSampleData = async () => {
  try {
    const Contact = require('./models/Contact');
    const count = await Contact.countDocuments();
    
    if (count === 0) {
      console.log('Creating sample contacts data...');
      
      const sampleContacts = [
        {
          firstName: "Happiness",
          lastName: "Ncube",
          email: "happiness@gmail.com",
          favoriteColor: "Blue",
          birthday: new Date("2000-01-01")
        },
        {
          firstName: "Thando",
          lastName: "Ncube",
          email: "thando@gmail.com",
          favoriteColor: "Pink",
          birthday: new Date("2014-03-07")
        }
      ];
      
      await Contact.insertMany(sampleContacts);
      console.log('✅ Sample contacts created successfully');
    }
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

module.exports = { initdb };