const User=require("../model/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const sendEmail=require("../utils/sendEmail")
const {OAuth2Client}=require("google-auth-library")
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const crypto = require("crypto");

exports.registerUser=async(req,res)=>{
    try{
        const {name,email,password,role}=req.body
       

        let user=await User.findOne({email});
        if (user) {
      if (user.isVerified) {
    
        return res.status(400).json({ message: "User already exists" });
      } else {

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = code;
        user.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendEmail(
          email,
          "Verify your email - Task Manager App",
          `Your new verification code is: ${code}`,
          `<p>Your new verification code is: <b>${code}</b></p>`
        );

        return res.status(200).json({
          message: "User already registered but not verified. A new code has been sent.",
        });
      }
    }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);

        const code=Math.floor(100000+Math.random()*900000).toString();

        user=await User.create({
            name,
            email,
            password:hashedPassword,
            role:role||"employee",
            verificationCode:code,
            verificationCodeExpires:Date.now()+10*60*1000
        });

        await sendEmail(
            email,
            "Verify your email - Task Manager App",
      `Your verification code is: ${code}`,
      `<p>Your verification code is: <b>${code}</b></p>`
        );

        res.status(201).json({message:"Registration successful.Please verify your email."});
    }catch(error){

         res.status(500).json({ message: error.message });

    }
};

exports.verifyEmail=async(req,res)=>{
    try{
        const {email,code}=req.body;
        console.log("email",email)

        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"User not found"});
        if (user.isVerified) return res.status(400).json({message:"Already verified"});


        if (user.verificationCode!==code || user.verificationCodeExpires<Date.now()){
            return  res.status(400).json({message:"Invalid or expire code"});
        }

        user.isVerified=true;
        user.verificationCode=null;
        user.verificationCodeExpires=null;

        await user.save();

        res.json({message:"Email verified successfully!"});

    }catch(error){
        res.status(500).json({message:error.message});
    }
};

exports.resendCode=async(req,res)=>{
    try{

        const {email}=req.body;
        const user=await User.findOne({email});

        if(!user) return res.status(400).json({message:"User not found"});
        if(user.isVerified) return res.status(400).json({message:"Email already verified"});

       const code = Math.floor(100000 + Math.random() * 900000).toString();
       user.verificationCode=code;
       user.verificationCodeExpires=Date.now()+10*60*1000;
       await user.save();

       
    await sendEmail(email, "Resend Verification Code", `Your new code is ${code}`, `<p>Your new code: <b>${code}</b></p>`);
    res.json({ message: "Verification code re-sent." });

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"});

        if (!user.isVerified){
            return res.status(403).json({message:"Please verify your email before logging in."});

        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

        user.lastLogin = new Date();
    await user.save();

        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        res.json({
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                 mustChangePassword: user.mustChangePassword,
            }});
        

    }catch{
        res.status(500).json({message:error.message})
    }
}

exports.changePassword=async(req,res)=>{
    try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.mustChangePassword = false; 
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.forgotPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email});
        if(!user)
            return res.status(404).json({message:"User not found"});

        const resetToken=crypto.randomBytes(20).toString("hex");
        user.resetToken=resetToken;
        user.resetTokenExpires=Date.now()+15*60*1000;
        await user.save()

        const resetLink=`${process.env.FRONTEND_URL}reset-password/${resetToken}`;
        await sendEmail(
            email,
            "Password Reset Request",
      `Click the link to reset your password: ${resetLink}`,
      `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`

        )

    res.json({ message: "Password reset link sent to your email" });

    }catch(error){
        res.status(500).json({message:error.message})
    }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    console.log("token",token)
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.googleLogin = async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google_auth_user",
        isVerified: true,
        role: "employee",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


