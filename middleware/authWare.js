const jwt = require("jsonwebtoken");
const SECRET_KEY = '0ca906adc9a75aa8b61e9d5b651b22c3a3d05f98fa97edadea465e0aba11ff87661af2d1811a5f543522eb0ddcbcdaad31956c428ff02f905c662feb85ac9d2b1fd163748c64bfabcfc514ec9fb5310fbd6545f292dd75b2faa9423bdcd3d81dea76e44e9ef5202aa8482b59733b5ef31db3cae7eac744835b3100efc29fbab718da510a9f9650338b38e668d3524d1943570015fc336067d8b64f47290d78471d2d43a2e864a84d8da671527549bf968fd01cfb9d7a02cd3052184efd7c81ffe5c31445d37ac88612535bafb0834bd457f934dc6fa7ef8b872d45e450de4c96dcd3b18de8b28d9ae02aa3ff124505d2c8468a184f2044a9072e23fd39b71f50';

const authLogin = (req, res, next) => {
    try{
        const token = req.header('Authorization')?.split(' ')[1];
        if(token && req.session && req.session.username){
            const verifyLogin = jwt.verify(token, SECRET_KEY);
            if(verifyLogin){
                next();
            }
        }
        res.status(401).json({"messsage": "Session Expired"});
    }
    catch(err){
        res.status(400).json({"message": "Error Logging In", "error": err.message});
    }
}

module.exports = authLogin;