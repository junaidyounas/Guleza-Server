const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { default: validator } = require("validator");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: [true, "firstname required"] },
  lastname: { type: String, required: [true, "lastname required"] },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "valid email address is required"],
  },
  password: { type: String, required: [true, "password is required"] },
  country: { type: String },
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
  address1: { type: String },
  address2: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  regDate: { type: String, default: new Date() },
  verificationCode: { type: String },
  userIP: { type: String },
  phone: { type: String, required: [true, "phone number is required"] },
  fax: { type: String },
  userType: { type: String },
  userRole: { type: String },
  isOnline: { type: Boolean, default: false },
  passwordChangedAt: { type: Date },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, dbPassword) {
  return await bcrypt.compare(candidatePassword, dbPassword);
};

userSchema.methods.changedPasswordAfter =  function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    var changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
