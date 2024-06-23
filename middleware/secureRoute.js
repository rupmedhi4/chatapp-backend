import jwt from 'jsonwebtoken'
import User from '../Model/user.modal.js'


const secureRoute =async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "No Token , authorization denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if(!decoded){
            return res.status(401).json({ error: "Invalid Token" });
        }
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        
        req.user = user
        next()
    } catch (err) {
        console.log("error in secureRoutes",err)
        res.status(500).json({error:"Internal server error"})
    }
}

export default secureRoute