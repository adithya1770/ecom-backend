const express = require("express");
const router = express.Router();
const productController = require("../controllers/productFunction");
const authWare = require("../middleware/authWare");
const cors = require("cors");
const passport = require('passport');
require('../auth');

router.use(cors());

router.get('/', productController.addHomeRoute);
router.post('/stock', productController.addPdts);
router.get('/check', authWare, productController.getPdts);
router.delete('/destock', productController.pdtDelete);
router.post('/search', productController.search);
router.post('/searchbyseller', productController.searchBySeller);

module.exports = router;