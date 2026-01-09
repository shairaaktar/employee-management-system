const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  getsubscribeNotification
} = require("../controllers/notification");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createNotification);
router.get("/", authMiddleware, getUserNotifications);
router.post("/subscribe", authMiddleware, getsubscribeNotification);
router.put("/read", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
