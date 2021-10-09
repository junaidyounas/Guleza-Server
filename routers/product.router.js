const express = require('express');

const productController = require('../controller/product.controller');
const auth = require('../controller/authProtection');
var multer = require('multer');
const muliple = require('connect-multiparty');
const multipleMiddleware = muliple();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    // console.log(req.file);
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    // console.log(req.file);
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 9
  },
  fileFilter: fileFilter,
});





const router = express.Router();
var cpUpload = upload.fields([
  {name: 'thumbnail', maxCount: 1},
  {name: 'images', maxCount: 6},
]);


router.post("/", auth.protectRoute, cpUpload, productController.createProduct);

// router.post('/', cpUpload, function (req, res, next) {
//   const thumbnail = req.files.thumbnail;
//   const images = req.files.images
//   console.log('images', images);
//   console.log(thumbnail);
//   res.status(200).json({
//     message: req.body,
//   });

// });

router.route("/").get(productController.getAllProducts);

router
  .route('/:id')
  .get(productController.getSingleProduct)
  .patch(cpUpload, productController.updateProduct)
  .delete(productController.deleteProduct);

router
  .route('/filter/')
  .post(productController.getFilteredProducts);

router.route("/url").post(productController.getFilteredProductsByUrl);

module.exports = router;
