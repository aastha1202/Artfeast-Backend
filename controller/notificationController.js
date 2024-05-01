const addNotification = async (userId, message, orderId) => {

    try{
        const notification = new Notification({ userId, message, orderId });
        await notification.save();
        return notification;

    }catch(error){
        return res.status(500).json(error)
    }

}

module.exports={addNotification}