const express = require('express')

require('dotenv').config()

const PORT = process.env.PORT || 5000

const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const connectDB = require('./db')

connectDB()

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.use('/api',require('./routes/auth'))
app.use('/rest',require('./routes/admin'))
app.use('/restful',require('./routes/product'))
app.use(require('./routes/user'))

app.listen(PORT, "0.0.0.0" ,()=>{
    console.log(`connected to port ${PORT}`)
})