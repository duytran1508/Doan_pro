const express = require ("express");
const router = express.Router()
const productController = require ('../controllers/ProductController');

router.post('/create',productController.createProduct)
router.put('/update/:id', productController.updateProduct)
router.get('/get-details/:id', productController.getDetailsProduct)
router.delete('/delete-product/:id', productController.deleteProduct)
router.get('/getAllProduct', productController.getAllProduct)
router.delete('/delete-many/:id', productController.deleteManyProduct)




module.exports = router