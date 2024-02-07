const express = require('express');
const mongoose = require('mongoose');
const bodyParser= require('body-parser');

const cors = require('cors');

const app = express();
app.use(cors({
  // http://192.168.63.2:3000/auth/signup
  origin:'*' 
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })); 

const port = 3000;
const hostName= '192.168.29.4;'

// Connect to your MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/artfeast', {
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
