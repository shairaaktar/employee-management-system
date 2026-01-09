
const cron = require("node-cron");
const Task = require("../model/Task");
const sendSocketNotification = require("../utils/sendSocketNotification");
const sendEmail=require("../utils/sendEmail")
const Employee = require("../model/Employee");

// Run once per day at 08:05
cron.schedule("5 8 * * *", async () => {
  try {
    const now = new Date();
    const daysWithoutProgress = 5; 


    const cutoff = new Date(now.getTime() - daysWithoutProgress * 24 * 60 * 60 * 1000);

    const tasks = await Task.find({
      status: "in-progress",
      lastProgressAt: { $lt: cutoff },
    }).populate("assignedTo");

    for (const t of tasks) {
      
      if (!t.blocked) {
        t.blocked = true;
        t.blockedReason = `No progress for ${daysWithoutProgress} days`;
        await t.save();

       
        const manager = await Employee.findById(t.assignedTo.manager).populate("userAccount");
        if (manager && manager.userAccount) {
          await sendSocketNotification(
            manager.userAccount._id,
            ` Task "${t.title}" blocked (no updates for ${daysWithoutProgress} days).`,
            "Task"
          );

          await sendEmail(
            manager.userAccount.email,
            `Blocked Task: ${t.title}`,
            `${t.assignedTo.name}'s task "${t.title}" has been blocked: no progress for ${daysWithoutProgress} days.`
          );
        }

       
        await sendSocketNotification(
          t.assignedTo._id,
          ` Your task "${t.title}" marked as blocked — please update or request help.`,
          "Task"
        );
      }
    }
  } catch (err) {
    console.error("Blocked task cron failed:", err);
  }
});
