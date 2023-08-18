const express = require('express')
const admin = require('../middlewares/admin')
const {Product} = require('../models/product')
const Order = require('../models/order')

const route = express.Router()

route.post('/admin/add-product',admin ,async(req,res)=>{
    try{

        const { name, description, images, quantity, price, category} = req.body

        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category
        })

        product = await product.save();

        res.json(product)

    }catch(error){
        res.status(500).json({error:error.message})
    }
})


//get All Products

route.get('/admin/get-products',admin , async(req,res)=>{
    try{

        const product = await Product.find({});

        res.json(product)
        
    } catch(error){
        res.status(500).json({error:error.message})
    }
})

//get All Products

route.post('/admin/delete-product',admin , async(req,res)=>{
    try{

        const {id} = req.body
        
        const product = await Product.findByIdAndDelete(id);

        res.json(product)

    } catch(error){
        res.status(500).json({error:error.message})
    }
})


//get all Order Product
route.get('/admin/get-orders',admin , async(req,res)=>{
    try{
        const orders = await Order.find({})
        res.json(orders)
    } catch(error){
        res.status(500).json({error:error.message})
    }
})

//Change Order Status
route.post('/admin/change-order-status',admin , async(req,res)=>{
    try{
        
        const { id, status} = req.body
        let order = await Order.findById(id)
        order.status = status
        order = await order.save()
        res.json(order)
    } catch(error){
        res.status(500).json({error:error.message})
    }
})


//Get Analytics
route.get('/admin/analytics',admin , async(req,res)=>{
    try{
       
        const orders = await Order.find({})
        let totalEarnings = 0

        for(let i = 0; i < orders.length ; i++){
            for(let j = 0; j < orders[i].products.length;j++ ){
                totalEarnings += orders[i].products[j].quantity * orders[i].products[j].product.price
            }
        }

            // CATEGORY WISE ORDER FETCHING
        let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
        let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
        let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
        let booksEarnings = await fetchCategoryWiseProduct("Books");
        let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

        let earnings = {
        totalEarnings,
        mobileEarnings,
        essentialEarnings,
        applianceEarnings,
        booksEarnings,
        fashionEarnings,
        };

        res.json(earnings);


    } catch(error){
        res.status(500).json({error:error.message})
    }
})

const fetchCategoryWiseProduct = async (category) => {

    let totalEarnings = 0
    let categoryOrder = await Order.find({
        'products.product.category' : category
    })

    for(let i = 0; i < categoryOrder.length ; i++){
        for(let j = 0; j < categoryOrder[i].products.length;j++ ){
            totalEarnings += categoryOrder[i].products[j].quantity * categoryOrder[i].products[j].product.price
        }
    }

    return totalEarnings
}


module.exports = route