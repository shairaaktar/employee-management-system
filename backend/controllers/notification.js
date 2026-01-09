const Notification = require("../model/Notification");


exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUserNotifications = async (req, res) => {

 
  try {
    
    const notifications = await Notification.find({ recipient: req.user.recipient })
      .sort({ createdAt: -1 });
    console.log("notification",notifications)
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MARK AS READ
// exports.markAsRead = async (req, res) => {
//   try {
//     const notification = await Notification.findByIdAndUpdate(
//       req.params.id,
//       { isRead: true },
//       { new: true }
//     );
//     res.json(notification);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// exports.markAsRead = async (req, res) => {
//   try {
//     await Notification.updateMany(
//       { recipient: req.user.id, isRead: false },
//       { isRead: true }
//     );
//     res.json({ message: "All notifications marked as read" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getsubscribeNotification=async(req,res)=>{
  try{
        await User.findByIdAndUpdate(req.user.id, {
      pushSubscription: req.body.subscription,
    });
    res.json({ message: "Push subscription saved!" });


  }catch(error){
     res.status(500).json({ message: error.message });
  }
}
