const mongo = require("mongoose");
const {timestamps} = require("console");

const ecomSchema = mongo.Schema(
    {
        pdtName: {
            type: String,
            required: [true, "Please Enter Product Name"]
        },

        pdtQuantity: {
            type: Number,
            required: [true, "Please Enter Quantity"]
        },

        pdtDetails: {
            type: String,
            required: [true, "Please Enter Details"]
        },

        pdtCost: {
            type: Number,
            required: [true, "Please Enter Cost"]
        },

        pdtAvl: {
            type: String,
            required: [true, "Enter Availability"]
        },

        pdtComments: {
            type: Array,
            required: [false]
        },

        pdtRating: {
            type: Array,
            reqruied: [true, "Please Enter Rating"]
        },

        pdtSellerName: {
            type: String,
            required: [true, "Please Enter Seller Name"]
        },

        pdtSellerRating: {
            type: Array,
            required: [true, "Please Enter Seller Rating"]
        },

        pdtImage: {
            type: String,
            required: [true, "Please Enter Product Image"]
        },

        pdtAvgRating:{
            type: Number,
            required: [false]
        },

        sellerAvgRating: {
            type: Number,
            required: [false]
        },

        appealFactor: {
            type: Number,
            required: [false]
        },

        uniqueId: {
            type: Number,
            required: [true]
        }
    },
    {
        timestamps: true
    }
)

const Ecom = mongo.model("Product", ecomSchema);
module.exports = Ecom;