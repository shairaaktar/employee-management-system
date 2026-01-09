const Employee = require("../model/Employee");
const Task = require("../model/Task");
const Notification=require("../model/Notification")
const path=require("path")
const fs=require("fs");


const sendEmail = require("../utils/sendEmail"); 
const {sendSocketNotification}=require("../utils/sendSocketNotification")

// Create Task
// exports.createTask = async (req, res) => {
//   try {
//     const { title, description, deadline, assignedTo, assignedToAll } = req.body;

//     // ✅ Case 1: Assign to ALL employees
//     if (assignedToAll) {
//       const employees = await Employee.find({ role: "employee" });

//       // Create all tasks in parallel
//       const tasks = await Promise.all(
//         employees.map(async (emp) => {
//           const task = await Task.create({
//             user: req.user.id, // HR/Admin creator
//             assignedTo: emp._id,
//             title,
//             description,
//             deadline,
//           });

//           // ✅ 1. Send Real-Time Socket Update (individual)
//           const socketId = global.activeUsers.get(emp._id.toString());
//           if (socketId) {
//             global.io.to(socketId).emit("taskAssigned", {
//               message: `New task assigned: ${title}`,
//               task,
//             });
//           }

//           // ✅ 2. Send Email
//           await sendEmail(
//             emp.email,
//             "New Task Assigned",
//             `Hi ${emp.name}, you have a new task: "${title}".`,
//             `<p>Hi ${emp.name},</p>
//              <p>You have been assigned a new task:</p>
//              <p><b>${title}</b></p>
//              <p>Deadline: ${deadline}</p>
//              <p>Description: ${description}</p>`
//           );

//           // await Notification.create({
//           //   recipient:emp._id,
//           //   message:`You have a new task:${title}`,
//           //   type:"Task",
//           // })

//           // ✅ 3. Send In-App Notification
//           await sendSocketNotification(
//             emp.userAccount || emp._id,
//             `New task assigned: "${title}"`,
//             "Task"
//           );

//           return task;
//         })
//       );

//       return res.status(201).json({
//         message: "Task assigned to all employees with notifications.",
//         tasks,
//       });
//     }

//     // ✅ Case 2: Assign to ONE employee
//     const employee = await Employee.findById(assignedTo);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     const task = await Task.create({
//       user: req.user.id,
//       assignedTo,
//       title,
//       description,
//       deadline,
//     });

//     // ✅ 1. Real-time socket notification
//     const socketId = global.activeUsers.get(employee._id.toString());
//     if (socketId) {
//       global.io.to(socketId).emit("taskAssigned", {
//         message: `You have a new task: ${title}`,
//         task,
//       });
//     }

//     // ✅ 2. Email notification
//     await sendEmail(
//       employee.email,
//       "New Task Assigned",
//       `Hi ${employee.name}, you have a new task: "${title}".`,
//       `<p>Hi ${employee.name},</p>
//        <p>You have been assigned a new task:</p>
//        <p><b>${title}</b></p>
//        <p>Deadline: ${deadline}</p>
//        <p>Description: ${description}</p>`
//     );

//     // ✅ 3. In-App Notification
//     await sendSocketNotification(
//       employee.userAccount || employee._id,
//       `New task assigned: "${title}"`,
//       "Task"
//     );

