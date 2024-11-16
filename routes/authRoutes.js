const express = require("express");
const router = express.Router();
const productController = require("../controllers/productFunction");
const cors = require("cors");
const passport = require('passport');
require('../auth');

router.use(cors());

router.post('/register', productController.register);
router.post('/login', productController.login);
router.post('/logout', productController.logout);
router.post('/change', productController.changePsw);
router.get('/user', productController.viewUser);
router.put('/changeuser', productController.updateUser);
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/callback', productController.callback);

module.exports = router;