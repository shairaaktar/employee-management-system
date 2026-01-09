const Payroll = require("../model/Payroll");
const Attendance = require("../model/Attendance");
const Employee = require("../model/Employee");
const { sendNotificationEmail } = require("../utils/sendNotificationEmail");
const {sendSocketNotification}=require("../utils/sendSocketNotification");
const User = require("../model/User");
const Stripe=require("stripe");
 const stripe=new Stripe(process.env.STRIPE_SECRET)
const {generatePayroll, generatePayslipPDF} =require("../utils/pdfGenerator")
const sendEmail=require("../utils/sendEmail")


exports.generatePayroll = async (req, res) => {
  try {
    const month = req.body.month; 
    const employees = await Employee.find();

    for (const emp of employees) {
      const attendances = await Attendance.find({
        user: emp._id,
        date: {
          $gte: new Date(`${month}-01`),
          $lte: new Date(`${month}-31`),
        },
      });

      const presentDays = attendances.filter((a) => a.status === "Present").length;
      const leaveDays = attendances.filter((a) => a.status === "Leave").length;

      const totalDays = 30; // Approx for simplicity
      const dailyRate = emp.salary / totalDays;
      const finalSalary = emp.salary - leaveDays * dailyRate;

      await Payroll.create({
        employee: emp._id,
        month,
        baseSalary: emp.salary,
        presentDays,
        leaveDays,
        finalSalary,
        status:"Pending"
      });
    }

    res.json({ message: "Payroll generated successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.markAsPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" },
      { new: true }
    ).populate("employee");


 
    await sendSocketNotification(
  payroll.employee._id,
  `Your salary for ${payroll.month} has been credited.`,
  "Payroll"
);

    
    await sendNotificationEmail(
      payroll.employee.email,
      "Salary Credited",
      `Your salary for ${payroll.month} (${payroll.finalSalary}) has been credited.`
    );

    

    res.json({ message: "Payroll marked as paid", payroll });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "name department email")
      .sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



 
 exports.getMyPayrolls = async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log("User Email:", userEmail);

   
    const employee = await Employee.findOne({ email: userEmail });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("Employee Name:", employee.name);


    const payrolls = await Payroll.find({ employee: employee._id })
      .populate("employee", "name email department");

    res.json(payrolls);
    console.log("Payrolls:", payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.approvePayroll = async (req, res) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findById(id).populate("employee");
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });


    if (payroll.status === "Approved") {
      return res.status(400).json({ message: "Payroll already approved" });
    }



    const duplicate = await Payroll.findOne({
      employee: payroll.employee._id,
      month: payroll.month,
      _id: { $ne: payroll._id },
    });
    if (duplicate) {
      return res.status(400).json({
        message: `A payroll record already exists for ${payroll.employee.name} (${payroll.month}).`,
      });
    }

    const message = `💰 Your salary for ${payroll.month} has been approved and credited: $${payroll.finalSalary.toLocaleString()}.`;
    const notification = await Notification.create({
      recipient: payroll.employee._id,
      message,
      type: "Payroll",
      isRead: false,
    });



    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payroll.finalSalary * 100), // in cents
      currency: "usd",
      
      description: `Salary Payment for ${payroll.employee.name} (${payroll.month})`,
      metadata:{
        employeeId:payroll.employee._id.toString(),
        month:payroll.month,

      },
      receipt_email: payroll.employee.email,
      automatic_payment_methods:{enabled:true}
    });

   const pdfPath=await generatePayslipPDF(payroll)

    payroll.status = "Approved";
    payroll.paymentIntentId = paymentIntent.id;
    payroll.paidAt=new Date();
    payroll.receiptUrl=pdfPath;
    await payroll.save();

    
    await sendSocketNotification(
      payroll.employee._id,
      `💰 Your salary for ${payroll.month} has been approved and credited.`,
      "Payroll"
    );

    const socketId = global.activeUsers.get(payroll.employee._id.toString());
    if (socketId) {
      global.io.to(socketId).emit("salaryCredited", {
        message: `Your salary for ${payroll.month} has been credited: ${payroll.finalSalary.toLocaleString()}$`,
        payslip:pdfPath,
      });
    }

    await sendEmail(
      payroll.employee.email,
      `Hi ${payroll.employee.name}, your salary for ${payroll.month} has been credited:${payroll.finalSalary.toLocaleString()}$ `
    )

    res.json({ message: "Payroll approved successfully",
       payroll ,
       client_secret:paymentIntent.client_secret,
      });
  } catch (err) {
    console.error("Error approving payroll:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updatePayroll=async(req,res)=>{
  try{
    const {id}=req.params;
    const {bonus=0,deductions=0}=req.body;

    const payroll=await Payroll.findById(id);
    if(!payroll){
      return res.status(404).json({message:"Payroll not found"});

    }

    if (payroll.status === "Approved") {
      return res
        .status(400)
        .json({ message: "Approved payrolls cannot be modified." });
    }

    payroll.bonus = bonus;
    payroll.deductions = deductions;

   
    payroll.finalSalary =
      payroll.baseSalary + Number(bonus) - Number(deductions);

    await payroll.save();

    res.json({
      message: "Payroll updated successfully",
      payroll,
    });

  }catch(error){
    console.error("Error updating payroll:", error);
    res.status(500).json({ message: error.message });

  }

}


//  exports.approvePayroll = async (req, res) => {
//   try {
//     const payroll = await Payroll.findById(req.params.id).populate("employee");
//     if (!payroll) return res.status(404).json({ message: "Payroll not found" });

//     payroll.status = "Approved";
//     await payroll.save();

//     const paymentIntent=await stripe.paymentIntents.create({
//       amount:Math.round(payroll.finalSalary*100),
//       currency:"usd",
//       payment_method_types:["card"],
//       description:`Salary payment for ${payroll.employee.name}`,
//       receipt_email:payroll.employee.email,

//     });

//     payroll.status="processing";
//     payroll.stripePaymentId=paymentIntent.id;
//     await payroll.save();

//     settimeout(async ()=>{
//       payroll.status="paid";
//       payroll.paidAt=new Date();
//       await payroll.save();

//       await sendEmail(
//       payroll.employee.email,
//       "Salary Payment Processed",
//         `Hi ${payroll.employee.name}, your salary of $${payroll.finalSalary} has been paid.`,
//         `<p>Your salary payment of <b>$${payroll.finalSalary}</b> has been processed successfully.</p>`
//     );

//     await sendSocketNotification(
//       payroll.employee.userAccount || payroll.employee._id,
//       `Salary of $${payroll.finalSalary} has been credited for ${payroll.month}.`,
//       "Payroll"
//     );



//     },3000);

   
    
    

//     res.json({ 
//       message: "Payroll approved and payemnt processing started" ,
//       payroll,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };