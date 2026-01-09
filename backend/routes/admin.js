const express = require("express");
const {
  getAllUsers,
  createDepartment,
  getDepartments,
  deleteDepartment,
  updateUserRole,
  getAdminStats,
} = require("../controllers/admin");
const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, allowRoles("admin"), getAllUsers);
router.post("/departments", authMiddleware, allowRoles("admin"), createDepartment);
router.get("/departments", authMiddleware, allowRoles("admin","hr"), getDepartments);
router.delete("/departments/:id", authMiddleware, allowRoles("admin"), deleteDepartment);
router.put("/users/:id/role", authMiddleware, allowRoles("admin"), updateUserRole);
router.get("/stats", authMiddleware, allowRoles("admin"), getAdminStats);

module.exports = router;
