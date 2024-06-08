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
        createTokenAndSaveCookie(newUser._ud,res)
        res.status(201).json({message:"User created successfully",newUser})

    }

   } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"})
   }
}

export default signup