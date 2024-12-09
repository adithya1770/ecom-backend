const Ecom = require('../models/ecomSchema');
const Auth = require('../models/authSchema');
const Sell = require("../models/sellerSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session")
const cookieParser = require("cookie-parser");
const { timestamp } = require("console");
const { mongo } = require('mongoose');
const passport = require('passport');
const SECRET_KEY = '0ca906adc9a75aa8b61e9d5b651b22c3a3d05f98fa97edadea465e0aba11ff87661af2d1811a5f543522eb0ddcbcdaad31956c428ff02f905c662feb85ac9d2b1fd163748c64bfabcfc514ec9fb5310fbd6545f292dd75b2faa9423bdcd3d81dea76e44e9ef5202aa8482b59733b5ef31db3cae7eac744835b3100efc29fbab718da510a9f9650338b38e668d3524d1943570015fc336067d8b64f47290d78471d2d43a2e864a84d8da671527549bf968fd01cfb9d7a02cd3052184efd7c81ffe5c31445d37ac88612535bafb0834bd457f934dc6fa7ef8b872d45e450de4c96dcd3b18de8b28d9ae02aa3ff124505d2c8468a184f2044a9072e23fd39b71f50';
require('../auth');

const homeRoute = (req, res) => {
    res.status(200).json({"message": "Welcome to Ecom"});
}

const callback = (req, res) => {
    res.redirect('/');
}

const addHomeRoute = (req, res) => {
    res.status(200).json({ "message": "Configure Now!"})
}

const viewUser = async (req, res) => {
    const { username } = req.session;
    res.status(200).json({"user": username, timestamp});
}

const updateUser = async (req, res) => {
    const {username} = req.session;
    const {name} = req.body;
    try{
        const currentUser = await Auth.findOne({userName: username});
        currentUser.userName = name;
        await currentUser.save();
        res.status(200).json({"message": "Username successfully updated"});
    }
    catch(error){
        res.status(400).json({"message": "User wasn't updated", "error": error.message});
    }

}

const register = async (req, res) => {
    try{
        const {username, password} = req.body;
        const authData = await Auth.find();
        const returnData = authData.find((auth) => auth.userName==username);
        if(returnData){
            res.status(400).json({"message": "Username or Password already in use"})
        }
        else{
            const sellerInfo = await Sell.findOne({userName: username});
            const newPassword = await bcrypt.hash(password, 10);
            const saltFactor = await bcrypt.genSalt(10);
            const authFactor = await bcrypt.hash(username, saltFactor);
            if(sellerInfo){
                await Auth.create({"userName": username, "passWord": newPassword, "authFactor": authFactor, userIdentity: "Seller"});
            }
            else{
                await Auth.create({"userName": username, "passWord": newPassword, "authFactor": authFactor, userIdentity: "Buyer"});
            }
            res.status(200).json({"message": "User added Successfully"});
        }
        
    }
    catch(error){
        res.status(400).json({"message": "Couldn't Add User", "error": error.message})
    }
}

const login = async (req, res) => {
    try{
        const {username, password} = req.body;
        const authData = await Auth.findOne({userName: username});
        if(authData){
            const entryBool = await bcrypt.compare(password, authData.passWord)
            if(entryBool){
                const genToken = jwt.sign({username:authData.username, id:authData.id}, SECRET_KEY);
                req.session.username = username;
                req.session.token = genToken;
                res.cookie('sessionId', req.sessionID, { httpOnly: true, secure: true });
                res.status(200).json({"message": "User Sucessfully logged in!", "clientToken": genToken, "session-username": req.session.username, "sid": req.cookies['connect.sid']});
            }
            else{
                res.status(400).json({"message": "Invalid Credentials"})
            }
        }
        else{
            res.status(400).json({"message": "User Doesn't Exist"});
        }
    }
    catch(error){
        res.status(400).json({"message": "Server Error", "error": error.message})
    }
}

const logout = async (req, res) => {
    try{
        req.session.destroy((error) => {
            if(error){
                res.status(400).json({"message": "Session Error", "error": error.message});
            }
            res.status(200).json({"message": "Successfully Logged out"});
        })
    }
    catch{
        res.status(404).json({"message": "Error 404"})
    }
}

const changePsw = async (req, res) => {
    try{
        const {username, password, changedPassword} = req.body;
        const userDetails = await Auth.findOne({userName: username});
        if(!userDetails){
            res.status(401).json({"message": "User not found"});
        }
        const verificationPsw = await bcrypt.compare(password, userDetails.passWord);
        if(verificationPsw){
            const changedHash = await bcrypt.hash(changedPassword, 10);
            userDetails.passWord = changedHash;
            await userDetails.save();
            res.status(200).json({"message": "Password successfully changed!"});
        }
        else{
            res.status(401).json({"message": "Incorrect Credentials!"});
        }
    }
    catch(error){
        res.status(500).json({"message": "Error 404", "error": error.message});
    }
} 

