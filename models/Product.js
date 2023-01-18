const mongoose = require('mongoose')
// const Category = require('../models/Category')
 const User = require('../models/User.js')


const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter the product name"],
        trim:true
      },
      description: {
        type: String,
        required: true,
      },

      // category:{
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref:Category,
      //   required:true,
       
      // },

      price:{
        type:Number,
        required: [true, "Please enter the product name"],
        maxLength: [8, "Price cannot exceed 8 character"]
      },

      rating:{
        type:"String",
        default: 0
      }, 
      
      images:[
         {        public_id:{
                      type:String,
                      required:true,
                     },

                   url:{
                      type:String,
                      required:true,
                    }
        }
      ],

      stock:{
        type:Number,
        required:[true, "Please product stock"],
        maxLength:[4, "stock cannot exceed 4 character"]
      },

      
        numOfReviews:{
            type:'Number',
            default:0
        },

        reviews:[{
          user:{
            type:mongoose.Schema.ObjectId,
            ref:User,
            required:true,
          },
          
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true,
            },
        }],

        user:{
          type:mongoose.Schema.ObjectId,
          ref:User,
          required:true,
        },

        createdAt:{
            type:Date,
            default:Date.now
        }
      

})


const Product = new mongoose.model('Product', ProductSchema)
module.exports = Product