
// const express = require("express");
// const router = express.Router();
// const {
//   submitSelfAssessment,
//   reviewEmployee,
//   getAllReviews,
//   getMyPerformance,
// } = require("../controllers/performanceController");
// const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

// router.post("/self", authMiddleware, allowRoles("employee"), submitSelfAssessment);
// router.put("/:id/review", authMiddleware, allowRoles("hr", "admin"), reviewEmployee);
// router.get("/my", authMiddleware, allowRoles("employee"), getMyPerformance);
// router.get("/", authMiddleware, allowRoles("hr", "admin"), getAllReviews);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  submitSelfAssessment,
  managerReview,
  hrReview,
  getAllReviews,
  getMyPerformance,
  getAdminPerformanceStats,
  getAdminAnalytics,
  finalizePerformance,
  getManagerReviewed
} = require("../controllers/performance");
const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

router.post("/self", authMiddleware, allowRoles("employee"), submitSelfAssessment);
router.get("/my", authMiddleware, allowRoles("employee"), getMyPerformance);
router.put("/manager/:id", authMiddleware, allowRoles("manager"), managerReview);


router.put("/hr/:id", authMiddleware, allowRoles("hr"), hrReview);
router.get("/all", authMiddleware, allowRoles("hr", "manager"), getAllReviews);
router.get("/admin/analytics",authMiddleware,allowRoles("admin"),getAdminAnalytics)
router.get("/admin/finalize/:id",authMiddleware,allowRoles("admin"),finalizePerformance)
router.get("/manager-reviewed", authMiddleware, allowRoles("hr"), getManagerReviewed);

module.exports = router;
