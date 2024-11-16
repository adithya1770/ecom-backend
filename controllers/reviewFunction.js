const Ecom = require("../models/ecomSchema");
const Review = require("../models/reviewSchema");


const addComment  = async (req, res) => {
    try{
        const { product, seller, comment } = req.body;
        const productDetails = await Ecom.findOne({pdtName: product, pdtSellerName: seller});
        const prodDetailsReview = await Review.create({productName: product, sellerName: seller})
        productDetails.pdtComments.push(comment);
        prodDetailsReview.productComments.push(comment);
        await prodDetailsReview.save();
        await productDetails.save();
        res.status(200).json({"message" : "Comment Added Successfully!"});
    }
    catch(error){
        res.status(401).json({"message": "Couldn't add message", "Error": error.message});
    }
}

const addProductRating = async (req, res) => {
    try{
        const { product, seller, rating } = req.body;
        const productDetails = await Ecom.findOne({pdtName: product, pdtSellerName: seller});
        const prodDetailsReview = await Review.create({productName: product, sellerName: seller});
        productDetails.pdtRating.push(rating);
        prodDetailsReview.productRating.push(rating);
        await prodDetailsReview.save();
        await productDetails.save();
        res.status(200).json({"message" : "Comment Added Successfully!"});
    }
    catch(error){
        res.send(401).json({"Message": "Couldn't add rating", "Error": error.message});
    }
}

const addSellerRating = async (req, res) => {
    try{
        const { product, seller, rating } = req.body;
        const productDetails = await Ecom.findOne({pdtName: product, pdtSellerName: seller});
        const prodDetailsReview = await Review.create({productName: product, sellerName: seller});
        productDetails.pdtSellerRating.push(rating);
        productDetailsReview.sellerRating.push(rating);
        await prodDetailsReview.save();
        await productDetails.save();
        res.status(200).json({"message": "Seller rating addded successfully!"});
    }
    catch(error){
        res.send(200).json({"message": "Couldn't add seller rating", "Error": error.message});
    }
}

module.exports = { addComment, addProductRating, addSellerRating};