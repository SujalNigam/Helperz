const express = require('express');
const router = express.Router();
const { register, login, getMe,editProfile } = require('../controllers/authController');
const {getServices, createService} = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register)
router.post('/login', login)
router.post('/createService', createService)
router.post('/getServices', getServices);
router.get('/getMe',authMiddleware, getMe);
router.patch('/editProfile',authMiddleware, editProfile);

module.exports = router;