const mongoose = require('mongoose');

const orderModel = require('../models/order.model');
const Email = require("email-templates");
const path = require("path");

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

  //Generate template (Example: templates/emails/demo/index.pug)
  var template = path.join(__dirname, "../templates/emails", "admin");
var email = new Email({ views: { root: template } });
var locals = {
  orderNumber: `${orderDetails.orderNumber}`,
  username: `${orderDetails.userName}`,
  shippingState: `${orderDetails.shipState}`,
  shipCity: `${orderDetails.shipCity}`,
  shipCountry: `${orderDetails.shipCountry}`,
  shipAddress: `${orderDetails.shipAddress1}`,
  phone: `${orderDetails.phone}`,
  date: `${orderDetails.date}`,
  itemsArray: orderDetails.items,
};
// console.log('items ====> ', orderDetails.items)
var html = await email.render(template, locals);
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"New Order" shop@guleza.com', // sender address
    to: "junaidammar2013@gmail.com", // list of receivers
    subject: "Guleza New Order - Alert", // Subject line
    text: "Hello Sir, you just got new order these are the details", // plain text body
    html: html,
  });

  function renderLoopTable(items) {
    `<table width="100%" border="1">
      <tr>
        <td class="column">
          Item Data
        </td>
        <td class="column">
           Item Data
        </td>
      </tr>
      <tr>
        <td class="column">
          Item Data
        </td>
        <td class="column">
           Item Data
        </td>
      </tr>
      <tr>
        <td class="column">
          Item Data
        </td>
        <td class="column">
           Item Data
        </td>
      </tr>
      <tr>
        <td class="column">
          Item Data
        </td>
        <td class="column">
           Item Data
        </td>
      </tr>
      </table>
      `;
  }

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

  

// create order
createOrder = async (req, res) => {
   const requestData = req.body;
  // console.log('Called', req.body)
  
   await orderModel
      .create(requestData)
      .then((order) => {
         res.status(201).json({
            message: 'success',
            body: order
         })
         mailerSender(requestData).catch(console.error);
        //  console.log("items === >", requestData);
      }).catch(err => {
         const array = [];
         for(var key in err.errors){
            array.push({eName: key, error:  err.errors[key].message});
         }
         res.status(409).json({
            error: array
         })
         console.log(array)
      })
}

// update order
updateOrder = async (req, res) => {
   const requestData = req.body;
   const {id: _id} = req.params;

   if(!mongoose.Types.ObjectId.isValid(_id)){
      return res.status(404).json({
         error: 'Sorry, no data with this id'
      })
   }

   await orderModel.findOneAndUpdate(_id, {requestData, _id}, {new: true})
   .then((data) => {
      res.status(201).json({
         message: 'success',
         data
      })
   }).catch(err => {
         const array = [];
         for(var key in err.errors){
            array.push({eName: key, error:  err.errors[key].message});
         }
         res.status(409).json({
            error: array
         })
      })


}

// getall orders
getAllOrders = async (req, res) => {
   await orderModel
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
getSingleOrderByID = async(req, res) => {
   const {id: _id} = req.params;
   await orderModel.findById(_id)
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
getFilteredOrders = async (req, res) => {
var query = {};

if (req.body.hasOwnProperty('orderNumber')) {
  query.orderNumber = req.body.orderNumber;
}

if (req.body.hasOwnProperty('email')) {
  query.email = req.body.email;
}

if (req.body.hasOwnProperty('_id')) {
  query._id = req.body._id;
}


if (req.body.hasOwnProperty('userId')) {
  query.userId = req.body.userId;
}

if (req.body.hasOwnProperty('trackingNumber')) {
  query.trackingNumber = req.body.trackingNumber;
}


   await orderModel
     .find(
       query,
      //  'userId paymentID'
     )
     .where()
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

// delete product
deleteAllOrder = async (req, res) => {
  
  await orderModel
    .deleteMany({})
    .then((data) => {
      res.status(201).json({
        message: "success"
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

module.exports = {
  createOrder,
  updateOrder,
  getAllOrders,
  getSingleOrderByID,
  getFilteredOrders,
  deleteAllOrder,
};