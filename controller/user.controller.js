import User from '../Model/user.modal.js'
import bcrypt from 'bcryptjs'
import createTokenAndSaveCookie from '../jwt/generateToken.js'


 const signup = async (req,res)=>{
    const {fullname,password,email} = req.body
   try {
    
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({error:"User already registered"})
    }
    
    // Hashing the password
    const hashPassword = await bcrypt.hash(password,10)

    const newUser =await new User({
        fullname,
        email,
        password:hashPassword,
    })
    await newUser.save()
    if(newUser){
        createTokenAndSaveCookie(newUser._id,res)
        res.status(201).json({message:"User created successfully",
            user:{
            _id:newUser.id,
            fullname : newUser.fullname,
            email:newUser.email
        }
        })

    }

   } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
   }
}




const login = async(req,res)=>{ 
    const {email,password} = req.body
    try {
        const user = await User.findOne({email})
        const isMatch = await bcrypt.compare(password,user.password)

        if(!user || !isMatch){
            return res.status(400).json({error:"invalid user credential"})
        }

        createTokenAndSaveCookie(user._id,res)
        res.status(200).json({message:"user logged in successfully",user:{
            _id:user.id,
            fullname : user.fullname,
            email:user.email
        }})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
}

const logout = async (req,res)=>{
    try {
        res.clearCookie("jwt")
        res.status(201).json({message:"User logged out successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
}


const allUser = async(req,res)=>{
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUser}}).select("-password") //$ne means not equal
        res.status(201).json(filteredUsers)
    } catch (error) {
        console.log("error in allUsers controller:" +error);
    }
}

export { login, signup,logout,allUser };