//     res.status(201).json({
//       message: "Task assigned and notifications sent.",
//       task,
//     });
//   } catch (error) {
//     console.error("Task creation error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, assignedTo, assignedToAll } = req.body;

    const currentUser = req.user; 
    const currentEmployee = await Employee.findOne({ userAccount: currentUser._id });

    if (!currentEmployee) {
      return res.status(404).json({ message: "Employee record not found for this user." });
    }

    
    if (assignedToAll) {
      let employees = [];

      if (currentUser.role === "manager") {
        
        employees = await Employee.find({ manager: currentEmployee._id });
      } else if (currentUser.role === "hr" || currentUser.role === "admin") {
      
        employees = await Employee.find({ role: "employee" });
      }

      if (employees.length === 0) {
        return res.status(400).json({ message: "No employees found under your management." });
      }

      
      const tasks = await Promise.all(
        employees.map(async (emp) => {
          const task = await Task.create({
            user: currentUser._id, 
            assignedTo: emp._id,
            title,
            description,
            deadline,
          });


          const socketId = global.activeUsers.get(emp._id.toString());
          if (socketId) {
            global.io.to(socketId).emit("taskAssigned", {
              message: `New task assigned: ${title}`,
              task,
            });
          }

          await sendEmail(
            emp.email,
            "New Task Assigned",
            `Hi ${emp.name}, you have a new task: "${title}".`,
            `<p>Hi ${emp.name},</p>
             <p>You have been assigned a new task:</p>
             <p><b>${title}</b></p>
             <p>Deadline: ${deadline}</p>
             <p>Description: ${description}</p>`
          );

          await sendSocketNotification(
            emp.userAccount || emp._id,
            `New task assigned: "${title}"`,
            "Task"
          );

          return task;
        })
      );

      return res.status(201).json({
        message: "Task assigned successfully to your team.",
        tasks,
      });
    }


    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

   
    if (currentUser.role === "manager") {
      const isMyTeam = await Employee.exists({
        _id: assignedTo,
        manager: currentEmployee._id,
      });
      if (!isMyTeam) {
        return res.status(403).json({
          message: "You can only assign tasks to your team members.",
        });
      }
    }

    const task = await Task.create({
      user: currentUser._id,
      assignedTo,
      title,
      description,
      deadline,
    });

   
    const socketId = global.activeUsers.get(employee._id.toString());
    if (socketId) {
      global.io.to(socketId).emit("taskAssigned", {
        message: `You have a new task: ${title}`,
        task,
      });
    }

    await sendEmail(
      employee.email,
      "New Task Assigned",
      `Hi ${employee.name}, you have a new task: "${title}".`,
      `<p>Hi ${employee.name},</p>
       <p>You have been assigned a new task:</p>
       <p><b>${title}</b></p>
       <p>Deadline: ${deadline}</p>
       <p>Description: ${description}</p>`
    );

    await sendSocketNotification(
      employee.userAccount || employee._id,
      `New task assigned: "${title}"`,
      "Task"
    );

    res.status(201).json({
      message: "Task assigned successfully.",
      task,
    });
  } catch (error) {
    console.error("Task creation error:", error);
    res.status(500).json({ message: error.message });
  }
};



exports.getTasks = async (req, res) => {
  try {
    // const tasks = await Task.find({ user: req.user.id });
    const tasks = await Task.find({
  $or: [{ assignedTo: req.user.id }, { assignedToAll: true }],
});

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTask=async(req,res)=>{
  try{
    let tasks;
    if(req.user.role==="employee"){
      const employee=await Employee.findOne({email:req.user.email});
      tasks=await Task.find({assignedTo:employee._id});

    }else if (["hr","admin"].includes(req.user.role)){
      tasks = await Task.find()
        .populate("assignedTo", "name department email")
        .populate("user", "name email");
    }
    res.json(tasks);

  }catch(err){
    res.status(500).json({message:err.message})
  }
}

exports.getManagerTasks = async (req, res) => {
  try {
    
    const manager = await Employee.findOne({ userAccount: req.user._id });
    if (!manager)
      return res.status(403).json({ message: "Manager record not found" });

    
    const teamMembers = await Employee.find({ manager: manager._id }).select("_id name email");

    const teamIds = teamMembers.map((emp) => emp._id);

   
    const tasks = await Task.find({
      $or: [
        { user: req.user._id },
        { assignedTo: { $in: teamIds } }, 
      ],
    })
      .populate("assignedTo", "name department email")
      .sort({ createdAt: -1 });

  console.log("tasks",tasks)

  const now=new Date();
  // const enrichedTasks=tasks.map((t)=>({
  //   ...t.toObject(),
  //   overdue: t.deadline && new Date(t.deadline) < now && t.status !== "completed",

  // }))
  const enrichedTasks = tasks.map((t) => {
  const deadline = t.deadline ? new Date(t.deadline) : null;
  const daysLeft = deadline ? Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)) : null;

  let deadlineStatus = "none";

  if (t.status === "completed") {
    deadlineStatus = "completed";
  } else if (deadline && daysLeft < 0) {
    deadlineStatus = "overdue";
  } else if (deadline && daysLeft >= 0) {
    deadlineStatus = "upcoming";
  }

  return {
    ...t.toObject(),
    overdue: deadlineStatus === "overdue",
    deadlineStatus,
    daysLeft,
    priority: t.priority || "medium",
    needsApproval: t.status === "completed" && !t.approvedByManager,
  };
});

     res.json({
      manager: manager.name,
      teamSize: teamMembers.length,
      tasks,
      enrichedTasks
    });

   
  } catch (err) {
    console.error("Error fetching manager tasks:", err);
    res.status(500).json({ message: err.message });
  }
};


