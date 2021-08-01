const mongoose = require('mongoose');

const productModel = require('../models/product.model');

// Create
createProduct = async (req, res) => {
  const requestData = req.body;
  const url = req.protocol + '://' + req.get('host') + '/uploads/';

  const thumbnail = url + req.files.thumbnail[0].filename;
  const images = req.files.images;

  const multipleImages = [];
  const imageArr = Array.from(images);
  imageArr.forEach((image) => {
    multipleImages.push(url + image.filename);
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
};

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

// getsingle product
getSingleProduct = async (req, res) => {
  const {id: _id} = req.params;
  await productModel
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
};

// update product
updateProduct = async (req, res) => {
  const requestData = req.body;
  const {id: _id} = req.params;
  const url = req.protocol + '://' + req.get('host') + '/uploads/';
  
  if(!mongoose.Types.ObjectId.isValid(_id)){
     return res.status(404).json({
        error: 'Sorry, no data with this id'
     })
  }
  var finalData = {...requestData, ..._id}
  if (req.files.thumbnail) {
    var thumbnail = url + req.files.thumbnail[0].filename;
    console.log('thumbnail =====> ', thumbnail);
    finalData = {...finalData, thumbnail};
  }
if (req.files.images) {
    var images = req.files.images;
    console.log('images =====> ', images);
    const multipleImages = [];
    const imageArr = Array.from(images);
    imageArr.forEach((image) => {
      multipleImages.push(url + image.filename);
    });
    finalData = {...finalData, images: multipleImages};
  }

  //  const images = req.files && req.files.map((item) => item.filename);

  // res.status(200).json({
  //   message: 'success',
  // });

   await productModel
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
};

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
};


// get filtered products
getFilteredProducts = async (req, res) => {
var query = {};

if (req.body.hasOwnProperty('title')) {
  query.title = req.body.title;;
}

if (req.body.hasOwnProperty("url")) {
  query.url = req.body.url;
  // console.log(req.body.url)
}

if (req.body.hasOwnProperty("sku")) {
  query.sku = req.body.sku;
  // var regex = new RegExp(["^", req.body.sku, "$"].join(""), "i");
  // query.sku = regex;
  // console.log(req.body.url)
}

if (req.body.hasOwnProperty('isLive')) {
  query.isLive = req.body.isLive;
}

if(req.body.hasOwnProperty('categories')){
  var regex = new RegExp(["^", req.body.categories, "$"].join(""), "i");
  query.categories = regex;
}



   await productModel
     .find(query)
     .then((data) => {
       res.status(200).json({
         message: 'success',
         length: data.length,
         data,
       });
       console.log(data)
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

// get filtered products by url
getFilteredProductsByUrl = async (req, res) => {
var query = {};



if (req.body.hasOwnProperty("url")) {
  query.url = req.body.url;
  // console.log(req.body.url)
}



   await productModel
     .find(query)
     .limit(1)
     .then((data) => {
       res.status(200).json({
         message: 'success',
         data,
       });
       console.log(data)
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
  deleteProduct,
  getFilteredProducts,
  getFilteredProductsByUrl,
};
