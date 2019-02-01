const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 2,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
    minlength: 2,  
  },
  birthday: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  userImage: {
    type: String, 
  },
  },
  {
    timestamps: true
});

const User = mongoose.model('User', UserSchema)

module.exports = User