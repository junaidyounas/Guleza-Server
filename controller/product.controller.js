const mongoose = require('mongoose');

const productModel = require('../models/product.model');

// Create
createProduct = async (req, res) => {
  const requestData = req.body;
  const url = req.protocol + '://' + req.get('host') + '/';
  
  const thumbnail =url+ req.files.thumbnail[0].filename;
  const images = req.files.images;
  // console.log('=====> body ====> ', thumbnail);
  // console.log('===> images ===> ', images)

  const multipleImages = [];
  const imageArr = Array.from(images);
  imageArr.forEach((image) => {
    multipleImages.push(url+image.filename)
  });
  
  const finalData = {
    ...requestData,
    ...{images: multipleImages},
    ...{thumbnail},
  };


   await productModel
     .create(finalData)
     .then((product) => {
       res.status(201).json({
         message: 'success',
         body: 'success',
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

// get all
getAllProducts = async (req, res) => {
   await productModel
      .find()
      .then((data) => {
         res.status(201).json({
           message: 'success',
           length: data.length,
           data,
         });
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

// getsingle product
getSingleProduct = async (req, res) => {
   const {id: _id} = req.params;
   await productModel.findById(_id)
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

// update product
updateProduct = async (req, res) => {
   const requestData = req.body;
   const {id: _id} = req.params;
   const images = req.files && req.files.map((item) => item.filename);

   if(!mongoose.Types.ObjectId.isValid(_id)){
      return res.status(404).json({
         error: 'Sorry, no data with this id'
      })
   }
   await productModel
     .findByIdAndUpdate(_id, {...requestData, _id, images}, {new: true})
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
deleteProduct = async (req, res) => {
   const {id} = req.params;

   if (!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(404).json({
       error: 'Sorry, no data with this id',
     });
   }
   await productModel
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
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};