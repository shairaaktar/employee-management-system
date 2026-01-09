const express=require("express");
const {registerUser,changePassword,loginUser,verifyEmail,resendCode,resetPassword,forgotPassword,googleLogin}=require("../controllers/auth");
const { authMiddleware } = require("../middleware/authMiddleware");

const router=express.Router()

router.post("/register",registerUser);
router.post("/verify-email",verifyEmail)
router.post("/login",loginUser)
router.post("/resend-code", resendCode);
router.post("/change-password",authMiddleware,changePassword)
router.post("/forgot-password",forgotPassword)
router.post("/google-login",googleLogin)
router.post("/reset-password/:token", resetPassword);

module.exports=router;