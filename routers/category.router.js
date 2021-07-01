const express = require('express');

const categoryController = require('../controller/category.controller');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.file);
    cb(null, './images/category/');
  },
  filename: function (req, file, cb) {
    console.log(req.file);
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
    files: 5,
  },
  fileFilter: fileFilter,
});

const router = express.Router();

router.post(
  '/',
  upload.array('images'),
  categoryController.createCategory
);

router.route('/').get(categoryController.getAllCategories);

router
  .route('/:id')
  .get(categoryController.getSingleCategoryByID)
  .delete(categoryController.deleteCategory);

router.patch(
  '/:id',
  upload.array('images'),
  categoryController.updateCategory
);

module.exports = router;
