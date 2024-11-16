const Auth = require("../models/authSchema");

const sellerWare = async (req, res, next) => {
    try{
        const { sellerName } = req.body;
        const user = await Auth.findOne({ userName: sellerName });
        if(user && user.userIdentity === 'Seller'){
            next();
            res.status(200).json({"message": "success!"});
        }
        else{
            res.status(400).json({"message": "couldn't upload"});
        }
    }
    catch(error){
        res.status(400).json({"message": error.message});
    }
}

module.exports = sellerWare;