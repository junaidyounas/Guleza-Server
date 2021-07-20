const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  userType: { type: String, default: 'guest' },
  orderNumber: { type: Number },
  paymentID: { type: String },
  date: { type: String, default: new Date() },
  shipDate: { type: String },
  shipCountry: { type: String, default: "Pakistan" },
  shipState: { type: String },
  shipCity: { type: String },
  shipAddress1: { type: String, required: [true, "Address is required"] },
  shipAddress2: { type: String },
  phone: { type: String },
  email: { type: String },
  comment: { type: String },
  requiredDate: { type: String },
  shipperId: { type: String },
  salesTax: { type: String },
  transactionStatus: { type: String },
  isFulfilled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
  paymentDate: { type: String },
  trackingNumber: { type: Number },
  isDelivered: { type: String },
});

const orderModel = mongoose.model('orders', orderSchema);

module.exports = orderModel;