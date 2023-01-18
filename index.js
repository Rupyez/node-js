const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");

const ProductRoute = require('./routes/productRoute.js')
const userRoute = require('./routes/userRoute.js')

const errorMiddleware = require('./middleware/error.js')

const PORT = process.env.PORT || 3600


const app = express()
// app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


// database connection
const db = "mongodb://127.0.0.1:27017/Ecom"

mongoose.set("strictQuery",true)
mongoose.connect(db, {useNewUrlParser:true,
useUnifiedTopology:true}).then(()=>{
    console.log("connected successfully")
}).catch((err)=>{
    console.log(err)
})

app.listen(PORT, ()=>{
  console.log('server connected')
})


// route
app.get('/', (req,res)=>{
  res.send("Homepage")
})

app.use('/api/product', ProductRoute)
app.use('/api/user', userRoute)


// middleware
app.use(errorMiddleware)