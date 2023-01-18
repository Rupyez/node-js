
const User = require('../models/User.js')
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const sendToken = require('../utils/jwtToken.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


// // register user
const registerUser = catchAsyncErrors(
    async(req,res)=>{
    const {name,email,password} = req.body;

    const user = await User.create({name,email,password,
    avatar:{
        public_id:'This is sample pic',
        url:'profile pic'
    }
    })

// Calling the token
sendToken(user, 201, res)

})


// login user
const loginUser = catchAsyncErrors(async(req,res,next)=>{
    
    const {email, password}= req.body;

    // checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }
sendToken(user, 200, res)
    
})


// logout
const logoutUser = catchAsyncErrors(async(req,res,next)=>{

res.cookie("token", null,{
    expires: new Date(Date.now()),
    httpOnly:true,
});

    res.status(200).json({
        success:true,
        message:"Logged out"
    })
})


// // Forgot Password
// const forgotPassword = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.findOne({ email: req.body.email });
  
//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }
  
//     // Get ResetPassword Token
//     const resetToken = user.getResetPasswordToken();
  
//     await user.save({ validateBeforeSave: false });
  
//     const resetPasswordUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/password/reset/${resetToken}`;
  
//     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
//     try {
//       await sendEmail({
//         email: user.email,
//         subject: `Ecommerce Password Recovery`,
//         message,
//       });
  
//       res.status(200).json({
//         success: true,
//         message: `Email sent to ${user.email} successfully`,
//       });
//     } catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;
  
//       await user.save({ validateBeforeSave: false });
  
//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

  // Get User Detail
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });

//  upadate password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await bcrypt.compare(req.body.oldPassword, user.password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {  
      return next(new ErrorHandler("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  

//   // Get all users(admin)
const getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });


//   // Get single user (admin)
const getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
  });


//   // update User Role -- Admin
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      // name: req.body.name,
      // email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });


//   // Delete User --Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  User.findByIdAndDelete(req.params.id, function (err, user) {
    if (err){
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
    }
    else{
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
      });
    }
});

    // const user = await User.findById(req.params.id);
  
    // if (!user) {
    //   return next(
    //     new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    //   );
    // }
  
    // const imageId = user.avatar.public_id;
  
    // await cloudinary.v2.uploader.destroy(imageId);
  
    // await user.remove();
  
    // res.status(200).json({
    //   success: true,
    //   message: "User Deleted Successfully",
    // });
  });
  
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    // forgotPassword,
    getUserDetails,
    updatePassword,
    getAllUser,
    getSingleUser,
    updateUserRole,
    deleteUser
}