const express = require("express");
const router = express.Router();
const {authMiddleware,allowRoles} = require("../middleware/authMiddleware");
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  getEmployeesForHR,
  getAllManagers
} = require("../controllers/employee");

router.post("/", authMiddleware, allowRoles("hr","admin"),createEmployee);
router.get("/", authMiddleware, getEmployees);
router.get("/forHr", authMiddleware, getEmployeesForHR);
router.put("/:id", authMiddleware, updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);
router.get("/managers",authMiddleware,allowRoles("hr"), getAllManagers);
router.get("/:id",authMiddleware,allowRoles("hr","admin"),getEmployee)


module.exports = router;
