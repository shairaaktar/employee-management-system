
const CompanyDocument = require("../model/CompanyDocument");
const Employee = require("../model/Employee");

exports.uploadCompanyDocument = async (req, res) => {
  try {
    const {
      title,
      category,
      visibility,
      department,
      allowedEmployees,
    } = req.body;

    let finalRecipients = [];

    if (visibility === "all") {
      const all = await Employee.find({}, "_id");
      finalRecipients = all.map((e) => e._id);
    }

    
    else if (visibility === "department" && department) {
      const dept = await Employee.find({ department }, "_id");
      finalRecipients = dept.map((e) => e._id);
    }

  
    else if (visibility === "team") {
      const manager = await Employee.findOne({ userAccount: req.user._id });

      const team = await Employee.find({ manager: manager._id }, "_id");
      finalRecipients = team.map((e) => e._id);
    }

    
    else if (visibility === "individual") {
      finalRecipients = allowedEmployees || [];
    }

    const fileUrl = req.file?.path || null; 

    const doc = await CompanyDocument.create({
      title,
      category,
      fileUrl,
      uploadedBy: req.user._id,
      visibility,
      department: department || null,
      allowedEmployees: finalRecipients,
    });

    res.status(201).json({ message: "Document uploaded", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await CompanyDocument.find()
      .populate("uploadedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

