// const express=require("express");
// const dotenv=require("dotenv");
// const cors=require("cors")
// const connectDB=require("./config/db")
// const http=require("http");
// const {Server}=require("socket.io")


// dotenv.config();
// connectDB();

// const app=express();
// const server=http.createServer(app)

// const io=new Server(server,{
//     cors: {
//     origin: "http://localhost:5173", // frontend URL
//     methods: ["GET", "POST","PUT","DELETE"],
//   },

// })

// app.use(cors());
// app.use(express.json())

// app.use("/api/auth",require("./routes/auth"))
// app.use("/api/tasks", require("./routes/task"));
// app.use("/api/employees", require("./routes/employee"));
// app.use("/api/payrolls", require("./routes/payroll"));

// app.use("/api/notifications", require("./routes/notification"));
// app.use("/api/analytics", require("./routes/analytics"));
// app.use("/api/attendance", require("./routes/attendance"));
// app.use("/api/leaves", require("./routes/leave"));
// app.use("/uploads", express.static("uploads"));
// app.use("/api/documents", require("./routes/document"));

// app.use("/api/admin", require("./routes/admin"));


// app.get("/",(req,res)=>{
//     res.send("API is running...");
// });


// global.io=io


//  global.activeUsers=new Map();

// io.on("connection",(socket)=>{
//     console.log("User connected:", socket.id);

//   socket.on("registerUser", (userId) => {
//     global.activeUsers.set(userId, socket.id);
//     console.log(`User ${userId} registered to socket ${socket.id}`);
// })
// socket.on("disconnect", () => {
//     for (let [userId, id] of global.activeUsers.entries()) {
//       if (id === socket.id) global.activeUsers.delete(userId);
//     }
//     console.log("User disconnected:", socket.id);
//   });

// })

// require("./utils/payrollCron")



// const PORT=process.env.PORT||5000;
// server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const cron=require("node-cron")
const Task =require("./model/Task")
const Employee=require("./model/Employee")
const {sendEmail}=require("./utils/sendEmail")
const {sendSocketNotification}=require("./utils/sendSocketNotification")


cron.schedule("0 * * * *", async () => { // runs every hour
  console.log("🔔 Checking for upcoming task deadlines...");

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const tasks = await Task.find({
      deadline: { $lte: in24Hours, $gte: now },
      status: { $nin: ["completed", "approved"] },
      reminderSent: false,
    }).populate("assignedTo");

    for (const task of tasks) {
      const employee = task.assignedTo;
      if (!employee) continue;

      // Send reminder email
      await sendEmail(
        employee.email,
        `Reminder: Task "${task.title}" deadline approaching`,
        `Hi ${employee.name}, your task "${task.title}" is due soon.`,
        `<p>Hi ${employee.name},</p>
         <p>This is a reminder that your task <b>${task.title}</b> is due on <b>${task.deadline.toDateString()}</b>.</p>
         <p>Please ensure it’s completed on time.</p>`
      );

      // Send real-time notification
      await sendSocketNotification(
        employee.userAccount,
        `⏰ Task "${task.title}" is due soon.`,
        "Task Reminder"
      );

      // Mark reminder as sent
      task.reminderSent = true;
      await task.save();
    }

    console.log(`✅ Sent ${tasks.length} deadline reminders.`);
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
});

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.io with CORS for Vite frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ✅ Global Socket setup
global.io = io;
global.activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("registerUser", (userId) => {
    if (userId) {
      global.activeUsers.set(userId.toString(), socket.id);
      console.log(`✅ Registered user: ${userId} → socket: ${socket.id}`);
    } else {
      console.warn("⚠️ registerUser event received with null userId");
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of global.activeUsers.entries()) {
      if (id === socket.id) {
        global.activeUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
  });
});

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));
app.use("/api/employees", require("./routes/employee"));
app.use("/api/payrolls", require("./routes/payroll"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/leaves", require("./routes/leave"));
app.use("/api/documents", require("./routes/document"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/performance", require("./routes/performance"));
app.use("/api/manager",require("./routes/manager"))
app.use("/api/communications", require("./routes/communication"));


// app.use("/uploads", express.static("uploads"));
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static("uploads"));




app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Import background cron jobs
require("./utils/payrollCron");
require("./utils/reminderJob");
require("./utils/blockedTaskDetector")
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
