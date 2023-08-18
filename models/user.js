const mongoose = require('mongoose')
const { productSchema } = require('./product')

const userSchema = mongoose.Schema({
    name : {
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        validate:{
            validator : (value) => {
                const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                return value.match(re)
            },
            message:"Please Enter a valid email address",
        }
    },
    password:{
        type:String,
        required:true,
        validate:{
            validator : (value) => {
                return value.length > 6
            },
            message:"Please Enter a long Password",
        }
    },
    address:{
        type:String,
        default:''
    },
    type:{
        type:String,
        default:'user'
    },
    cart : [
        {
            product:productSchema,
            quantity:{
                type: Number,
                required:true
            }
        }
    ]
})

const User = mongoose.model("user",userSchema)

module.exports = User