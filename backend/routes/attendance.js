const express = require("express");
const router = express.Router();
const {
  clockIn,
  clockOut,
  getAllAttendance,
  getMyAttendance,
  getAttendanceForManager
} = require("../controllers/attendance");
const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

router.post("/clockin", authMiddleware, allowRoles("employee", "hr", "admin"), clockIn);
router.post("/clockout", authMiddleware, allowRoles("employee", "hr", "admin"), clockOut);
router.get("/my", authMiddleware, getMyAttendance);
router.get("/", authMiddleware, allowRoles("hr", "admin"), getAllAttendance);
router.get("/manager/team", authMiddleware, allowRoles("hr", "manager","admin"), getAttendanceForManager);
module.exports = router;
