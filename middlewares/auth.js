const jwt = require('jsonwebtoken');

const auth = async(req,res,next) => {
    try{
        const token = req.header('x-auth-token');
        if(!token)  return res.status(401).json({msg:"No Auth token provided"})

        const verified = jwt.verify(token, "hello world");
        if(!verified) return res.status(400).json({msg:"False Token"})

        req.user = verified.id
        req.token = token
        
        next()

    } catch(err){
        res.status(500).json({error:err.message})
    }
}

module.exports = auth;