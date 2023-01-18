const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength:[30, "Name cannot excced more than 30"],
        minLength:[6, "Name cannot excced less than 6"]
      },

      email:{
        type:String,
        required:[true, "Email is Required"],
        unique:true,
        validate: [validator.isEmail,"Please enter a valid email"] //custom validate for email
      },


      password:{
        type:String,
        unique:true,
        required: [true, "Please enter your password"], 
        minLength:[6, "Password should be at least 6 characters long"],
        select:false
      },
    


      avatar:
        {        public_id:{
                     type:String,
                     
                    },

                  url:{
                     type:String,
                     
                   }
       },

       role:{
        type:String,
        default:"user"
       },
     
       resetPasswordToken: String,
       resetPasswordExpire:Date,

        createdAt:{
            type:Date,
            default:Date.now
        }
      

})


// password encryption runs before data in database          

//note we cant use {this} at arrow or callback function   but we can use at normal function
userSchema.pre('save', async function(next){

  if(!this.isModified("password")){
    next()
  }


  const salt = await bcrypt.genSalt()
this.password = await bcrypt.hash(this.password, salt);
next();
})


// jwt token
userSchema.methods.getJWTToken = function(){
  return jwt.sign({id:this._id}, 'JWT_SECRET',{
    expiresIn: '1d',
  })
}

// compare password
// userSchema.methods.comparePassword = async function(enteredPassword){
//   return  await bcrypt.compare(enteredPassword, this.password)
// }


// generating password reset token
userSchema.methods.getResetPasswordToken = function(){

  // generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and resetPasswordToekn to userschema
  this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken
}


const User = new mongoose.model('User', userSchema)
module.exports = User