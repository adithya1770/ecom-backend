const mongo = require("mongoose");
const { timestamps } = require("console");
const { type } = require("os");

const orderSchema = mongo.Schema(
    {
        consumerName: {
            type: String,
            required: [true]
        },

        consumerAddress: {
            type: String,
            required: [true]
        },

        orderItems: {
            type: Array,
            required: [true]
        },
        
        totalCost: {
            type: Number,
            required: [true]
        }
    },
    {
        timestamps: true
    }
)

const Order = mongo.model("Order", orderSchema);
module.exports = Order;