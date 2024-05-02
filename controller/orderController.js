const Cart = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');
const { addNotification } = require('./notificationController');



const addOrder = async (req, res) => {
    try{
        const { userId } = req.user;
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.postId',
            model: 'Post',
            select: 'price quantity postId',
            foreignField: 'postId',
          });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        let totalAmount = 0;
        cart.items.forEach((item) => {
            totalAmount += item.quantity * item.postId.price;
        });

        const order = new Order({
            userId,
            items: cart.items,
            totalAmount,
        });

        await order.save();

        cart.items = [];
        await cart.save();



        res.status(201).json({ message: 'Order created successfully'});
    }catch(error){
        return res.status(500).json(error)
    }
}

const fetchAllOrders = async(req,res)=> {
    try{
        const {userId} = req.user
        const orders = await Order.find({userId: userId}).populate({
            path: 'items.postId',
            model: 'Post',
            select: 'postUrl artworkName theme price',
            foreignField: '_id'
        }).populate({
            path: 'userId',
            model: 'User',
            select: 'fullName ',
            foreignField: 'userId'
        })
        res.status(200).json(orders);

    }
    catch(error){
        return res.status(500).json(error)

    }
}

const fetchOrdersForArtist = async(req, res)=> {
    try {
        const { userId } = req.user;
        const orders = await Order.find({ 'items.artistId': userId }).populate({
            path:'userId',
            model: 'User',
            foreignField:'userId',
            select: 'fullName' 
        }).populate({
            path: 'items.postId',
            model: 'Post',
            select: 'postUrl artworkName theme',
            foreignField: '_id'
        });
        res.status(200).json(orders);
    } 
    catch(error){
        return res.status(500).json(error)
    }
}

module.exports={
    addOrder,
    fetchAllOrders,
    fetchOrdersForArtist
}