const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
   title: {type: String, required: [true, 'Please enter the title']},
   url: {type: String},
   price: {type: Number, required: [true, 'Please enter the price']},
   size: {type: Array},
   images: {type: Array},
   thumbnail: {type: String},
   views: {type: Number, default: 0},
   purchases: {type: Number, default: 0},
   categories: {type: Array},
   sku: {type: String},
   weight: {type: String},
   stock: {type: Number},
   shortDesc: {type: String},
   longDesc: {type: String},
   cartDesc: {type: String},
   updateDate: {type: String, default: new Date()},
   location: {type: String},
   isLive: {type: Boolean, default: true},
   colors: {type: Array}
});

const productModel = mongoose.model('products', productSchema);

module.exports = productModel;