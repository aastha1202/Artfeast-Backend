const Cart = require('../models/cart')

const addPost = async (req,res)=>{
    try{
        const {postId, quantity} = req.body
        const {userId} = req.user
        let cart = await Cart.findOne({userId})
        if(!cart){
            cart= new Cart({userId,items:[{postId, quantity}]})
        }
        else{
            let existingItem = cart.items.find(item => item.postId.equals(postId))

            if(existingItem){
                existingItem.quantity += quantity
            }
            else{
                cart.items.push({postId,quantity})
            }
        }

        await cart.save()
        res.status(200).json({ message: 'Product added to cart successfully.' });

    }
    catch(e){
        console.error('Error adding product to cart:', e);
        res.status(500).json({ error: 'Internal server error.' });
    }
}


const deletePost = async (req,res)=>{
    try{
        const {postId} = req.params
        const {userId} = req.user
        let cart = await Cart.findOne({userId})
        if(!cart){
           return res.status(402).json({ message: 'Cart not found' });
        }
        console.log('postId',postId)
        const index = cart.items.findIndex(item => item.postId.equals(postId))

        if(index === -1){
            return res.status(404).json({ error: 'Post not found in cart.' });
        }

        cart.items.splice(index, 1)

        await cart.save()
        res.status(200).json({ message: 'Post removed from cart successfully.' });

    }
    catch(e){
        console.error('Error removing product to cart:', e);
        res.status(500).json({ error: 'Internal server error.' });
    }
}


const decreasePostQuantityItem = async (req,res)=>{
    try{
        const {postId} = req.params
        const {userId} = req.user
        let cart = await Cart.findOne({userId})
        if(!cart){
           return res.status(402).json({ message: 'Cart not found' });
        }
        console.log('postId',postId)
        const index = cart.items.findIndex(item => item.postId.equals(postId))

        if(index === -1){
            return res.status(404).json({ error: 'Post not found in cart.' });
        }
        if( cart.items[index].quantity>1)
        cart.items[index].quantity-= 1
        
        else
        cart.items.splice(index, 1)

        await cart.save()
        res.status(200).json({ message: 'Post removed from cart successfully.' });

    }
    catch(e){
        console.error('Error removing product to cart:', e);
        res.status(500).json({ error: 'Internal server error.' });
    } 
}


const findAllPostsinCart = async(req,res)=>{
    try{
        const {userId}=req.user
        const cartItem = await Cart.findOne({userId:userId}).populate({
        path: 'items.postId',
        model: 'Post',
        select: 'postUrl price',
        foreignField: 'postId',
      })
        res.send(cartItem)
    }catch(e){
        res.status(500).json({error: e})
    }
}


module.exports ={
    addPost,
    deletePost,
    decreasePostQuantityItem,
    findAllPostsinCart
}