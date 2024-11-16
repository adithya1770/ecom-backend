const mongo = require("mongoose");
const { timestamps } = require("console");

const reviewSchema = mongo.Schema(
    {
        productName: {
            type: String,
            required: [false]
        },

        sellerName: {
            type: String,
            required: [false]
        },

        productComments: {
            type: Array,
            required: [false]
        },

        productRating: {
            type: Array,
            required: [false]
        },

        sellerRating: {
            type: Array,
            required: [false]
        }
    },
    {
        timestamps: true
    }
)

const Review = mongo.model('Review', reviewSchema);
module.exports = Review;