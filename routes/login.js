const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const express = require("express");
const router = express.Router();

const schema = Joi.object({
  _id: Joi.string().allow(null, ''),
  first_name: Joi.string().allow(null, ''),
  last_name: Joi.string().allow(null, ''),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
});

//Login routes
router.post("/login", async (req, res) => {
  // First Validate The HTTP Request
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //  Now find the user by their email address
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Incorrect email or password.");
  }

  // Then validate the Credentials in MongoDB to match those provided in the request
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Incorrect email or password.");
  }

  //Create jwt token with user id/Details
  const payload = {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phoneNo: user.phoneNo,
    dateOfBirth: user.dateOfBirth,
    profilePhoto: user.profilePhoto,
  };
  let token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: 1440,
  });

  //Send the jwt
  const body = {token: token};
  res.status(200).send(body);
});

module.exports = router;
