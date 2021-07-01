const express = require('express');

const userController = require('../controller/user.controller');

const router = express.Router();

router
   .route('/createaccount')
   .post(userController.createUser);

router
   .route('/:id')
   .patch(userController.updateUser)
   .get(userController.getSingleUser)
   .delete(userController.deleteUser);

router
   .route('/')
   .get(userController.getAllUsers);

module.exports = router;