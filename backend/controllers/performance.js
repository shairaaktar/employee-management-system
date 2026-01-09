



const Performance = require("../model/Performance");
const Payroll = require("../model/Payroll");
const Promotion = require("../model/Promotion");
const Employee=require("../model/Employee")
const LND = require("../model/LND");
const { calculatePerformanceScore } = require("../utils/calculatePerformanceScore");
const sendEmail = require("../utils/sendEmail");
const sendSocketNotification = require("../utils/sendSocketNotification");


exports.submitSelfAssessment = async (req, res) => {
  console.log("user",req)
  try {
    const { period, selfRating, selfFeedback, goals } = req.body;

    const em=await Employee.findOne({
      userAccount:req.user._id
    })
    console.log("em",em)

    const existing = await Performance.findOne({
      employee: em._id,
      period,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "Self-assessment already submitted for this period" });

    const record = await Performance.create({
      employee: em._id,
      period,
      selfRating,
      selfFeedback,
      goals,
      status: "Submitted",
    });

    const employee = await Employee.findById(req.user.employeeId).populate("manager");
if (employee.manager) {
  const managerUser = await User.findById(employee.manager.userAccount);
  
  await Notification.create({
    user: managerUser._id,
    title: "New Self-Assessment Submitted",
    message: `${employee.name} has submitted their self-assessment for ${period}.`,
    type: "info",
  });

  await sendEmail(
    managerUser.email,
    "Employee Self-Assessment Submitted",
    `${employee.name} has submitted their self-assessment for ${period}.`
  )}

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👩‍💼 Manager reviews employee
// exports.managerReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { managerRating, managerFeedback, promotionRecommended, lndRecommended } =
//       req.body;

//     const record = await Performance.findById(id).populate("employee");
//     if (!record) return res.status(404).json({ message: "Record not found" });

//     if (record.status !== "Submitted") {
//       return res.status(400).json({ message: "Manager can only review after employee submission" });
//     }

//     const employee = await Employee.findById(record.employee._id);
//     console.log("employee",employee)
//     // if (String(employee.manager) !== String(req.user._id)) {
//     //   return res.status(403).json({ message: "Not authorized to review this employee" });
//     // }

//     record.managerRating = managerRating;
//     record.managerFeedback = managerFeedback;
//     record.promotionRecommended = promotionRecommended;
//     record.lndRecommended = lndRecommended;
//     record.status = "Manager Reviewed";

//     record.calibratedScore = calculatePerformanceScore(
//       record.selfRating,
//       managerRating
//     );

//     await record.save();

//     const hrUsers = await User.find({ role: "hr" });
// for (const hr of hrUsers) {
//   await Notification.create({
//     user: hr._id,
//     title: "Manager Review Completed",
//     message: `${employee.name}'s performance has been reviewed by manager and awaits HR calibration.`,
//     type: "info",
//   });

//   await sendEmail(
//     hr.email,
//     "Manager Review Completed",
//     `${employee.name}'s performance review has been submitted for HR verification.`
//   );
// }


//     await sendSocketNotification(
//       record.employee._id,
//       `Your performance review for ${record.period} was evaluated by your manager.`,
//       "Performance"
//     );

//     res.json({ message: "Manager review submitted", record });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


exports.managerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerRating, managerFeedback, promotionRecommended, lndRecommended } = req.body;

   
    const manager = await Employee.findOne({ userAccount: req.user._id });
    if (!manager) return res.status(403).json({ message: "Manager record not found" });

    const record = await Performance.findById(id).populate("employee");
    if (!record) return res.status(404).json({ message: "Record not found" });


    const employee = await Employee.findById(record.employee._id);
    if (!employee || String(employee.manager) !== String(manager._id)) {
      return res.status(403).json({ message: "Not authorized to review this employee" });
    }


    if (record.status !== "Submitted") {
      return res.status(400).json({ message: "Manager can only review after employee submission" });
    }

 
    record.managerRating = managerRating;
    record.managerFeedback = managerFeedback;
    record.promotionRecommended = promotionRecommended;
    record.lndRecommended = lndRecommended;
    record.status = "Manager Reviewed";
    record.calibratedScore = ((Number(record.selfRating) + Number(managerRating)) / 2).toFixed(1);

    await record.save();

  
    const hrUsers = await User.find({ role: "hr" });
    for (const hr of hrUsers) {
      await Notification.create({
        user: hr._id,
        title: "Manager Review Completed",
        message: `${employee.name}'s performance has been reviewed by manager.`,
        type: "info",
      });
      await sendEmail(
        hr.email,
        "Manager Review Completed",
        `${employee.name}'s performance review has been submitted for HR verification.`
      );
    }

    
    await sendSocketNotification(
      record.employee.userAccount || record.employee._id,
      `Your performance review for ${record.period} was evaluated by your manager.`,
      "Performance"
    );

    res.json({ message: "Manager review submitted", record });
  } catch (err) {
    console.error("Manager review error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getManagerReviewed = async (req, res) => {
  try {
    const records = await Performance.find({ status: "Manager Reviewed" })
      .populate("employee", "name department");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.hrReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { hrRating, hrFeedback } = req.body;

    const record = await Performance.findById(id)
      .populate("employee")
      .populate("linkedPayroll");

    if (!record) return res.status(404).json({ message: "Record not found" });

    if (record.status !== "Manager Reviewed") {
      return res.status(400).json({ message: "HR can only review after manager review" });
    }

    record.hrRating = hrRating;
    record.hrFeedback = hrFeedback;
    
    // record.calibratedScore = ((record.managerRating || 0) + hrRating) / 2;
     record.calibratedScore = (
      (record.selfRating || 0) * 0.3 +
      (record.managerRating || 0) * 0.5 +
      (hrRating || 0) * 0.2
    ).toFixed(2);

    record.status = "HR Reviewed";

    record.overallScore = calculatePerformanceScore(
      record.selfRating,
      record.managerRating,
      hrRating
    );

    await record.save();

    const admins = await User.find({ role: "admin" });
for (const admin of admins) {
  await Notification.create({
    user: admin._id,
    title: "HR Review Completed",
    message: `${record.employee.name}'s review is ready for final approval.`,
    type: "success",
  });

  await sendEmail(
    admin.email,
    "HR Review Completed",
    `${record.employee.name}'s review is ready for admin finalization.`
  );
}


    
    // if (record.overallScore >= 4) {
    //   const payroll = await Payroll.findOne({ employee: record.employee._id })
    //     .sort({ createdAt: -1 })
    //     .limit(1);
    //   if (payroll) {
    //     record.linkedPayroll = payroll._id;
    //     payroll.bonus = (payroll.baseSalary * 0.1).toFixed(2);
    //     await payroll.save();
    //   }
    // }

    // if (record.lndRecommended) {
    //   await LND.create({
    //     employee: record.employee._id,
    //     reason: "Recommended by manager during performance review",
    //     status: "Pending Enrollment",
    //   });
    // }

   
    // if (record.promotionRecommended && record.overallScore >= 4.5) {
    //   await Promotion.create({
    //     employee: record.employee._id,
    //     oldRole: record.employee.role,
    //     newRole: "Senior " + record.employee.role,
    //     reason: "Performance excellence in " + record.period,
    //   });
    // }

    // await sendEmail(
    //   record.employee.email,
    //   `Hi ${record.employee.name}, your ${record.period} performance review is finalized with a score of ${record.overallScore}.`
    // );

    res.json({ message: "HR finalized performance review", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.finalizePerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const performance = await Performance.findById(id).populate("employee");

    if (!performance) return res.status(404).json({ message: "Record not found" });
    if (performance.status === "Finalized")
      return res.status(400).json({ message: "Already finalized" });

    performance.status = "Finalized";
    performance.calibratedScore =
      (performance.selfRating + performance.managerRating + performance.hrRating) / 3;
    await performance.save();

  
   if (record.overallScore >= 4) {
     const payroll = await Payroll.findOne({ employee: record.employee._id })
       .sort({ createdAt: -1 })
       .limit(1);
     if (payroll) {
       record.linkedPayroll = payroll._id;
       payroll.bonus = (payroll.baseSalary * 0.1).toFixed(2);
       await payroll.save();
     }
   }

   if (record.lndRecommended) {
     await LND.create({
       employee: record.employee._id,
       reason: "Recommended by manager during performance review",
       status: "Pending Enrollment",
     });
   }

  
   if (record.promotionRecommended && record.overallScore >= 4.5) {
     await Promotion.create({
       employee: record.employee._id,
       oldRole: record.employee.role,
       newRole: "Senior " + record.employee.role,
       reason: "Performance excellence in " + record.period,
     });
   }

  //  await sendEmail(
  //     record.employee.email,
  //     `Hi ${record.employee.name}, your ${record.period} performance review is finalized with a score of ${record.overallScore}.`
  //   );

  //   res.json({
  //     message: "Performance finalized successfully",
  //     performance,
  //   });

  const empUser = await User.findById(record.employee.userAccount);

await Notification.create({
  user: empUser._id,
  title: "Performance Finalized",
  message: `Your performance review for ${record.period} has been finalized.`,
  type: "success",
});

await sendEmail(
  empUser.email,
  "Performance Review Finalized",
  `Your performance review for ${record.period} has been finalized.`
);

  } catch (err) {
    console.error("Error finalizing performance:", err);
    res.status(500).json({ message: err.message });
  }
};




exports.getAllReviews = async (req, res) => {
  try {
    const { department, status, period } = req.query;

    
    const filter = {};
    if (status) filter.status = status;
    if (period) filter.period = period;

    let records = await Performance.find(filter)
      .populate({
        path: "employee",
        select: "name department userAccount",
        populate: { path: "userAccount", select: "email name role" },
      })
      .sort({ createdAt: -1 });

    
    if (department) {
      records = records.filter(
        (r) =>
          r.employee?.department?.toLowerCase() === department.toLowerCase()
      );
    }

    

    res.json({ records });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: err.message });
  }
};











exports.getMyPerformance = async (req, res) => {
  console.log('req',req.user)

  try {

    const employee=await Employee.findOne({userAccount:req.user._id})
    console.log("employee",employee)
    const id=employee._id
    console.log("id",id)

    const records = await Performance.find({employee: id}).sort({
      createdAt: -1,
    });
    res.json(records);
    console.log('recors',records)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /performance/admin/dashboard
// exports.getAdminPerformanceStats = async (req, res) => {
//   try {
//     const records = await Performance.find()
//       .populate("employee", "name department");

//     const total = records.length;
//     const finalized = records.filter(r => r.status === "Finalized").length;
//     const topPerformers = records.filter(r => r.overallScore >= 4).length;
//     const promotions = records.filter(r => r.promotionRecommended).length;
//     const lnd = records.filter(r => r.lndRecommended).length;
//     const avgScore = (
//       records.reduce((sum, r) => sum + (r.overallScore || 0), 0) / total
//     ).toFixed(2);

//     // Group by department
//     const deptStats = {};
//     records.forEach(r => {
//       const dept = r.employee?.department || "Unknown";
//       if (!deptStats[dept]) deptStats[dept] = { count: 0, avg: 0, sum: 0 };
//       deptStats[dept].count++;
//       deptStats[dept].sum += r.overallScore || 0;
//     });
//     Object.keys(deptStats).forEach(d => {
//       deptStats[d].avg = (deptStats[d].sum / deptStats[d].count).toFixed(2);
//     });

//     res.json({
//       total,
//       finalized,
//       avgScore,
//       topPerformers,
//       promotions,
//       lnd,
//       deptStats,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getAdminAnalytics = async (req, res) => {
  try {
    const performances = await Performance.find()
      .populate("employee", "department salary name")
      .populate("linkedPayroll");

    
    const totalReviews = performances.length;
    const finalized = performances.filter((r) => r.status === "Finalized").length;
    const avgScore =
      performances.reduce((sum, r) => sum + (r.overallScore || 0), 0) /
      (totalReviews || 1);

    const totalBonus = performances.reduce(
      (sum, r) => sum + (r.linkedPayroll?.bonus || 0),
      0
    );

    const totalSalaryImpact = performances.reduce(
      (sum, r) => sum + (r.linkedPayroll?.netSalary || 0),
      0
    );

  
    const deptStats = {};
    performances.forEach((r) => {
      if (r.employee?.department) {
        const d = r.employee.department;
        if (!deptStats[d])
          deptStats[d] = { total: 0, count: 0, avgScore: 0 };
        deptStats[d].total += r.overallScore || 0;
        deptStats[d].count++;
      }
    });

    const departmentScores = Object.keys(deptStats).map((dept) => ({
      department: dept,
      avgScore: (deptStats[dept].total / deptStats[dept].count).toFixed(2),
    }));

    
    const lndCount = performances.filter((r) => r.lndRecommended).length;

    
    const promotionCount = performances.filter(
      (r) => r.promotionRecommended
    ).length;

    res.json({
      totalReviews,
      finalized,
      avgScore: avgScore.toFixed(2),
      totalBonus,
      totalSalaryImpact,
      departmentScores,
      lndCount,
      promotionCount,
    });
  } catch (err) {
    console.error("Admin Analytics Error:", err);
    res.status(500).json({ message: err.message });
  }
};
