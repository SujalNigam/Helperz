const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const {getServices, createService, getServiceByID, getProviderServices,editService,deleteService} = require('../controllers/serviceController');
const upload = require("../middleware/upload");

router.post(
  "/createService",
  authMiddleware,
  upload.single("image"),
  createService
);

router.get('/getServices', getServices);
router.get('/getProviderServices',authMiddleware, getProviderServices);
router.put('/editService/:id',authMiddleware, upload.single("image"), editService);
router.delete('/deleteService/:id',authMiddleware, deleteService);
router.get('/:id', getServiceByID);


module.exports = router;