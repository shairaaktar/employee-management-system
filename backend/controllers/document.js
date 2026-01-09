const Document = require("../model/Document");
const path = require("path");
const fs = require("fs");
const {sendSocketNotification}=require("../utils/sendSocketNotification")


exports.uploadDocument = async (req, res) => {
  try {
    const { category } = req.body;

    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const doc = await Document.create({
      user: req.user._id,
      fileName: file.originalname,
      fileType: file.mimetype,
      filePath: file.path,
      category,
    });

    res.status(201).json({ message: "File uploaded successfully", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (doc.user.toString() !== req.user._id.toString() && req.user.role !== "Admin")
      return res.status(403).json({ message: "Not authorized" });

    fs.unlinkSync(path.join(__dirname, "..", doc.filePath));
    await doc.deleteOne();

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.verifyDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.verified = true;
    await doc.save();

    await sendSocketNotification(
  doc.user,
  `Your document "${doc.fileName}" has been verified.`,
  "Document"
);

    res.json({ message: "Document verified", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
