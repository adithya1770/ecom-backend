const mongo = require("mongoose");
const {timestamps} = require("console");

const authSchema = mongo.Schema(
    {
        userName: {
            type: String,
            required: [true, "Please Enter Username!"]
        },

        passWord: {
            type: String,
            required: [true, "Please Enter Password!"]
        },

        authFactor: {
            type: String,
            required: [false]
        },

        userIdentity: {
            type: String,
            required: [false]
        },

        userWishlist: {
            type: Array,
            required: [false]
        }
    },
    {
        timestamps: true
    }
)

const Auth = mongo.model("Auth", authSchema);
module.exports = Auth;