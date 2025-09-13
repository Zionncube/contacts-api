const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Swagger Docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

console.log("MongoDB URI:", MONGODB_URI);

// Contact Schema
const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    favoriteColor: { type: String },
    birthday: { type: Date },
  },
  {
    timestamps: true,
  },
);

const Contact = mongoose.model("Contact", contactSchema);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });


// Routes

// GET / - Home route
app.get("/", (req, res) => {
  res.json({
    message: "Contacts API - Week 01 Project",
    database: "MongoDB Connected ✅",
  });
});

// GET /contacts - Get all contacts
/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     responses:
 *       200:
 *         description: A list of contacts
 */
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
});

// GET /contacts/:id - Get single contact by ID
/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a single contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: A single contact
 *       404:
 *         description: Contact not found
 */
app.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching contact",
      error: error.message,
    });
  }
});

// POST /contacts - Create new contact
/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: add a single contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Invalid request
 */
app.post("/contacts", async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and email are required",
      });
    }

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday: birthday ? new Date(birthday) : null,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: savedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating contact",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Visit http://localhost:${PORT} to test the API`);
});

// Put /contacts - Update new contact
/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: update a single contact
 *    parameters:
 *     requestid:
 *       - in: path
 *         name: id
 *         requestBody:
 *            required: true
 *            content:
 *               application/json:
 *                schema:
 *                   type: object
 *                      properties:
 *                          firstName:
 *                             type: string
 *                          lastName:
 *                             type: string
 *                          email:
 *                             type: string
 *                          favoriteColor:
 *                             type: string
 *                          birthday:
 *                             type: string
 *                          format: date
 *               responses:
 *              201:
 *               description: Contact updated successfully
 *              400:
 *               description: Invalid request
 */
app.put("/contacts/:id", async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        favoriteColor,
        birthday: birthday ? new Date(birthday) : null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating contact",
      error: error.message,
    });
  }
});

// DELETE /contacts/:id - Delete a contact
/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a single contact by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: A single contact
 *       404:
 *         description: Contact not found
 */
app.delete("/contacts/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting contact",
      error: error.message,
    });
  }
});
