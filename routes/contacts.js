const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

// GET all
router.get('/', contactsController.getAll);

// GET one by ID
router.get('/:id', contactsController.getOne);

// POST create new contact
router.post('/', contactsController.create);

// PUT update contact
router.put('/:id', contactsController.update);

// DELETE contact
router.delete('/:id', contactsController.remove);

module.exports = router;
