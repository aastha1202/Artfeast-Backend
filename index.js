const express = require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
require('dotenv').config();

const cors = require('cors');

const app = express();
app.use(cors({
  // http://192.168.63.2:3000/auth/signup
  origin:'*' 
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })); 

const port = 3000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const followRoutes = require('./routes/followRoutes')
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes')


app.use('/auth', authRoutes);
app.use('/post',postRoutes)
app.use('/follows', followRoutes)
app.use('/userDetails', userRoutes)
app.use('/cart', cartRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
