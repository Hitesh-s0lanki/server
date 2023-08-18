const mongoose = require('mongoose')
const ratingSchema = require('./rating')

const productSchema = mongoose.Schema({
    name : {
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    images:[
        {
            type : String,
            require:true
        }
    ],
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    ratings:[ ratingSchema ]
})

const Product = mongoose.model("product",productSchema)

module.exports = {Product,productSchema}
