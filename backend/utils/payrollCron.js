const cron = require("node-cron");
const Payroll = require("../model/Payroll");
const Employee = require("../model/Employee");
const Attendance = require("../model/Attendance");
const { sendSocketNotification } = require("../utils/sendSocketNotification");
const sendEmail = require("../utils/sendEmail");


cron.schedule("0 10 1 * *", async () => {
  console.log("📅 Running monthly payroll generation...");

  const employees = await Employee.find();

  for (const emp of employees) {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM

    const exists = await Payroll.findOne({ employee: emp._id, month });
    if (exists) continue;

  
    const leaves = await Attendance.find({
      employee: emp._id,
      status: "Leave",
      date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) },
    });

    const leaveCount = leaves.length;
    const dailyRate = emp.salary / 30;
    const deductions = dailyRate * leaveCount;
    const finalSalary = emp.salary - deductions;

    const payroll = await Payroll.create({
      employee: emp._id,
      month,
      baseSalary: emp.salary,
      deductions,
      finalSalary,
      status: "Pending",
    });

 
    await sendSocketNotification(
      emp.manager,
      `Payroll generated for ${emp.name} (${month}) - awaiting approval.`,
      "Payroll"
    );

   
    
    sendEmail(
      "hr@company.com", 
      `Payroll Generated for ${emp.name}`,
      `Salary: ${emp.salary}, Deductions: ${deductions}, Final: ${finalSalary}`,
      `<p>Payroll for <b>${emp.name}</b> is generated and awaiting your approval.</p>
       <p><b>Base:</b> ${emp.salary} | <b>Deductions:</b> ${deductions} | <b>Final:</b> ${finalSalary}</p>`
    );
  }

  console.log(" Payroll generation complete.");
});
