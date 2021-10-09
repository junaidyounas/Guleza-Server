const express = require('express');

const orderDetailsController = require('../controller/orderDetail.controller');
const router = express.Router();

router
   .route('/')
   .post(orderDetailsController.createOrderDetail)
   .get(orderDetailsController.getAllOrdersDetails);

router
   .route('/:id')
   .get(orderDetailsController.getSingleOrderDetailByID);

router
   .route('/filter/')
   .post(orderDetailsController.getFilteredOrdersDetails);

router
   .route('/deleteall')
   .delete(orderDetailsController.deleteAllOrderDetails);


module.exports = router;