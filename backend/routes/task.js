const express = require("express");
const { createTask, getTasks, updateTask, deleteTask ,getTask, getManagerTasks,updateProgress,uploadAttachment,returnTask,rateTask,approveTask,addComment} = require("../controllers/task");
const {authMiddleware,allowRoles} = require("../middleware/authMiddleware");

const multer=require("multer")
const path=require("path")
const {v4:uuidv4}=require("uuid")
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/tasks"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/:id/comments", authMiddleware, addComment);

router.post("/:id/attachments", authMiddleware, upload.single("file"), uploadAttachment);


router.put("/:id/progress", authMiddleware, updateProgress);

router.put("/:id/approve", authMiddleware, allowRoles("hr", "admin","manager"),approveTask);
router.put("/:id/return", authMiddleware,returnTask);


router.put("/:id/rate", authMiddleware, rateTask);

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/manager",authMiddleware,allowRoles("manager"),getManagerTasks);
router.get("/tasks", authMiddleware, getTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
