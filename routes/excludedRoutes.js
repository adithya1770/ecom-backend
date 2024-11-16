const express = require("express");
const router = express.Router();
const productController = require("../controllers/productFunction");
const cors = require("cors");

router.use(cors());

router.get('/', productController.homeRoute);

module.exports = router;