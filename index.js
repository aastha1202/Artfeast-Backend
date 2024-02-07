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

// Connect to your MongoDB database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')
const followRoutes = require('./routes/followRoutes')
const userRoutes = require('./routes/userRoutes')


// Define routes and middleware here
app.use('/auth', authRoutes);
app.use('/post',postRoutes)
app.use('/follows', followRoutes)
app.use('/userDetails', userRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
