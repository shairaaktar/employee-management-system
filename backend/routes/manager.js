const express = require("express");
const router = express.Router();
const {authMiddleware,allowRoles}=require("../middleware/authMiddleware")
const {
  getMyTeam,
  getTeamPerformance,
  reviewTeamMember,
  getManagerAnalytics,
  getManagerDocuments
} = require("../controllers/manager");


router.get("/my-team", authMiddleware, allowRoles("manager"), getMyTeam);


router.get("/team-performance", authMiddleware, allowRoles("manager"), getTeamPerformance);


router.get("/analytics", authMiddleware, allowRoles("manager"), getManagerAnalytics);
router.get("/company-docs", authMiddleware, allowRoles("manager"), getManagerDocuments);

router.put("/review/:id", authMiddleware, allowRoles("manager"), reviewTeamMember);

module.exports = router;
