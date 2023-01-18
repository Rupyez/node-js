const Product = require('../models/Product.js');
const ErrorHandler = require('../utils/errorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js')

// create product -- admin
const createProduct = catchAsyncErrors(

    async(req, res, next)=>{
        req.body.user = req.user.id;
        
        const product = await Product.create(req.body);
        res.status(201).json({success:true, product})
    }
)



// get all products
const getAllProduct = catchAsyncErrors(

 async(req, res)=>{
    const products = await Product.find();
    res.status(201).json({success:true, products})
  }
)

// get products by id
const getProductsByid = catchAsyncErrors(

    async(req,res, next)=>{
        const products = await Product.findById(req.params.id);
        if(!products)
    
        return next(new ErrorHandler("Product not found", 404 ))
    
        res.status(201).json({success:true, products})
    
    }
)



// update products -- admin
const updateProduct = catchAsyncErrors(

    async(req, res, next)=>{
        let product = Product.findById(req.params.id);
    
        if(!product){
            return next(new ErrorHandler("Product cannot be updated", 404 ))
        }
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {new:true, useFindAndModify:false})
        
        res.status(201).json({success:true, product})
    }
    
)

// delete product - admin

const deleteProduct = catchAsyncErrors(

    async(req, res, next)=>{
        let product = Product.findById(req.params.id);
    
        if(!product){
            return next(new ErrorHandler("Product not found", 404 ))
        }
        product = await Product.findByIdAndRemove(req.params.id, req.body)
        
        res.status(201).json({success:true, message:"Product deleted successfully"})
    }
    
)


//create New review or update the review
const createProductReview = catchAsyncErrors(async(req,res, next)=>{
    const {rating, comment, productID} = req.body;

    const review ={
        user:req.user._id,
        name:req.user.name,
        rating: Number(rating), comment,
    };

    const product = await Product.findById(productID);
    
    if(isReviewed){
        const isReviewed = product.reviews.find(rev=>rev.user)
    }else{
        product.reviews.push(review)
    }
}) 



module.exports ={
    createProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    getProductsByid
}