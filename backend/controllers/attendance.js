const Attendance = require("../model/Attendance");
const Employee=require("../model/Employee")


exports.clockIn = async (req, res) => {
  try {
    const today = new Date().toDateString();
    const existing = await Attendance.findOne({
      user: req.user._id,
      date: { $gte: new Date(today) },
    });

    if (existing) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    const record = await Attendance.create({
      user: req.user._id,
      checkIn: new Date(),
      status: "Present",
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.clockOut = async (req, res) => {
  try {
    const today = new Date().toDateString();
    const record = await Attendance.findOne({
      user: req.user._id,
      date: { $gte: new Date(today) },
    });

    if (!record) return res.status(400).json({ message: "You have not clocked in yet" });

    record.checkOut = new Date();
    await record.save();

    res.json({ message: "Clock out successful", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("user", "name email")
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// exports.getAttendanceForManager = async (req, res) => {
//   console.log('req',req.user._id)
  
//   try {
//     const manager=await Employee.findOne({userAccount:req.user._id})
//     console.log("manager",manager)


//     const employee=await Employee.find({manager:manager._id})
    
//      console.log("employee",employee)
   

//     const records = await Attendance.find({user:employee.userAccount})
    
//       .populate("user", "name email")
//       .sort({ date: -1 });

//       console.log("records",records)
//     res.json(records);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getAttendanceForManager = async (req, res) => {
  try {
  
    const manager = await Employee.findOne({ userAccount: req.user._id });
    if (!manager) return res.status(404).json({ message: "Manager record not found" });


    const employees = await Employee.find({ manager: manager._id });

    if (!employees.length) {
      return res.status(200).json([]); 
    }

  
    const userIds = employees
      .filter((emp) => emp.userAccount) 
      .map((emp) => emp.userAccount);


    const records = await Attendance.find({ user: { $in: userIds } })
      .populate("user", "name email")
      .sort({ date: -1 });

    const summary={
      total:records.length,
      present: records.filter((r) => r.status === "Present").length,
      late: records.filter((r) => r.status === "Late").length,
      absent: records.filter((r) => r.status === "Absent").length,
    }

    const latenessMap = {};
    records.forEach((r) => {
      const name = r.user?.name;
      if (!latenessMap[name]) latenessMap[name] = { late: 0, absent: 0 };
      if (r.status === "Late") latenessMap[name].late++;
      if (r.status === "Absent") latenessMap[name].absent++;
    });

     console.log("records",records)

 
    res.json({ summary, records, latenessMap });
  } catch (err) {
    console.error("Error fetching attendance for manager:", err);
    res.status(500).json({ message: err.message });
  }
};
