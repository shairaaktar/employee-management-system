const cron = require("node-cron");
const Task = require("../model/Task");
const Employee = require("../model/Employee");
const sendEmail = require("../utils/sendEmail")
const sendSocketNotification = require("../utils/sendSocketNotification");

cron.schedule("0 9 * * *", async () => {
  try {
    const tasks = await Task.find().populate("assignedTo");

    const now = new Date();

    for (const task of tasks) {
      if (!task.deadline || !task.assignedTo) continue;

      const deadline = new Date(task.deadline);
      const daysLeft = Math.ceil((deadline - now) / (1000*60*60*24));

     
      if (task.status === "completed") continue;

      
      if (daysLeft === 2) {
        await sendEmail(
          task.assignedTo.email,
          `Reminder: Task "${task.title}" due soon`,
          `Your task "${task.title}" is due in 2 days.`
        );

        await sendSocketNotification(
          task.assignedTo._id,
          ` Task "${task.title}" is due in 2 days`,
          "Task Reminder"
        );
      }

   
      if (daysLeft === -1) {
        await sendEmail(
          task.assignedTo.email,
          ` Task "${task.title}" is overdue`,
          `Your task "${task.title}" is overdue. Please update progress.`
        );

        await sendSocketNotification(
          task.assignedTo._id,
          ` Task "${task.title}" is overdue`,
          "Task Reminder"
        );
      }


      if (daysLeft <= -3) {
        const manager = await Employee.findById(task.assignedTo.manager).populate("userAccount");

        if (manager) {
          await sendEmail(
            manager.userAccount.email,
            ` Team Task Overdue`,
            `${task.assignedTo.name} has not completed the task "${task.title}" for more than 3 days.`
          );

          await sendSocketNotification(
            manager.userAccount._id,
            ` Task "${task.title}" overdue 3+ days`,
            "Escalation"
          );
        }
      }

      
      if (daysLeft <= -7) {
        const hrUsers = await User.find({ role: "hr" });
        for (const hr of hrUsers) {
          await sendEmail(
            hr.email,
            ` Critical: Task overdue`,
            `"${task.title}" assigned to ${task.assignedTo.name} is overdue for a week.`
          );
        }
      }
    }
  } catch (err) {
    console.error("Cron job failed:", err);
  }
});
