const express = require("express");
const router = express.Router();
const {
  requestLeave,
  getAllLeaves,
  updateLeaveStatus,
  getLeavesForManager,
} = require("../controllers/leave");
const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, allowRoles("employee"), requestLeave);
router.get("/", authMiddleware, allowRoles("hr", "admin"), getAllLeaves);
router.get("/manager/team", authMiddleware, allowRoles("hr", "admin","manager"), getLeavesForManager);
router.put("/:id", authMiddleware, allowRoles("hr", "admin","manager"), updateLeaveStatus);


module.exports = router;
