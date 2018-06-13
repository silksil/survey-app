`use strict`

const mongoose = require('mongoose');
const { Schema } = mongoose; // mongoose wants us to define the schema beforehand.

const userSchema = new Schema ({
  googleId: String,
  name: String,
});

mongoose.model('users', userSchema); //state it should create a collection - if it not already exists
