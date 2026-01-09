const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const attachmentSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
});


const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ["todo", "in-progress", "completed","blocked","approved","revision_request"], 

    default: "todo" 
  },
  priority:{
    type:String,
    enum:["low","medium","high"],
    default:"medium",

  },
  progress: { type: Number, default: 0 }, 
    lastProgressAt: { type: Date, default: Date.now },
    progressUpdates: [
      {
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        progress: Number,
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    blocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: "" },

    comments: [commentSchema],

    attachments: [attachmentSchema],

    performanceRating: { type: Number, min: 0, max: 5 }, 
    needsApproval: { type: Boolean, default: false },
  approvedByManager: {
  type: Boolean,
  default: false
},

  assignedTo:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Employee",
    default:null,

  },
  assignedToAll:{
    type:Boolean,
    default:false,

  },
  
  
  deadline: { type: Date },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
