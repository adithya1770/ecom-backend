const express = require("express")
const cors = require("cors");
const reviewController = require("../controllers/reviewFunction");

const router = express.Router();
router.use(cors());

router.post('/comment', reviewController.addComment);
router.post('/productrating', reviewController.addProductRating);
router.post('/sellerrating', reviewController.addSellerRating);

module.exports = router;