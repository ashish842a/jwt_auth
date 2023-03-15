const jwt = require("jsonwebtoken");
const { use } = require("../routes");

const userModel = require("../routes/users");

const auth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyuser = await jwt.verify(token,process.env.SECRET_KEY)

        let user = await userModel.findOne({_id:verifyuser._id});
        // console.log(user);
        next();
        // if(verifyuser){
        // }else{
        //     console.log("andr");
        //     res.redirect("/login")
        // }

    } catch (error) {
        console.log("bhar");
        res.redirect("/login")
        // res.status(401).send(error);
    }
}

module.exports = auth;