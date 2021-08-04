const express = require('express');
const lusca = require("lusca");
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const port = 4001;
const dotenv = require('dotenv');
const helmet = require("helmet-csp");
const csp = require("express-csp-header");
// HelloHelloHellloHello

app.use(function (req, res, next) {
  res.setHeader(
    "Report-To",
    '{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"http://127.0.0.1:4001/"}],"include_subdomains":true}'
  );
  res.setHeader(
    "Content-Security-Policy-Report-Only",
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com; script-src 'self' https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/ 'sha256-INJfZVfoUd61ITRFLf63g+S/NJAfswGDl15oK0iXgYM='; style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css; frame-src 'self' https://www.youtube.com https://api.guleza.com/favicon.ico; report-to csp-endpoint; report-uri /;"
  );
  next();
});


dotenv.config({path: './config.env'});

const userRouter = require('./routers/user.router');
const productRouter = require('./routers/product.router');
const orderRouter = require('./routers/orders.router')
const orderDetailRouter = require('./routers/orderDetails.router')
const categoryRouter = require('./routers/category.router')
const uploadRouter = require('./routers/upload.router');
var bb = require('express-busboy');
var path = require('path');


// const DB = process.env.DATABASE.replace('<PASSWORD>', 
// process.env.DATABASE_PASSWORD);

const DB = `mongodb://gulezaAdmin:YouMy88128812%40%40@51.161.162.154:27017/guleza?authSource=admin?retryWrites=true&w=majority`;

// const DB_LOCAL = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("Connection Successfully");
  });

  // app.use(lusca.xframe("SAMEORIGIN"));
  // app.use(lusca.xssProtection(true));
  // app.use(
  //   lusca.csp({
  //     policy: {
  //       "default-src": "'self' *api.guleza.com",
  //       "img-src": "*",
  //     },
  //   })
  // );

  



app.options("*", cors()); // include before other routes
app.use(cors());
app.use(express.json({limit: '50mb', extended: true}));









app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));


// ... Mongoose and etc.
  app.all('/*', function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
          res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
          next();
        });

// Access local multer uploaded filesss

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