const addPdts = async (req, res) => {
    try{
        const {pdtRating, pdtSellerRating} = req.body;
        const pdtAvg = pdtRating.reduce((sum, i) => sum=sum+i, 0)/pdtRating.length;
        const sellerAvg = pdtSellerRating.reduce((sum, i) => sum=sum+i, 0)/pdtSellerRating.length;
        appealNumber = ((((pdtAvg+sellerAvg)/2)/5)*100)/100;
        const newProd = {
            ...req.body,
            pdtAvgRating: pdtAvg,
            sellerAvgRating: sellerAvg,
            appealFactor: appealNumber
        }
        await Ecom.create(newProd);
        res.status(200).json({ "message": "Inventory Successfully Updated. "});
    }
    catch{
        res.status(400).json({ "message": "Server Error!"})
    }
}

const getPdts = async (req, res) => {
    try{
        const pdtsReceived = await Ecom.find();
        res.status(200).json(pdtsReceived);
    }
    catch{
        res.status(400).json({"message": "Couldn't Fetch Inventory"});
    }
}

const pdtDelete = async (req, res) => {
    try{
        const { pdtName } = req.body;
        await Ecom.findOneAndDelete(pdtName);
        res.status(200).json({"message": "Item Successfully Removed from Inventory"})
    }
    catch{
        res.status(400).json({"message": "Couldn't Remove from Inventory"})
    }
}

const userWishlist = async (req ,res) => {
    try{
        const curUser = "Adi";
        const user = await Auth.findOne({ userName: curUser});
        if(user){
            return res.status(200).json({"data": user.userWishlist});
        }
        else{
            return res.status(400).json({"message": "User doesn't exist"});
        }
    }
    catch(error){
       return res.status(401).json({  message: 'Could not retrieve wishlist', error: error.message });
    }
}

const addWishlist = async (req, res) => {
    try{
        const curUser = req.session.username;
        const { name, uid } = req.body;
        const returnedProduct = await Ecom.findOne({ pdtName: name, uniqueId: uid});
        if(returnedProduct){
            const requiredUser = await Auth.findOne({ userName: curUser});
            requiredUser.userWishlist.push(returnedProduct.pdtName);
            await requiredUser.save();
            return res.status(200).json({ "message": "Product added to wishlist" });
        }
        else{
            res.status(401).json({"message": "No such product"});
        }
    }
    catch(error){
        res.status(401).json({"message": error.message});
    }
}

const removeWishlist = async (req, res, error) => {
    try{
        const curUser = req.session.username;
        const { name } = req.body;
        const userDetails = await Auth.findOne({ userName: curUser});
        console.log(userDetails);
        if(userDetails){
            const prodIndex = userDetails.userWishlist.indexOf(name);
            if(prodIndex != -1){
                userDetails.userWishlist.splice(prodIndex, 1);
                await userDetails.save();
                res.status(200).json({"message": "Product successfully removed!"}); 
            }
            else{
                res.status(500).json({"message": "Internal Server Error"});
            }
        }
        else{
            res.status(404).json({"message": "User/Product not found", "error": error.message}); 
        }
    }
    catch(error){
        res.status(400).json({"message": "Item couldn't be removed", "error": error.message});
    }
}

const search = async (req, res) => {
    try {
        const { name } = req.body;
        const retrievedProducts = await Ecom.find({}, { _id: 0, pdtName: 1 });
        const retrievedList = retrievedProducts.map((product) => product.pdtName);

        const matchedItems = retrievedList.filter((product) =>
            product.toLowerCase().includes(name.toLowerCase())
        );

        if (matchedItems.length > 0) {
            res.status(200).json({
                message: "Successful search",
                result: matchedItems,
                formFactor: matchedItems.length
            });
        } else {
            res.status(400).json({ message: "Item not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const searchBySeller = async(req, res) => {
    try{
        const { item, name } = req.body;
        const productName = await Ecom.find({}, {_id: 0, pdtName: 1, pdtSellerName: 1});
        const searchResult = productName.filter((product) => product.pdtName.toLowerCase().includes(item.toLowerCase()) && product.pdtSellerName.toLowerCase().includes(name.toLowerCase()));
        res.status(200).json({message: "Search succesful", itemWithSeller: searchResult});
    }
    catch{
        res.status(400).json({"message": "Couldn't find seller"});
    }
}

module.exports = { callback, searchBySeller, search ,removeWishlist, userWishlist, addWishlist, updateUser, homeRoute, addPdts, addHomeRoute, getPdts, pdtDelete, register, login, logout, changePsw, viewUser };