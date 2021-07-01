const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
   title: {type: String, required: [true, 'Title must required']},
   shortDesc: {type: String},
   longDesc: {type: String},
   images: {type: Array},
   isActive: {type: String}
});

const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
