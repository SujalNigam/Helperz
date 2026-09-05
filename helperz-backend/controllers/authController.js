const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  
  try{
        // 1. get data from req.body
  const {name,role,email,password,phone} = req.body;
  // 2. check if user exists

  const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.status(400).json({ message: "User already exists." });
    }
  // 3. hash password
    const encryptedPassword = await bcrypt.hash(password,10);
  // 4. save user
        const user = await User.create({
        name,
        email,
        password: encryptedPassword,
        role,
        phone
            });

        const updatedUser = user.toObject();
        delete updatedUser.password;

  // 5. generate token
    const token = jwt.sign(
        { id: updatedUser._id, role: updatedUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )

// 6. send response
return res.status(201).json({ token, user:updatedUser })
  }
catch(error){
    res.status(500).json({message:error.message});
}}


const login = async(req,res) => {
    try{
        // Get email + password from req.body
        const {email, password} = req.body;
        // Find user by email
        const existingUser = await User.findOne({email});

        // If not found → return error
        if(!existingUser){
            return res.status(400).json({message:'User Does not exists'});
        }
        // Compare password with bcrypt
        // const password = await existingUser;
        const isMatch = await bcrypt.compare(password,existingUser.password);
        // After password check → generate token and send response (same as register)
        if(!isMatch){
           return res.status(400).json({message:'Password does not match'});
        }
        const token = jwt.sign(
            {id:existingUser._id, role:existingUser.role},
            process.env.JWT_SECRET,
            {expiresIn:'7h'}
        );
        const user = existingUser.toObject();
        delete user.password;
        // Add login to exports
        return res.status(200).json({ token, user: user });


    }
    catch(error){
       return res.status(500).json({message:error.message});
    }
}

const getMe = async (req,res) => {
    try{

    
    const userId = req.user.id;

    if(!userId){
        return res.status(400).json({message:'UserId did not reach backend'});
    }

    const user = await User.findOne({_id:userId}).select('-password');
    
    if(!user){
        return res.status(400).json({message:'User does not exists in DB'});
    }


    return res.status(200).json({user,message:'User ME fetched successfully'});
}
catch(error){
    return res.status(500).json({message:error.message});
}

}


const editProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is missing"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                phone
            },
            {
                new: true,
                select: "-password"
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { register,login,getMe,editProfile };