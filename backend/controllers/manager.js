const Employee = require("../model/Employee");
const Performance = require("../model/Performance");
const Task=require("../model/Task")
const CompanyDocument=require("../model/CompanyDocument")


exports.getMyTeam = async (req, res) => {
    console.log("id",req.user._id)
  try {
    const employee=await Employee.findOne({userAccount:req.user._id})
    console.log("employee",employee)
    const team = await Employee.find({ manager: employee._id })
      .populate("userAccount", "name email role")
      .select("name department role salary");
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getTeamPerformance = async (req, res) => {

    console.log("req",req.user._id)
  try {

    const {department,status,period}=req.query;
    const filter={};
    if(status) filter.status=status;
    if(period) filter.status=period;

    

   const manager = await Employee.findOne({ userAccount: req.user._id });
       if (!manager) return res.status(404).json({ message: "Manager record not found" });

    const teamMembers = await Employee.find({ manager: manager._id }).select("_id");
    const teamIds = teamMembers.map((m) => m._id);

    console.log("teamIds",teamIds)

    const records = await Performance.find({ employee: { $in: teamIds } })
      .populate("employee", "name department")
      .sort({ createdAt: -1 });

console.log("records",records)

    if (department) {
      records = records.filter(
        (r) =>
          r.employee?.department?.toLowerCase() === department.toLowerCase()
      );
    }


    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.reviewTeamMember = async (req, res) => {
  try {
    const { managerRating, managerFeedback, promotionRecommended, lndRecommended } = req.body;

    const record = await Performance.findById(req.params.id).populate("employee");
    if (!record) return res.status(404).json({ message: "Performance record not found" });

    record.managerRating = managerRating;
    record.managerFeedback = managerFeedback;
    record.promotionRecommended = promotionRecommended || false;
    record.lndRecommended = lndRecommended || false;
    record.status = "Manager Reviewed";
    record.overallScore = ((record.selfRating || 0) + managerRating) / 2;

    await record.save();
    res.json({ message: "Manager review submitted successfully", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





exports.getManagerAnalytics = async (req, res) => {
  try {

    const manager = await Employee.findOne({ userAccount: req.user._id });
    if (!manager)
      return res.status(404).json({ message: "Manager not found" });

    
    const team = await Employee.find({ manager: manager._id });
    const teamIds = team.map((e) => e._id);

   
    const tasks = await Task.find({ assignedTo: { $in: teamIds } });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length;
    const todoTasks = tasks.filter((t) => t.status === "todo").length;


    const performances = await Performance.find({
      employee: { $in: teamIds },
      status: "Finalized",
    }).populate("employee", "name department");

   
    const promotionCount = performances.filter((p) => p.promotionRecommended).length;
    const lndCount = performances.filter((p) => p.lndRecommended).length;
    const avgManagerRating =
      performances.length > 0
        ? (
            performances.reduce((s, p) => s + (p.managerRating || 0), 0) /
            performances.length
          ).toFixed(1)
        : 0;
    const avgHRRating =
      performances.length > 0
        ? (
            performances.reduce((s, p) => s + (p.hrRating || 0), 0) /
            performances.length
          ).toFixed(1)
        : 0;

    
    const leaderboard = performances
      .map((p) => ({
        employee: p.employee?.name,
        department: p.employee?.department,
        managerRating: p.managerRating,
        hrRating: p.hrRating,
        promotion: p.promotionRecommended,
        lnd: p.lndRecommended,
        overall: p.calibratedScore || p.overallScore || 0,
      }))
      .sort((a, b) => b.overall - a.overall)
      .slice(0, 5); 

   
    res.json({
      kpis: {
        teamSize: team.length,
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        avgManagerRating,
        avgHRRating,
        promotionCount,
        lndCount,
      },
      leaderboard,
    });
  } catch (err) {
    console.error("Error fetching manager analytics:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.getManagerDocuments = async (req, res) => {
  try {
    const manager = await Employee.findOne({ userAccount: req.user._id });

    const docs = await CompanyDocument.find({
      $or: [
        { visibility: "all" },
        { visibility: "managers" },
        { visibility: "team" },
        { visibility: "department", department: manager.department },
        { allowedEmployees: manager._id },
      ],
    }).sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
