const mongoose = require('mongoose');

const orderModel = require('../models/order.model');

// create order
createOrder = async (req, res) => {
   const requestData = req.body;

   await orderModel
      .create(requestData)
      .then((order) => {
         res.status(201).json({
            message: 'success',
            body: order
         })
      }).catch(err => {
         const array = [];
         for(var key in err.errors){
            array.push({eName: key, error:  err.errors[key].message});
         }
         res.statuc(409).json({
            error: array
         })
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
         res.statuc(409).json({
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