// Update Task
// exports.updateTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    
    if (req.user.role === "employee") {
      const employee = await Employee.findOne({ email: req.user.email });
      if (!employee || !task.assignedTo.equals(employee._id)) {
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    task.status = status;
    await task.save();
    res.json({ message: "Status updated", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.approveTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     task.approvedByManager = true;
//     await task.save();

//     await sendSocketNotification(
//   task.assignedTo._id,
//   ` Your task "${task.title}" has been approved`,
//   "Task"
// );


//     res.json({ message: "Task approved", task });
//   } catch {
//     res.status(500).json({ message: "Error approving task" });
//   }
// };

// exports.returnTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     task.status = "in-progress";
//     task.approvedByManager = false;
//     await task.save();

//     await sendSocketNotification(
//   task.assignedTo._id,
//   ` Task "${task.title}" was returned for revision`,
//   "Task"
// );


//     res.json({ message: "Task returned for revision", task });
//   } catch {
//     res.status(500).json({ message: "Error returning task" });
//   }
// };




exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments.push({ user: req.user._id, text });
    await task.save();

    
    await sendSocketNotification(
      task.assignedTo || task.user,
      `New comment on task "${task.title}"`,
      "Task"
    );

    res.json({ message: "Comment added", comment: task.comments.slice(-1)[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.uploadAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const attachment = {
      fileName: req.file.originalname,
      filePath: `/uploads/tasks/${req.file.filename}`,
      uploadedBy: req.user._id,
    };
    task.attachments.push(attachment);
    await task.save();

    await sendSocketNotification(task.assignedTo || task.user, `New file attached to "${task.title}"`, "Task");

    res.json({ message: "Attachment uploaded", attachment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, note } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.progress = progress;
    task.lastProgressAt = new Date();
    task.progressUpdates.push({ by: req.user._id, progress, note });

   
    if (progress >= 100) {
      task.status = "completed";
      task.needsApproval = true;
    } else {
      task.status = "in-progress";
    }

    
    if (task.blocked) {
      task.blocked = false;
      task.blockedReason = "";
    }

    await task.save();

    await sendSocketNotification(task.user, `Progress updated on "${task.title}"`, "Task");

    res.json({ message: "Progress updated", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.approveTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate("assignedTo");
    if (!task) return res.status(404).json({ message: "Task not found" });

  
    task.needsApproval = false;
    task.status = "completed";
    await task.save();

    await sendSocketNotification(task.assignedTo._id, ` Task "${task.title}" approved`, "Task");

    res.json({ message: "Task approved", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.returnTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const task = await Task.findById(id).populate("assignedTo");
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.needsApproval = false;
    task.status = "in-progress";
    task.blocked = false; 
    task.blockedReason = `Returned by manager: ${reason || "No reason"}`;
    await task.save();

    await sendSocketNotification(task.assignedTo._id, ` Task "${task.title}" returned: ${reason}`, "Task");

    res.json({ message: "Task returned", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.rateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.performanceRating = rating;
    await task.save();

    res.json({ message: "Task rated", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
