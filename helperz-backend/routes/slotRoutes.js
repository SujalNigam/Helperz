const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { generateSlots, getAvailableSlots,getProviderSlots,updateSlotStatus } = require("../controllers/slotController");

router.post("/:serviceId/generate",authMiddleware,generateSlots);
router.get(
    "/:serviceId",
    getAvailableSlots
);
router.get(
    "/provider/:serviceId/manage",
    authMiddleware,
    getProviderSlots
);
router.put(
    "/provider/:slotId/status",
    authMiddleware,
    updateSlotStatus
);
module.exports = router;