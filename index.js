const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path')

const app = express();
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
// const connectDB = require('./config/db')
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("Db connection is successful"))
.catch((err)=>{console.log(err);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use('/home',indexRoute);
app.use('/api/auth',authRoute);
app.use('/api/users',userRoute);
app.use('/api/products',productRoute);
app.use('/api/users/cart',cartRoute);
app.use('/api/users/orders',orderRoute);


app.listen(4000, (req, res) => {
    console.log('server started');
})