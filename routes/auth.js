const express = require('express')
const User = require('../models/user')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const route = express.Router()

route.post('/makeUser',async(req,res)=>{

    const {name,email,password} = req.body

    try{
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({msg:"User with email already exist"})
        }
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password,salt)

        let user = new User({
            name,
            email,
            password:hashPassword
        })
    
        user = await user.save()
    
    
        res.json(user)
    } catch(error){
        res.status(500).json({error:error.message})
    }
})


route.post('/signIn',async(req,res)=>{
    try{

        const {email,password} = req.body;

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                msg:"User with this email does not exist!"
            })
        }

        const isMatch = await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                msg:"Invalid Email or Password!"
            })
        }

        const token = jwt.sign({id:user._id},"hello world");
        res.json({token,...user._doc})

    }catch(e){
        res.status(500).json({error:e.message})
    }
})

route.post('/getUserValidation',async(req,res)=>{
    try{
        
        const token = req.header('x-auth-token');
        if(!token) return res.status(400).json(false)
        const verified = jwt.verify(token, "hello world");
        if(!verified) return res.status(400).json(false)
        
        const user = await User.findById(verified.id)
        if(!user) return res.status(400).json(false)

        res.json(true)

    }catch(e){
        res.status(500).json({error:e.message})
    }
})

//get user data
route.get('/getUserData',auth , async(req,res) => {
    const user = await User.findById(req.user)
    res.json({...user._doc,token: req.token})
})


module.exports = route 