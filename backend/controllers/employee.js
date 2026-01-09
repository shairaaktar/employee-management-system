const Employee = require("../model/Employee");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const CompanyDocument=require("../model/CompanyDocument")

// ✅ Create
// exports.createEmployee = async (req, res) => {
//   try {
//     const { name, email, department, role, salary } = req.body;
//     const employee = await Employee.create({
//       name,
//       email,
//       department,
//       role,
//       salary,
//       manager: req.user.id,
//     });
//     res.status(201).json(employee);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, role, salary,manager } = req.body;

    console.log("role",role)

  
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee)
      return res.status(400).json({ message: "Employee already exists" });

    const randomPassword = Math.random().toString(36).slice(-8);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role,
      isVerified: true,
      mustChangePassword:true,
    });

   
    const employee = await Employee.create({
      name,
      email,
      department,
      roles:role,
      salary,
      manager: manager, 
      userAccount: user._id,
    });

    await sendEmail(
      email,
      "Welcome to Company Portal",
      `Hi ${name}, your account has been created.
       Login email: ${email}
       Temporary password: ${randomPassword}`,
      `<p>Hi ${name},</p>
       <p>Your employee account has been created successfully.</p>
       <p><b>Login email:</b> ${email}<br/>
       <b>Temporary password:</b> ${randomPassword}</p>
       <p>Please log in and change your password after your first login.</p>`
    );

    const hrEmail = req.user.email;
    await sendEmail(
      hrEmail,
      "Employee Created Successfully",
      `Employee ${name} (${email}) has been added successfully to the system.`,
      `<p>Hi ${req.user.name},</p>
       <p>You successfully added <b>${name}</b> (${email}) to the company portal.</p>
       <p>Department: ${department} | Salary: ${salary}</p>`
    );

    res.status(201).json({
      message: "Employee added successfully and login credentials sent via email.",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ manager: req.user.id });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getEmployeesForHR = async (req, res) => {
  try {
    const employees = await Employee.find().select("name email department roles");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    if (employee.manager.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(employee, req.body);
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    if (employee.manager.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await employee.deleteOne();
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.getAllManagers = async (req, res) => {
  console.log("res",res)
  try {

    const managers = await Employee.find({ roles: "manager" })
      .populate("userAccount", "name email role") 
      .select("name email department role userAccount");
   console.log("managers",managers)
    res.json(managers);
  } catch (err) {
    console.error("Error fetching managers:", err);
    res.status(500).json({ message: "Server error fetching managers" });
  }
};


exports.getEmployeeDocuments = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userAccount: req.user._id });

    const docs = await CompanyDocument.find({
      $or: [
        { visibility: "all" },
        { department: employee.department },
        { allowedEmployees: employee._id },
      ],
    }).sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
