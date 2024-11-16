const express = require("express");
const cors = require("cors");
const productController = require("../controllers/productFunction");

const router = express.Router();
router.use(cors());

router.get('/cart', productController.userWishlist);
router.post('/addproduct', productController.addWishlist);
router.post('/delete', productController.removeWishlist)

module.exports = router;;