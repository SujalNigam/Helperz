const User = require('../models/User');

const getUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        const currentUser = req.user;

        if(currentUser.role!='admin'){
            return res.status(400).json({message:'Only admin can access all users'});
        }
        
        return res.status(200).json({message: 'All Users are fetched!',users});

    }
    catch(error){
        return res.status(500).json({message:error.message});
    }

}

const blockUnblockUser = async (req,res) => {
    try{
        
        const currentUser = req.user;
        const userId = req.params.id;
        if(currentUser.role!=='admin'){
            return res.status(403).json({message:'Only Admin can access block unblock users.'})
        }
       
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({message:'No user exists'});
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { isBlocked: !user.isBlocked }, { new: true });
        return res.status(200).json({message:'User block status updated successfully', user:updatedUser});
    }
    catch(error){
        return res.status(500).json({message:'Internal Server Error: '});
    }

    
    
}

module.exports = {getUsers, blockUnblockUser};