const express = require('express');

const orderController = require('../controller/order.controller');

const router = express.Router();

   router
      .route('/')
      .post(orderController.createOrder)
      .get(orderController.getAllOrders);

   router
      .route('/:id')
      .get(orderController.getSingleOrderByID);
   
   router
     .route('/filter/')
     .post(orderController.getFilteredOrders);


module.exports = router;