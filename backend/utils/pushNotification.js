const webpush = require("web-push");

webpush.setVapidDetails(
  "mailto:admin@managepro.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.sendPushNotification = async (subscription, message) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify({ message }));
  } catch (error) {
    console.error("Push notification error:", error);
  }
};
