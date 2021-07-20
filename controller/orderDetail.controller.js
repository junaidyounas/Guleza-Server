const mongoose = require('mongoose');

const orderDetailModel = require('../models/orderDetails.modal');

// createOrderDetail
createOrderDetail = async (req, res) => {
  const requestData = req.body;

  await orderDetailModel
    .create(requestData)
    .then((orderDetail) => {
      res.status(201).json({
        message: 'success',
        body: orderDetail,
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