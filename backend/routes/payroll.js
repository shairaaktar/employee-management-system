const express = require("express");
const router = express.Router();
const {
  generatePayroll,
  getAllPayrolls,
  markAsPaid,
  approvePayroll,
  getMyPayrolls,
  updatePayroll
} = require("../controllers/payroll");
const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

router.post("/generate", authMiddleware, allowRoles("hr", "admin"), generatePayroll);
router.get("/", authMiddleware, allowRoles("hr", "admin"), getAllPayrolls);
router.put("/:id/pay", authMiddleware, allowRoles("hr", "admin"), markAsPaid);
router.put("/:id/approve", authMiddleware, allowRoles("hr", "admin"), approvePayroll);
router.get("/my",authMiddleware,getMyPayrolls)
router.put(
  "/:id",
  authMiddleware,
  allowRoles("hr", "admin"),
  updatePayroll
);

module.exports = router;
