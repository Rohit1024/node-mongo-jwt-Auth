const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default:
        "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg",
    },
    phoneNo: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    password: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  })
);
exports.User = User;
