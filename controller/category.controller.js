const mongoose = require('mongoose');

const categoryModel = require('../models/category.model');

// createCategory
createCategory = async (req, res) => {
  const requestData = req.body;
  

  await categoryModel
    .create(requestData)
    .then((category) => {
      res.status(201).json({
        message: 'success',
        body: category,
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
getAllCategories = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE"); // If needed
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,contenttype"); // If needed
  res.setHeader("Access-Control-Allow-Credentials", true); // If needed

  await categoryModel
    .find()
    .then((data) => {
      res.status(201).json({
        message: "success",
        length: data.length,
        data,
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

// getSingleOrder by id
getSingleCategoryByID = async(req, res) => {
   const {id: _id} = req.params;
   await categoryModel
     .findById(_id)
     .then((data) => {
       res.status(200).json({
         message: 'success',
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


// get filtered cateogory
getFilteredCategories = async (req, res) => {
var query = {};

if (req.body.hasOwnProperty('title')) {
  query.title = req.body.title;
}

if (req.body.hasOwnProperty('isActive')) {
  query.isActive = req.body.isActive;
}



   await categoryModel
     .find(query)
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

// update product
updateCategory = async (req, res) => {

  const requestData = req.body;
  const {id: _id} = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({
      error: 'Sorry, no data with this id',
    });
  }
  var finalData = {...requestData, ..._id};
 
 

   await categoryModel
     .findByIdAndUpdate(_id, finalData, {new: true})
     .then((data) => {
       res.status(201).json({
         message: 'success',
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
deleteCategory = async (req, res) => {
   const {id} = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(404).json({
       error: 'Sorry, no data with this id',
     });
   }
   await categoryModel
     .findByIdAndRemove(id)
     .then((data) => {
       res.status(201).json({
         message: 'success',
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
   createCategory,
   updateCategory,
   getAllCategories,
   getSingleCategoryByID,
   getFilteredCategories,
   deleteCategory
}
