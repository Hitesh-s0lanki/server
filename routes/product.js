const express = require('express')
const auth = require('../middlewares/auth')
const {Product} = require('../models/product')

const route = express.Router()

route.get('/api/products',auth,async(req,res) => {
    try{

        const {category} = req.query
        const product = await Product.find({category})
        res.json(product) 
    } catch(error){
        res.status(500).json({ error : error.message})
    }
})

route.get('/api/products/search/:name',auth,async(req,res) => {
    try{

        const name = req.params.name
        const product = await Product.find({
            name : { $regex: name , $options:"i"}
        })
        res.json(product) 
    } catch(error){
        res.status(500).json({ error : error.message})
    }
})


//create a post route to rate the product
route.post('/api/rate-product',auth,async(req,res) => {
    try{
        const { id, rating } = req.body;
        let product = await Product.findById(id);
    
        for (let i = 0; i < product.ratings.length; i++) {
          if (product.ratings[i].userId == req.user) {
            product.ratings.splice(i, 1);
            break;
          }
        }
    
        const ratingSchema = {
          userId: req.user,
          rating,
        };
    
        product.ratings.push(ratingSchema);
        product = await product.save();
        res.json(product);
        
    } catch(error){
        res.status(500).json({ error : error.message})
    }
})

//Deal of the day Product
route.get('/api/deal-of-day', auth,async(req,res) => {
    try{

        let products = await Product.find({})

        products = products.sort((a, b) => {
            let aSum = 0;
            let bSum = 0;
      
            for (let i = 0; i < a.ratings.length; i++) {
              aSum += a.ratings[i].rating;
            }
      
            for (let i = 0; i < b.ratings.length; i++) {
              bSum += b.ratings[i].rating;
            }
            return aSum < bSum ? 1 : -1;
          });

        res.json(products[0])

    } catch(error){
        res.status(500).json({ error : error.message})
    }
})


module.exports = route