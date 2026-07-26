const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUsers, blockUnblockUser } = require('../controllers/userController');

router.get('/', authMiddleware, getUsers);
router.patch('/:id/block', authMiddleware, blockUnblockUser);

module.exports = router;