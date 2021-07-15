const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   title: {type: String, required: [true, 'Title must required']},
   shortDesc: {type: String},
   longDesc: {type: String},
   images: {type: Array},
   isLive: {type: Boolean}
});

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
