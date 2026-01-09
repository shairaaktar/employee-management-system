const express = require("express");
const router = express.Router();
const { getHRStats } = require("../controllers/analytics");
const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, allowRoles("hr", "admin"), getHRStats);

module.exports = router;
