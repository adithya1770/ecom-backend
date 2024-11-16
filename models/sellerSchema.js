const mongo = require("mongoose");
const { timestamps } = require("console");

const sellerSchema = mongo.Schema(
    {
        sellerName: {
            type: String,
            required: [true, "Enter Seller Name"]
        },

        sellerCategory: {
            type: String,
            required: [true, "Please Enter Category"]
        },

        sellerAuth: {
            type: Boolean,
            required: [true, "Authorization Required"]
        },

        sellerActivity: {
            type: Number,
            requried: [false]
        }
    },

    {
        timestamps: true
    }
)

const Sell = mongo.model('Seller', sellerSchema);
module.exports = Sell;
