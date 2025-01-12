const express = require("express");
const cors = require("cors");
const sellerController = require("../controllers/sellerFunction");
const sellerWare = require("../middleware/sellerWare");

const router = express.Router();
router.use(cors());

router.post('/add', sellerWare, sellerController.addSeller);
router.get('/list', sellerController.getSeller);
router.post('/verify', sellerController.verifySeller);

module.exports = router;