const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


// Create User
createUser = async (req, res) => {
  const requestData = req.body;

  await userModel
    .create(requestData)
    .then((user) => {
      res.status(201).json({
        message: 'success',
        body: user,
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

// Update User
updateUser = async(req, res) => {
   const requestData = req.body;
   const {id: _id} = req.params;

   if(!mongoose.Types.ObjectId.isValid(_id)){
      return res.status(404).json({
         error: 'Sorry, no user found with this id.'
      })
   }

   await userModel
     .findByIdAndUpdate(_id, {...requestData, _id}, {new: true})
     .then((user) => {
       res.status(201).json({
         message: 'Successfully updated',
         body: user,
       });
     })
     .catch((err) => {
       const array = [];
       for (var key in err.errors) {
         array.push({errorName: key, errorMessage: err.errors[key].message});
       }
       res.status(409).json({
         error: array,
       });
     });
}

// GetAllUsers
getAllUsers = async (req, res) => {
   await userModel.find()
   .then((data) => {
      res.status(200).json({
         message: 'success',
         length: data.length,
         data
      })
   }).catch((err) => {
     const array = [];
     for (var key in err.errors) {
       array.push({errorName: key, errorMessage: err.errors[key].message});
     }
     res.status(409).json({
       error: array,
     });
   })
}

getSingleUser = async (req, res) => {
   const {id: _id} = req.params;

   if(!mongoose.Types.ObjectId.isValid(_id)){
      return res.status(404).json({
         error: 'Sorry, no user exists with this id'
      })
   }

   await userModel.findById(_id)
      .then((data) => {
         res.status(200).json({
            message: 'success',
            data
         })
      }).catch((err) => {
         const array = [];
         for (var key in err.errors) {
           array.push({errorName: key, errorMessage: err.errors[key].message});
         }
         res.status(409).json({
           error: array,
         });
      })
}

deleteUser = async (req, res) => {
   const {id} = req.params;

   if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({
         error: 'Sorry, no user exists with this id'
      })
   }

   await userModel.findByIdAndUpdate(id)
      .then((data) => {
         res.status(201).json({
           message: 'success',
           data,
         });
      }).catch(err => {
         const array = [];
         for (var key in err.errors) {
           array.push({errorName: key, errorMessage: err.errors[key].message});
         }
         res.status(409).json({
           error: array,
         });
      })
}

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  getSingleUser,
  deleteUser
};

