const sendEmail = require("./sendEmail");

exports.sendNotificationEmail = async (email, title, message) => {
  try {
    await sendEmail(
      email,
      `Company Notification: ${title}`,
      message,
      `<h3>${title}</h3><p>${message}</p>`
    );
  } catch (err) {
    console.error("Email notification failed:", err.message);
  }
};
