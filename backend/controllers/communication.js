const Communication = require("../model/Communication");
const Employee = require("../model/Employee");
const { sendSocketNotification } = require("../utils/sendSocketNotification");


exports.createCommunication = async (req, res) => {
  try {
    console.log("req.body",req.body)
    let { type, title, message, recipient, visibility, department } = req.body;
   

    if (visibility === "all" && req.user.role !== "hr" && req.user.role !== "admin") {
  return res.status(403).json({ message: "Only HR or Admin can send company-wide announcements." });
}

    if(visibility==="all"){
        const allEmployees=await Employee.find();
        recipient=allEmployees.map(e=>e._id);
    }
    
    if (visibility === "team" && req.user.role !== "manager") {
  return res.status(403).json({ message: "Only managers can send team-wide announcements." });
}
    else if(visibility==="team"){
        const manager=await Employee.findOne({userAccount:req.user._id});
        if(!manager)
            return res.status(404).json({message:"Manager profile not found "});
        const teamMembers=await Employee.find({manager:manager._id});
        recipient=teamMembers.map(e=>e._id);
    }

    else if (visibility==="individual" && recipient){
        recipient=[recipient]

    }

    const comm = await Communication.create({
      type,
      sender: req.user._id,
      recipient: recipient || null,
      title,
      message,
      visibility,
      department,
    });

    for (const empId of recipient){
        await sendSocketNotification(
            empId,
            `📢 New Announcement: ${title}`,
        "Announcement"
        )
    }

    res.status(201).json({ message: "Message sent successfully", comm });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getCommunicationsForUser = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userAccount: req.user._id });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const messages = await Communication.find({
      $or: [
        { visibility: "all" },

        { visibility: "individual", recipient: employee._id },
      ],
    })
      .populate("sender", "name email role")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getManagerCommunications = async (req, res) => {
  try {
    const comms = await Communication.find({ sender: req.user._id })
      .populate("recipient", "name department email")
      .sort({ createdAt: -1 });
    res.json(comms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
