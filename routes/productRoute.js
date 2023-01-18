const express = require('express');
const { createProduct, getAllProduct, updateProduct, deleteProduct, getProductsByid } = require('../controllers/productcontoller');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth.js');


const router = express.Router();


router.post('/add', isAuthenticatedUser, createProduct)
router.get('/products', getAllProduct)
router.get('/products/:id', getProductsByid)
router.put('/update/:id',isAuthenticatedUser, updateProduct)
router.delete('/delete/:id',isAuthenticatedUser, deleteProduct)



module.exports = router