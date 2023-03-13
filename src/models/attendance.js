// const mongoose = require("mongoose");
const {Schema, model} = require('mongoose');

const userSchemema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  punchIn: {
    type: String,
    required: true,
  },
  punchOut: {
    type: String,
    required: true,
  },
});

module.exports = model('User', userSchemema);
