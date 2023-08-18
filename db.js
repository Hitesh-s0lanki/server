require('dotenv').config()

const url = process.env.Mongo_Url

const mongoose = require('mongoose')

const connectDB = ()=>{
    mongoose.connect(url)
    .then(()=>{
        console.log("connected to Database")
    }).catch(error => console.error(error))
}

module.exports = connectDB