const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 4001;
const dotenv = require('dotenv');





dotenv.config({path: './config.env'});

const userRouter = require('./routers/user.router');
const productRouter = require('./routers/product.router');
const orderRouter = require('./routers/orders.router')
const orderDetailRouter = require('./routers/orderDetails.router')
const categoryRouter = require('./routers/category.router')
const uploadRouter = require('./routers/upload.router');
var bb = require('express-busboy');
var path = require('path');


const DB = process.env.DATABASE.replace('<PASSWORD>', 
process.env.DATABASE_PASSWORD);

const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose.connect(DB_LOCAL, {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false,
   useUnifiedTopology: true
}).then((con) => {
   console.log('Connection Successfully');
});

app.use(cors());
app.use(express.json({limit: '50mb', extended: true}));

app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));


// Access local multer uploaded files

var dir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(dir));



// bb.extend(app);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/orderdetails', orderDetailRouter);
app.use('/api/v1/categories', categoryRouter);
app.use("/api/v1/upload", uploadRouter);




app.listen(port, () => {
   console.log('app is running');
})