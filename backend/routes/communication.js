const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createCommunication,
  getCommunicationsForUser,
  getManagerCommunications,
} = require("../controllers/communication");


router.post("/", authMiddleware, createCommunication);


router.get("/", authMiddleware, getCommunicationsForUser);

router.get("/manager", authMiddleware, getManagerCommunications);

module.exports = router;
