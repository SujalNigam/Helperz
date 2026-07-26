const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     try{
//         // 1. get token from header
//         const token = req.headers.authorization?.split(' ')[1];
//         if(!token) return res.status(401).json({ message: 'No token provided' });
//         // 2. verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         // 3. attach user to req
//         req.user = decoded; // { id, role }

//         // 4. call next()
//         next();        
//     }
//     catch(error){
//         res.status(500).json({message:error.message});
//     }
 
// }


const authMiddleware = (req, res, next) => {
    try {
        // console.log("Authorization:", req.headers.authorization);

        const token = req.headers.authorization?.split(" ")[1];
        // console.log("Token:", token);
        if(!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.log("Middleware Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = authMiddleware;