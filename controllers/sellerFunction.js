const Sell = require("../models/sellerSchema");
const Ecom = require("../models/ecomSchema");

const addSeller = async (req, res) => {
    try{
        const sellerInfo = req.body;
        const sellerName = sellerInfo['sellerName'];
        const dataSeller = await Ecom.find();
        const countSeller = dataSeller.reduce((acc, item) => {acc[item.pdtSellerName] = (acc[item.pdtSellerName] || 0) + 1; return acc;}, {});
        // object with seller and their occurence
        sellerInfo['sellerActivity'] = countSeller[sellerName];
        if(sellerInfo['sellerActivity']>5){
            await Sell.create(sellerInfo);
            res.status(200).json({"message": "Seller successfully added"});
        }
        else{
            res.status(401).json({"message": "Not enough Seller Activity to be a seller"});
        }
    } 
    catch{
        res.status(400).json({"message": "Couldn't add seller"});
    }
}

const getSeller = async (req, res) => {
    try{
        const sellerInfo = await Sell.find();
        res.status(200).json(sellerInfo);
    }
    catch{
        res.status(400).json({"message": "Couldn't retrive seller information"})
    }
}

const verifySeller = async (req, res) => {
    try{
        const {name} = req.body;
        const returnName = await Sell.findOne({sellerName: name});
        if(returnName){
            res.status(200).json({"message": "User Found!"});
        }
        else{
            res.status(404).json({"message": "User Not Found."});
        }
    }
    catch{
        res.status(400).json({"message": "Internal Server Error!"});
    }
}

module.exports = {addSeller, getSeller, verifySeller};