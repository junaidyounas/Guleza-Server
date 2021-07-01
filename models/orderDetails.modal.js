const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
   productSKU: {type: String},
   orderNumber: {type: String},
   price: {type: String},
   quantity: {type: String},
   discount: {type: String},
   total: {type: Number},
   size: {type: String},
   color: {type: String},
});

const orderDetailModel = mongoose.model('orderdetails', orderDetailsSchema);

module.exports = orderDetailModel;