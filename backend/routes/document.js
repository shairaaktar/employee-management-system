const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadDocument,
  getAllDocuments,
  getMyDocuments,
  deleteDocument,
  verifyDocument,
} = require("../controllers/document");
const { authMiddleware, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });


router.post("/", authMiddleware, allowRoles("employee", "hr", "admin"), upload.single("file"), uploadDocument);
router.get("/", authMiddleware, allowRoles("hr", "admin"), getAllDocuments);
router.get("/my", authMiddleware, getMyDocuments);
router.delete("/:id", authMiddleware, deleteDocument);
router.put("/:id/verify", authMiddleware, allowRoles("hr", "admin"), verifyDocument);

module.exports = router;
