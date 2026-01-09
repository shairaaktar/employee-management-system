const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token not valid" });
  }
};

exports.allowRoles=(...roles)=>{
  return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return res.status(403).json({message:"Acess denies:Insufficient role"})

    }
    next()
  }
}

// module.exports = authMiddleware;
