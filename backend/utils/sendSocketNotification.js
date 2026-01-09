const Notification = require("../model/Notification");

async function sendSocketNotification(userId, message, type = "General") {
  const allowedTypes = ["General", "Payroll", "Leave", "Task"];
  const safeType = allowedTypes.includes(type) ? type : "General";


  const note = await Notification.create({ recipient: userId, message, type:safeType });

 
  const socketId = global.activeUsers.get(userId.toString());
  if (socketId) {
    global.io.to(socketId).emit("notification", {
      message,
      type:safeType,
      createdAt: note.createdAt,
    });
  }
}

module.exports = { sendSocketNotification };
