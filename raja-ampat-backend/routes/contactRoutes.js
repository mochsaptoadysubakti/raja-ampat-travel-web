const express = require('express');
const router = express.Router();
const { getInboxMessages, deleteMessage, sendMessage } = require('../controllers/contactController');

router.get('/', getInboxMessages);
router.post('/', sendMessage);
router.delete('/:id', deleteMessage);

module.exports = router;