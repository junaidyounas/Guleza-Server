const mongoose = require('mongoose');

const orderDetailModel = require('../models/orderDetails.modal');
const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper
async function mailerSender(orderDetails) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILER_MAIL, // generated ethereal user
      pass: process.env.MAILER_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"New Order" shop@guleza.com', // sender address
    to: "junaidammar2013@gmail.com", // list of receivers
    subject: "Guleza New Order - Alert", // Subject line
    text: "Hello Sir, you just got new order these are the details", // plain text body
    html: `<b>Hello Sir, you just got new order these are the details</b></br>${orderDetails}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

  

// createOrderDetail
createOrderDetail = async (req, res) => {
  const requestData = req.body;
// mailerSender(orderDetail).catch(console.error);
  
  await orderDetailModel
    .create(requestData)
    .then((orderDetail) => {
      res.status(201).json({
        message: "success",
        body: orderDetail,
      });
      
    })
    .catch((err) => {
      const array = [];
      for (var key in err.errors) {
        array.push({ eName: key, error: err.errors[key].message });
      }
      res.status(409).json({
        error: array,
      });
    });
};


// getall orders
getAllOrdersDetails = async (req, res) => {
   await orderDetailModel
     .find()
     .then((data) => {
       res.status(201).json({
         message: 'success',
         length: data.length,
         data,
       });
     })
     .catch((err) => {
       const array = [];
       for (var key in err.errors) {
         array.push({eName: key, error: err.errors[key].message});
       }
       res.status(409).json({
         error: array,
       });
     });
}

// getSingleOrder by id
getSingleOrderDetailByID = async(req, res) => {
   const {id: _id} = req.params;
   await orderDetailModel.findById(_id)
      .then((data) => {
         res.status(200).json({
            message: 'success',
            data
         })
      }).catch(err => {
         const array = [];
         for (var key in err.errors) {
           array.push({eName: key, error: err.errors[key].message});
         }
         res.status(409).json({
           error: array,
         });
      })

}

// getSingle by orderNumber
getFilteredOrdersDetails = async (req, res) => {
var query = {};

if (req.body.hasOwnProperty('orderNumber')) {
  query.orderNumber = req.body.orderNumber;
}

if (req.body.hasOwnProperty('price')) {
  query.email = req.body.email;
}

if (req.body.hasOwnProperty('_id')) {
  query._id = req.body._id;
}


if (req.body.hasOwnProperty('color')) {
  query.userId = req.body.userId;
}


   await orderDetailModel
     .find(
       query,
     )
     .then((data) => {
       res.status(200).json({
         message: 'success',
         length: data.length,
         data,
       });
     })
     .catch((err) => {
       const array = [];
       for (var key in err.errors) {
         array.push({eName: key, error: err.errors[key].message});
       }
       res.status(409).json({
         error: array,
       });
     });
}


module.exports = {
  createOrderDetail,
  getAllOrdersDetails,
  getSingleOrderDetailByID,
  getFilteredOrdersDetails,
};