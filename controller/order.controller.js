const mongoose = require('mongoose');

const orderModel = require('../models/order.model');

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
    html: `<table width="100%" border="1">
<tr>
  <td class="column">
    Username
  </td>
  <td class="column">
    ${orderDetails.userName}
  </td>
</tr>
<tr>
  <td class="column">
    Order Number
  </td>
  <td class="column">
    ${orderDetails.orderNumber}
  </td>
</tr>
<tr>
  <td class="column">
    Shipping State
  </td>
  <td class="column">
    ${orderDetails.shipState}
  </td>
</tr>
<tr>
  <td class="column">
    Shipping City
  </td>
  <td class="column">
    ${orderDetails.shipCity}
  </td>
</tr>
<tr>
  <td class="column">
    Shipping Address
  </td>
  <td class="column">
    ${orderDetails.shipAddress1}
  </td>
</tr>
<tr>
  <td class="column">
    Phone Number
  </td>
  <td class="column">
    ${orderDetails.phone}
  </td>
</tr>
<tr>
  <td class="column">
    Date
  </td>
  <td class="column">
    ${orderDetails.date}
  </td>
</tr>
<tr>
  <td class="column">
    Country
  </td>
  <td class="column">
    ${orderDetails.shipCountry}
  </td>
</tr>
</table></br>
<table width="100%" border="1">
      ${orderDetails.items.map(
        (item) =>
          ` <tr>
          <td class="column">Item Data</td>
          <td class="column">Product :${item.name} , Price : ${item.price}, Size : ${item.size}, Stock : ${item.quantity}, Sku : ${item.sku}</td>
        </tr>`
      )}
      </table>

`, // html body
  });

  function renderLoopTable (items){
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

 
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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

module.exports = {
  createOrder,
  updateOrder,
  getAllOrders,
  getSingleOrderByID,
  getFilteredOrders,
};