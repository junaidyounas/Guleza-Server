const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model");
 
 
 protectRoute = async (req, res, next) => {
   //  Get Token and check if token available
   let token;
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
   }
  //  console.log(token);
   if(!token){
    return res.status(401).json({
        error: 'Sorry you are not logged In',
      });
   }

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
   
   const freshUser = await userModel.findById(decoded?.id);
   if(!freshUser){
      return res.status(401).json({
        error: "User not exists",
      });
   }

   // // chekc if user changed pasword after jwt
   if (freshUser.changedPasswordAfter(freshUser.iat)) {
     return res.status(401).json({
       error: "Please login again",
     });
   }
   // grant access
   req.user = freshUser;
  next();

}

module.exports = {
   protectRoute
}