const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

const Authenticate = async (req,res,next) =>{
    try {
        const token1 = req.cookies.jwtokencomp;
        const verifyToken1 = jwt.verify(token1, process.env.SECRET_KEY)

        const rootUser1 = await User.findOne({_id:verifyToken1._id, "tokens.token": token1})
        if (!rootUser1) {
            throw new Error("User not Found")
        }
        req.token = token1;
        req.rootUser = rootUser1;
        req.userID = rootUser1._id;

        next();

    } catch (err) {
        res.status(401).send("Unauthorised: No token provided")
        console.log(err);
    }
}

module.exports = Authenticate